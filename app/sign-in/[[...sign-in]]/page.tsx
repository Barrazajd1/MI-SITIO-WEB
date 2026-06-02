import { SignIn } from "@clerk/nextjs";
import { cookies } from "next/headers";
import LocaleSelect from "../../../components/LocaleSelect";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const current = cookieStore.get("preferred-locale")?.value ?? "en";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      {/* Language selector — top */}
      <LocaleSelect current={current} from="/sign-in" />

      <SignIn />
    </main>
  );
}
