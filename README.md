# mi-sitio-web

Sitio web multilingüe (EN / ES) construido con Next.js. El contenido vive en archivos JSON locales — sin base de datos, sin CMS en producción.

**Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript 5

---

## Arquitectura

```
Strapi (futuro, solo editor interno)
        │
        │  exporta JSON manualmente
        ▼
data/en/*.json   ──→  traducciones  ──→  data/es/*.json
        │
        ▼
lib/content.ts        (única fuente de datos tipada)
        │
        ▼
app/[locale]/...      (páginas Next.js por idioma)
        │
        ▼
Sitio estático generado en build
```

**Regla principal:** Next.js nunca llama a Strapi en producción. El sitio se construye exclusivamente desde los archivos JSON de `/data/`.

---

## Estructura de carpetas

```
mi-sitio-web/
├── app/
│   ├── layout.tsx                  # Root layout (fuentes, metadata global)
│   ├── page.tsx                    # Redirección automática a /en
│   └── [locale]/
│       ├── layout.tsx              # Layout por idioma (Navbar, generateStaticParams)
│       ├── page.tsx                # Página home
│       ├── about/page.tsx
│       ├── services/page.tsx
│       └── contact/page.tsx
│
├── components/
│   ├── Navbar.tsx                  # Navegación con cambio de idioma
│   └── ContactForm.tsx             # Formulario de contacto (client component)
│
├── data/
│   ├── en/                         # Contenido en inglés
│   │   ├── home.json
│   │   ├── nav.json
│   │   ├── services.json
│   │   ├── about.json
│   │   └── contact.json
│   └── es/                         # Contenido en español (misma estructura)
│       └── ...
│
├── lib/
│   └── content.ts                  # Mapa de contenido, tipos y función getContent()
│
├── scripts/
│   └── validate-content.js         # Valida que en/ y es/ tengan las mismas claves
│
└── public/                         # Assets estáticos
```

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:3000 → redirige a /en)
npm run dev

# Build de producción
npm run build
npm run start
```

---

## Cómo validar contenido

Antes de hacer un commit o un build, corre:

```bash
npm run validate
```

El script compara recursivamente las claves de cada JSON entre `data/en/` y `data/es/`.

**Salida sin errores:**
```
✓ about.json           — OK
✓ contact.json         — OK
✓ home.json            — OK
✓ nav.json             — OK
✓ services.json        — OK

All content files are consistent across locales.
```

**Salida con errores:**
```
✗ home.json
  Missing in es: hero.subtitle
  Extra in   es: hero.subtitulo
```

Sale con código `0` si todo está bien y `1` si hay errores (compatible con CI).

---

## Agregar una nueva página

1. Crear `data/en/{page}.json` con la estructura de claves de la página
2. Crear `data/es/{page}.json` con **exactamente las mismas claves** (solo cambian los valores)
3. En `lib/content.ts`, agregar los imports y la entrada al mapa `content`:
   ```ts
   import enFoo from "../data/en/foo.json";
   import esFoo from "../data/es/foo.json";

   const content = {
     en: { ..., foo: enFoo },
     es: { ..., foo: esFoo },
   };
   ```
4. Crear `app/[locale]/foo/page.tsx` usando `getContent(locale, "foo")`
5. Agregar el enlace en `data/en/nav.json` y `data/es/nav.json`
6. Correr `npm run validate` para confirmar que las claves son consistentes

---

## Agregar un nuevo idioma

1. Crear la carpeta `data/{locale}/` con los mismos 5 archivos JSON que `en/` (misma estructura de claves, contenido traducido)
2. En `lib/content.ts`, agregar el locale al array:
   ```ts
   export const locales = ["en", "es", "{locale}"] as const;
   ```
3. Agregar la columna al mapa `content`:
   ```ts
   const content = {
     en: { ... },
     es: { ... },
     {locale}: { home: xxHome, nav: xxNav, ... },
   };
   ```
4. Correr `npm run validate` para verificar consistencia

---

## Nota importante: Strapi

> **Strapi no es el backend de producción de este sitio.**

El flujo de trabajo previsto con Strapi es:

1. El equipo usa Strapi como editor visual para redactar y organizar el contenido **en inglés**
2. El contenido se exporta a `data/en/*.json` con `npm run export-content`
3. El equipo traduce el contenido y actualiza `data/es/*.json`
4. Se corre `npm run validate` para verificar consistencia de claves
5. Next.js usa únicamente los archivos JSON del repositorio para generar el sitio

**Nunca agregar llamadas a la API de Strapi dentro de las páginas o layouts de Next.js.** Toda la lógica de carga de contenido vive en `lib/content.ts` y apunta a los JSON locales.

### Exportar contenido desde Strapi

```bash
# Configurar en .env.local
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<token de solo lectura desde Settings > API Tokens>

# Exportar y validar
npm run export-content
npm run validate
```

El script lee cada single type de Strapi, limpia los `id` que Strapi inyecta en componentes y escribe el JSON resultante en `data/en/`. Los slugs de los single types y los parámetros `populate` se configuran al inicio de `scripts/export-from-strapi.js`.

---

## Próximos pasos sugeridos

- [x] Menú móvil (hamburger) en `Navbar`
- [x] `generateMetadata` por página para SEO (title, description)
- [x] Script de exportación Strapi → `data/en/` (`scripts/export-from-strapi.js`)
- [x] Generación de `sitemap.xml` con las rutas por idioma
