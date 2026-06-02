"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export default function ProjectCard({ id, name, description, createdAt }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    setDeleting(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="bg-white border border-[#cae4f2] rounded-xl p-5 hover:border-[#009fe1] transition-colors flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#2e435e] mb-1">{name}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
        <p className="text-xs text-gray-300 mt-2">
          {new Date(createdAt).toLocaleDateString("es-ES", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors duration-150 ${
          confirm
            ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
            : "bg-white border-[#cae4f2] text-gray-400 hover:border-red-300 hover:text-red-500"
        }`}
      >
        {deleting ? "..." : confirm ? "¿Confirmar?" : "Eliminar"}
      </button>
    </div>
  );
}
