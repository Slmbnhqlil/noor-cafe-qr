"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listenOrder } from "@/lib/menuService";
import { Order, OrderStatus } from "@/types";
import { useLang } from "@/lib/langStore";
import { t, DictKey } from "@/lib/i18n";
import { CURRENCY } from "@/lib/firebase";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const steps: OrderStatus[] = ["new", "preparing", "ready", "delivered"];

export default function OrderDetail() {
  const { lang } = useLang();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    const unsub = listenOrder(id, setOrder);
    return () => unsub();
  }, [id]);

  if (!order) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-coffee-500">...</div>;
  }

  const currentIdx = steps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="label">#{order.id.slice(0, 8)} · {t(lang, "table")} {order.tableNumber}</p>
      <h1 className="serif text-3xl text-coffee-800 mt-1">{t(lang, "orderTracking")}</h1>

      {/* Status timeline */}
      <div className="card p-6 mt-6">
        {order.status === "cancelled" ? (
          <p className="text-red-600 text-center">{t(lang, "status_cancelled")}</p>
        ) : (
          <div className="space-y-3">
            {steps.map((s, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s} className="flex items-center gap-3">
                  {done ? (
                    active ? <Clock className="text-coffee-700 animate-pulse" size={22} /> : <CheckCircle2 className="text-coffee-700" size={22} />
                  ) : (
                    <Circle className="text-coffee-300" size={22} />
                  )}
                  <span className={`serif ${done ? "text-coffee-800" : "text-coffee-400"}`}>
                    {t(lang, `status_${s}` as DictKey)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card p-6 mt-4">
        <p className="label mb-3">{t(lang, "yourOrder")}</p>
        <div className="space-y-2 text-sm">
          {order.items.map((i) => (
            <div key={i.itemId} className="flex justify-between">
              <span className="text-coffee-700">{i.name} × {i.qty}</span>
              <span className="text-coffee-800">{CURRENCY}{i.price * i.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-coffee-100 mt-3 pt-3 flex justify-between">
          <span className="text-coffee-600">{t(lang, "total")}</span>
          <span className="serif text-xl text-coffee-800">{CURRENCY}{order.subtotal}</span>
        </div>
        {order.note && (
          <p className="mt-3 text-xs text-coffee-500"><b>{t(lang, "note")}:</b> {order.note}</p>
        )}
      </div>
    </div>
  );
}
