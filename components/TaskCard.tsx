"use client";

import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
}

export function TaskCard({
  task,
  actionLabel,
  onAction,
  loading,
}: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">
            {task.taskType}
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Posted by {task.customerName}
          </p>
          <p className="mt-1 text-sm text-stone-500">{task.address}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            task.status === "open"
              ? "bg-green-100 text-green-800"
              : task.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : "bg-stone-100 text-stone-600"
          }`}
        >
          {task.status}
        </span>
      </div>
      {actionLabel && onAction && task.status === "open" && (
        <button
          type="button"
          onClick={onAction}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-teal-600 py-3 text-base font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Please wait…" : actionLabel}
        </button>
      )}
    </article>
  );
}
