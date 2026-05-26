import type { Metadata } from "next";
import type { Locale } from "./content";
import { locales } from "./content";

/**
 * The canonical base URL of the site.
 * Set NEXT_PUBLIC_BASE_URL in Vercel environment variables for production.
 * Falls back to the current Vercel deployment URL.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://mi-sitio-web-tau.vercel.app";

/**
 * Maps our locale codes to the BCP-47 tags Google expects in hreflang.
 *   en → en-US,  es → es-ES,  fr → fr-FR
 */
const HREFLANG: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
};

/**
 * Maps our locale codes to the Open Graph locale format.
 */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
};

/**
 * Builds a complete Metadata object for a given page.
 *
 * @param locale   - Current locale ("en" | "es" | "fr")
 * @param pagePath - Path after the locale prefix, e.g. "" | "/about" | "/services" | "/contact"
 * @param title    - Short page title shown in browser tab and Google result
 * @param description - One-sentence summary shown in Google results (120–160 chars ideal)
 * @param siteName - Localised site name from nav.json (e.g. "My Site" / "Mi Sitio")
 *
 * What this adds:
 *  - title + description
 *  - openGraph: title, description, url, siteName, locale, type
 *  - twitter: summary_large_image card
 *  - alternates.canonical: the authoritative URL for this page+locale
 *  - alternates.languages: hreflang links to all other locales + x-default
 */
export function buildMetadata(
  locale: Locale,
  pagePath: string,
  title: string,
  description: string,
  siteName: string
): Metadata {
  const canonical = `${BASE_URL}/${locale}${pagePath}`;

  // hreflang: one entry per locale + x-default pointing to the English version
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[HREFLANG[l]] = `${BASE_URL}/${l}${pagePath}`;
  }
  languages["x-default"] = `${BASE_URL}/en${pagePath}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: OG_LOCALE[locale] ?? locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
