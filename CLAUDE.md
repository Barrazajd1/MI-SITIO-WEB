# CLAUDE.md — mi-sitio-web

## Qué es este proyecto

Sitio web multilingüe (EN / ES / FR) construido con Next.js, React, Tailwind CSS y TypeScript.
Todo el contenido vive en archivos JSON locales. El sitio se genera estáticamente en build — sin base de datos, sin llamadas a APIs externas en producción.

Este es un proyecto de aprendizaje de Next.js bajo supervisión. La referencia de diseño es https://sinc.business/

## Stack

- **Framework:** Next.js 15+ con App Router y Turbopack
- **Estilos:** Tailwind CSS
- **Lenguaje:** TypeScript
- **Editor de contenido:** Strapi v5 (solo inglés, solo uso interno, nunca en producción)
- **Deploy:** Vercel (auto-deploy desde GitHub)

## Comandos principales

```bash
npm run dev             # servidor de desarrollo en http://localhost:3000
npm run build           # build de producción
npm run export-content  # exporta Strapi → data/en/*.json (requiere Strapi corriendo)
npm run validate        # verifica consistencia de claves entre EN / ES / FR
```

Para exportar desde Strapi (requiere .env.local con STRAPI_URL y STRAPI_TOKEN):
```bash
npm run export-content
```

## Filosofía de contenido — MUY IMPORTANTE

**Strapi es solo un editor de inglés. No tiene i18n configurado.**

```
Strapi v5 (solo inglés)
        │
        │  npm run export-content
        ▼
data/en/*.json          ← fuente de verdad
        │
        │  IA genera traducciones con contexto
        ▼
data/es/*.json          ← generado por IA desde EN
data/fr/*.json          ← generado por IA desde EN
data/{xx}/*.json        ← cualquier idioma futuro, mismo proceso
        │
        ▼
lib/content.ts          (única fuente de datos tipada — getContent())
        │
        ▼
app/[locale]/...        (páginas Next.js por idioma)
        │
        ▼
Vercel → sitio estático en vivo
```

**Reglas críticas:**
- Next.js NUNCA llama a Strapi en producción
- Strapi NUNCA tiene contenido en ES o FR — solo EN
- Los archivos ES/FR son generados por IA y viven en el repo junto al código
- Para agregar un idioma nuevo: generar JSONs con IA → agregar locale en `lib/content.ts`

## Pipeline completo antes de producción

```
1. npm run export-content     → descarga EN fresco de Strapi
2. npm run validate-en        → valida que EN no tenga campos vacíos (POR CONSTRUIR)
3. npm run translate          → IA genera ES/FR con contexto inteligente (POR CONSTRUIR)
4. npm run validate           → verifica consistencia de keys entre todos los idiomas
5. git add -A && git commit && git push → Vercel despliega automáticamente
```

Los scripts marcados "POR CONSTRUIR" son la próxima tarea de desarrollo.

## Estructura de carpetas relevante

```
app/
  layout.tsx                  # Root layout
  page.tsx                    # Redirige a /en
  [locale]/
    layout.tsx                # Layout por idioma (Navbar, generateStaticParams)
    page.tsx                  # Home
    about/page.tsx
    services/page.tsx
    contact/page.tsx
    pricing/page.tsx          # Página de precios (estilo Sinc)

components/
  Navbar.tsx                  # Navegación con cambio de idioma y menú hamburguesa
  ContactForm.tsx             # Formulario de contacto (client component)
  PricingCards.tsx            # Tarjetas de precios con toggle mensual/anual (client component)
  AnimatedSection.tsx         # Wrapper de animaciones

data/
  en/                         # Fuente de verdad — exportado de Strapi
    home.json
    nav.json
    services.json
    about.json
    contact.json
    pricing.json
  es/                         # Generado por IA desde EN
  fr/                         # Generado por IA desde EN

lib/
  content.ts                  # getContent(locale, page) — única fuente de datos tipada
  metadata.ts                 # buildMetadata() para SEO

scripts/
  export-from-strapi.js       # Exporta Strapi v5 → data/en/*.json (solo EN)
  validate-content.js         # Valida consistencia de keys entre todos los idiomas
  validate-en.js              # (POR CONSTRUIR) Valida que EN no tenga campos vacíos
  translate.js                # (POR CONSTRUIR) Genera traducciones con contexto IA
```

## Strapi v5 — detalles importantes

El script `scripts/export-from-strapi.js` fue adaptado para **Strapi v5**:
- La respuesta es `body.data.field` directamente (sin wrapper `attributes`)
- Se filtran campos del sistema: `id`, `documentId`, `createdAt`, `updatedAt`, `publishedAt`, `locale`
- El campo `worflow` (typo en Strapi) se renombra a `workflow` automáticamente en el export
- Solo exporta `LOCALES = ["en"]` — ES y FR NO se exportan de Strapi

Single Types en Strapi y sus slugs de API:

| Archivo JSON     | Slug API Strapi  |
|------------------|------------------|
| `home.json`      | `home-page`      |
| `about.json`     | `about-page`     |
| `services.json`  | `services-page`  |
| `contact.json`   | `contact-page`   |
| `nav.json`       | `nav`            |

El servidor de Strapi corre en `http://localhost:1337` durante desarrollo.
Las credenciales están en `.env.local` (nunca en el repo).

## Flujo para agregar una nueva página

1. Crear el Single Type en Strapi con los campos en inglés
2. Agregar el slug al mapa `ENDPOINTS` en `scripts/export-from-strapi.js`
3. Correr `npm run export-content` → genera `data/en/{page}.json`
4. Pedir a la IA que genere `data/es/{page}.json` y `data/fr/{page}.json`
5. En `lib/content.ts`, importar los JSON y agregarlos al mapa `content`
6. Crear `app/[locale]/{page}/page.tsx` usando `getContent(locale, "{page}")`
7. Agregar la ruta al nav en `data/en/nav.json`, `data/es/nav.json`, `data/fr/nav.json`
8. Correr `npm run validate` → confirmar consistencia de claves
9. `git add -A && git commit && git push`

## Flujo para actualizar contenido existente

1. Editar en Strapi (solo inglés)
2. `npm run export-content` → actualiza `data/en/*.json`
3. Pedir a la IA que actualice `data/es/*.json` y `data/fr/*.json`
4. `npm run validate` → confirmar consistencia
5. `git add -A && git commit && git push`

## Próximas tareas de desarrollo

1. ~~**`scripts/validate-en.js`**~~ ✅ **COMPLETADO** — Valida recursivamente todos los `data/en/*.json`. Campos allowlisted: `currency` y `period` del plan Enterprise en `pricing.json` (intencionalmente vacíos). Registrado como `npm run validate-en`.

2. **`scripts/translate.js`** ← PRÓXIMO — Script que lee `data/en/*.json` + un archivo de marcadores de contexto (`scripts/translation-markers.js`), y genera los archivos de otros idiomas usando la API de Claude. Los marcadores indican el tipo de cada campo:
   - `seo_title` → terminología precisa, keywords optimizados para SEO
   - `feature_term` → término técnico, debe ser consistente en todo el sitio
   - `engaging_copy` → texto natural y atractivo, no traducción literal
   - `blog_content` → contenido enganchador, tono local
   - `ui_label` → etiqueta de interfaz, corta y clara
   Uso esperado: `node scripts/translate.js --lang=es` o `--lang=fr`

3. **Página de Pricing en Strapi** — Crear el Single Type `pricing-page` en Strapi con los campos correspondientes y conectarlo al export script.
