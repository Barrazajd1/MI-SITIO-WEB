#!/usr/bin/env node
/**
 * scaffold-locale-empty.js
 *
 * Lee data/en/<archivo>.json y genera el mismo archivo en los demás idiomas,
 * manteniendo la estructura completa, copiando campos técnicos tal cual
 * y dejando los textos traducibles como cadenas vacías "".
 *
 * Los campos que NO son texto (slugs, URLs, fechas, números, íconos, hrefs)
 * se copian tal cual.
 *
 * Uso:
 *   node scripts/scaffold-locale-empty.js <archivo>
 *   node scripts/scaffold-locale-empty.js blog
 *   node scripts/scaffold-locale-empty.js guides
 *   node scripts/scaffold-locale-empty.js         ← procesa TODOS los archivos en data/en/
 *
 * Flags:
 *   --overwrite    Sobreescribe archivos existentes (por defecto los omite)
 *   --locale es    Solo genera para un idioma específico
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");
const EN_DIR   = join(DATA_DIR, "en");

// ─── Campos que se copian sin modificar ──────────────────────────────────────
const NO_TRANSLATE_KEYS = new Set([
  "slug", "href", "icon", "coverImage", "image", "src", "url",
  "date", "author", "number", "phone", "email", "Telephone",
]);

// ─── Detectar si un valor es texto traducible ─────────────────────────────────
function isTranslatableString(key, value) {
  if (typeof value !== "string") return false;
  if (NO_TRANSLATE_KEYS.has(key)) return false;
  if (/^https?:\/\//.test(value)) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  if (/^[\+\d\s\-\(\)]+$/.test(value)) return false;
  if (/^\p{Emoji}+$/u.test(value)) return false;
  if (value.trim() === "") return false;
  return true;
}

// ─── Recorre el JSON: textos traducibles → "", resto se copia ─────────────────
function scaffoldValue(key, value) {
  if (isTranslatableString(key, value)) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map((item) => scaffoldValue(null, item));
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = scaffoldValue(k, v);
    }
    return result;
  }
  return value;
}

// ─── Argumentos ───────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const overwrite  = args.includes("--overwrite");
const localeIdx  = args.indexOf("--locale");
const onlyLocale = localeIdx !== -1 ? args[localeIdx + 1] : null;
const fileArg    = args.find((a) => !a.startsWith("--") && a !== onlyLocale);

// Archivos a procesar
let files;
if (fileArg) {
  const name = fileArg.endsWith(".json") ? fileArg : `${fileArg}.json`;
  if (!existsSync(join(EN_DIR, name))) {
    console.error(`❌  No existe data/en/${name}`);
    process.exit(1);
  }
  files = [name];
} else {
  files = readdirSync(EN_DIR).filter((f) => f.endsWith(".json"));
}

// Idiomas destino (todas las carpetas excepto "en")
let locales = readdirSync(DATA_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "en")
  .map((d) => d.name)
  .sort();

if (onlyLocale) {
  if (!locales.includes(onlyLocale)) {
    console.error(`❌  Idioma "${onlyLocale}" no encontrado en data/`);
    process.exit(1);
  }
  locales = [onlyLocale];
}

// ─── Procesar ─────────────────────────────────────────────────────────────────
console.log(`\n📁  Idiomas destino : ${locales.join(", ")}`);
console.log(`📄  Archivos        : ${files.join(", ")}`);
console.log(`✏️   Modo            : ${overwrite ? "sobreescribir existentes" : "omitir existentes"}\n`);

let created = 0;
let skipped = 0;

for (const file of files) {
  const enData     = JSON.parse(readFileSync(join(EN_DIR, file), "utf8"));
  const scaffolded = scaffoldValue(null, enData);

  for (const locale of locales) {
    const dir      = join(DATA_DIR, locale);
    const destPath = join(dir, file);

    if (existsSync(destPath) && !overwrite) {
      console.log(`⏭   ${locale}/${file}  →  ya existe, se omite`);
      skipped++;
      continue;
    }

    mkdirSync(dir, { recursive: true });
    writeFileSync(destPath, JSON.stringify(scaffolded, null, 2) + "\n", "utf8");
    const action = overwrite ? "actualizado" : "creado";
    console.log(`✅  ${locale}/${file}  →  ${action}`);
    created++;
  }
}

console.log(`\n✨  Listo — ${created} creado(s), ${skipped} omitido(s).\n`);
console.log(`💡  Busca los campos "" en data/ para ver qué textos faltan por traducir.\n`);
