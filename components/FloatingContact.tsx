"use client";

import { useState } from "react";

interface FloatingContactProps {
  locale: string;
  cta: string;
}

type Screen = "home" | "form" | "sending" | "success" | "error";

const COPY: Record<string, {
  greeting: string;
  subtitle: string;
  action: string;
  back: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sent: string;
  sentSub: string;
}> = {
  en: {
    greeting: "Hi there 👋",
    subtitle: "How can we help you?",
    action:   "Send us a message",
    back:     "Back",
    name:     "Your name",
    email:    "Your email",
    message:  "Tell us about your project...",
    send:     "Send message",
    sent:     "Message sent! ✓",
    sentSub:  "We'll get back to you shortly.",
  },
  es: {
    greeting: "Hola 👋",
    subtitle: "¿Cómo podemos ayudarte?",
    action:   "Envíanos un mensaje",
    back:     "Volver",
    name:     "Tu nombre",
    email:    "Tu email",
    message:  "Cuéntanos sobre tu proyecto...",
    send:     "Enviar mensaje",
    sent:     "¡Mensaje enviado! ✓",
    sentSub:  "Te responderemos pronto.",
  },
  fr: {
    greeting: "Bonjour 👋",
    subtitle: "Comment pouvons-nous vous aider ?",
    action:   "Envoyez-nous un message",
    back:     "Retour",
    name:     "Votre nom",
    email:    "Votre e-mail",
    message:  "Parlez-nous de votre projet...",
    send:     "Envoyer le message",
    sent:     "Message envoyé ! ✓",
    sentSub:  "Nous vous répondrons bientôt.",
  },
  pt: {
    greeting: "Olá 👋",
    subtitle: "Como podemos te ajudar?",
    action:   "Envie-nos uma mensagem",
    back:     "Voltar",
    name:     "Seu nome",
    email:    "Seu e-mail",
    message:  "Fale sobre o seu projeto...",
    send:     "Enviar mensagem",
    sent:     "Mensagem enviada! ✓",
    sentSub:  "Retornaremos em breve.",
  },
  it: {
    greeting: "Ciao 👋",
    subtitle: "Come possiamo aiutarti?",
    action:   "Inviaci un messaggio",
    back:     "Indietro",
    name:     "Il tuo nome",
    email:    "La tua email",
    message:  "Raccontaci del tuo progetto...",
    send:     "Invia messaggio",
    sent:     "Messaggio inviato! ✓",
    sentSub:  "Ti risponderemo al più presto.",
  },
};

export default function FloatingContact({ locale }: FloatingContactProps) {
  const [open, setOpen]     = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const copy = COPY[locale] ?? COPY.en;

  function close() {
    setOpen(false);
    setTimeout(() => setScreen("home"), 300);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setScreen("sending");
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      }),
    });
    setScreen(res.ok ? "success" : "error");
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 " +
    "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009fe1] " +
    "focus:border-transparent transition bg-white";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Popup ── */}
      {open && (
        <div
          className="w-72 rounded-2xl overflow-hidden shadow-2xl shadow-[#2e435e]/20 border border-[#cae4f2]"
          style={{ animation: "floatUp 0.2s ease-out" }}
        >

          {/* ── Screen 1: greeting ── */}
          {screen === "home" && (
            <>
              {/* Header */}
              <div
                className="relative px-5 pt-6 pb-8"
                style={{ background: "linear-gradient(150deg, #2e435e 0%, #3a6b96 100%)" }}
              >
                <button
                  onClick={close}
                  className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <p className="text-white text-lg font-bold leading-snug">
                  {copy.greeting}<br />{copy.subtitle}
                </p>
              </div>

              {/* Body */}
              <div className="bg-white px-4 py-4 -mt-3">
                <button
                  onClick={() => setScreen("form")}
                  className="flex items-center justify-between w-full bg-white border border-[#cae4f2] hover:border-[#009fe1] hover:shadow-sm rounded-xl px-4 py-3 text-sm font-semibold text-[#2e435e] transition-all duration-200 group"
                >
                  <span>{copy.action}</span>
                  <svg className="w-4 h-4 text-[#009fe1] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* ── Screen 2: form ── */}
          {(screen === "form" || screen === "sending") && (
            <div className="bg-white">
              {/* Mini header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#cae4f2]">
                <button
                  onClick={() => setScreen("home")}
                  className="text-gray-400 hover:text-[#2e435e] transition-colors"
                  aria-label={copy.back}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <span className="text-sm font-semibold text-[#2e435e]">{copy.action}</span>
                <button
                  onClick={close}
                  className="ml-auto text-gray-400 hover:text-[#2e435e] transition-colors"
                  aria-label="Cerrar"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-4">
                <input
                  type="text"
                  name="name"
                  placeholder={copy.name}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder={copy.email}
                  required
                  className={inputClass}
                />
                <textarea
                  name="message"
                  placeholder={copy.message}
                  required
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  disabled={screen === "sending"}
                  className="w-full bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {screen === "sending" ? "..." : copy.send}
                  {screen !== "sending" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── Screen 3: error ── */}
          {screen === "error" && (
            <div className="px-5 py-8 text-center flex flex-col items-center gap-3 bg-white">
              <p className="text-[#2e435e] font-bold text-base">Error al enviar</p>
              <p className="text-gray-400 text-sm">Algo salió mal. Intenta de nuevo.</p>
              <button
                onClick={() => setScreen("form")}
                className="mt-2 text-sm text-[#009fe1] underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* ── Screen 4: success ── */}
          {screen === "success" && (
            <div
              className="px-5 py-8 text-center flex flex-col items-center gap-3"
              style={{ background: "linear-gradient(150deg, #2e435e 0%, #3a6b96 100%)" }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-white font-bold text-base">{copy.sent}</p>
              <p className="text-white/70 text-sm">{copy.sentSub}</p>
              <button
                onClick={close}
                className="mt-2 text-xs text-white/60 hover:text-white underline transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Floating button ── */}
      <button
        onClick={() => { setOpen((prev) => !prev); if (!open) setScreen("home"); }}
        aria-label={open ? "Cerrar" : "Contacto"}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#009fe1]/30 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "#009fe1" }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
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
