"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthFooterLink,
  AuthLayout,
  FormField,
  buttonClassName,
  inputClassName,
} from "@/components/AuthLayout";
import { signInWithPhone } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isFirebaseConfigured()) {
        throw new Error(
          "Firebase is not configured. Copy .env.local.example to .env.local and add your Firebase keys.",
        );
      }

      const { profile } = await signInWithPhone(phone, password);
      router.replace(
        profile?.role === "worker" ? "/worker/home" : "/customer/home",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Log in" subtitle="For customers and workers">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Phone number">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className={inputClassName}
            autoComplete="tel"
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            autoComplete="current-password"
          />
        </FormField>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={buttonClassName}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <AuthFooterLink
        text="New here?"
        href="/signup"
        linkText="Create an account"
      />
    </AuthLayout>
  );
}
