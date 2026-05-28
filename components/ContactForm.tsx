"use client";

import { useState } from "react";

interface FormStrings {
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitButton: string;
  successMessage: string;
  errorMessage: string;
}

export default function ContactForm({ form }: { form: FormStrings }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

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

    setStatus(res.ok ? "success" : "error");
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009fe1] focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder={form.namePlaceholder}
        required
        className={inputClass}
      />
      <input
        type="email"
        name="email"
        placeholder={form.emailPlaceholder}
        required
        className={inputClass}
      />
      <textarea
        name="message"
        placeholder={form.messagePlaceholder}
        required
        rows={5}
        className={`${inputClass} resize-none`}
      />

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-60 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
      >
        {status === "loading" ? "..." : form.submitButton}
      </button>

      {status === "success" && (
        <p className="text-emerald-600 text-sm text-center bg-emerald-50 py-3 rounded-xl">
          {form.successMessage}
        </p>
      )}
      {status === "error" && (
        <p className="text-[#009fe1] text-sm text-center bg-[#e8f4fb] py-3 rounded-xl">
          {form.errorMessage}
        </p>
      )}
    </form>
  );
}
