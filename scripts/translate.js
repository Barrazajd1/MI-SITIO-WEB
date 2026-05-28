// @ts-check
"use strict";

// ---------------------------------------------------------------------------
// Usage:
//   npm run translate -- --lang=es
//   npm run translate -- --lang=fr
//
// Requires GEMINI_API_KEY in .env.local (loaded via --env-file in npm script).
// ---------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const MARKERS = require("./translation-markers.js");

// ── Config ───────────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = /** @type {Record<string, string>} */ ({
  es: "Spanish (Latin America)",
  fr: "French",
  pt: "Portuguese (Brazil)",
  it: "Italian",
});

const MODEL = "gemini-2.0-flash";

const EN_DIR  = path.join(__dirname, "..", "data", "en");
const DATA_DIR = path.join(__dirname, "..", "data");

// ── Parse CLI args ────────────────────────────────────────────────────────────

const langArg = process.argv.find((a) => a.startsWith("--lang="));
if (!langArg) {
  console.error("Error: --lang flag is required.");
  console.error("  Usage: npm run translate -- --lang=es");
  console.error("  Supported: " + Object.keys(SUPPORTED_LANGS).join(", "));
  process.exit(1);
}
const LANG = langArg.split("=")[1].toLowerCase();
if (!SUPPORTED_LANGS[LANG]) {
  console.error(
    `Error: Unsupported language "${LANG}". Supported: ${Object.keys(SUPPORTED_LANGS).join(", ")}`
  );
  process.exit(1);
}
const LANG_NAME = SUPPORTED_LANGS[LANG];

// ── Gemini client ─────────────────────────────────────────────────────────────

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set.");
  console.error("  Run via: npm run translate -- --lang=" + LANG);
  console.error("  (npm script passes --env-file=.env.local automatically)");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(/** @type {string} */ (process.env.GEMINI_API_KEY));

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively collect all leaf paths.
 * Returns { normalized: "plans[].features[].text", actual: "plans[0].features[2].text" }[]
 *
 * @param {unknown} value
 * @param {string} actual
 * @param {string} normalized
 * @returns {{ actual: string; normalized: string }[]}
 */
function collectLeafPaths(value, actual = "", normalized = "") {
  /** @type {{ actual: string; normalized: string }[]} */
  const results = [];

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      const a = `${actual}[${i}]`;
      const n = `${normalized}[]`;
      if (typeof item === "object" && item !== null) {
        results.push(...collectLeafPaths(item, a, n));
      } else {
        results.push({ actual: a, normalized: n });
      }
    });
  } else if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      const a = actual    ? `${actual}.${key}`    : key;
      const n = normalized ? `${normalized}.${key}` : key;
      results.push(...collectLeafPaths(child, a, n));
    }
  } else {
    results.push({ actual, normalized });
  }

  return results;
}

/**
 * Build the field-type guide that goes into the user message.
 * Deduplicates by normalized path (one entry per array template).
 *
 * @param {string} fileName
 * @param {unknown} enData
 * @returns {string}
 */
function buildTypeGuide(fileName, enData) {
  const fileMarkers = MARKERS[fileName] || {};
  const leaves = collectLeafPaths(enData);
  const seen = new Set();
  const lines = [];

  for (const { normalized } of leaves) {
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    const type = fileMarkers[normalized] || "engaging_copy";
    lines.push(`  ${normalized.padEnd(42)} → ${type}`);
  }

  return lines.join("\n");
}

// ── Prompts ───────────────────────────────────────────────────────────────────

/**
 * System instruction passed to Gemini at model-initialization time,
 * shared across all sequential file calls.
 */
function buildSystemInstruction() {
  return `You are a professional content translator for a multilingual business website.
Translate JSON content from English to ${LANG_NAME}.

Content type rules:
  seo_title     – Precise and keyword-rich. Preserve SEO value and industry terms.
  feature_term  – Consistent technical term. Prioritize recognizability over literal meaning.
  engaging_copy – Natural, compelling copy in ${LANG_NAME}. Adapt idioms; never translate literally.
  blog_content  – Engaging, culturally adapted narrative.
  ui_label      – Short, clear UI text following ${LANG_NAME} conventions.
  skip          – COPY THE EXACT ORIGINAL VALUE. Do not change anything.

Output rules:
  1. Return ONLY the translated JSON object — no markdown fences, no explanation.
  2. Preserve the exact structure: same keys, same nesting depth, same array lengths.
  3. For "skip" fields: return the exact original value unchanged.
  4. For booleans and numbers: always return the original value unchanged.`;
}

// ── Translation ───────────────────────────────────────────────────────────────

// Build the model once — system instruction is fixed for all files in this run.
const geminiModel = genAI.getGenerativeModel({
  model: MODEL,
  systemInstruction: buildSystemInstruction(),
});

/**
 * Call Gemini to translate one JSON file.
 *
 * @param {string} fileName
 * @param {unknown} enData
 * @returns {Promise<unknown>}
 */
async function translateFile(fileName, enData) {
  const typeGuide = buildTypeGuide(fileName, enData);

  const userMessage = `Translate this JSON file from English to ${LANG_NAME}.

=== Field translation types ===
${typeGuide}

=== JSON to translate ===
${JSON.stringify(enData, null, 2)}`;

  const result = await geminiModel.generateContent(userMessage);
  const raw = result.response.text().trim();

  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let translated;
  try {
    translated = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON for ${fileName}:\n${cleaned.slice(0, 300)}`
    );
  }

  return translated;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const outDir = path.join(DATA_DIR, LANG);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs
    .readdirSync(EN_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  console.log(`Translating ${files.length} files → ${LANG_NAME} (${LANG})\n`);
  let hasErrors = false;

  for (const file of files) {
    process.stdout.write(`  ${file.padEnd(20)}`);
    try {
      const enData = JSON.parse(
        fs.readFileSync(path.join(EN_DIR, file), "utf8")
      );
      const translated = await translateFile(file, enData);
      const outPath = path.join(outDir, file);
      fs.writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n", "utf8");
      console.log(`✓  →  data/${LANG}/${file}`);
    } catch (err) {
      console.log(`✗`);
      console.error(`    ${/** @type {Error} */ (err).message}`);
      hasErrors = true;
    }
  }

  console.log();
  if (hasErrors) {
    console.log("Translation finished with errors. Fix the issues above.");
    process.exit(1);
  } else {
    console.log(`All files translated. Run \`npm run validate\` to verify key consistency.`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
