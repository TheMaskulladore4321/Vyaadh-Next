"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export function AppHeader({ title }: { title: string }) {
  const { profile } = useAuth();
  const pathname = usePathname();
  const homeHref = profile?.role === "worker" ? "/worker/home" : "/customer/home";

  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
            Vyaadh
          </p>
          <h1 className="text-lg font-bold text-stone-900">{title}</h1>
        </div>
        <nav className="flex items-center gap-2">
          {pathname !== homeHref && (
            <Link
              href={homeHref}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Home
            </Link>
          )}
          {pathname !== "/profile" && (
            <Link
              href="/profile"
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Profile
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
