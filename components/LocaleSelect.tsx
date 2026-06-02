"use client";

import { useRouter } from "next/navigation";

const LOCALES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "de", name: "Deutsch" },
  { code: "id", name: "Indonesia" },
];

export default function LocaleSelect({
  current,
  from,
}: {
  current: string;
  from: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/api/locale?locale=${e.target.value}&from=${encodeURIComponent(from)}`);
  }

  return (
    <div className="relative inline-block">
      <select
        value={current}
        onChange={handleChange}
        className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009fe1] focus:border-transparent hover:border-[#009fe1] transition-colors"
      >
        {LOCALES.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
