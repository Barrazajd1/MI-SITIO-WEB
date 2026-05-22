import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import AnimatedSection from "../../../components/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "services");
  return { title: hero.title, description: hero.description };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "services");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative py-28 px-6 text-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white pointer-events-none" />
        <AnimatedSection className="relative max-w-3xl mx-auto" variant="fadeUp">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5 border border-indigo-100">
            Services
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            {data.hero.description}
          </p>
        </AnimatedSection>
      </section>

      {/* Services grid */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
            <AnimatedSection key={item.title} variant="fadeUp" delay={i * 0.08}>
              <div className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-3 text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-24">
        <AnimatedSection variant="fadeUp">
          <div className="max-w-2xl mx-auto text-center p-12 rounded-2xl bg-indigo-50 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Need something custom?
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              We tailor solutions to fit your specific needs. Let&apos;s talk.
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-200 shadow-sm"
            >
              Contact us
            </a>
          </div>
        </AnimatedSection>
      </section>

    </main>
  );
}
