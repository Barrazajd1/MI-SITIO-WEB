import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/metadata";

/**
 * Generates /robots.txt
 *
 * Rules:
 *  - Allow all bots to crawl the entire site
 *  - Tell Google (and all crawlers) where the sitemap lives
 *
 * Google reads this on every crawl. Without it, Google has to
 * discover your sitemap manually via Search Console.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
