import type { MetadataRoute } from "next";
import { locales } from "../lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const routes = ["", "/about", "/services", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1.0 : 0.8,
    }))
  );
}
