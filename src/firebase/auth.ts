import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./config";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    displayName,
    createdAt: Timestamp.now(),
  });
  return mapUser(cred.user);
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(cred.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthChange(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapUser(user) : null);
  });
}
