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
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="py-28 px-6 text-center border-b border-gray-100">
        <span className="inline-block text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-4">
          Services
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {data.hero.title}
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
          {data.hero.description}
        </p>
      </section>

      {/* Services grid */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
            >
              <span className="text-3xl mb-5 block">{item.icon}</span>
              <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-indigo-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
