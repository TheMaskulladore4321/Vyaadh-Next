"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VyaadhLogo } from "@/components/VyaadhLogo";
import { useAuth } from "@/context/AuthContext";

export default function SplashPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) return;

      if (user && profile) {
        router.replace(
          profile.role === "worker" ? "/worker/home" : "/customer/home",
        );
        return;
      }

      router.replace("/login");
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, profile, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-teal-600 to-teal-800">
      <VyaadhLogo size={140} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
        Vyaadh
      </h1>
      <p className="mt-2 text-sm text-teal-100">The Worker&apos;s Network</p>
    </div>
  );
}
