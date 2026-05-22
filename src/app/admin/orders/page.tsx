"use client";
import { useEffect, useState } from "react";
import { listenAllOrders, updateOrderStatus } from "@/lib/menuService";
import { Order, OrderStatus } from "@/types";
import { CURRENCY } from "@/lib/firebase";
import toast from "react-hot-toast";

const STATUSES: OrderStatus[] = ["new", "preparing", "ready", "delivered", "paid", "cancelled"];
const labels: Record<OrderStatus, string> = {
  new: "Yeni", preparing: "Hazırlanıyor", ready: "Hazır", delivered: "Teslim", paid: "Ödeme Alındı", cancelled: "İptal"
};
const colors: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-coffee-100 text-coffee-700",
  paid: "bg-green-600 text-white",
  cancelled: "bg-red-100 text-red-700"
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    const unsub = listenAllOrders(setOrders);
    return () => unsub();
  }, []);

  const shown = orders.filter((o) => (filter === "all" ? true : o.status === filter));

  const change = async (id: string, s: OrderStatus) => {
    try { await updateOrderStatus(id, s); toast.success("Güncellendi"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter("all")} className={`chip ${filter === "all" ? "bg-coffee-700 text-cream" : "bg-coffee-100 text-coffee-700"}`}>Tümü</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`chip ${filter === s ? "bg-coffee-700 text-cream" : "bg-coffee-100 text-coffee-700"}`}>
            {labels[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="serif text-coffee-800">Masa {o.tableNumber} <span className="text-coffee-400 text-sm">#{o.id.slice(0,6)}</span></p>
                <p className="text-xs text-coffee-500">{new Date(o.createdAt).toLocaleString("tr-TR")}</p>
              </div>
              <span className={`chip ${colors[o.status]}`}>{labels[o.status]}</span>
            </div>
            <div className="mt-3 text-sm space-y-1">
              {o.items.map((i) => (
                <div key={i.itemId} className="flex justify-between">
                  <span>{i.name} × {i.qty}</span>
                  <span>{CURRENCY}{i.price * i.qty}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-coffee-100 pt-2 mt-2 font-medium">
                <span>Toplam</span><span>{CURRENCY}{o.subtotal}</span>
              </div>
              {o.note && <p className="text-xs text-coffee-500 mt-1">Not: {o.note}</p>}
              {o.customerName && <p className="text-xs text-coffee-500">Müşteri: {o.customerName} {o.phone && `· ${o.phone}`}</p>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => change(o.id, s)}
                  disabled={o.status === s}
                  className={`chip ${o.status === s ? "bg-coffee-700 text-cream" : "bg-coffee-50 text-coffee-700 hover:bg-coffee-100"} disabled:opacity-50`}
                >
                  {labels[s]}
                </button>
              ))}
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-center text-coffee-500 py-8">Sipariş yok.</p>}
      </div>
    </div>
  );
}
