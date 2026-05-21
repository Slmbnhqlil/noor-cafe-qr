"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  tableNumber: string;
  setTable: (n: string) => void;
  add: (item: CartItem) => void;
  remove: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  setNote: (itemId: string, note: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: "",
      setTable: (n) =>
        set((s) => {
          // Farklı bir masa QR'ı okutulduysa o masanın sepetiyle başla (öncekini temizle)
          if (s.tableNumber && s.tableNumber !== n) {
            return { tableNumber: n, items: [] };
          }
          return { tableNumber: n };
        }),
      add: (item) =>
        set((s) => {
          const ex = s.items.find((i) => i.itemId === item.itemId);
          if (ex) {
            return {
              items: s.items.map((i) =>
                i.itemId === item.itemId ? { ...i, qty: i.qty + item.qty } : i
              )
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.itemId !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.itemId !== id)
              : s.items.map((i) => (i.itemId === id ? { ...i, qty } : i))
        })),
      setNote: (id, note) =>
        set((s) => ({ items: s.items.map((i) => (i.itemId === id ? { ...i, note } : i)) })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0)
    }),
    { name: "noor-cart" }
  )
);
