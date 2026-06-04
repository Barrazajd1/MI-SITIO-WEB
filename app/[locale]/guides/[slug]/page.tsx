import { notFound } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    const guides = (await import(`@/data/${locale}/guides.json`)).default;
    for (const category of guides.categories) {
      for (const guide of category.guides) {
        params.push({ locale, slug: guide.slug });
      }
    }
  }
  return params;
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const guides = (await import(`@/data/${locale}/guides.json`)).default;

  const guide = guides.categories
    .flatMap((cat: any) => cat.guides)
    .find((g: any) => g.slug === slug);

  if (!guide) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href={`/${locale}/guides`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← Back to guides
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>
      <p className="text-gray-500 mb-12">{guide.description}</p>

      <div className="space-y-8">
        {guide.steps.map((step: any) => (
          <div key={step.step} className="flex gap-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {step.step}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}