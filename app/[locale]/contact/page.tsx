import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import ContactForm from "../../../components/ContactForm";
import AnimatedSection from "../../../components/AnimatedSection";

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
      <section className="relative py-28 px-6 text-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white pointer-events-none" />
        <AnimatedSection className="relative max-w-3xl mx-auto" variant="fadeUp">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5 border border-indigo-100">
            Contact
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            {data.hero.description}
          </p>
        </AnimatedSection>
      </section>

      {/* Form + Info */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Contact info panel */}
          <AnimatedSection className="md:col-span-2 flex flex-col gap-6" variant="slideLeft" delay={0.1}>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Get in touch</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We typically respond within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shrink-0">
                  📧
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm text-gray-700">{data.info.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm text-gray-700">{data.info.location}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection className="md:col-span-3" variant="slideRight" delay={0.2}>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <ContactForm form={data.form} />
            </div>
          </AnimatedSection>

        </div>
      </section>

    </main>
  );
}
