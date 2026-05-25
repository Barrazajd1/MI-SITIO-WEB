import type { Metadata } from "next";
import Image from "next/image";
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
  const { hero } = getContent(locale, "about");
  return { title: hero.title, description: hero.description };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "about");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative py-40 px-6 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85"
          alt="Team collaborating on web projects"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gray-950/65" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <AnimatedSection className="relative max-w-3xl mx-auto" variant="fadeUp">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-red-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
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

      {/* Mission */}
      <section className="px-6 py-24">
        <AnimatedSection className="max-w-3xl mx-auto" variant="slideLeft">
          <div className="flex items-start gap-8 p-10 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="shrink-0 w-1 self-stretch bg-red-500 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {data.mission.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {data.mission.body}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Values */}
      <section className="px-6 py-16 pb-28 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-14" variant="fadeUp">
            <span className="inline-block text-red-600 text-xs font-semibold tracking-widest uppercase mb-3">
              {data.valuesBadge}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">{data.valuesSectionTitle}</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.values.map((value, i) => (
              <AnimatedSection key={value.title} variant="fadeUp" delay={i * 0.1}>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-5">
                    <span className="text-red-600 font-bold text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
