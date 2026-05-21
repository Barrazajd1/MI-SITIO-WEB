import { notFound } from "next/navigation";
import { getContent, isValidLocale, locales } from "../../lib/content";
import Navbar from "../../components/Navbar";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
    <>
      <Navbar locale={locale} siteName={nav.siteName} links={nav.links} />
      {children}
    </>
  );
}
