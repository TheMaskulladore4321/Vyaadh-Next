"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedPage } from "@/components/ProtectedPage";
import {
  FormField,
  buttonClassName,
  inputClassName,
} from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/auth";

function DetailRow({
  label,
  value,
  privateField,
}: {
  label: string;
  value?: string;
  privateField?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-stone-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-stone-700">{label}</p>
        <p className="mt-0.5 text-base text-stone-900">{value || "—"}</p>
      </div>
      {privateField && (
        <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
          Private
        </span>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    email: profile?.email ?? "",
    address: profile?.address ?? "",
    profession: profile?.profession ?? "",
    experience: profile?.experience ?? "",
    photoUrl: profile?.photoUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      profession: profile.profession ?? "",
      experience: profile.experience ?? "",
      photoUrl: profile.photoUrl ?? "",
    });
  }, [profile]);

  if (!profile) return null;

  const isWorker = profile.role === "worker";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage("");

    try {
      await updateUserProfile(profile.uid, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        profession: isWorker ? form.profession : undefined,
        experience: isWorker ? form.experience : undefined,
        photoUrl: form.photoUrl || undefined,
      });
      await refreshProfile();
      setEditing(false);
      setMessage("Profile updated.");
    } catch {
      setMessage("Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-stone-50">
        <AppHeader title="My profile" />
        <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                {isWorker ? "Worker profile" : "Customer profile"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="text-sm font-semibold text-teal-700"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <FormField label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className={inputClassName}
                  />
                </FormField>
                <FormField label="Phone (private)">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className={inputClassName}
                  />
                </FormField>
                <FormField label="Email (private)">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className={inputClassName}
                  />
                </FormField>
                <FormField label="Address">
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    className={inputClassName}
                  />
                </FormField>
                {isWorker && (
                  <>
                    <FormField label="Profession">
                      <input
                        required
                        value={form.profession}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, profession: e.target.value }))
                        }
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField label="Experience">
                      <input
                        required
                        value={form.experience}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, experience: e.target.value }))
                        }
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField label="Photo URL (optional)">
                      <input
                        value={form.photoUrl}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, photoUrl: e.target.value }))
                        }
                        placeholder="https://..."
                        className={inputClassName}
                      />
                    </FormField>
                  </>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className={buttonClassName}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>
            ) : (
              <div>
                <DetailRow label="Name" value={profile.name} />
                <DetailRow label="Phone" value={profile.phone} privateField />
                <DetailRow label="Email" value={profile.email} privateField />
                <DetailRow label="Address" value={profile.address} />
                {isWorker && (
                  <>
                    <DetailRow label="Profession" value={profile.profession} />
                    <DetailRow label="Experience" value={profile.experience} />
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="border-b border-stone-100 py-3">
                        <p className="text-sm font-medium text-stone-700">
                          Skills
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {message && (
              <p className="mt-3 text-sm text-teal-700">{message}</p>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
              What others see
            </h3>
            <p className="text-sm text-stone-600">
              {isWorker
                ? "Customers see your name, photo, profession, experience, skills, and address when searching for workers."
                : "Workers see your name and address when you post a task."}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Phone and email are private and only visible to you on this page.
            </p>
          </section>
        </main>
      </div>
    </ProtectedPage>
  );
}
