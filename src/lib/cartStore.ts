"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";
import { saveCart } from "@/lib/menuService";

type CartState = {
  items: CartItem[];
  tableNumber: string;
  // Firestore snapshot'undan gelen güncel sepeti yansıtır (yazma yapmaz)
  _applyRemote: (items: CartItem[]) => void;
  setTable: (n: string) => void;
  add: (item: CartItem) => void;
  remove: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  setNote: (itemId: string, note: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

// items'ı hesapla, hem yerel state'i güncelle hem Firestore'a (masa varsa) yaz
function commit(set: any, get: any, next: CartItem[]) {
  set({ items: next });
  const table = get().tableNumber;
  if (table) {
    // ortak sepete yaz; snapshot tüm cihazlara dağıtır
    saveCart(table, next).catch(() => {});
  }
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: "",
      _applyRemote: (items) => set({ items }),
      setTable: (n) => set({ tableNumber: n }),
      add: (item) => {
        const items = get().items;
        const ex = items.find((i) => i.itemId === item.itemId);
        const next = ex
          ? items.map((i) => (i.itemId === item.itemId ? { ...i, qty: i.qty + item.qty } : i))
          : [...items, item];
        commit(set, get, next);
      },
      remove: (id) => commit(set, get, get().items.filter((i) => i.itemId !== id)),
      setQty: (id, qty) =>
        commit(
          set,
          get,
          qty <= 0
            ? get().items.filter((i) => i.itemId !== id)
            : get().items.map((i) => (i.itemId === id ? { ...i, qty } : i))
        ),
      setNote: (id, note) =>
        commit(set, get, get().items.map((i) => (i.itemId === id ? { ...i, note } : i))),
      clear: () => commit(set, get, []),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0)
    }),
    {
      name: "noor-cart",
      // Sadece masa numarasını yerelde sakla; ürünler Firestore'dan gelir
      partialize: (s) => ({ tableNumber: s.tableNumber }) as any
    }
  )
);
