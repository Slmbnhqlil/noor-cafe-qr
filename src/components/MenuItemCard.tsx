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

  const hasDesc = !!item.description[lang]?.trim();

  return (
    <div className="card p-3 sm:p-4 flex gap-3 sm:gap-4 overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name[lang]}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-coffee-100 flex items-center justify-center text-2xl sm:text-3xl serif text-coffee-400 flex-shrink-0">
          ✦
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="serif text-base sm:text-lg text-coffee-800 leading-tight break-words">
            {item.name[lang]}
          </h3>
          {item.popular && (
            <span className="chip bg-gold/15 text-coffee-700 flex-shrink-0">
              <Star size={12} />
              <span className="hidden sm:inline">{t(lang, "popular")}</span>
            </span>
          )}
        </div>

        {hasDesc && (
          <p className="text-xs sm:text-sm text-coffee-600 mt-1 line-clamp-2 break-words">
            {item.description[lang]}
          </p>
        )}

        {(item.prepMinutes || item.allergens?.length) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-coffee-500">
            {item.prepMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={11} /> {item.prepMinutes} {t(lang, "minutes")}
              </span>
            ) : null}
            {item.allergens?.length ? (
              <span className="truncate max-w-full">
                {t(lang, "allergens")}: {item.allergens.join(", ")}
              </span>
            ) : null}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="serif text-coffee-800 text-base sm:text-lg whitespace-nowrap">
            {CURRENCY}{item.price}
          </span>
          <button
            disabled={!item.available}
            onClick={handleAdd}
            aria-label={t(lang, "addToCart")}
            className="btn-primary !px-3 sm:!px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{t(lang, "addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
