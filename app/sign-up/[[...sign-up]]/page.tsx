import { SignUp } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "it", label: "IT", name: "Italiano" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "id", label: "ID", name: "Indonesia" },
];

async function switchLocale(formData: FormData) {
  "use server";
  const locale = formData.get("locale") as string;
  const cookieStore = await cookies();
  cookieStore.set("preferred-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/sign-up");
}

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const current = cookieStore.get("preferred-locale")?.value ?? "en";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <SignUp />

      {/* Language switcher */}
      <div className="flex flex-wrap justify-center gap-1.5 pb-6">
        {LOCALES.map(({ code, label, name }) => (
          <form key={code} action={switchLocale}>
            <input type="hidden" name="locale" value={code} />
            <button
              type="submit"
              title={name}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors duration-150 ${
                current === code
                  ? "bg-[#009fe1] text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-[#009fe1] hover:text-[#009fe1]"
              }`}
            >
              {label}
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}
