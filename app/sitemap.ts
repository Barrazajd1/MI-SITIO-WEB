import type { MetadataRoute } from "next";
import { locales } from "../lib/content";
import { BASE_URL } from "../lib/metadata";

/**
 * All page paths (without the locale prefix).
 * "" = home page (/en, /es, /fr)
 */
const routes = ["", "/about", "/services", "/contact"];

/**
 * Google reads this file at /sitemap.xml to discover all URLs.
 * For multilingual sites, each URL includes `alternates` (hreflang) so
 * Google understands the relationship between the same page in different languages.
 *
 * Result example for /about:
 *   url:        https://mi-sitio-web-tau.vercel.app/en/about
 *   alternates: { en: .../en/about, es: .../es/about, fr: .../fr/about }
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => {
      // Build hreflang alternates for this route across all locales
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${BASE_URL}/${l}${route}`;
      }

      return {
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        // Home page gets highest priority; all other pages are equal
        priority: route === "" ? 1.0 : 0.8,
        alternates: { languages },
      };
    })
  );
}
