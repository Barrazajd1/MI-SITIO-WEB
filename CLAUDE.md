# CLAUDE.md — mi-sitio-web

## Qué es este proyecto

Sitio web multilingüe (EN / ES / FR / PT / IT) construido con Next.js, React, Tailwind CSS y TypeScript.
Todo el contenido vive en archivos JSON locales. El sitio se genera estáticamente en build — sin base de datos, sin llamadas a APIs externas en producción.

Este es un proyecto de aprendizaje de Next.js bajo supervisión. La referencia de diseño es https://sinc.business/

## Stack

- **Framework:** Next.js 15+ con App Router y Turbopack
- **Estilos:** Tailwind CSS
- **Lenguaje:** TypeScript
- **Editor de contenido:** Strapi v5 (solo inglés, solo uso interno, nunca en producción)
- **Deploy:** Vercel (auto-deploy desde GitHub)
- **Traducción automatizada:** `scripts/translate.js` usando Google Gemini API (`gemini-1.5-flash`)

## Idiomas soportados

| Código | Idioma     | Origen        |
|--------|------------|---------------|
| `en`   | Inglés     | Strapi (fuente de verdad) |
| `es`   | Español    | Generado por IA desde EN |
| `fr`   | Francés    | Generado por IA desde EN |
| `pt`   | Portugués  | Generado por IA desde EN |
| `it`   | Italiano   | Generado por IA desde EN |

## Comandos principales

```bash
npm run dev                        # servidor de desarrollo en http://localhost:3000
npm run build                      # build de producción
npm run export-content             # exporta Strapi → data/en/*.json
npm run validate-en                # valida que EN no tenga campos vacíos
npm run translate -- --lang=es     # genera traducciones para un idioma con Gemini
npm run validate                   # verifica consistencia de claves entre todos los idiomas
```

Para exportar desde Strapi (requiere `.env.local` con `STRAPI_URL` y `STRAPI_TOKEN`):
```bash
npm run export-content
```

Para traducir con Gemini (requiere `GEMINI_API_KEY` en `.env.local`):
```bash
npm run translate -- --lang=es
npm run translate -- --lang=fr
npm run translate -- --lang=pt
npm run translate -- --lang=it
```

## Variables de entorno (.env.local)

```
NEXT_PUBLIC_BASE_URL=https://mi-sitio-web-tau.vercel.app
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<token de Strapi>
GEMINI_API_KEY=<token de Google AI Studio>
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
        │  npm run translate --lang=xx  (Gemini API)
        │  o pedir a la IA manualmente
        ▼
data/es/*.json  data/fr/*.json  data/pt/*.json  data/it/*.json
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
- Strapi NUNCA tiene contenido en ES, FR, PT o IT — solo EN
- Los archivos de traducción son generados por IA y viven en el repo junto al código
- Para agregar un idioma nuevo: generar JSONs con IA → agregar locale en `lib/content.ts`

## Pipeline completo antes de producción

```
1. npm run export-content          → descarga EN fresco de Strapi
2. npm run validate-en             → valida que EN no tenga campos vacíos ✅
3. npm run translate -- --lang=xx  → Gemini genera traducciones con contexto ✅
   (o pedir a la IA manualmente si no hay crédito en Gemini)
4. npm run validate                → verifica consistencia de keys entre todos los idiomas ✅
5. git add -A && git commit && git push → Vercel despliega automáticamente
```

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
    pricing/page.tsx          # Página de precios con toggle mensual/anual (estilo Sinc)

components/
  Navbar.tsx                  # Navegación con cambio de idioma y menú hamburguesa
  ContactForm.tsx             # Formulario de contacto (client component)
  PricingCards.tsx            # Tarjetas de precios con toggle mensual/anual (client component)
  AnimatedSection.tsx         # Wrapper de animaciones

data/
  en/                         # Fuente de verdad — exportado de Strapi
  es/                         # Generado por IA desde EN
  fr/                         # Generado por IA desde EN
  pt/                         # Generado por IA desde EN
  it/                         # Generado por IA desde EN
  (cada carpeta contiene: home.json, nav.json, services.json, about.json, contact.json, pricing.json)

lib/
  content.ts                  # getContent(locale, page) — única fuente de datos tipada
  metadata.ts                 # buildMetadata() para SEO

scripts/
  export-from-strapi.js       # Exporta Strapi v5 → data/en/*.json (solo EN)
  validate-en.js              # Valida que EN no tenga campos vacíos ✅
  validate-content.js         # Valida consistencia de keys entre todos los idiomas ✅
  translate.js                # Genera traducciones con Gemini API ✅
  translation-markers.js      # 77 reglas de contexto por campo (seo_title, feature_term, etc.)
```

## Strapi v5 — detalles importantes

El script `scripts/export-from-strapi.js` fue adaptado para **Strapi v5**:
- La respuesta es `body.data.field` directamente (sin wrapper `attributes`)
- Se filtran campos del sistema: `id`, `documentId`, `createdAt`, `updatedAt`, `publishedAt`, `locale`
- El campo `worflow` (typo en Strapi) se renombra a `workflow` automáticamente en el export
- Solo exporta `LOCALES = ["en"]` — otros idiomas NO se exportan de Strapi

Single Types en Strapi y sus slugs de API:

| Archivo JSON     | Slug API Strapi  |
|------------------|------------------|
| `home.json`      | `home-page`      |
| `about.json`     | `about-page`     |
| `services.json`  | `services-page`  |
| `contact.json`   | `contact-page`   |
| `nav.json`       | `nav`            |
| `pricing.json`   | `pricing-page`   |

El servidor de Strapi corre en `http://localhost:1337` durante desarrollo.
Las credenciales están en `.env.local` (nunca en el repo).

## Flujo para agregar una nueva página

1. Crear el Single Type en Strapi con los campos en inglés
2. Agregar el slug al mapa `ENDPOINTS` en `scripts/export-from-strapi.js`
3. Correr `npm run export-content` → genera `data/en/{page}.json`
4. Correr `npm run translate -- --lang=es` (y fr, pt, it) o pedir a la IA
5. En `lib/content.ts`, importar los JSON y agregarlos al mapa `content`
6. Crear `app/[locale]/{page}/page.tsx` usando `getContent(locale, "{page}")`
7. Agregar la ruta al nav en todos los `data/{locale}/nav.json`
8. Correr `npm run validate` → confirmar consistencia de claves
9. `git add -A && git commit && git push`

## Flujo para agregar un nuevo idioma

1. Correr `npm run translate -- --lang=xx` (Gemini) o pedir a la IA los JSON traducidos
2. En `lib/content.ts`, agregar `"xx"` al array `locales` e importar todos los JSON
3. Correr `npm run validate` → confirmar consistencia
4. `git add -A && git commit && git push`

## Flujo para actualizar contenido existente

1. Editar en Strapi (solo inglés)
2. `npm run export-content` → actualiza `data/en/*.json`
3. `npm run validate-en` → verificar que EN está completo
4. `npm run translate -- --lang=es` (y fr, pt, it) o pedir a la IA
5. `npm run validate` → confirmar consistencia
6. `git add -A && git commit && git push`
