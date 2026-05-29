import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const firstName = user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "Usuario";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-[#cae4f2] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link
          href="/en"
          className="text-xl font-bold text-[#2e435e] hover:text-[#009fe1] transition-colors"
        >
          mi-sitio-web
        </Link>
        <span className="text-sm text-gray-500">
          {user.emailAddresses[0]?.emailAddress}
        </span>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-[#cae4f2] shadow-sm p-10">
          <p className="text-sm font-semibold text-[#009fe1] uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-[#2e435e] mb-4">
            Bienvenido, {firstName} 👋
          </h1>
          <p className="text-gray-500 mb-8">
            Has iniciado sesión correctamente. Desde aquí podrás acceder a tu área privada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Mi perfil", desc: "Ver y editar tu información", href: "#" },
              { label: "Mis proyectos", desc: "Administra tus proyectos activos", href: "#" },
              { label: "Soporte", desc: "Contacta con nuestro equipo", href: "/en/contact" },
            ].map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="block p-5 rounded-xl border border-[#cae4f2] hover:border-[#009fe1] hover:shadow-md transition-all duration-200"
              >
                <p className="font-semibold text-[#2e435e] mb-1">{card.label}</p>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
