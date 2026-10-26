// database/firebase.js
// Al Firebase-opsætning samles ét sted,
// så App.js og alle screens kan importere databasen herfra uden "require cycles".
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase setup
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialiser kun Firebase-appen én gang.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Realtime Database (Belgium = europe-west1). URL'en kommer fra databaseURL ovenfor
export const rtdb = getDatabase(firebaseApp);
