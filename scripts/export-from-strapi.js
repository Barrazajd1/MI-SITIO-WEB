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

// Locales to export. Add new locales here as needed.
// "en" is the Strapi default locale (no locale param sent).
// All others append &locale={code} to the request.
const LOCALES = ["en", "es", "fr"];

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
    // home.services.items is a nested repeatable component — needs deep populate.
    populate: "populate[hero]=*&populate[services][populate][items]=*",
  },
  "about.json": {
    slug: "about-page",
    populate: "populate[hero]=*&populate[mission]=*&populate[values]=*",
  },
  "services.json": {
    slug: "services-page",
    populate: "populate[hero]=*&populate[items]=*",
  },
  "contact.json": {
    slug: "contact-page",
    populate: "populate[hero]=*&populate[form]=*&populate[info]=*",
  },
  "nav.json": {
    slug: "nav",
    populate: "populate[links]=*",
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
        const raw = await fetchSingleType(slug, populate, locale);
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
