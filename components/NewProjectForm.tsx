"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

export default function NewProjectForm({ userId }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: name.trim(), description: description.trim() }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al crear el proyecto");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#cae4f2] rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-[#2e435e] mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mi proyecto"
          required
          className="w-full border border-[#cae4f2] rounded-lg px-3 py-2 text-sm text-[#2e435e] focus:outline-none focus:border-[#009fe1] transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#2e435e] mb-1">Descripción <span className="text-gray-300">(opcional)</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu proyecto..."
          rows={3}
          className="w-full border border-[#cae4f2] rounded-lg px-3 py-2 text-sm text-[#2e435e] focus:outline-none focus:border-[#009fe1] transition-colors resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="bg-[#009fe1] hover:bg-[#007cb5] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
      >
        {loading ? "Guardando..." : "Crear proyecto"}
      </button>
    </form>
  );
}
