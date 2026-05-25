import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../lib/content";
import AnimatedSection from "../../components/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "home");
  return { title: hero.title, description: hero.description };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "home");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-6 py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/60 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

        <AnimatedSection className="relative text-center max-w-4xl mx-auto" variant="fadeUp">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white border border-red-100 text-red-600 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            Next.js · JSON · Multilingual
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-gray-900">
            {data.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-12 max-w-2xl mx-auto">
            {data.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/services`}
              className="inline-block bg-red-600 hover:bg-red-700 text-white text-base font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-red-200"
            >
              {data.hero.buttonText}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-white hover:bg-gray-50 text-gray-700 text-base font-semibold px-8 py-4 rounded-xl border border-gray-200 transition-colors duration-200"
            >
              {data.hero.learnMore}
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50/50 px-6 py-10">
        <AnimatedSection variant="fadeIn" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-red-600">{stat.number}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Services preview */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16" variant="fadeUp">
            <span className="inline-block text-red-600 text-xs font-semibold tracking-widest uppercase mb-3">
              {data.services.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {data.services.title}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services.items.map((service, i) => (
              <AnimatedSection key={service.title} variant="fadeUp" delay={i * 0.1}>
                <div className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-lg hover:shadow-red-50 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors flex items-center justify-center mb-5">
                    <span className="text-red-600 font-bold text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-3 text-gray-900 group-hover:text-red-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" variant="fadeUp" delay={0.3}>
            <Link
              href={`/${locale}/services`}
              className="inline-block text-red-600 hover:text-red-700 font-semibold text-sm border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl transition-all duration-200"
            >
              {data.services.viewAll}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA banner */}
      <AnimatedSection variant="fadeUp" delay={0.1}>
        <section className="px-6 py-20 mx-6 mb-16 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white text-center max-w-5xl xl:mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {data.cta.title}
          </h2>
          <p className="text-red-200 text-lg mb-8 max-w-xl mx-auto">
            {data.cta.subtitle}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-md"
          >
            {data.cta.button}
          </Link>
        </section>
      </AnimatedSection>

    </main>
  );
}
