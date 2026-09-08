// lib/firebaseClient.ts
// Step 1: Import modular Firebase Client SDK functions
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Step 2: Define basic Firebase client configuration parameters
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "docket-f0db3",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForDocketAppLocalDev",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "docket-f0db3"}.firebaseapp.com`,
};

// Step 3: Initialize the Firebase App instance for the client (avoids re-initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Step 4: Export the client Firestore database reference to use with onSnapshot listeners
export const db = getFirestore(app);
