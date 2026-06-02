import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, esES, frFR, ptBR, itIT, deDE, idID } from "@clerk/localizations";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clerkLocalizations = {
  en: enUS,
  es: esES,
  fr: frFR,
  pt: ptBR,
  it: itIT,
  de: deDE,
  id: idID,
} as const;

export const metadata: Metadata = {
  title: "Mi Sitio Web",
  description: "Sitio web multilingüe construido con Next.js y contenido JSON.",
  verification: {
    google: "XxLM6fZ0VbLuXe0VNL8ZongrK9JFZJ6msP4YHu7UXfI",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? "en") as keyof typeof clerkLocalizations;
  const localization = clerkLocalizations[locale] ?? enUS;

  return (
    <ClerkProvider localization={localization} afterSignOutUrl="/en">
      <html
        lang={locale}
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
