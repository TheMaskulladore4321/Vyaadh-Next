"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedPage } from "@/components/ProtectedPage";
import { WorkerCard } from "@/components/WorkerCard";
import { useAuth } from "@/context/AuthContext";
import { TASK_TYPES } from "@/lib/constants";
import { createTask } from "@/lib/tasks";
import { findWorkersForTask } from "@/lib/workers";
import type { UserProfile } from "@/lib/types";

export default function CustomerHomePage() {
  const { profile } = useAuth();
  const [selectedTask, setSelectedTask] = useState("");
  const [workers, setWorkers] = useState<UserProfile[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedTask || !profile?.address) {
      setWorkers([]);
      return;
    }

    let cancelled = false;
    setLoadingWorkers(true);

    findWorkersForTask(selectedTask, profile.address)
      .then((results) => {
        if (!cancelled) setWorkers(results);
      })
      .finally(() => {
        if (!cancelled) setLoadingWorkers(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTask, profile?.address]);

  async function handlePostTask() {
    if (!profile || !selectedTask) return;
    setPosting(true);
    setMessage("");

    try {
      await createTask(
        selectedTask,
        profile.uid,
        profile.name,
        profile.address,
      );
      setMessage("Task posted! Workers nearby can now opt in.");
    } catch {
      setMessage("Could not post task. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <ProtectedPage role="customer">
      <div className="min-h-screen bg-stone-50">
        <AppHeader title="Find a worker" />
        <main className="mx-auto max-w-lg space-y-6 px-4 py-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">
                What do you need help with?
              </span>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Choose a task</option>
                {TASK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            {selectedTask && (
              <button
                type="button"
                onClick={handlePostTask}
                disabled={posting}
                className="mt-4 w-full rounded-xl border-2 border-teal-600 py-3 text-base font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-60"
              >
                {posting ? "Posting…" : "Post this task for workers"}
              </button>
            )}
            {message && (
              <p className="mt-3 text-sm text-teal-700">{message}</p>
            )}
          </section>

          {selectedTask && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-stone-900">
                Workers near you
              </h2>
              {loadingWorkers ? (
                <p className="text-sm text-stone-500">Searching…</p>
              ) : workers.length === 0 ? (
                <p className="rounded-xl bg-white p-4 text-sm text-stone-500">
                  No workers found for {selectedTask} near your address yet.
                  Post the task so workers can opt in.
                </p>
              ) : (
                workers.map((worker) => (
                  <WorkerCard key={worker.uid} worker={worker} />
                ))
              )}
            </section>
          )}
        </main>
      </div>
    </ProtectedPage>
  );
}
