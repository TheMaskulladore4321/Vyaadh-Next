import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

function addressOverlap(a: string, b: string): number {
  const tokensA = new Set(
    a
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((t) => t.length > 2),
  );
  const tokensB = b
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((t) => t.length > 2);
  return tokensB.filter((t) => tokensA.has(t)).length;
}

function workerMatchesTask(worker: UserProfile, taskType: string): boolean {
  const type = taskType.toLowerCase();
  if (worker.profession?.toLowerCase().includes(type)) return true;
  if (worker.skills?.some((s) => s.toLowerCase().includes(type))) return true;
  if (worker.skills?.some((s) => type.includes(s.toLowerCase()))) return true;
  return worker.profession?.toLowerCase() === type;
}

export async function findWorkersForTask(
  taskType: string,
  customerAddress: string,
): Promise<UserProfile[]> {
  const q = query(collection(db, "users"), where("role", "==", "worker"));
  const snap = await getDocs(q);

  const workers = snap.docs
    .map((d) => d.data() as UserProfile)
    .filter((w) => workerMatchesTask(w, taskType))
    .sort(
      (a, b) =>
        addressOverlap(b.address, customerAddress) -
        addressOverlap(a.address, customerAddress),
    );

  return workers;
}

export function getWorkerTaskTypes(worker: UserProfile): string[] {
  const types = new Set<string>();
  if (worker.profession) types.add(worker.profession);
  worker.skills?.forEach((s) => types.add(s));
  return Array.from(types);
}
