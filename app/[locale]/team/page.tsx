import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContent, isValidLocale } from "../../../lib/content";
import { buildMetadata } from "../../../lib/metadata";
import AnimatedSection from "../../../components/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const { hero } = getContent(locale, "team");
  const nav = getContent(locale, "nav");
  return buildMetadata(locale, "/team", hero.title, hero.description, nav.siteName);
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = getContent(locale, "team");

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="py-24 px-6 text-center bg-[#f0f8fd] border-b border-[#cae4f2]">
        <AnimatedSection className="max-w-2xl mx-auto" variant="fadeUp">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#2e435e]">
            {data.hero.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {data.hero.description}
          </p>
        </AnimatedSection>
      </section>

      {/* Team grid */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.members.map((member, i) => (
            <AnimatedSection key={member.slug} variant="fadeUp" delay={i * 0.08}>
              <div className="group flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-white hover:border-[#cae4f2] hover:shadow-xl hover:shadow-[#009fe1]/10 transition-all duration-300">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-5 ring-4 ring-[#e8f4fb] group-hover:ring-[#cae4f2] transition-all">
                  {member.image ? (
                    <Image
                      src={member.image.trim()}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e8f4fb] flex items-center justify-center text-2xl font-bold text-[#009fe1]">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-[#009fe1] mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

    </main>
  );
}
