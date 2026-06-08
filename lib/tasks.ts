import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Task, TaskStatus } from "@/lib/types";

const TASKS = "tasks";

export async function createTask(
  taskType: string,
  customerId: string,
  customerName: string,
  address: string,
) {
  const docRef = await addDoc(collection(db, TASKS), {
    taskType,
    customerId,
    customerName,
    address,
    status: "open" as TaskStatus,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export function subscribeToOpenTasks(
  callback: (tasks: Task[]) => void,
  taskTypes?: string[],
) {
  const q = query(collection(db, TASKS), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    let tasks = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Task)
      .filter((task) => task.status === "open");

    if (taskTypes?.length) {
      const normalized = taskTypes.map((t) => t.toLowerCase());
      tasks = tasks.filter((task) =>
        normalized.some(
          (type) =>
            task.taskType.toLowerCase().includes(type) ||
            type.includes(task.taskType.toLowerCase()),
        ),
      );
    }
    callback(tasks);
  });
}

export async function acceptTask(
  taskId: string,
  workerId: string,
  workerName: string,
) {
  await updateDoc(doc(db, TASKS, taskId), {
    status: "assigned",
    workerId,
    workerName,
  });
}

export async function getCustomerTasks(customerId: string): Promise<Task[]> {
  const q = query(collection(db, TASKS), where("customerId", "==", customerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Task)
    .sort((a, b) => b.createdAt - a.createdAt);
}
