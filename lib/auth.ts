import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type {
  CustomerSignupData,
  UserProfile,
  UserRole,
  WorkerSignupData,
} from "@/lib/types";

const USERS = "users";
const PHONE_LOOKUPS = "phoneLookups";

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

async function savePhoneLookup(phone: string, email: string, uid: string) {
  await setDoc(doc(db, PHONE_LOOKUPS, normalizePhone(phone)), { email, uid });
}

async function findEmailByPhone(phone: string): Promise<string | null> {
  const snap = await getDoc(doc(db, PHONE_LOOKUPS, normalizePhone(phone)));
  if (!snap.exists()) return null;
  return snap.data().email as string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function signInWithPhone(phone: string, password: string) {
  const email = await findEmailByPhone(phone);
  if (!email) {
    throw new Error("No account found with this phone number.");
  }
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(credential.user.uid);
  return { user: credential.user, profile };
}

async function createAccount(
  data: CustomerSignupData,
  role: UserRole,
  extra?: Partial<UserProfile>,
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );

  await updateProfile(credential.user, { displayName: data.name });

  const profile: UserProfile = {
    uid: credential.user.uid,
    role,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    createdAt: Date.now(),
    ...extra,
  };

  await setDoc(doc(db, USERS, credential.user.uid), profile);
  await savePhoneLookup(data.phone, data.email, credential.user.uid);
  return { user: credential.user, profile };
}

export async function signUpCustomer(data: CustomerSignupData) {
  return createAccount(data, "customer");
}

export async function signUpWorker(data: WorkerSignupData) {
  return createAccount(data, "worker", {
    profession: data.profession,
    skills: data.skills,
    experience: data.experience,
  });
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>,
) {
  const existing = await getUserProfile(uid);
  if (!existing) throw new Error("Profile not found.");
  const merged = { ...existing, ...updates, uid, role: existing.role };
  await setDoc(doc(db, USERS, uid), merged);

  if (updates.phone && updates.phone !== existing.phone) {
    await deleteDoc(doc(db, PHONE_LOOKUPS, normalizePhone(existing.phone)));
    await savePhoneLookup(merged.phone, merged.email, uid);
  } else if (updates.email && updates.email !== existing.email) {
    await savePhoneLookup(merged.phone, merged.email, uid);
  }

  return merged;
}
