---
name: new-page
description: |
  Pipeline completo para agregar una nueva página al proyecto mi-sitio-web en todos
  los idiomas activos. Úsala cuando el usuario diga "agrega la página [X]", "crea una
  nueva página llamada [X]", "quiero una página de [X]", o cualquier variante que
  implique crear una nueva ruta en el sitio multilingüe.
---

# Skill: New-page

Automatiza el pipeline completo para crear una nueva página en el proyecto y registrarla
en todos los idiomas activos.

## Paso 0 — Identificar la página

Lee el mensaje del usuario y extrae:
- **Nombre de la página** (ej: "FAQ", "Blog", "Portfolio")
- **Slug / ruta** (ej: `/faq`, `/blog`, `/portfolio`) — si el usuario no lo indicó, deducirlo del nombre o preguntar
- **Descripción breve** del propósito de la página (para generar contenido inicial)

Si falta algún dato, pregunta al usuario antes de continuar.

Variables que usarás en los pasos siguientes:
- `PAGE_NAME` — nombre legible (ej: "FAQ")
- `PAGE_SLUG` — ruta sin locale (ej: `faq`)
- `PAGE_DESCRIPTION` — propósito breve

## Paso 1 — Revisar los idiomas activos

Lee `lib/content.ts` y extrae el array `locales` para saber exactamente qué idiomas
están activos en el proyecto.

Lee también un archivo existente como `data/en/home.json` para entender la estructura
de los JSON de contenido.

## Paso 2 — Crear el archivo EN como fuente de verdad

Crea `data/en/PAGE_SLUG.json` con la estructura base en inglés.

La estructura mínima recomendada es:

```json
{
  "meta": {
    "title": "PAGE_NAME | mi-sitio-web",
    "description": "Short SEO description in English"
  },
  "hero": {
    "title": "PAGE_NAME",
    "subtitle": "Short subtitle describing this page"
  },
  "content": {
    "heading": "Main section heading",
    "body": "Main body text for this page."
  }
}
```

Adapta la estructura según el tipo de página (si es FAQ agrega una sección `items` con
preguntas/respuestas, si es Blog agrega `posts`, etc.). Usa tu criterio para generar
contenido relevante en inglés basándote en `PAGE_DESCRIPTION`.

## Paso 3 — Validar el archivo EN

Ejecuta: `npm run validate-en`

Verifica que el nuevo archivo no tenga campos vacíos.
Si hay errores, corrígelos antes de continuar.

## Paso 4 — Traducir a todos los idiomas activos

Para cada idioma en `locales` (excepto `en`), crea `data/XX/PAGE_SLUG.json` traduciendo
el contenido desde EN.

Reglas estrictas (mismas que Translate-1):
- Mantén exactamente la misma estructura de claves que EN
- Traduce solo los valores de texto
- Nunca traduzcas las claves JSON
- Nunca traduzcas URLs ni rutas
- El campo `meta.title` puede incluir el nombre del sitio tal cual: no lo traduzcas

## Paso 5 — Crear el componente de página Next.js

Crea el archivo `app/[locale]/PAGE_SLUG/page.tsx` con la estructura estándar del proyecto:

```typescript
import { notFound } from "next/navigation";
import { locales, content, type Locale } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PAGENAMEPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  const nav = content[l].nav;
  const page = content[l].PAGE_SLUG as any;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        locale={l}
        siteName={nav.siteName}
        cta={nav.cta}
        links={nav.links}
      />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2e435e] mb-4">{page.hero.title}</h1>
          <p className="text-lg text-gray-500">{page.hero.subtitle}</p>
        </div>

        <div className="bg-white border border-[#cae4f2] rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-[#2e435e] mb-4">{page.content.heading}</h2>
          <p className="text-gray-600 leading-relaxed">{page.content.body}</p>
        </div>
      </section>

      <Footer locale={l} content={content[l]} />
    </main>
  );
}
```

Adapta el JSX según la estructura del JSON que creaste en el Paso 2. Importa los tipos
correctos desde `@/lib/content`.

## Paso 6 — Registrar en lib/content.ts

Abre `lib/content.ts` y realiza los siguientes cambios:

1. **Agrega los imports** para todos los idiomas activos:
   ```typescript
   import EnPAGESLUG from "../data/en/PAGE_SLUG.json";
   import EsPAGESLUG from "../data/es/PAGE_SLUG.json";
   // ... (un import por cada idioma activo)
   ```

2. **Agrega el tipo** si es necesario (opcional, solo si el proyecto tiene tipos explícitos por página).

3. **Agrega la clave en cada entrada del objeto `content`**:
   ```typescript
   en: { home: EnHome, nav: EnNav, ..., PAGE_SLUG: EnPAGESLUG },
   es: { home: EsHome, nav: EsNav, ..., PAGE_SLUG: EsPAGESLUG },
   // ... (todos los idiomas activos)
   ```

## Paso 7 — Agregar la página al nav en todos los idiomas

Para cada `data/XX/nav.json`, agrega un nuevo enlace en el array `links`:

```json
{ "label": "PAGE_NAME_EN_ESE_IDIOMA", "href": "/PAGE_SLUG" }
```

Traduce el label al idioma correspondiente. No traduzcas el `href`.

Asegúrate de insertar el enlace en una posición lógica (generalmente antes del último
elemento, o al final del array según el tipo de página).

## Paso 8 — Validar consistencia

Ejecuta: `npm run validate`

Verifica que todos los idiomas tengan exactamente las mismas claves que EN en el nuevo archivo.
Si hay claves faltantes o extra, corrígelas antes de continuar.

## Paso 9 — Commit y push

Una vez completados todos los pasos sin errores, ejecuta:

```
git add -A && git commit -m "feat: add PAGE_SLUG page" && git push
```

Vercel desplegará automáticamente. La nueva página estará disponible en:
`https://tu-dominio.com/en/PAGE_SLUG`, `/es/PAGE_SLUG`, `/fr/PAGE_SLUG`, etc.

## Resumen final al usuario

Al terminar informa:
- Los archivos JSON creados en `data/XX/PAGE_SLUG.json` (todos los idiomas)
- El componente creado en `app/[locale]/PAGE_SLUG/page.tsx`
- Si se actualizó `lib/content.ts` correctamente
- Si se actualizaron los `nav.json` de todos los idiomas
- Si el push fue exitoso
- Las URLs donde se puede ver la nueva página

## Notas importantes

- Usa siempre la paleta de colores del proyecto: `#009fe1`, `#007cb5`, `#2e435e`, `#cae4f2`
- El patrón `params: Promise<{ locale: string }>` es obligatorio en Next.js 15
- Usa `generateStaticParams` para que la página sea estática (SSG)
- Si el proyecto usa un componente `Footer`, inclúyelo
- Nunca uses rutas absolutas con locale hardcodeado — siempre usa la variable `l`
