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
import { TagInput } from "@/components/TagInput";
import { TASK_TYPES, SUGGESTED_SKILLS } from "@/lib/constants";
import { signUpWorker } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function WorkerSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    profession: "",
    experience: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (skills.length === 0) {
      setError("Add at least one skill.");
      return;
    }

    setLoading(true);

    try {
      if (!isFirebaseConfigured()) {
        throw new Error(
          "Firebase is not configured. Copy .env.local.example to .env.local and add your Firebase keys.",
        );
      }

      await signUpWorker({ ...form, skills });
      router.replace("/worker/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Worker sign up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full name">
          <input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClassName}
            autoComplete="name"
          />
        </FormField>
        <FormField label="Phone number">
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClassName}
            autoComplete="tel"
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClassName}
            autoComplete="email"
          />
        </FormField>
        <FormField label="Address">
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={inputClassName}
            autoComplete="street-address"
          />
        </FormField>
        <FormField label="Profession">
          <select
            required
            value={form.profession}
            onChange={(e) => updateField("profession", e.target.value)}
            className={inputClassName}
          >
            <option value="">Select profession</option>
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Skills">
          <TagInput
            tags={skills}
            onChange={setSkills}
            suggestions={SUGGESTED_SKILLS}
          />
        </FormField>
        <FormField label="Experience">
          <input
            required
            value={form.experience}
            onChange={(e) => updateField("experience", e.target.value)}
            placeholder="e.g. 3 years"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className={inputClassName}
            autoComplete="new-password"
          />
        </FormField>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={buttonClassName}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <AuthFooterLink
        text="Already have an account?"
        href="/login"
        linkText="Log in"
      />
    </AuthLayout>
  );
}
