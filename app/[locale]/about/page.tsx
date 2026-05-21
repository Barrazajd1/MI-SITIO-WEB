import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";

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
      <section className="py-28 px-6 text-center border-b border-gray-100">
        <span className="inline-block text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-4">
          About
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {data.hero.title}
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
          {data.hero.description}
        </p>
      </section>

      {/* Mission */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="block w-10 h-1 bg-indigo-600 mb-8 rounded-full" />
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {data.mission.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {data.mission.body}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {data.values.map((value, i) => (
              <div key={value.title}>
                <span className="text-5xl font-bold text-indigo-100 select-none block mb-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
