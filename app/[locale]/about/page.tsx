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
    <main className="min-h-screen bg-white text-black">
      <section className="py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{data.hero.title}</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {data.hero.description}
        </p>
      </section>

      <section className="px-6 pb-16 bg-gray-50">
        <div className="max-w-3xl mx-auto py-16">
          <h2 className="text-2xl font-bold mb-4">{data.mission.title}</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{data.mission.body}</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
