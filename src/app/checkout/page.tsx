"use client";
import { useCart } from "@/lib/cartStore";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CURRENCY } from "@/lib/firebase";
import { useState } from "react";
import { createOrder } from "@/lib/menuService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { lang } = useLang();
  const router = useRouter();
  const { items, subtotal, tableNumber, setTable, clear } = useCart();
  const [table, setTableLocal] = useState(tableNumber);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table.trim()) {
      toast.error(lang === "tr" ? "Masa numarası gerekli" : "Table number required");
      return;
    }
    if (items.length === 0) return;
    setLoading(true);
    try {
      setTable(table);
      const id = await createOrder({
        tableNumber: table,
        items,
        subtotal: subtotal(),
        note: note || undefined,
        customerName: name || undefined,
        phone: phone || undefined
      });
      // remember locally for /orders
      const list = JSON.parse(localStorage.getItem("noor-orders") || "[]");
      localStorage.setItem("noor-orders", JSON.stringify([id, ...list].slice(0, 20)));
      clear();
      toast.success(t(lang, "orderReceived"));
      router.push(`/orders/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="serif text-3xl text-coffee-800 mb-6">{t(lang, "order")}</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">{t(lang, "tableNo")} *</label>
          <input
            className="input mt-1"
            value={table}
            onChange={(e) => setTableLocal(e.target.value)}
            placeholder="12"
            required
          />
        </div>
        <div>
          <label className="label">
            {t(lang, "name")} <span className="text-coffee-400">({t(lang, "optional")})</span>
          </label>
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">
            {t(lang, "phone")} <span className="text-coffee-400">({t(lang, "optional")})</span>
          </label>
          <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label">{t(lang, "note")}</label>
          <textarea
            className="input mt-1 min-h-[80px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t(lang, "notePh")}
          />
        </div>

        <div className="card p-5">
          <p className="label mb-3">{t(lang, "yourOrder")}</p>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.itemId} className="flex justify-between">
                <span className="text-coffee-700">{i.name} × {i.qty}</span>
                <span className="text-coffee-800">{CURRENCY}{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-coffee-100 mt-3 pt-3 flex justify-between">
            <span className="text-coffee-600">{t(lang, "total")}</span>
            <span className="serif text-xl text-coffee-800">{CURRENCY}{subtotal()}</span>
          </div>
        </div>

        <button disabled={loading || items.length === 0} className="btn-primary w-full">
          {loading ? "..." : `${t(lang, "confirm")} →`}
        </button>
      </form>
    </div>
  );
}
