import type { UserProfile } from "@/lib/types";

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="h-16 w-16 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
      {initials}
    </div>
  );
}

export function WorkerCard({ worker }: { worker: UserProfile }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <Avatar name={worker.name} photoUrl={worker.photoUrl} />
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-stone-900">{worker.name}</h3>
        <p className="text-sm font-medium text-teal-700">
          {worker.profession ?? "Worker"}
        </p>
        <p className="mt-1 text-sm text-stone-600">
          Experience: {worker.experience ?? "Not specified"}
        </p>
        <p className="mt-1 text-sm text-stone-500">{worker.address}</p>
        {worker.skills && worker.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {worker.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
