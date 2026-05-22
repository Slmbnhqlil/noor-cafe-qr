"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cartStore";
import { listenCart } from "@/lib/menuService";

// Masa numarası değiştikçe o masanın ortak sepetini canlı dinler.
export default function CartSync() {
  const tableNumber = useCart((s) => s.tableNumber);
  const applyRemote = useCart((s) => s._applyRemote);

  useEffect(() => {
    if (!tableNumber) {
      applyRemote([]);
      return;
    }
    const unsub = listenCart(tableNumber, applyRemote);
    return () => unsub();
  }, [tableNumber, applyRemote]);

  return null;
}
