// @ts-check
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const LOCALES = fs
  .readdirSync(DATA_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

/**
 * Recursively collects all key paths from a JSON value.
 * Arrays: inspects the first element if it is an object, marks it with [].
 * @param {unknown} value
 * @param {string} prefix
 * @returns {Set<string>}
 */
function getKeyPaths(value, prefix = "") {
  const paths = new Set();

  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      for (const p of getKeyPaths(value[0], `${prefix}[]`)) {
        paths.add(p);
      }
    } else {
      paths.add(`${prefix}[]`);
    }
  } else if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      const childPrefix = prefix ? `${prefix}.${key}` : key;
      for (const p of getKeyPaths(child, childPrefix)) {
        paths.add(p);
      }
    }
  } else {
    paths.add(prefix);
  }

  return paths;
}

function loadJson(locale, file) {
  const filePath = path.join(DATA_DIR, locale, file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function setDiff(a, b) {
  return [...a].filter((x) => !b.has(x)).sort();
}

// Collect all .json files per locale
const filesByLocale = {};
for (const locale of LOCALES) {
  filesByLocale[locale] = new Set(
    fs
      .readdirSync(path.join(DATA_DIR, locale))
      .filter((f) => f.endsWith(".json"))
  );
}

const allFiles = new Set(Object.values(filesByLocale).flatMap((s) => [...s]));

let hasErrors = false;
const results = [];

for (const file of [...allFiles].sort()) {
  const errors = [];

  // Check which locales are missing this file entirely
  const presentIn = LOCALES.filter((l) => filesByLocale[l].has(file));
  const missingIn = LOCALES.filter((l) => !filesByLocale[l].has(file));

  for (const locale of missingIn) {
    errors.push(`  File missing in ${locale}/`);
  }

  // Compare key paths across all pairs
  if (presentIn.length >= 2) {
    const pathSets = Object.fromEntries(
      presentIn.map((l) => [l, getKeyPaths(loadJson(l, file))])
    );

    // Use the first locale as reference and compare every other against it
    const [ref, ...rest] = presentIn;
    for (const other of rest) {
      const missing = setDiff(pathSets[ref], pathSets[other]);
      const extra = setDiff(pathSets[other], pathSets[ref]);

      for (const p of missing) {
        errors.push(`  Missing in ${other}: ${p}`);
      }
      for (const p of extra) {
        errors.push(`  Extra in   ${other}: ${p}`);
      }
    }
  }

  if (errors.length > 0) {
    hasErrors = true;
    results.push(`✗ ${file}\n${errors.join("\n")}`);
  } else {
    results.push(`✓ ${file.padEnd(20)} — OK`);
  }
}

console.log(results.join("\n"));

if (hasErrors) {
  console.log("\nContent validation failed. Fix the issues above.");
  process.exit(1);
} else {
  console.log("\nAll content files are consistent across locales.");
  process.exit(0);
}
