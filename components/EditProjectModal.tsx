"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DashT } from "@/lib/dashboard-i18n";

interface Props {
  project: {
    id: string; name: string; description?: string | null;
    client_name?: string | null; client_email?: string | null;
    phone?: string | null; budget?: string | null;
    deadline?: string | null; status?: string | null;
  };
  t: DashT;
  onClose: () => void;
}

export default function EditProjectModal({ project, t, onClose }: Props) {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:         project.name         ?? "",
    description:  project.description  ?? "",
    client_name:  project.client_name  ?? "",
    client_email: project.client_email ?? "",
    phone:        project.phone        ?? "",
    budget:       project.budget       ?? "",
    deadline:     project.deadline ? project.deadline.slice(0, 10) : "",
    status:       project.status  ?? "pending",
  });

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#cae4f2]">
          <h2 className="font-bold text-[#2e435e]">{t.modal.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#2e435e] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>{t.form.nameReq}</label>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required className={inp} />
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
        </div>
        <div className="px-6 py-4 border-t border-[#cae4f2] flex gap-3 justify-end">
          <button onClick={onClose} className="text-sm font-medium text-gray-400 hover:text-[#2e435e] px-4 py-2 rounded-lg border border-[#cae4f2] transition-colors">
            {t.modal.cancel}
          </button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()}
            className="text-sm font-semibold text-white bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-50 px-5 py-2 rounded-lg transition-colors">
            {saving ? t.modal.saving : t.modal.save}
          </button>
        </div>
      </div>
    </div>
  );
}
