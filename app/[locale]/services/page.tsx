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
    <main className="min-h-screen bg-white text-black">
      <section className="py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{data.hero.title}</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {data.hero.description}
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
