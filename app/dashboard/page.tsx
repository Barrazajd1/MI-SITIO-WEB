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

  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-[#cae4f2] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/en" className="text-xl font-bold text-[#2e435e] hover:text-[#009fe1] transition-colors">
          mi-sitio-web
        </Link>
        <span className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#009fe1] uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-[#2e435e]">Bienvenido, {firstName}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2e435e]">Mis proyectos</h2>
              <span className="text-sm text-gray-400">{projects?.length ?? 0} proyecto{projects?.length !== 1 ? "s" : ""}</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">
                Error al cargar proyectos: {error.message}
              </div>
            )}

            {!projects || projects.length === 0 ? (
              <div className="bg-white border border-[#cae4f2] rounded-2xl p-10 text-center">
                <p className="text-gray-400 text-sm">No tienes proyectos aún.</p>
                <p className="text-gray-400 text-sm">Crea tu primer proyecto desde el formulario.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    createdAt={project.created_at}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#2e435e] mb-4">Nuevo proyecto</h2>
            <NewProjectForm userId={user.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
