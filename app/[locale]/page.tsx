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
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-6">
            Next.js · JSON · Multilingual
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8 text-gray-900">
            {data.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-12 max-w-2xl mx-auto">
            {data.hero.description}
          </p>
          <a
            href={`/${locale}/services`}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-8 py-4 rounded-full transition-colors duration-200"
          >
            {data.hero.buttonText}
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {data.services.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.services.items.map((service, i) => (
              <div
                key={service.title}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-4xl font-bold text-indigo-100 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold mt-4 mb-3 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
