"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Locale, locales } from "../lib/content";
import dynamic from "next/dynamic";

const NavAuth = dynamic(() => import("./NavAuth"), { ssr: false });

// Sinc.business brand palette
// #009fe1 — primary cyan-blue  (CTAs, active states, accents)
// #007cb5 — darker blue        (hover on CTA)
// #2e435e — dark navy          (logo, strong text)
// #cae4f2 — light blue         (subtle highlights)

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  locale: Locale;
  siteName: string;
  cta: string;
  links: NavLink[];
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: "transform 0.2s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Navbar({ locale, siteName, cta, links }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchLocale(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    return segments.join("/");
  }

  const localeLabels: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    pt: "Português",
    it: "Italiano",
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        scrolled ? "shadow-md shadow-[#009fe1]/10" : "border-b border-[#cae4f2]"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold tracking-tight text-[#2e435e] hover:text-[#009fe1] transition-colors duration-200"
        >
          {siteName}
        </Link>

        {/* Desktop: nav links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
          {links.map((link) => {
            const href = `/${locale}${link.href === "/" ? "" : link.href}`;
            const isActive =
              pathname === href ||
              (link.href !== "/" && pathname.startsWith(href));
            return (
              <li key={link.href}>
                <Link
                  href={href}
                  className={`relative pb-0.5 transition-colors duration-200 ${
                    isActive
                      ? "text-[#009fe1] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#009fe1] after:rounded-full"
                      : "hover:text-[#009fe1]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop: language dropdown + CTA */}
        <div className="hidden md:flex items-center gap-3">

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#009fe1] transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-[#cae4f2]/30"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Select language"
            >
              <GlobeIcon />
              <span>{locale.toUpperCase()}</span>
              <ChevronDown open={langOpen} />
            </button>

            {langOpen && (
              <ul
                role="listbox"
                className="absolute right-0 mt-1 w-36 bg-white border border-[#cae4f2] rounded-lg shadow-lg shadow-[#009fe1]/10 py-1 text-sm"
              >
                {locales.map((l) => (
                  <li key={l} role="option" aria-selected={l === locale}>
                    <Link
                      href={switchLocale(l)}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 transition-colors duration-150 ${
                        l === locale
                          ? "text-[#009fe1] font-semibold bg-[#cae4f2]/30"
                          : "text-gray-600 hover:bg-[#cae4f2]/20 hover:text-[#2e435e]"
                      }`}
                    >
                      <span>{localeLabels[l]}</span>
                      {l === locale && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA button */}
          <Link
            href={`/${locale}/contact`}
            className="bg-[#009fe1] hover:bg-[#007cb5] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors duration-200"
          >
            {cta}
          </Link>

          {/* Auth */}
          <NavAuth />
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-[#2e435e] transition-transform duration-200 origin-center ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#2e435e] transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[#2e435e] transition-transform duration-200 origin-center ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile: dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#cae4f2] bg-white px-6 py-4 flex flex-col gap-4 shadow-lg shadow-[#009fe1]/10">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            {links.map((link) => {
              const href = `/${locale}${link.href === "/" ? "" : link.href}`;
              const isActive =
                pathname === href ||
                (link.href !== "/" && pathname.startsWith(href));
              return (
                <li key={link.href}>
                  <Link
                    href={href}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#009fe1] font-semibold" : "hover:text-[#009fe1]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile language switcher */}
          <div className="pt-3 border-t border-[#cae4f2]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GlobeIcon /> Language
            </p>
            <div className="flex gap-2 flex-wrap">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                    l === locale
                      ? "bg-[#009fe1] text-white"
                      : "bg-[#cae4f2]/40 text-[#2e435e] hover:bg-[#cae4f2]"
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile CTA */}
          <Link
            href={`/${locale}/contact`}
            className="bg-[#009fe1] hover:bg-[#007cb5] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 text-center"
          >
            {cta}
          </Link>

          {/* Mobile Auth */}
          <div className="pt-3 border-t border-[#cae4f2]">
            <NavAuth />
          </div>
        </div>
      )}
    </header>
  );
}
