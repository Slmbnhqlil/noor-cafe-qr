import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function db(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}
export function auth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp());
  return _auth;
}
export function storage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
export const CAFE_NAME = process.env.NEXT_PUBLIC_CAFE_NAME || "Noor Cafe";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "₺";
