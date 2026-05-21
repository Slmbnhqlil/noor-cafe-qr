"use client";
import { useMemo, useState } from "react";
import { Category, MenuItem } from "@/types";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import MenuItemCard from "@/components/MenuItemCard";
import { Search } from "lucide-react";

export default function MenuClient({
  initialCats,
  initialItems
}: {
  initialCats: Category[];
  initialItems: MenuItem[];
}) {
  const { lang } = useLang();
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");

  const cats = initialCats;
  const items = initialItems;

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
        {filtered.map((i) => (
          <MenuItemCard key={i.id} item={i} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-coffee-500 col-span-2 py-12">
            {lang === "tr" ? "Sonuç bulunamadı." : "No results."}
          </p>
        )}
      </div>
    </div>
  );
}
