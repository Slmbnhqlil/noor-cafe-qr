"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Lang } from "@/types";

type S = { lang: Lang; setLang: (l: Lang) => void };
export const useLang = create<S>()(
  persist((set) => ({ lang: "tr", setLang: (lang) => set({ lang }) }), { name: "noor-lang" })
);
