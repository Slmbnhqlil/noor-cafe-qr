"use client";
import { useCart } from "@/lib/cartStore";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CURRENCY } from "@/lib/firebase";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { lang } = useLang();
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="serif text-3xl text-coffee-800 mb-6">{t(lang, "cart")}</h1>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="mx-auto text-coffee-300" size={48} />
          <p className="mt-4 text-coffee-600">{t(lang, "emptyCart")}</p>
          <Link href="/menu" className="btn-primary mt-6">
            {t(lang, "continueShopping")}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.itemId} className="card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-coffee-100 flex items-center justify-center serif text-coffee-400 text-xl">
                  ✦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="serif text-coffee-800 truncate">{i.name}</p>
                  <p className="text-sm text-coffee-600">
                    {CURRENCY}{i.price} × {i.qty} = <span className="text-coffee-800 font-medium">{CURRENCY}{i.price * i.qty}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-coffee-50 rounded-full p-1">
                  <button onClick={() => setQty(i.itemId, i.qty - 1)} className="w-8 h-8 rounded-full hover:bg-coffee-100 flex items-center justify-center">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm">{i.qty}</span>
                  <button onClick={() => setQty(i.itemId, i.qty + 1)} className="w-8 h-8 rounded-full hover:bg-coffee-100 flex items-center justify-center">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => remove(i.itemId)} className="p-2 text-coffee-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="card p-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-coffee-600">{t(lang, "subtotal")}</span>
              <span className="serif text-2xl text-coffee-800">{CURRENCY}{subtotal()}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-4">
              {t(lang, "placeOrder")} →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
