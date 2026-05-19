"use client";
import { MenuItem } from "@/types";
import { useCart } from "@/lib/cartStore";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CURRENCY } from "@/lib/firebase";
import { Plus, Star, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { lang } = useLang();
  const add = useCart((s) => s.add);

  const handleAdd = () => {
    add({
      itemId: item.id,
      name: item.name[lang],
      price: item.price,
      qty: 1,
      image: item.image
    });
    toast.success(t(lang, "added"));
  };

  return (
    <div className="card p-4 flex gap-4">
      {item.image ? (
        <img src={item.image} alt={item.name[lang]} className="w-24 h-24 rounded-xl object-cover" />
      ) : (
        <div className="w-24 h-24 rounded-xl bg-coffee-100 flex items-center justify-center text-3xl serif text-coffee-400">
          ✦
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="serif text-lg text-coffee-800 leading-tight truncate">{item.name[lang]}</h3>
          {item.popular && (
            <span className="chip bg-gold/15 text-coffee-700">
              <Star size={12} /> {t(lang, "popular")}
            </span>
          )}
        </div>
        <p className="text-sm text-coffee-600 mt-1 line-clamp-2">{item.description[lang]}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-coffee-500">
          {item.prepMinutes && (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {item.prepMinutes} {t(lang, "minutes")}
            </span>
          )}
          {item.allergens?.length ? (
            <span className="truncate">{t(lang, "allergens")}: {item.allergens.join(", ")}</span>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="serif text-coffee-800 text-lg">{CURRENCY}{item.price}</span>
          <button
            disabled={!item.available}
            onClick={handleAdd}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> {t(lang, "addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
