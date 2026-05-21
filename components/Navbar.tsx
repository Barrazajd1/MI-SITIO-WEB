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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          {siteName}
        </Link>

        {/* Desktop: nav links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          {links.map((link) => {
            const href = `/${locale}${link.href === "/" ? "" : link.href}`;
            const isActive = pathname === href || (link.href !== "/" && pathname.startsWith(href));
            return (
              <li key={link.href}>
                <Link
                  href={href}
                  className={`transition-colors ${
                    isActive ? "text-gray-900 font-semibold" : "hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop: language switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">|</span>}
                <Link
                  href={switchLocale(l)}
                  className={
                    l === locale
                      ? "text-indigo-600 font-bold"
                      : "text-gray-400 hover:text-gray-700 transition-colors"
                  }
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Contact us
          </Link>
        </div>

        {/* Mobile: hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-200 origin-center ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-200 origin-center ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile: dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4 shadow-lg">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href === "/" ? "" : link.href}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 text-sm font-medium pt-3 border-t border-gray-100">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">|</span>}
                <Link
                  href={switchLocale(l)}
                  className={
                    l === locale
                      ? "text-indigo-600 font-bold"
                      : "text-gray-400 hover:text-gray-700 transition-colors"
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
