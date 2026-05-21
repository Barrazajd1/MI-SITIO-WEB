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
  const { hero } = getContent(locale, "contact");
  return { title: hero.title, description: hero.description };
}
import ContactForm from "../../../components/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "contact");

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{data.hero.title}</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {data.hero.description}
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <ContactForm form={data.form} />

          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500 flex flex-col gap-2">
            <p>📧 {data.info.email}</p>
            <p>📍 {data.info.location}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
