"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";

export function ProtectedPage({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role && profile && profile.role !== role) {
      router.replace(
        profile.role === "worker" ? "/worker/home" : "/customer/home",
      );
    }
  }, [user, profile, loading, role, router]);

  if (loading || !user || (role && profile?.role !== role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-stone-500">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
