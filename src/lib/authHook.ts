"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);
  const isAdmin = !!user && (!ADMIN_EMAIL || user.email === ADMIN_EMAIL);
  return { user, loading, isAdmin };
}

export const login = (email: string, pw: string) =>
  signInWithEmailAndPassword(auth(), email, pw);
export const logout = () => signOut(auth());
