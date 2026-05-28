import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../lib/content";
import { buildMetadata } from "../../lib/metadata";
import AnimatedSection from "../../components/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "home");
  const nav = getContent(locale, "nav");
  return buildMetadata(locale, "", hero.title, hero.description, nav.siteName);
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
      <section className="relative min-h-[88vh] flex items-center justify-center px-6 py-28 overflow-hidden">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1800&q=85"
          alt="Modern website development"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-950/70" />
        {/* Red accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#009fe1]/20 rounded-full blur-3xl pointer-events-none" />

        <AnimatedSection className="relative text-center max-w-4xl mx-auto" variant="fadeUp">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#009fe1] text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#009fe1] rounded-full animate-pulse" />
            Next.js · JSON · Multilingual
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-white">
            {data.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto">
            {data.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/services`}
              className="inline-block bg-[#009fe1] hover:bg-[#e8f4fb]0 text-white text-base font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-[#009fe1]/30"
            >
              {data.hero.buttonText}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-white/10 hover:bg-white/20 text-white text-base font-semibold px-8 py-4 rounded-xl border border-white/20 transition-colors duration-200 backdrop-blur-sm"
            >
              {data.hero.learnMore}
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50/50 px-6 py-10">
        <AnimatedSection variant="fadeIn" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#009fe1]">{stat.number}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Workflow section */}
      <section className="px-6 py-28 bg-gray-950 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16" variant="fadeUp">
            <span className="inline-block text-[#009fe1] text-xs font-semibold tracking-widest uppercase mb-3">
              {data.workflow.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {data.workflow.title}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {data.workflow.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 — Strapi */}
            <AnimatedSection variant="fadeUp" delay={0}>
              <div className="flex flex-col h-full">
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                    alt="Strapi CMS admin panel"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-4xl font-black text-white/20 leading-none select-none">
                    {data.workflow.steps[0].number}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{data.workflow.steps[0].title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{data.workflow.steps[0].description}</p>
              </div>
            </AnimatedSection>

            {/* Step 2 — JSON */}
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <div className="flex flex-col h-full">
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                    alt="JSON code on screen"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-4xl font-black text-white/20 leading-none select-none">
                    {data.workflow.steps[1].number}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{data.workflow.steps[1].title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{data.workflow.steps[1].description}</p>
              </div>
            </AnimatedSection>

            {/* Step 3 — Deploy */}
            <AnimatedSection variant="fadeUp" delay={0.2}>
              <div className="flex flex-col h-full">
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                    alt="Fast website deployed on Vercel"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-4xl font-black text-white/20 leading-none select-none">
                    {data.workflow.steps[2].number}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{data.workflow.steps[2].title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{data.workflow.steps[2].description}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16" variant="fadeUp">
            <span className="inline-block text-[#009fe1] text-xs font-semibold tracking-widest uppercase mb-3">
              {data.services.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {data.services.title}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.services.items.map((service, i) => (
              <AnimatedSection key={service.title} variant="fadeUp" delay={i * 0.1}>
                <div className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-[#cae4f2] hover:shadow-lg hover:shadow-[#009fe1]/10 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#e8f4fb] group-hover:bg-[#cae4f2]/40 transition-colors flex items-center justify-center mb-5">
                    <span className="text-[#009fe1] font-bold text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-3 text-gray-900 group-hover:text-[#007cb5] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" variant="fadeUp" delay={0.3}>
            <Link
              href={`/${locale}/services`}
              className="inline-block text-[#009fe1] hover:text-[#007cb5] font-semibold text-sm border border-[#cae4f2] hover:border-[#009fe1] bg-[#e8f4fb] hover:bg-[#cae4f2]/40 px-6 py-3 rounded-xl transition-all duration-200"
            >
              {data.services.viewAll}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA banner */}
      <AnimatedSection variant="fadeUp" delay={0.1}>
        <section className="px-6 py-20 mx-6 mb-16 rounded-3xl bg-gradient-to-br from-[#009fe1] to-[#007cb5] text-white text-center max-w-5xl xl:mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {data.cta.title}
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            {data.cta.subtitle}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-white text-[#009fe1] hover:bg-[#e8f4fb] font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-md"
          >
            {data.cta.button}
          </Link>
        </section>
      </AnimatedSection>

    </main>
  );
}
