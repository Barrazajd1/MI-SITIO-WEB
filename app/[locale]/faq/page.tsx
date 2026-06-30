import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import { buildMetadata } from "../../../lib/metadata";
import AnimatedSection from "../../../components/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "faq");
  const nav = getContent(locale, "nav");
  return buildMetadata(locale, "/faq", hero.title, hero.description, nav.siteName);
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "faq");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="px-6 pt-24 pb-12 text-center">
        <AnimatedSection className="max-w-2xl mx-auto" variant="fadeUp">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#2e435e]">
            {data.hero.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {data.hero.description}
          </p>
        </AnimatedSection>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          {data.categories.map((category, i) => (
            <AnimatedSection key={category.title} variant="fadeUp" delay={i * 0.08}>
              <h2 className="text-xl font-bold text-[#2e435e] mb-4 border-b border-[#cae4f2] pb-2">
                {category.title}
              </h2>
              <div className="flex flex-col gap-3">
                {category.questions.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-gray-100 bg-white open:border-[#cae4f2] open:shadow-sm transition-colors"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-gray-900">
                      {item.question}
                      <span className="text-[#009fe1] transition-transform group-open:rotate-45 text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
