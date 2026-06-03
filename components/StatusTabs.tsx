"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { DashT } from "@/lib/dashboard-i18n";

interface Props { t: DashT }

export default function StatusTabs({ t }: Props) {
  const params  = useSearchParams();
  const current = params.get("status") ?? "";

  const TABS = [
    { value: "",            label: t.allProjects },
    { value: "pending",     label: t.status.pending },
    { value: "in_progress", label: t.status.in_progress },
    { value: "review",      label: t.status.review },
    { value: "draft",       label: t.status.draft },
    { value: "done",        label: t.status.done },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(({ value, label }) => {
        const href   = value ? `/dashboard?status=${value}` : "/dashboard";
        const active = current === value;
        return (
          <Link key={value} href={href}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              active
                ? "bg-[#009fe1] text-white"
                : "bg-white border border-[#cae4f2] text-gray-500 hover:border-[#009fe1] hover:text-[#009fe1]"
            }`}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
