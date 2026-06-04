import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (apiKey && apiKey !== "your_api_key_here") {
  app = initializeApp({
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
  _auth = getAuth(app);
  _db = getFirestore(app);
}

// Non-null assertion is safe: every consumer checks for null before using
// (AuthContext, BestTimes, firestore service all guard with if (!user) etc.)
export const auth = _auth as Auth;
export const db = _db as Firestore;
export const isFirebaseReady = app !== null;
export default app;
