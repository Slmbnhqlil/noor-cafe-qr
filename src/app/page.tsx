"use client";
import Link from "next/link";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CAFE_NAME } from "@/lib/firebase";
import { useCart } from "@/lib/cartStore";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Coffee, QrCode, Clock } from "lucide-react";

function HomeInner() {
  const { lang } = useLang();
  const sp = useSearchParams();
  const setTable = useCart((s) => s.setTable);
  const tableNumber = useCart((s) => s.tableNumber);

  useEffect(() => {
    const table = sp.get("masa") || sp.get("table");
    if (table) setTable(table);
  }, [sp, setTable]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <p className="label text-coffee-500">QR Menü & Sipariş</p>
          <h1 className="mt-3 text-4xl sm:text-6xl serif text-coffee-800">
            {CAFE_NAME}
          </h1>
          <p className="mt-4 text-coffee-600 max-w-md mx-auto">
            {t(lang, "heroSub")}
          </p>
          {tableNumber && (
            <p className="mt-4 chip bg-coffee-700 text-cream">
              {t(lang, "table")}: {tableNumber}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-primary">
              <Coffee size={16} /> {t(lang, "viewMenu")}
            </Link>
            <Link href="/orders" className="btn-outline">
              <Clock size={16} /> {t(lang, "orders")}
            </Link>
          </div>
        </div>
        {/* decorative */}
        <div className="absolute inset-x-0 -bottom-20 h-40 bg-gradient-to-b from-transparent to-cream pointer-events-none" />
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-5xl px-4 pb-16 grid sm:grid-cols-3 gap-4">
        {[
          { icon: <QrCode size={20} />, title: lang === "tr" ? "QR ile Sipariş" : "Order via QR", desc: lang === "tr" ? "Masandan kalkmana gerek yok" : "No need to leave your seat" },
          { icon: <Coffee size={20} />, title: lang === "tr" ? "Taze Kahve" : "Fresh Coffee", desc: lang === "tr" ? "Günün çekirdeği, özenle" : "Bean of the day, with care" },
          { icon: <Clock size={20} />, title: lang === "tr" ? "Canlı Takip" : "Live Tracking", desc: lang === "tr" ? "Siparişinin durumunu izle" : "Watch your order status" }
        ].map((f, i) => (
          <div key={i} className="card p-6">
            <div className="w-10 h-10 rounded-full bg-coffee-100 text-coffee-700 flex items-center justify-center">{f.icon}</div>
            <h3 className="mt-3 serif text-lg text-coffee-800">{f.title}</h3>
            <p className="mt-1 text-sm text-coffee-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
