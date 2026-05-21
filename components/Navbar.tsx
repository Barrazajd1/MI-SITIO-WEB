"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Locale, locales } from "../lib/content";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  locale: Locale;
  siteName: string;
  links: NavLink[];
}

export default function Navbar({ locale, siteName, links }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function switchLocale(next: string) {
    return pathname.replace(/^\/(en|es|fr)/, `/${next}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-gray-900 transition-shadow duration-200 ${
        scrolled ? "shadow-lg shadow-black/30" : "border-b border-gray-700"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-white"
        >
          {siteName}
        </Link>

        {/* Desktop: nav links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop: language switcher */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {locales.map((l, i) => (
            <span key={l} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-600">|</span>}
              <Link
                href={switchLocale(l)}
                className={
                  l === locale
                    ? "text-white font-bold"
                    : "text-gray-500 hover:text-white transition-colors"
                }
              >
                {l.toUpperCase()}
              </Link>
            </span>
          ))}
        </div>

        {/* Mobile: hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 origin-center ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 origin-center ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile: dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-gray-900 px-6 py-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-400">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href === "/" ? "" : link.href}`}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 text-sm font-medium pt-3 border-t border-gray-800">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-600">|</span>}
                <Link
                  href={switchLocale(l)}
                  className={
                    l === locale
                      ? "text-white font-bold"
                      : "text-gray-500 hover:text-white transition-colors"
                  }
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
