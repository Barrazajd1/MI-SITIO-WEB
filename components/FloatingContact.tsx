"use client";

import Link from "next/link";
import { useState } from "react";

interface FloatingContactProps {
  locale: string;
  cta: string;
}

const COPY: Record<string, { greeting: string; subtitle: string; action: string }> = {
  en: { greeting: "Hi there 👋",  subtitle: "How can we help you?",         action: "Send us a message" },
  es: { greeting: "Hola 👋",      subtitle: "¿Cómo podemos ayudarte?",      action: "Envíanos un mensaje" },
  fr: { greeting: "Bonjour 👋",   subtitle: "Comment pouvons-nous vous aider ?", action: "Envoyez-nous un message" },
  pt: { greeting: "Olá 👋",       subtitle: "Como podemos te ajudar?",      action: "Envie-nos uma mensagem" },
};

export default function FloatingContact({ locale, cta }: FloatingContactProps) {
  const [open, setOpen] = useState(false);
  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Popup card */}
      {open && (
        <div
          className="w-72 rounded-2xl overflow-hidden shadow-2xl shadow-[#2e435e]/20 border border-[#cae4f2]"
          style={{ animation: "floatUp 0.2s ease-out" }}
        >
          {/* Header — dark navy gradient like sinc */}
          <div
            className="relative px-5 py-6"
            style={{ background: "linear-gradient(160deg, #2e435e 0%, #3a6b96 100%)" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <p className="text-white text-xl font-bold leading-snug">
              {copy.greeting}<br />{copy.subtitle}
            </p>
          </div>

          {/* Body */}
          <div className="bg-white px-5 py-5">
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full bg-white border border-[#cae4f2] hover:border-[#009fe1] hover:shadow-sm rounded-xl px-4 py-3 text-sm font-semibold text-[#2e435e] transition-all duration-200 group"
            >
              <span>{copy.action}</span>
              <svg
                className="w-4 h-4 text-[#009fe1] group-hover:translate-x-0.5 transition-transform"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar chat" : cta}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#009fe1]/30 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "#009fe1" }}
      >
        {open ? (
          /* X icon when open */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Chat bubble icon when closed */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
