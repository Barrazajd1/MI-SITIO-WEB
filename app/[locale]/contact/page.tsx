import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import { buildMetadata } from "../../../lib/metadata";
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
  const nav = getContent(locale, "nav");
  return buildMetadata(locale, "/contact", hero.title, hero.description, nav.siteName);
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
      <section className="relative py-40 px-6 text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1800&q=85"
          alt="Person working on a laptop to get in touch"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gray-950/65" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#009fe1]/20 rounded-full blur-3xl pointer-events-none" />
        <AnimatedSection className="relative max-w-3xl mx-auto" variant="fadeUp">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#009fe1] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
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

      {/* Form + Info */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Contact info panel */}
          <AnimatedSection className="md:col-span-2 flex flex-col gap-6" variant="slideLeft" delay={0.1}>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{data.info.infoTitle}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {data.info.infoDescription}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shrink-0">
                  📧
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{data.info.emailLabel}</p>
                  <p className="text-sm text-gray-700">{data.info.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{data.info.locationLabel}</p>
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
