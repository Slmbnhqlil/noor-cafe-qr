"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CAFE_NAME } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function Header() {
  const count = useCart((s) => s.count());
  const { lang, setLang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-coffee-100">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xl sm:text-2xl serif text-coffee-700 flex-shrink-0">✦</span>
          <span className="serif text-base sm:text-xl text-coffee-800 tracking-wide truncate">
            {CAFE_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            href="/menu"
            className="hidden sm:inline px-3 py-2 text-sm text-coffee-700 hover:text-coffee-900"
          >
            {t(lang, "menu")}
          </Link>
          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-coffee-700 hover:bg-coffee-100"
            aria-label="language"
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-coffee-100 text-coffee-700"
            aria-label="cart"
          >
            <ShoppingBag size={20} />
            {mounted && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coffee-700 text-cream text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
