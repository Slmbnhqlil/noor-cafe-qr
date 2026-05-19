"use client";
import Link from "next/link";
import { ShoppingBag, Globe } from "lucide-react";
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
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl serif text-coffee-700">✦</span>
          <span className="serif text-xl text-coffee-800 tracking-wide">{CAFE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/menu" className="hidden sm:inline px-3 py-2 text-sm text-coffee-700 hover:text-coffee-900">
            {t(lang, "menu")}
          </Link>
          <button
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="p-2 rounded-full hover:bg-coffee-100 text-coffee-700"
            aria-label="language"
          >
            <Globe size={18} />
            <span className="sr-only">lang</span>
          </button>
          <span className="text-xs uppercase text-coffee-600 -ml-1">{lang}</span>
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-coffee-100 text-coffee-700">
            <ShoppingBag size={20} />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 bg-coffee-700 text-cream text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
