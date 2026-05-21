import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../lib/content";

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
    <main className="min-h-screen bg-white text-black">
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            {data.hero.description}
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-lg">
            {data.hero.buttonText}
          </button>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {data.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services.items.map((service) => (
              <div key={service.title} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
