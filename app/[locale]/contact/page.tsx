import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import ContactForm from "../../../components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "contact");
  return { title: hero.title, description: hero.description };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "contact");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="py-28 px-6 text-center border-b border-gray-100">
        <span className="inline-block text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-4">
          Contact
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {data.hero.title}
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
          {data.hero.description}
        </p>
      </section>

      {/* Form + Info */}
      <section className="px-6 py-24">
        <div className="max-w-xl mx-auto">
          <ContactForm form={data.form} />

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="text-base">📧</span>
              <span>{data.info.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="text-base">📍</span>
              <span>{data.info.location}</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
