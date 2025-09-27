// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- REVISED VALIDATION ---
// Check if any value in the config is missing.
const missingConfig = Object.entries(firebaseConfig).find(
  ([key, value]) => typeof value === 'undefined'
);

if (missingConfig) {
  // If a variable is missing, stop everything and throw a clear error.
  throw new Error(
    `Firebase config is missing required environment variable: NEXT_PUBLIC_${missingConfig[0].replace(/([A-Z])/g, '_$1').toUpperCase()}`
  );
}

// If we get here, the config is valid.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// These will now always be valid Auth and Firestore instances, never null.
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;