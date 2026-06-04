#!/usr/bin/env node
/**
 * init-locale-json.js
 *
 * Genera un archivo JSON vacío (con la estructura base correcta) en cada
 * carpeta de idioma dentro de data/ que todavía no lo tenga.
 *
 * Uso:
 *   node scripts/init-locale-json.js <tipo>
 *
 * Ejemplos:
 *   node scripts/init-locale-json.js blog
 *   node scripts/init-locale-json.js guides
 *
 * Para añadir un nuevo tipo, agrégalo en TEMPLATES más abajo.
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../data");

// ─── Plantillas por tipo ──────────────────────────────────────────────────────
const TEMPLATES = {
  blog: {
    posts: [],
  },

  guides: {
    categories: [],
  },

  // Agrega más tipos aquí según vayas necesitando:
  // faq: { items: [] },
  // testimonials: { items: [] },
};

// ─── Script ───────────────────────────────────────────────────────────────────
const type = process.argv[2];

if (!type) {
  console.error("❌  Debes indicar el tipo de archivo.");
  console.error("   Uso: node scripts/init-locale-json.js <tipo>");
  console.error("   Tipos disponibles:", Object.keys(TEMPLATES).join(", "));
  process.exit(1);
}

if (!TEMPLATES[type]) {
  console.error(`❌  Tipo "${type}" no reconocido.`);
  console.error("   Tipos disponibles:", Object.keys(TEMPLATES).join(", "));
  process.exit(1);
}

// Detectar los idiomas existentes (subcarpetas de data/)
const locales = readdirSync(DATA_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

console.log(`\n📁  Idiomas detectados: ${locales.join(", ")}`);
console.log(`📄  Tipo: ${type}\n`);

let created = 0;
let skipped = 0;

for (const locale of locales) {
  const dir = join(DATA_DIR, locale);
  const filePath = join(dir, `${type}.json`);

  if (existsSync(filePath)) {
    console.log(`⏭   ${locale}/${type}.json  →  ya existe, se omite`);
    skipped++;
    continue;
  }

  // Crear la carpeta si no existe (por si acaso)
  mkdirSync(dir, { recursive: true });

  // Escribir la plantilla vacía con formato legible
  writeFileSync(filePath, JSON.stringify(TEMPLATES[type], null, 2) + "\n", "utf8");
  console.log(`✅  ${locale}/${type}.json  →  creado`);
  created++;
}

console.log(`\n✨  Listo — ${created} creado(s), ${skipped} omitido(s).\n`);
