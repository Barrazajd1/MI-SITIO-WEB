import Link from "next/link";

interface FooterProps {
  locale: string;
  siteName: string;
  links: { label: string; href: string }[];
}

export default function Footer({ locale, siteName, links }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href={`/${locale}`} className="text-lg font-bold text-gray-900">
              {siteName}
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Fast, modern, multilingual websites built with Next.js and structured content.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pages</p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <span>Built with Next.js &amp; Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
