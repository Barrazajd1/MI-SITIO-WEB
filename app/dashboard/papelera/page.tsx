import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getDashT } from "@/lib/dashboard-i18n";
import ProjectCard from "@/components/ProjectCard";
import LocaleSelect from "@/components/LocaleSelect";

export default async function PapeleraPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value ?? "en";
  const t = getDashT(locale);

  const { data: trashed, error } = await supabaseAdmin
    .from("projects").select("*").eq("user_id", user.id)
    .not("trashed_at", "is", null)
    .order("trashed_at", { ascending: false });

  const count = trashed?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f4f8fb]">
      <header className="bg-white border-b border-[#cae4f2] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-[#2e435e] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </Link>
            <span className="text-xl font-bold text-[#2e435e]">{t.trashTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSelect current={locale} from="/dashboard/papelera" />
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white border border-orange-100 rounded-2xl px-6 py-5 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[#2e435e]">{t.trashTitle}</p>
            <p className="text-sm text-gray-400">{count} {t.trashDesc}</p>
          </div>
          <Link href="/dashboard" className="ml-auto text-sm font-semibold text-[#009fe1] hover:underline shrink-0">
            ← {t.back}
          </Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-4">{error.message}</div>}

        {count === 0 ? (
          <div className="bg-white border border-dashed border-[#cae4f2] rounded-2xl p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
            </div>
            <p className="text-gray-400 font-medium">{t.trashEmpty}</p>
            <p className="text-gray-300 text-sm mt-1">{t.trashEmptyHint}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trashed!.map((p) => (
              <ProjectCard key={p.id} id={p.id} name={p.name} description={p.description}
                client_name={p.client_name} client_email={p.client_email} phone={p.phone}
                budget={p.budget} deadline={p.deadline} status={p.status} createdAt={p.created_at}
                trashed t={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
