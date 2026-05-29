"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NavAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div className="w-16 h-8" />;

  return !isSignedIn ? (
    <Link
      href="/sign-in"
      className="text-sm font-semibold text-[#2e435e] hover:text-[#009fe1] transition-colors duration-200 px-3 py-2 rounded-lg border border-[#cae4f2] hover:border-[#009fe1]"
    >
      Login
    </Link>
  ) : (
    <UserButton />
  );
}
