// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Env vars — set in .env.local or export in your shell before running:
//
//   STRAPI_URL=http://localhost:1337
//   STRAPI_TOKEN=<API token with read access to all single types>
// ---------------------------------------------------------------------------
const { STRAPI_URL, STRAPI_TOKEN } = process.env;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error("Error: STRAPI_URL and STRAPI_TOKEN must be set.");
  console.error("  STRAPI_URL   — base URL, e.g. http://localhost:1337");
  console.error("  STRAPI_TOKEN — read-only API token (Settings > API Tokens)");
  process.exit(1);
}

// Locales to export from Strapi.
// Strapi is English-only — no i18n configured.
// ES, FR and other languages are generated separately by AI from the EN JSON files.
// To add a new language: generate its JSON files with AI, add the locale to
// lib/content.ts, and import the new JSON files there.
const LOCALES = ["en"];

const DATA_DIR = path.join(__dirname, "..", "data");

// ---------------------------------------------------------------------------
// Endpoint map
//
// `slug`    — Strapi single-type API ID (Settings > Content-Type Builder).
// `populate` — Controls how deep Strapi populates component fields.
//
//   "*"    → all top-level components (works when components are not nested).
//   For nested components (e.g. home → services → items) use explicit syntax:
//     "populate[hero]=*&populate[services][populate][items]=*"
//   Alternatively install strapi-plugin-populate-deep and use "deep".
//
// Adjust slugs and populate values to match your actual Strapi setup.
// ---------------------------------------------------------------------------
const ENDPOINTS = /** @type {Record<string, { slug: string; populate: string }>} */ ({
  "home.json": {
    slug: "home-page",
    // Note: "worflow" is the actual Strapi field name (typo in content type).
    // The export script renames it to "workflow" automatically.
    populate:
      "populate[hero]=*" +
      "&populate[stats]=*" +
      "&populate[worflow][populate][steps]=*" +
      "&populate[services][populate][items]=*" +
      "&populate[cta]=*",
  },
  "about.json": {
    slug: "about-page",
    populate: "populate[hero]=*&populate[mission]=*&populate[values]=*",
  },
  "services.json": {
    slug: "services-page",
    populate: "populate[hero]=*&populate[cta]=*&populate[items]=*",
  },
  "contact.json": {
    slug: "contact-page",
    populate: "populate[hero]=*&populate[form]=*&populate[info]=*",
  },
  "nav.json": {
    slug: "nav",
    populate: "populate[links]=*&populate[footer]=*",
  },
  "pricing.json": {
    slug: "pricing-page",
    // Strapi named the repeatable components "Plan" and "PlanFeature" (capitalized).
    // The renaming to plans/features happens in main() after fetching.
    // mostPopular is a plain text field — no populate needed.
    populate:
      "populate[hero]=*" +
      "&populate[toggle]=*" +
      "&populate[Plan][populate][PlanFeature]=*" +
      "&populate[cta]=*",
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Strapi v5 system fields to exclude from the exported JSON
const STRAPI_SYSTEM_FIELDS = new Set([
  "id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
]);

/**
 * Fetch a Strapi v5 single type and return its content fields.
 * Strapi v5 returns data directly in body.data (no `attributes` wrapper).
 * @param {string} slug
 * @param {string} populate
 * @param {string} locale
 */
async function fetchSingleType(slug, populate, locale) {
  const localeParam = locale === "en" ? "" : `&locale=${locale}`;
  const url = `${STRAPI_URL}/api/${slug}?${populate}${localeParam}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const body = /** @type {any} */ (await res.json());
  if (!body?.data || typeof body.data !== "object") {
    throw new Error(
      `Unexpected response shape — got: ${JSON.stringify(body).slice(0, 120)}`
    );
  }
  // Strapi v5: attributes are directly on body.data — strip system fields
  return Object.fromEntries(
    Object.entries(body.data).filter(([k]) => !STRAPI_SYSTEM_FIELDS.has(k))
  );
}

/**
 * Strapi injects numeric `id` fields into repeatable components.
 * Strip them so the output matches the clean JSON structure in data/en/.
 * @param {unknown} value
 * @returns {unknown}
 */
function stripIds(value) {
  if (Array.isArray(value)) return value.map(stripIds);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(/** @type {Record<string,unknown>} */ (value))
        .filter(([k, v]) => k !== "id" && v !== null)
        .map(([k, v]) => [k, stripIds(v)])
    );
  }
  return value;
}

/**
 * Write data as formatted JSON to data/{locale}/{filename}.
 * @param {string} locale
 * @param {string} filename
 * @param {unknown} data
 */
function writeJson(locale, filename, data) {
  const dir = path.join(DATA_DIR, locale);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, filename);
  fs.writeFileSync(dest, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Fetching from ${STRAPI_URL}...\n`);
  let hasErrors = false;

  for (const locale of LOCALES) {
    console.log(`[${locale}]`);
    for (const [filename, { slug, populate }] of Object.entries(ENDPOINTS)) {
      try {
        let raw = await fetchSingleType(slug, populate, locale);
        // Rename Strapi typo "worflow" → "workflow" in home.json
        if (filename === "home.json" && raw.worflow !== undefined) {
          raw = { ...raw, workflow: raw.worflow };
          delete raw.worflow;
        }
        // Rename Strapi capitalized component names → lowercase to match data/en/pricing.json:
        //   Plan       → plans
        //   PlanFeature → features  (nested inside each plan)
        if (filename === "pricing.json" && raw.Plan !== undefined) {
          raw = {
            ...raw,
            plans: /** @type {any[]} */ (raw.Plan).map((plan) => {
              const { PlanFeature, ...planFields } = /** @type {any} */ (plan);
              return { ...planFields, features: PlanFeature ?? [] };
            }),
          };
          delete raw.Plan;
        }
        writeJson(locale, filename, stripIds(raw));
        console.log(`  ✓ ${filename}`);
      } catch (err) {
        console.error(`  ✗ ${filename} — ${/** @type {Error} */ (err).message}`);
        hasErrors = true;
      }
    }
    console.log();
  }

  console.log(
    hasErrors
      ? "Export finished with errors. Fix the issues above before running `npm run validate`."
      : "Export complete. Run `npm run validate` to verify key consistency."
  );
  process.exit(hasErrors ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
