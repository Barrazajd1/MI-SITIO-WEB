---
name: translate-1
description: |
  Pipeline completo de traducción para mi-sitio-web. Úsala siempre que el usuario diga
  "corre la skill Translate 1", "traduce al [idioma]", "agrega el idioma [X]", "genera
  las traducciones para [idioma]", o cualquier variante que implique agregar o regenerar
  un idioma en el proyecto. Ejecuta export → validate-en → traducción con Claude Code →
  validate y registra el nuevo idioma en lib/content.ts si es necesario.
---

# Skill: Translate-1

Automatiza el pipeline completo para agregar o regenerar un idioma en el proyecto.

## Paso 0 — Identificar el idioma

Lee el mensaje del usuario y extrae el idioma destino. Si no lo indicó, pregúntale antes de continuar.

Idiomas ya soportados en scripts/translate.js:

| Código | Idioma |
|--------|--------|
| es     | Spanish (Latin America) |
| fr     | French |
| pt     | Portuguese (Brazil) |
| it     | Italian |
| de     | German |
| id     | Indonesian |

Si el usuario pide un idioma que no está en esta lista, agrégalo primero al objeto SUPPORTED_LANGS en scripts/translate.js antes de continuar.

## Paso 1 — Exportar contenido de Strapi

Ejecuta: npm run export-content

Esto descarga el contenido más reciente desde Strapi y actualiza los archivos en data/en/.
Si Strapi no está corriendo localmente el comando fallará — en ese caso avisa al usuario
y continúa con los archivos EN que ya existen en el repo (son la fuente de verdad).

## Paso 2 — Validar el contenido EN

Ejecuta: npm run validate-en

Verifica que ningún campo en data/en/*.json esté vacío.
Si hay errores, muéstralos al usuario y detente — no tiene sentido traducir contenido incompleto.

## Paso 3 — Leer los archivos EN como referencia

Lee los 6 archivos fuente antes de traducir:
- data/en/home.json
- data/en/nav.json
- data/en/services.json
- data/en/about.json
- data/en/contact.json
- data/en/pricing.json

Esto te da la estructura exacta que deben replicar los archivos traducidos.

## Paso 4 — Generar las traducciones con Claude Code

Traduce tú mismo los 6 archivos JSON del inglés al idioma destino y créalos en data/XX/.

Reglas estrictas:
- Mantén exactamente la misma estructura de claves que EN — no agregues ni quites ninguna
- Traduce solo los valores de texto
- Nunca traduzcas las claves JSON (ej: "hero", "title", "description" se quedan igual)
- Nunca traduzcas URLs ni rutas (ej: "/services" se queda igual)
- El campo "number" en stats NO se traduce (ej: "100%", "0", "∞" se quedan igual)
- El campo "number" de Languages/Idiomas SÍ se actualiza al total real de idiomas activos
  después de agregar el nuevo (ver Paso 4b)

### Paso 4b — Actualizar el conteo de idiomas en todos los archivos

Después de crear los archivos del nuevo idioma, cuenta cuántos idiomas tiene el proyecto
(incluyendo el recién agregado) y actualiza el campo "number" del stat de idiomas en TODOS
los archivos home.json de TODOS los idiomas.

Por ejemplo, si el proyecto ahora tiene 6 idiomas, busca en cada data/XX/home.json el stat
cuyo label sea el equivalente a "Languages" / "Idiomas" / "Langues" / etc. y cambia su
"number" al nuevo total:

  { "label": "Languages", "number": "6" }
  { "label": "Idiomas", "number": "6" }
  { "label": "Langues", "number": "6" }
  ... (todos los idiomas activos)

## Paso 5 — Validar consistencia entre idiomas

Ejecuta: npm run validate

Verifica que todos los idiomas tengan exactamente las mismas claves que EN.
Si hay errores de claves faltantes o extra, corrígelos antes de continuar.

## Paso 6 — Registrar el idioma en lib/content.ts

Si el idioma es NUEVO (no existía antes), actualiza lib/content.ts:

1. Agrega los imports de los 6 archivos JSON:
   import XXHome from "../data/XX/home.json";
   import XXNav from "../data/XX/nav.json";
   import XXServices from "../data/XX/services.json";
   import XXAbout from "../data/XX/about.json";
   import XXContact from "../data/XX/contact.json";
   import XXPricing from "../data/XX/pricing.json";

2. Agrega "XX" al array locales:
   export const locales = ["en", "es", "fr", "pt", "it", "XX"] as const;

3. Agrega la entrada en el objeto content:
   XX: { home: XXHome, nav: XXNav, services: XXServices, about: XXAbout, contact: XXContact, pricing: XXPricing },

Si el idioma ya existía (solo se está regenerando), omite este paso.

## Paso 7 — Commit y push

Una vez completados todos los pasos anteriores sin errores, ejecuta:

  git add -A && git commit -m "feat: add XX language" && git push

Reemplaza XX con el código del idioma agregado. Vercel desplegará automáticamente.

Al terminar informa al usuario:
- Qué pasos se completaron exitosamente
- Qué pasos fallaron y por qué (si hubo alguno)
- Los archivos generados en data/XX/
- Si se actualizó lib/content.ts
- Si el push fue exitoso

## Notas importantes

- Nunca uses Google Gemini ni npm run translate — las traducciones las genera Claude Code directamente
- Nunca traduzcas las claves JSON, solo los valores de texto
- Nunca traduzcas URLs ni nombres de rutas
- Actualiza siempre el conteo de idiomas en todos los home.json cuando agregues un idioma nuevo
