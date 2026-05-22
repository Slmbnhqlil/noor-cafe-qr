"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/langStore";
import { useCart } from "@/lib/cartStore";
import { t, DictKey } from "@/lib/i18n";
import { listenOrdersByTable } from "@/lib/menuService";
import { Order } from "@/types";
import { CURRENCY } from "@/lib/firebase";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready: "bg-emerald-100 text-emerald-700",
  delivered: "bg-coffee-100 text-coffee-700",
  cancelled: "bg-red-100 text-red-700"
};

export default function OrdersPage() {
  const { lang } = useLang();
  const tableNumber = useCart((s) => s.tableNumber);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!tableNumber) {
      setOrders([]);
      return;
    }
    const unsub = listenOrdersByTable(tableNumber, setOrders);
    return () => unsub();
  }, [tableNumber]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="serif text-3xl text-coffee-800">{t(lang, "orders")}</h1>
      {tableNumber ? (
        <p className="text-sm text-coffee-600 mt-1 mb-6">{t(lang, "table")} {tableNumber}</p>
      ) : (
        <p className="text-sm text-coffee-600 mt-1 mb-6">
          {lang === "tr" ? "Masa QR'ını okutun." : "Scan a table QR."}
        </p>
      )}

      {tableNumber && orders.length === 0 ? (
        <div className="card p-8 text-center text-coffee-500">
          {lang === "tr" ? "Bu masaya ait sipariş yok." : "No orders for this table."}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="card p-4 block hover:bg-coffee-50">
              <div className="flex items-center justify-between gap-2">
                <p className="serif text-coffee-800">#{o.id.slice(0, 6)}</p>
                <span className={`chip ${statusColors[o.status] || ""}`}>
                  {t(lang, `status_${o.status}` as DictKey)}
                </span>
              </div>
              <p className="text-sm text-coffee-600 mt-1">
                {o.items.reduce((s, i) => s + i.qty, 0)} ürün · {CURRENCY}{o.subtotal}
              </p>
              <p className="text-xs text-coffee-400 mt-0.5">
                {new Date(o.createdAt).toLocaleString(lang === "tr" ? "tr-TR" : "en-US")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
