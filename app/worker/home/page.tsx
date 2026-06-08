"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedPage } from "@/components/ProtectedPage";
import { TaskCard } from "@/components/TaskCard";
import { useAuth } from "@/context/AuthContext";
import { acceptTask, subscribeToOpenTasks } from "@/lib/tasks";
import { getWorkerTaskTypes } from "@/lib/workers";
import type { Task } from "@/lib/types";

export default function WorkerHomePage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const taskTypes = getWorkerTaskTypes(profile);
    const unsubscribe = subscribeToOpenTasks(setTasks, taskTypes);
    return unsubscribe;
  }, [profile]);

  async function handleAccept(task: Task) {
    if (!profile) return;
    setAcceptingId(task.id);
    setMessage("");

    try {
      await acceptTask(task.id, profile.uid, profile.name);
      setMessage(`You opted into "${task.taskType}". The customer can reach you.`);
    } catch {
      setMessage("Could not accept this task. It may already be taken.");
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <ProtectedPage role="worker">
      <div className="min-h-screen bg-stone-50">
        <AppHeader title="Available tasks" />
        <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
          <p className="text-sm text-stone-600">
            Tasks matching your profession and skills appear here. Tap to opt in
            and connect with the customer.
          </p>
          {message && (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
              {message}
            </p>
          )}
          {tasks.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-sm text-stone-500">
              No open tasks right now. Check back soon.
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                actionLabel="Opt into this task"
                onAction={() => handleAccept(task)}
                loading={acceptingId === task.id}
              />
            ))
          )}
        </main>
      </div>
    </ProtectedPage>
  );
}
