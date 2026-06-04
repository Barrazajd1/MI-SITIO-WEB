import Link from "next/link";
import { locales, type Locale } from "@/lib/content";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const guides = (await import(`@/data/${locale}/guides.json`)).default;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Guides</h1>
      <p className="text-gray-500 mb-12">Step-by-step guides to help you get started.</p>

      {guides.categories.map((category: any) => (
        <div key={category.slug} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            {category.title}
          </h2>
          <div className="grid gap-4">
            {category.guides.map((guide: any) => (
              <Link
                key={guide.slug}
                href={`/${locale}/guides/${guide.slug}`}
                className="block p-5 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition"
              >
                <h3 className="text-lg font-medium text-gray-900">{guide.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}