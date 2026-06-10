// @ts-check
"use strict";

/**
 * translate.js
 *
 * Lee data/en/*.json (fuente exportada de Strapi) y traduce su contenido
 * a todos los demás idiomas del proyecto usando Claude (Anthropic API).
 *
 * Detecta automáticamente los idiomas destino desde las carpetas en data/,
 * por lo que cualquier idioma nuevo que se agregue al proyecto será incluido
 * sin modificar este script.
 *
 * Uso:
 *   npm run translate                        ← todos los idiomas, todos los archivos
 *   npm run translate -- --lang=es           ← solo español
 *   npm run translate -- --file=blog         ← solo blog.json en todos los idiomas
 *   npm run translate -- --lang=es --file=nav
 *   npm run translate -- --overwrite         ← retraducir aunque ya exista el archivo
 *   npm run translate -- --dry-run           ← muestra qué se haría sin escribir nada
 *
 * Comportamiento por defecto (sin --overwrite):
 *   - Si el archivo destino no existe → traduce
 *   - Si existe pero contiene "TODO:" → retraduce (estaba pendiente)
 *   - Si existe y no tiene "TODO:" → omite
 *
 * Requiere en .env.local:
 *   ANTHROPIC_API_KEY=<tu clave de Anthropic>
 */

const fs       = require("fs");
const path     = require("path");
const { default: Anthropic } = require("@anthropic-ai/sdk");

// ─── Configuración ────────────────────────────────────────────────────────────

const { ANTHROPIC_API_KEY } = process.env;

if (!ANTHROPIC_API_KEY) {
  console.error("❌  ANTHROPIC_API_KEY no está definida.");
  console.error("    Agrégala en .env.local: ANTHROPIC_API_KEY=<tu clave>");
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, "..", "data");
const EN_DIR   = path.join(DATA_DIR, "en");

// ─── Campos técnicos que nunca se traducen ────────────────────────────────────

const NO_TRANSLATE_KEYS = new Set([
  "slug", "href", "icon", "coverImage", "image", "src", "url",
  "date", "author", "number", "phone", "email", "Telephone",
]);

/**
 * Devuelve true si el valor es un texto que debe traducirse.
 * @param {string|null} key
 * @param {unknown} value
 * @returns {boolean}
 */
function isTranslatableString(key, value) {
  if (typeof value !== "string")                          return false;
  if (key !== null && NO_TRANSLATE_KEYS.has(key))        return false;
  if (/^https?:\/\//.test(value))                        return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value))                return false;
  if (/^[\+\d\s\-\(\)]+$/.test(value))                  return false;
  if (/^\p{Emoji}+$/u.test(value))                       return false;
  if (value.trim() === "")                               return false;
  return true;
}

// ─── Extracción de cadenas (JSON → mapa plano) ────────────────────────────────

/**
 * Recorre el JSON y rellena `out` con un mapa plano de rutas → valores.
 * Ejemplo: { "hero.title": "Build faster...", "links[0].label": "Home" }
 *
 * @param {unknown} value
 * @param {string|null} key
 * @param {string} prefix
 * @param {Record<string, string>} out
 */
function extractStrings(value, key, prefix, out) {
  if (isTranslatableString(key, value)) {
    out[prefix] = /** @type {string} */ (value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) =>
      extractStrings(item, null, `${prefix}[${i}]`, out)
    );
    return;
  }
  if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(/** @type {Record<string,unknown>} */ (value))) {
      const childPrefix = prefix ? `${prefix}.${k}` : k;
      extractStrings(v, k, childPrefix, out);
    }
  }
}

// ─── Aplicación de traducciones (mapa plano → JSON) ───────────────────────────

/**
 * Reconstruye el JSON original reemplazando las cadenas traducibles por
 * sus traducciones del mapa. Los campos técnicos se copian tal cual.
 *
 * @param {unknown} value
 * @param {string|null} key
 * @param {string} prefix
 * @param {Record<string, string>} translations
 * @returns {unknown}
 */
function applyStrings(value, key, prefix, translations) {
  if (isTranslatableString(key, value)) {
    return translations[prefix] ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      applyStrings(item, null, `${prefix}[${i}]`, translations)
    );
  }
  if (value !== null && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const result = {};
    for (const [k, v] of Object.entries(/** @type {Record<string,unknown>} */ (value))) {
      const childPrefix = prefix ? `${prefix}.${k}` : k;
      result[k] = applyStrings(v, k, childPrefix, translations);
    }
    return result;
  }
  return value;
}

// ─── Nombres de idioma para el prompt ────────────────────────────────────────

/** @type {Record<string, string>} */
const LOCALE_NAMES = {
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  id: "Indonesian",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  vi: "Vietnamese",
  hi: "Hindi",
  th: "Thai",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  cs: "Czech",
  ro: "Romanian",
  uk: "Ukrainian",
  he: "Hebrew",
};

/** @param {string} locale @returns {string} */
function localeName(locale) {
  return LOCALE_NAMES[locale] ?? locale;
}

// ─── Llamada a Claude (Anthropic) ────────────────────────────────────────────

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

/**
 * Envía todas las cadenas en un solo request y devuelve el mapa traducido.
 * @param {Record<string, string>} strings
 * @param {string} locale
 * @returns {Promise<Record<string, string>>}
 */
async function translateBatch(strings, locale) {
  const language = localeName(locale);

  const prompt =
`Translate the following JSON values from English to ${language}.

Rules:
- Return ONLY valid JSON — no markdown fences, no explanations, no extra text
- Translate every string value accurately and naturally for a professional website
- Preserve special characters exactly: ←, →, —, ·, ∞
- Do NOT translate: proper nouns (Next.js, Vercel, JSON, React, Git, Strapi), URLs, slugs
- Keep the exact same JSON keys

${JSON.stringify(strings, null, 2)}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const message = await client.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages:   [{ role: "user", content: prompt }],
      });
      const raw   = /** @type {any} */ (message.content[0]).text.trim();
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      return JSON.parse(clean);
    } catch (err) {
      if (attempt === 2) throw new Error(`Claude error: ${/** @type {Error} */ (err).message}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return strings;
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Devuelve true si el archivo destino tiene valores "TODO:" pendientes.
 * @param {string} filePath
 * @returns {boolean}
 */
function hasTodos(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").includes("TODO:");
  } catch {
    return false;
  }
}

// ─── Argumentos de línea de comandos ─────────────────────────────────────────

const args      = process.argv.slice(2);
const overwrite = args.includes("--overwrite");
const dryRun    = args.includes("--dry-run");
const langArg   = (args.find(a => a.startsWith("--lang=")) ?? "").replace("--lang=", "");
const fileArg   = (args.find(a => a.startsWith("--file=")) ?? "").replace("--file=", "");

// Locales destino: todas las carpetas de data/ excepto "en"
let locales = fs
  .readdirSync(DATA_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== "en")
  .map(d => d.name)
  .sort();

if (langArg) {
  if (!locales.includes(langArg)) {
    console.error(`❌  Locale "${langArg}" no existe en data/`);
    console.error(`    Locales disponibles: ${locales.join(", ")}`);
    process.exit(1);
  }
  locales = [langArg];
}

// Archivos a traducir: todos los .json de data/en/
let files = fs.readdirSync(EN_DIR).filter(f => f.endsWith(".json")).sort();

if (fileArg) {
  const name = fileArg.endsWith(".json") ? fileArg : `${fileArg}.json`;
  if (!files.includes(name)) {
    console.error(`❌  Archivo "data/en/${name}" no encontrado`);
    process.exit(1);
  }
  files = [name];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const modeLabel = dryRun
    ? "dry-run (no escribe)"
    : overwrite
    ? "sobreescribir todo"
    : "omitir existentes sin TODO";

  console.log(`\n🌐  Traducción con Claude API${dryRun ? " — DRY RUN" : ""}`);
  console.log(`📁  Locales  : ${locales.map(l => `${l} (${localeName(l)})`).join(", ")}`);
  console.log(`📄  Archivos : ${files.join(", ")}`);
  console.log(`✏️   Modo     : ${modeLabel}\n`);

  let done = 0, skipped = 0, failed = 0;

  for (const locale of locales) {
    console.log(`[${locale}] ${localeName(locale)}`);

    const dir = path.join(DATA_DIR, locale);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const file of files) {
      const destPath = path.join(dir, file);
      const exists   = fs.existsSync(destPath);
      const hasTodo  = exists && hasTodos(destPath);

      // ── Decidir si traducir ────────────────────────────────────────────────
      if (exists && !overwrite && !hasTodo) {
        console.log(`  ⏭   ${file}  →  omitido (ya existe)`);
        skipped++;
        continue;
      }

      // ── Leer fuente EN ─────────────────────────────────────────────────────
      const enData = JSON.parse(
        fs.readFileSync(path.join(EN_DIR, file), "utf8")
      );

      // ── Extraer cadenas traducibles ────────────────────────────────────────
      /** @type {Record<string, string>} */
      const strings = {};
      extractStrings(enData, null, "", strings);

      if (Object.keys(strings).length === 0) {
        console.log(`  ⏭   ${file}  →  sin cadenas traducibles`);
        skipped++;
        continue;
      }

      const count  = Object.keys(strings).length;
      const reason = !exists ? "nuevo" : hasTodo ? "tiene TODO" : "forzado";
      process.stdout.write(`  ⏳  ${file}  (${count} cadenas, ${reason})...`);

      // ── Dry run: no escribe ────────────────────────────────────────────────
      if (dryRun) {
        console.log("  [dry-run]");
        done++;
        continue;
      }

      // ── Traducir y escribir ────────────────────────────────────────────────
      try {
        const translated = await translateBatch(strings, locale);
        const result     = applyStrings(enData, null, "", translated);

        fs.writeFileSync(
          destPath,
          JSON.stringify(result, null, 2) + "\n",
          "utf8"
        );
        console.log("  ✅");
        done++;

        // Pausa entre requests para evitar rate limiting
        await new Promise(r => setTimeout(r, 300));
      } catch (/** @type {any} */ err) {
        console.log(`  ✗  ${err.message}`);
        failed++;
      }
    }

    console.log();
  }

  // ── Resumen ────────────────────────────────────────────────────────────────
  console.log(`✨  Listo — ${done} traducido(s), ${skipped} omitido(s), ${failed} error(es).`);

  if (!dryRun && done > 0) {
    console.log(`\n💡  Siguiente paso: npm run validate\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(/** @type {any} */ err => {
  console.error(`\n❌  Error fatal: ${err.message}`);
  process.exit(1);
});
