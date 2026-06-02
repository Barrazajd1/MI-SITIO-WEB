import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const VALID = new Set(["en", "es", "fr", "pt", "it", "de", "id"]);

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";
  const from   = req.nextUrl.searchParams.get("from")   ?? "/sign-in";
  const safe   = VALID.has(locale) ? locale : "en";

  const cookieStore = await cookies();
  cookieStore.set("preferred-locale", safe, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(from);
}
