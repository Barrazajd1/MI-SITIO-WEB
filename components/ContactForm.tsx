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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: wire up to an API route or email service later
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder={form.namePlaceholder}
        required
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="email"
        placeholder={form.emailPlaceholder}
        required
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <textarea
        placeholder={form.messagePlaceholder}
        required
        rows={5}
        className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
      />

      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        {form.submitButton}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm text-center">{form.successMessage}</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm text-center">{form.errorMessage}</p>
      )}
    </form>
  );
}
