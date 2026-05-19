"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";

export default function OrdersPage() {
  const { lang } = useLang();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(JSON.parse(localStorage.getItem("noor-orders") || "[]"));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="serif text-3xl text-coffee-800 mb-6">{t(lang, "orders")}</h1>
      {ids.length === 0 ? (
        <div className="card p-8 text-center text-coffee-500">
          {lang === "tr" ? "Henüz siparişiniz yok." : "No orders yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {ids.map((id) => (
            <Link key={id} href={`/orders/${id}`} className="card p-4 block hover:bg-coffee-50">
              <p className="serif text-coffee-800">#{id.slice(0, 8)}</p>
              <p className="text-sm text-coffee-500">{t(lang, "orderTracking")} →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
