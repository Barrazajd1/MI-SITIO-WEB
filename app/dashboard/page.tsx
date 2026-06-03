import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import NewProjectForm from "@/components/NewProjectForm";
import ProjectCard from "@/components/ProjectCard";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const firstName = user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "Usuario";
  const email     = user.emailAddresses[0]?.emailAddress ?? "";

  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const projectCount = projects?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f4f8fb]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#cae4f2] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/en" className="text-xl font-bold text-[#2e435e] hover:text-[#009fe1] transition-colors">
            Mi Sitio
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-400">{email}</span>
            {/* Help button */}
            <Link
              href="/en/contact"
              title="Ayuda"
              className="w-9 h-9 rounded-full bg-[#e8f4fb] hover:bg-[#cae4f2] text-[#009fe1] flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* ── Welcome banner ── */}
        <div
          className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #2e435e 0%, #3a6b96 100%)" }}
        >
          <div>
            <p className="text-[#cae4f2] text-sm font-semibold uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Bienvenido, {firstName} 👋</h1>
            <p className="text-white/60 text-sm mt-1">Gestiona tus proyectos y encuentra todo lo que necesitas aquí.</p>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-2xl font-bold text-white">{projectCount}</p>
            <p className="text-white/60 text-xs mt-0.5">Proyecto{projectCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* ── Projects section (TOP) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Project list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#2e435e]">Mis proyectos</h2>
              <span className="text-sm text-gray-400 bg-white border border-[#cae4f2] px-3 py-1 rounded-full">
                {projectCount} proyecto{projectCount !== 1 ? "s" : ""}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">
                Error al cargar proyectos: {error.message}
              </div>
            )}

            {projectCount === 0 ? (
              <div className="bg-white border border-dashed border-[#cae4f2] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e8f4fb] flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">No tienes proyectos aún</p>
                <p className="text-gray-300 text-xs mt-1">Crea tu primer proyecto desde el formulario.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects!.map((p) => (
                  <ProjectCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    client_name={p.client_name}
                    client_email={p.client_email}
                    phone={p.phone}
                    budget={p.budget}
                    deadline={p.deadline}
                    status={p.status}
                    createdAt={p.created_at}
                  />
                ))}
              </div>
            )}
          </div>

          {/* New project form */}
          <div>
            <h2 className="text-lg font-bold text-[#2e435e] mb-4">Nuevo proyecto</h2>
            <NewProjectForm userId={user.id} />
          </div>
        </div>

        {/* ── Info cards (BOTTOM) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* About */}
          <div className="bg-white rounded-2xl border border-[#cae4f2] p-6 flex flex-col gap-3 hover:shadow-md hover:shadow-[#009fe1]/10 transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#e8f4fb] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#2e435e]">Quiénes somos</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                Somos un equipo especializado en crear sitios web rápidos, modernos y multilingües con Next.js y contenido JSON.
              </p>
            </div>
            <Link href="/en/about" className="text-sm font-semibold text-[#009fe1] hover:underline mt-auto">
              Ver más →
            </Link>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl border border-[#cae4f2] p-6 flex flex-col gap-3 hover:shadow-md hover:shadow-[#009fe1]/10 transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#e8f4fb] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#2e435e]">Nuestros servicios</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                Desarrollo web, gestión de contenido, localización, optimización de rendimiento y soporte continuo.
              </p>
            </div>
            <Link href="/en/services" className="text-sm font-semibold text-[#009fe1] hover:underline mt-auto">
              Ver servicios →
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
