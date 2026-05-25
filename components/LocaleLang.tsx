"use client";

import { useEffect } from "react";

/**
 * Updates <html lang="..."> to match the current locale.
 * Needed because the root layout can't read the [locale] param directly.
 */
export default function LocaleLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
