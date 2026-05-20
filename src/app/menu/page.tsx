"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchItems } from "@/lib/menuService";
import { Category, MenuItem } from "@/types";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import MenuItemCard from "@/components/MenuItemCard";
import { Search } from "lucide-react";

export default function MenuPage() {
  const { lang } = useLang();
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    // Önbellek varsa anında göster
    const applyCats = (c: Category[]) => { if (alive) { setCats([...c].sort((a, b) => a.order - b.order)); setLoading(false); } };
    const applyItems = (i: MenuItem[]) => { if (alive) setItems(i); };
    fetchCategories(applyCats).then(applyCats).catch(() => {});
    fetchItems(applyItems).then(applyItems).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((i) => i.available)
      .filter((i) => (active === "all" ? true : i.categoryId === active))
      .filter((i) =>
        q
          ? (i.name[lang] + " " + i.description[lang]).toLowerCase().includes(q.toLowerCase())
          : true
      );
  }, [items, active, q, lang]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="serif text-3xl text-coffee-800">{t(lang, "menu")}</h1>
        <p className="text-sm text-coffee-600 mt-1">
          {lang === "tr" ? "Tatlar, kokular, anlar." : "Flavors, aromas, moments."}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, "search")}
          className="input pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        <button
          onClick={() => setActive("all")}
          className={`chip whitespace-nowrap ${
            active === "all" ? "bg-coffee-700 text-cream" : "bg-coffee-100 text-coffee-700"
          }`}
        >
          {t(lang, "allCategories")}
        </button>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`chip whitespace-nowrap ${
              active === c.id ? "bg-coffee-700 text-cream" : "bg-coffee-100 text-coffee-700"
            }`}
          >
            {c.icon} {c.name[lang]}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="grid sm:grid-cols-2 gap-4">
        {loading && items.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-3 sm:p-4 flex gap-3 sm:gap-4 animate-pulse">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-coffee-100 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-coffee-100 rounded w-2/3" />
                <div className="h-3 bg-coffee-100 rounded w-full" />
                <div className="h-3 bg-coffee-100 rounded w-1/2" />
                <div className="h-6 bg-coffee-100 rounded w-1/3 mt-3" />
              </div>
            </div>
          ))
        ) : (
          <>
            {filtered.map((i) => (
              <MenuItemCard key={i.id} item={i} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-coffee-500 col-span-2 py-12">
                {lang === "tr" ? "Sonuç bulunamadı." : "No results."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
