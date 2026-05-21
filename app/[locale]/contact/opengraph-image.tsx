import { getContent, isValidLocale } from "../../../lib/content";
import { generateOgImage, ogSize, ogContentType } from "../../../lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return new Response("Not found", { status: 404 });
  const data = getContent(locale, "contact");
  return generateOgImage(data.hero.title, data.hero.description, "Contact");
}
