import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { getDashT } from "@/lib/dashboard-i18n";
import NewProjectForm from "@/components/NewProjectForm";
import ProjectCard from "@/components/ProjectCard";
import StatusTabs from "@/components/StatusTabs";
import LocaleSelect from "@/components/LocaleSelect";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value ?? "en";
  const t = getDashT(locale);

  const { status: filterStatus } = await searchParams;
  const firstName = user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "Usuario";
  const email     = user.emailAddresses[0]?.emailAddress ?? "";

  const { data: allProjects, error } = await supabaseAdmin
    .from("projects").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const active  = allProjects?.filter((p) => !p.trashed_at) ?? [];
  const trashed = allProjects?.filter((p) =>  p.trashed_at) ?? [];

  const counts = {
    pending:     active.filter((p) => p.status === "pending").length,
    in_progress: active.filter((p) => p.status === "in_progress").length,
    review:      active.filter((p) => p.status === "review").length,
    draft:       active.filter((p) => p.status === "draft").length,
    done:        active.filter((p) => p.status === "done").length,
  };

  const filtered = filterStatus ? active.filter((p) => p.status === filterStatus) : active;
  const tabLabel = filterStatus ? (t.status[filterStatus] ?? filterStatus) : t.allProjects;

  return (
    <div className="min-h-screen bg-[#f4f8fb]">
      <header className="bg-white border-b border-[#cae4f2] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/en" className="text-xl font-bold text-[#2e435e] hover:text-[#009fe1] transition-colors">
            {t.appName}
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSelect current={locale} from="/dashboard" />
            <span className="hidden sm:block text-sm text-gray-400">{email}</span>
            <Link href="/dashboard/papelera" title={t.trash}
              className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-orange-50 text-gray-400 hover:text-orange-400 flex items-center justify-center transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              {trashed.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {trashed.length}
                </span>
              )}
            </Link>
            <Link href="/en/contact" title={t.help}
              className="w-9 h-9 rounded-full bg-[#e8f4fb] hover:bg-[#cae4f2] text-[#009fe1] flex items-center justify-center transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Banner */}
        <div className="rounded-2xl px-8 py-8 flex flex-col gap-6"
          style={{ background: "linear-gradient(135deg, #2e435e 0%, #3a6b96 100%)" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[#cae4f2] text-sm font-semibold uppercase tracking-widest mb-1">{t.dashLabel}</p>
              <h1 className="text-3xl font-bold text-white">{t.welcome}, {firstName} 👋</h1>
              <p className="text-white/60 text-sm mt-1">{t.manageText}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{active.length}</p>
              <p className="text-white/60 text-xs mt-0.5">{t.totalActive}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.entries(counts) as [string, number][]).map(([key, count]) => (
              <Link key={key} href={`/dashboard?status=${key}`}
                className="bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2.5 text-center transition-colors">
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-white/60 text-xs">{t.status[key]}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-[#2e435e]">{tabLabel}</h2>
              <span className="text-sm text-gray-400 bg-white border border-[#cae4f2] px-3 py-1 rounded-full">
                {filtered.length} {filtered.length !== 1 ? t.projs : t.proj}
              </span>
            </div>
            <Suspense><StatusTabs t={t} /></Suspense>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error.message}</div>}
            {filtered.length === 0 ? (
              <div className="bg-white border border-dashed border-[#cae4f2] rounded-2xl p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e8f4fb] flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">{filterStatus ? t.noProjectsStatus : t.noProjects}</p>
                {!filterStatus && <p className="text-gray-300 text-xs mt-1">{t.noProjectsHint}</p>}
                {filterStatus && <Link href="/dashboard" className="text-xs text-[#009fe1] hover:underline mt-1 block">{t.seeAll}</Link>}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((p) => (
                  <ProjectCard key={p.id} id={p.id} name={p.name} description={p.description}
                    client_name={p.client_name} client_email={p.client_email} phone={p.phone}
                    budget={p.budget} deadline={p.deadline} status={p.status} createdAt={p.created_at} t={t} />
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2e435e] mb-4">{t.newProject}</h2>
            <NewProjectForm userId={user.id} t={t} />
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#cae4f2] p-6 flex flex-col gap-3 hover:shadow-md hover:shadow-[#009fe1]/10 transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#e8f4fb] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div><h3 className="font-bold text-[#2e435e]">{t.about}</h3><p className="text-sm text-gray-400 mt-1 leading-relaxed">{t.aboutDesc}</p></div>
            <Link href={`/${locale}/about`} className="text-sm font-semibold text-[#009fe1] hover:underline mt-auto">{t.seeMore}</Link>
          </div>
          <div className="bg-white rounded-2xl border border-[#cae4f2] p-6 flex flex-col gap-3 hover:shadow-md hover:shadow-[#009fe1]/10 transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#e8f4fb] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
              </svg>
            </div>
            <div><h3 className="font-bold text-[#2e435e]">{t.services}</h3><p className="text-sm text-gray-400 mt-1 leading-relaxed">{t.servicesDesc}</p></div>
            <Link href={`/${locale}/services`} className="text-sm font-semibold text-[#009fe1] hover:underline mt-auto">{t.seeServices}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
