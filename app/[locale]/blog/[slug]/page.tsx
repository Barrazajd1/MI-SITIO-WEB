import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { locales, content, type Locale } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return locales.flatMap((locale) => {
    const blog = (content[locale] as typeof content.en).blog;
    return blog.posts.map((post: any) => ({ locale, slug: post.slug }));
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  const nav = content[l].nav;
  const blog = (content[l] as typeof content.en).blog;
  const post = blog.posts.find((p: any) => p.slug === slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-gray-50">

      <article className="max-w-3xl mx-auto px-6 py-20">

        <Link
          href={`/${l}/blog`}
          className="text-sm text-[#009fe1] hover:underline mb-8 inline-block"
        >
          {blog.backLink}
        </Link>

        {post.coverImage && (
          <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-xs text-gray-400 mb-3">{post.date} · {post.author}</p>
        <h1 className="text-4xl font-bold text-[#2e435e] mb-8">{post.title}</h1>

        <div className="prose prose-gray max-w-none">
          {post.content.split("\n\n").map((paragraph: string, i: number) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-5">
              {paragraph}
            </p>
          ))}
        </div>

      </article>

    </main>
  );
}