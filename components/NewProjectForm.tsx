"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import type { DashT } from "@/lib/dashboard-i18n";

interface Props { userId: string; t: DashT }

export default function NewProjectForm({ userId, t }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({
    name: "", description: "", client_name: "",
    client_email: "", phone: "", budget: "",
    deadline: "", status: "pending",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...form }),
    });
    if (res.ok) {
      track("project_created", { status: form.status });
      setForm({ name: "", description: "", client_name: "", client_email: "", phone: "", budget: "", deadline: "", status: "pending" });
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error");
    }
    setLoading(false);
  }

  const inp = "w-full border border-[#cae4f2] rounded-lg px-3 py-2 text-sm text-[#2e435e] focus:outline-none focus:border-[#009fe1] transition-colors bg-white";
  const lbl = "block text-xs font-semibold text-[#2e435e] mb-1";

  const STATUS_OPTS = [
    { value: "draft",       label: t.status.draft },
    { value: "pending",     label: t.status.pending },
    { value: "in_progress", label: t.status.in_progress },
    { value: "review",      label: t.status.review },
    { value: "done",        label: t.status.done },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#cae4f2] rounded-2xl p-6 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.nameReq}</label>
          <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder={t.form.name} required className={inp} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.status}</label>
          <select value={form.status} onChange={e => set("status", e.target.value)} className={inp}>
            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.clientName}</label>
          <input type="text" value={form.client_name} onChange={e => set("client_name", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.clientEmail}</label>
          <input type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)} className={inp} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.phone}</label>
          <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} className={inp} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={lbl}>{t.form.budget}</label>
          <input type="text" value={form.budget} onChange={e => set("budget", e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label className={lbl}>{t.form.deadline}</label>
        <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className={inp} />
      </div>
      <div>
        <label className={lbl}>{t.form.description} <span className="text-gray-300 font-normal">{t.form.optional}</span></label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={`${inp} resize-none`} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading || !form.name.trim()}
        className="bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
        {loading ? t.form.saving : t.form.create}
      </button>
    </form>
  );
}
