// @ts-check
const fs = require("fs");
const path = require("path");

const EN_DIR = path.join(__dirname, "..", "data", "en");

// Paths (with [] for array items) where empty strings are intentional.
// Format: "<filename> → <normalized.path>"
const ALLOWED_EMPTY = new Set([
  "pricing.json → plans[].currency",
  "pricing.json → plans[].period",
  "guides.json → categories",  // pendiente de contenido
]);

/**
 * Recursively collects paths where values are empty strings, empty arrays, or null.
 * Booleans and numbers are always considered valid.
 * @param {unknown} value
 * @param {string} prefix
 * @param {string} fileName
 * @param {string[]} errors
 */
function collectIssues(value, prefix, fileName, errors) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      errors.push(`  Empty array at: ${prefix}`);
    } else {
      value.forEach((item, i) => {
        collectIssues(item, `${prefix}[${i}]`, fileName, errors);
      });
    }
  } else if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      collectIssues(child, prefix ? `${prefix}.${key}` : key, fileName, errors);
    }
  } else if (value === null || value === undefined) {
    errors.push(`  Null/undefined at: ${prefix}`);
  } else if (typeof value === "string" && value.trim() === "") {
    const normalizedPath = `${fileName} → ${prefix.replace(/\[\d+\]/g, "[]")}`;
    if (!ALLOWED_EMPTY.has(normalizedPath)) {
      errors.push(`  Empty string at: ${prefix}`);
    }
  }
}

const files = fs
  .readdirSync(EN_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

let hasErrors = false;
const results = [];

for (const file of files) {
  const filePath = path.join(EN_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    hasErrors = true;
    results.push(`✗ ${file}\n  Invalid JSON: ${err.message}`);
    continue;
  }

  const errors = [];
  collectIssues(data, "", file, errors);

  if (errors.length > 0) {
    hasErrors = true;
    results.push(`✗ ${file}\n${errors.join("\n")}`);
  } else {
    results.push(`✓ ${file.padEnd(20)} — OK`);
  }
}

console.log(results.join("\n"));

if (hasErrors) {
  console.log("\nEN validation failed. Fix the empty or null fields above.");
  process.exit(1);
} else {
  console.log("\nAll EN content files are complete — no empty fields found.");
  process.exit(0);
}
