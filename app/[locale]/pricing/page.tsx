import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import { buildMetadata } from "../../../lib/metadata";
import AnimatedSection from "../../../components/AnimatedSection";
import PricingCards from "../../../components/PricingCards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const data = getContent(locale, "pricing");
  const nav = getContent(locale, "nav");
  return buildMetadata(locale, "/pricing", data.hero.title, data.hero.description, nav.siteName);
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "pricing");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative py-40 px-6 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85"
          alt="Pricing plans"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gray-950/65" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#009fe1]/20 rounded-full blur-3xl pointer-events-none" />
        <AnimatedSection className="relative max-w-3xl mx-auto" variant="fadeUp">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#009fe1] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
            {data.hero.badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
            {data.hero.description}
          </p>
        </AnimatedSection>
      </section>

      {/* Pricing section */}
      <section className="px-6 py-24">
        <PricingCards data={data} locale={locale} />
      </section>

    </main>
  );
}
