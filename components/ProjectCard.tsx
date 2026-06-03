"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pendiente",    color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  in_progress: { label: "En progreso",  color: "bg-blue-50 text-[#009fe1] border-[#cae4f2]" },
  review:      { label: "En revisión",  color: "bg-purple-50 text-purple-600 border-purple-200" },
  done:        { label: "Completado",   color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

interface Props {
  id: string;
  name: string;
  description?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  phone?: string | null;
  budget?: string | null;
  deadline?: string | null;
  status?: string | null;
  createdAt: string;
}

export default function ProjectCard({ id, name, description, client_name, client_email, phone, budget, deadline, status, createdAt }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirm,  setConfirm]  = useState(false);

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const statusInfo = STATUS_LABELS[status ?? "pending"] ?? STATUS_LABELS.pending;

  return (
    <div className="bg-white border border-[#cae4f2] rounded-xl p-5 hover:border-[#009fe1] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-[#2e435e]">{name}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors duration-150 ${
            confirm ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                    : "bg-white border-[#cae4f2] text-gray-400 hover:border-red-300 hover:text-red-500"
          }`}>
          {deleting ? "..." : confirm ? "¿Confirmar?" : "Eliminar"}
        </button>
      </div>

      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-400">
        {client_name  && <span><span className="font-medium text-gray-500">Cliente:</span> {client_name}</span>}
        {client_email && <span><span className="font-medium text-gray-500">Email:</span> {client_email}</span>}
        {phone        && <span><span className="font-medium text-gray-500">Tel:</span> {phone}</span>}
        {budget       && <span><span className="font-medium text-gray-500">Presupuesto:</span> {budget}</span>}
        {deadline     && (
          <span><span className="font-medium text-gray-500">Entrega:</span>{" "}
            {new Date(deadline).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-300 mt-3">
        Creado: {new Date(createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
