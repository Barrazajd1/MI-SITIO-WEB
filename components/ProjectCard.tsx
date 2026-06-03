"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditProjectModal from "./EditProjectModal";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:       { label: "Borrador",     color: "bg-gray-100 text-gray-500 border-gray-200" },
  pending:     { label: "Pendiente",    color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  in_progress: { label: "En progreso",  color: "bg-blue-50 text-[#009fe1] border-[#cae4f2]" },
  review:      { label: "En revisión",  color: "bg-purple-50 text-purple-600 border-purple-200" },
  done:        { label: "Completado",   color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

interface Props {
  id: string; name: string; description?: string | null;
  client_name?: string | null; client_email?: string | null;
  phone?: string | null; budget?: string | null;
  deadline?: string | null; status?: string | null;
  createdAt: string; trashed?: boolean;
}

export default function ProjectCard(props: Props) {
  const { id, name, description, client_name, client_email, phone, budget, deadline, status, createdAt, trashed } = props;
  const router = useRouter();
  const [editing,     setEditing]     = useState(false);
  const [loadingAct,  setLoadingAct]  = useState<string | null>(null);
  const [confirmDel,  setConfirmDel]  = useState(false);

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  async function handleAction(action: string) {
    setLoadingAct(action);
    if (action === "trash")   await patch({ trashed_at: new Date().toISOString() });
    if (action === "restore") await patch({ trashed_at: null });
    if (action === "draft")   await patch({ status: "draft" });
    if (action === "delete") {
      if (!confirmDel) { setConfirmDel(true); setLoadingAct(null); return; }
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      router.refresh();
    }
    setLoadingAct(null);
  }

  const statusInfo = STATUS_LABELS[status ?? "pending"] ?? STATUS_LABELS.pending;

  return (
    <>
      {editing && <EditProjectModal project={props} onClose={() => setEditing(false)} />}

      <div className={`bg-white border rounded-xl p-5 transition-all ${trashed ? "opacity-60 border-gray-200" : "border-[#cae4f2] hover:border-[#009fe1] hover:shadow-sm"}`}>

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <p className="font-bold text-[#2e435e] truncate">{name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!trashed && (
              <>
                {/* Edit */}
                <button onClick={() => setEditing(true)} title="Editar"
                  className="w-7 h-7 rounded-lg border border-[#cae4f2] text-gray-400 hover:border-[#009fe1] hover:text-[#009fe1] flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>

                {/* Draft */}
                {status !== "draft" && (
                  <button onClick={() => handleAction("draft")} title="Mover a borrador" disabled={loadingAct === "draft"}
                    className="w-7 h-7 rounded-lg border border-[#cae4f2] text-gray-400 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </button>
                )}

                {/* Trash */}
                <button onClick={() => handleAction("trash")} title="Mover a papelera" disabled={loadingAct === "trash"}
                  className="w-7 h-7 rounded-lg border border-[#cae4f2] text-gray-400 hover:border-orange-300 hover:text-orange-400 flex items-center justify-center transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </>
            )}

            {trashed && (
              <>
                {/* Restore */}
                <button onClick={() => handleAction("restore")} title="Restaurar" disabled={loadingAct === "restore"}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg border border-[#cae4f2] text-[#009fe1] hover:bg-[#e8f4fb] transition-colors">
                  Restaurar
                </button>
                {/* Permanent delete */}
                <button onClick={() => handleAction("delete")} title="Eliminar definitivamente" disabled={loadingAct === "delete"}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                    confirmDel ? "bg-red-50 border-red-300 text-red-600" : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                  }`}>
                  {confirmDel ? "¿Confirmar?" : "Eliminar"}
                </button>
              </>
            )}
          </div>
        </div>

        {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-400">
          {client_name  && <span><span className="font-medium text-gray-500">Cliente:</span> {client_name}</span>}
          {client_email && <span><span className="font-medium text-gray-500">Email:</span> {client_email}</span>}
          {phone        && <span><span className="font-medium text-gray-500">Tel:</span> {phone}</span>}
          {budget       && <span><span className="font-medium text-gray-500">Presupuesto:</span> {budget}</span>}
          {deadline     && <span><span className="font-medium text-gray-500">Entrega:</span>{" "}
            {new Date(deadline).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
          </span>}
        </div>

        <p className="text-xs text-gray-300 mt-3">
          Creado: {new Date(createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </>
  );
}
