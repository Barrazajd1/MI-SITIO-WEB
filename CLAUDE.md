# CLAUDE.md — mi-sitio-web

## Qué es este proyecto

Sitio web multilingüe (EN / ES) construido con Next.js 16, React 19, Tailwind CSS 4 y TypeScript 5.
Todo el contenido vive en archivos JSON locales. El sitio se genera estáticamente en build — sin base de datos, sin llamadas a APIs externas en producción.

## Stack

- **Framework:** Next.js 16 con App Router y Turbopack
- **Estilos:** Tailwind CSS 4
- **Lenguaje:** TypeScript 5
- **Editor de contenido:** Strapi v5 (solo uso interno, nunca en producción)

## Comandos principales

```bash
npm run dev          # servidor de desarrollo en http://localhost:3000
npm run build        # build de producción (genera 13 páginas estáticas)
npm run validate     # verifica que data/en/ y data/es/ tengan las mismas claves
npm run export-content  # exporta contenido de Strapi → data/en/*.json (requiere env vars)
```

Para exportar desde Strapi:
```bash
STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=<token> npm run export-content
```

## Arquitectura de contenido

```
Strapi v5 (editor interno, solo inglés)
        │
        │  npm run export-content
        ▼
data/en/*.json   ──→  traducción manual  ──→  data/es/*.json
        │
        ▼
lib/content.ts        (única fuente de datos tipada — función getContent())
        │
        ▼
app/[locale]/...      (páginas Next.js por idioma)
        │
        ▼
Sitio estático generado en build
```

**Regla crítica:** Next.js NUNCA llama a Strapi en producción. Toda la lógica de contenido vive en `lib/content.ts` apuntando a los JSON locales.

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
    sitemap.ts                # Genera /sitemap.xml con 8 URLs (2 locales × 4 rutas)

components/
  Navbar.tsx                  # Navegación con cambio de idioma y menú hamburguesa
  ContactForm.tsx             # Formulario de contacto (client component)

data/
  en/                         # Contenido en inglés (generado por export-content)
    home.json
    nav.json
    services.json
    about.json
    contact.json
  es/                         # Contenido en español (misma estructura de claves)

lib/
  content.ts                  # getContent(locale, page) — fuente única de datos

scripts/
  export-from-strapi.js       # Exporta Strapi v5 → data/en/*.json
  validate-content.js         # Valida consistencia de claves entre en/ y es/
```

## Strapi v5 — detalles importantes

El script `scripts/export-from-strapi.js` fue adaptado para **Strapi v5**:
- La respuesta de la API es `body.data.field` directamente (sin wrapper `attributes`)
- Se filtran los campos del sistema: `id`, `documentId`, `createdAt`, `updatedAt`, `publishedAt`, `locale`
- Se filtran valores `null` (campos opcionales vacíos como `hero.buttonText` en páginas que no lo usan)

Los Single Types en Strapi y sus slugs de API:

| Archivo JSON    | Slug API Strapi  |
|-----------------|------------------|
| `home.json`     | `home-page`      |
| `about.json`    | `about-page`     |
| `services.json` | `services-page`  |
| `contact.json`  | `contact-page`   |
| `nav.json`      | `nav`            |

El servidor de Strapi corre en `http://localhost:1337` durante desarrollo.

## Flujo para agregar una nueva página

1. Crear el Single Type en Strapi con los campos correspondientes
2. Agregar el slug al mapa `ENDPOINTS` en `scripts/export-from-strapi.js`
3. Crear `data/en/{page}.json` y `data/es/{page}.json` con las mismas claves
4. En `lib/content.ts`, importar los JSON y agregarlos al mapa `content`
5. Crear `app/[locale]/{page}/page.tsx` usando `getContent(locale, "{page}")`
6. Agregar la ruta al array `routes` en `app/sitemap.ts`
7. Agregar el enlace en `data/en/nav.json` y `data/es/nav.json`
8. Correr `npm run validate` para confirmar consistencia de claves

## Flujo para actualizar contenido

1. Editar en Strapi (solo inglés)
2. `npm run export-content` → actualiza `data/en/*.json`
3. Actualizar `data/es/*.json` con las traducciones correspondientes
4. `npm run validate` → confirmar consistencia
5. `npm run build` → verificar que compila limpio
