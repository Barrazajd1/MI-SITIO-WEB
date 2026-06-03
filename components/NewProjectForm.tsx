"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

const STATUS_OPTIONS = [
  { value: "pending",     label: "Pendiente" },
  { value: "in_progress", label: "En progreso" },
  { value: "review",      label: "En revisión" },
  { value: "done",        label: "Completado" },
];

export default function NewProjectForm({ userId }: Props) {
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
      setForm({ name: "", description: "", client_name: "", client_email: "", phone: "", budget: "", deadline: "", status: "pending" });
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al crear el proyecto");
    }
    setLoading(false);
  }

  const inputClass = "w-full border border-[#cae4f2] rounded-lg px-3 py-2 text-sm text-[#2e435e] focus:outline-none focus:border-[#009fe1] transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-[#2e435e] mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#cae4f2] rounded-2xl p-6 flex flex-col gap-4">

      {/* Row 1: Nombre + Estado */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Nombre del proyecto *</label>
          <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="Mi proyecto" required className={inputClass} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Estado</label>
          <select value={form.status} onChange={e => set("status", e.target.value)} className={inputClass}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Cliente + Email cliente */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Nombre del cliente</label>
          <input type="text" value={form.client_name} onChange={e => set("client_name", e.target.value)}
            placeholder="Empresa o persona" className={inputClass} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Email del cliente</label>
          <input type="email" value={form.client_email} onChange={e => set("client_email", e.target.value)}
            placeholder="cliente@email.com" className={inputClass} />
        </div>
      </div>

      {/* Row 3: Teléfono + Presupuesto */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Teléfono</label>
          <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
            placeholder="+1 234 567 890" className={inputClass} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Presupuesto</label>
          <input type="text" value={form.budget} onChange={e => set("budget", e.target.value)}
            placeholder="$1,000" className={inputClass} />
        </div>
      </div>

      {/* Row 4: Fecha límite */}
      <div>
        <label className={labelClass}>Fecha límite</label>
        <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
          className={inputClass} />
      </div>

      {/* Row 5: Descripción */}
      <div>
        <label className={labelClass}>Descripción <span className="text-gray-300 font-normal">(opcional)</span></label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Describe el proyecto..." rows={3}
          className={`${inputClass} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading || !form.name.trim()}
        className="bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
        {loading ? "Guardando..." : "Crear proyecto"}
      </button>
    </form>
  );
}
