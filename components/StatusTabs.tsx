"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TABS = [
  { value: "",            label: "Todos" },
  { value: "pending",     label: "Pendientes" },
  { value: "in_progress", label: "En progreso" },
  { value: "review",      label: "En revisión" },
  { value: "draft",       label: "Borradores" },
  { value: "done",        label: "Completados" },
];

export default function StatusTabs() {
  const params  = useSearchParams();
  const current = params.get("status") ?? "";

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(({ value, label }) => {
        const href = value ? `/dashboard?status=${value}` : "/dashboard";
        const active = current === value;
        return (
          <Link
            key={value}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              active
                ? "bg-[#009fe1] text-white"
                : "bg-white border border-[#cae4f2] text-gray-500 hover:border-[#009fe1] hover:text-[#009fe1]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
