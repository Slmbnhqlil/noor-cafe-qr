"use client";
import { useEffect, useState } from "react";
import { listenAllOrders, seedIfEmpty } from "@/lib/menuService";
import { Order } from "@/types";
import { CURRENCY } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsub = listenAllOrders(setOrders);
    return () => unsub();
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todays = orders.filter((o) => o.createdAt >= today.getTime());
  const pending = orders.filter((o) => ["new", "preparing", "ready"].includes(o.status));
  const completed = todays.filter((o) => o.status === "delivered");
  const revenue = completed.reduce((s, o) => s + o.subtotal, 0);

  const seed = async () => {
    try { await seedIfEmpty(); toast.success("Örnek menü yüklendi"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Bugün" value={todays.length} />
        <Stat label="Bekleyen" value={pending.length} accent />
        <Stat label="Tamamlanan" value={completed.length} />
        <Stat label="Gelir" value={`${CURRENCY}${revenue}`} />
      </div>

      <div className="card p-6 mt-6">
        <h2 className="serif text-lg text-coffee-800 mb-3">Hızlı İşlemler</h2>
        <button onClick={seed} className="btn-ghost">Firestore'a örnek menüyü yükle</button>
        <p className="text-xs text-coffee-500 mt-2">
          İlk kurulumda Firestore koleksiyonları boşsa örnek kategorileri ve ürünleri yükler.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <div className={`card p-5 ${accent ? "bg-coffee-700 text-cream border-coffee-700" : ""}`}>
      <p className={`text-xs uppercase tracking-wider ${accent ? "text-cream/70" : "text-coffee-500"}`}>{label}</p>
      <p className={`serif text-3xl mt-1 ${accent ? "text-cream" : "text-coffee-800"}`}>{value}</p>
    </div>
  );
}
