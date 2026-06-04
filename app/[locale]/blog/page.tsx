import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { locales, content, type Locale } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  const nav = content[l].nav;
  const blog = (content["en"] as any).blog;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-sm font-semibold text-[#009fe1] uppercase tracking-widest mb-2">Blog</p>
          <h1 className="text-4xl font-bold text-[#2e435e]">Latest posts</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blog.posts.map((post: any) => (
            <Link
              key={post.slug}
              href={`/${l}/blog/${post.slug}`}
              className="bg-white border border-[#cae4f2] rounded-2xl overflow-hidden hover:border-[#009fe1] transition-colors group"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2">{post.date} · {post.author}</p>
                <h2 className="text-lg font-semibold text-[#2e435e] mb-2 group-hover:text-[#009fe1] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}