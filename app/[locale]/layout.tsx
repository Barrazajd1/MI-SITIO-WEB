import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale, locales } from "../../lib/content";
import { BASE_URL } from "../../lib/metadata";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LocaleLang from "../../components/LocaleLang";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Locale-level metadata:
 *  - Sets the title template so every page renders "Page Title | Site Name"
 *  - Sets metadataBase so relative image paths resolve correctly
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const nav = getContent(locale, "nav");

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: `%s | ${nav.siteName}`,
      default: nav.siteName,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const nav = getContent(locale, "nav");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixes <html lang="en"> → correct locale for SEO & accessibility */}
      <LocaleLang locale={locale} />
      <Navbar locale={locale} siteName={nav.siteName} cta={nav.cta} links={nav.links} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} siteName={nav.siteName} links={nav.links} footer={nav.footer} />
    </div>
  );
}
