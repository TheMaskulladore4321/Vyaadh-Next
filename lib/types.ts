export type UserRole = "customer" | "worker";

export type TaskStatus = "open" | "assigned" | "completed";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  address: string;
  profession?: string;
  skills?: string[];
  experience?: string;
  photoUrl?: string;
  createdAt: number;
}

export interface Task {
  id: string;
  taskType: string;
  customerId: string;
  customerName: string;
  address: string;
  status: TaskStatus;
  workerId?: string;
  workerName?: string;
  createdAt: number;
}

export interface CustomerSignupData {
  name: string;
  phone: string;
  email: string;
  address: string;
  password: string;
}

export interface WorkerSignupData extends CustomerSignupData {
  profession: string;
  skills: string[];
  experience: string;
}
