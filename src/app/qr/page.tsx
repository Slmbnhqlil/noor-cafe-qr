"use client";
import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CAFE_NAME } from "@/lib/firebase";
import { Printer } from "lucide-react";

function QRGrid() {
  const sp = useSearchParams();
  const [origin, setOrigin] = useState("");
  const [base, setBase] = useState("");

  const from = Number(sp.get("from") || 1);
  const to = Number(sp.get("to") || 10);
  const queryBase = sp.get("base");

  useEffect(() => {
    const o = window.location.origin;
    setOrigin(o);
    const saved = localStorage.getItem("noor-qr-base") || "";
    setBase(queryBase || saved || o);
  }, [queryBase]);

  const saveBase = (v: string) => {
    setBase(v);
    localStorage.setItem("noor-qr-base", v);
  };

  const nums = Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 print:p-0">
      <div className="print:hidden card p-5 mb-6">
        <h1 className="serif text-2xl text-coffee-800">Masa QR Üretici</h1>
        <p className="text-sm text-coffee-600 mt-1">
          Bu sayfadaki QR'lar <code className="bg-coffee-50 px-1 rounded">/?masa=N</code> linkini içerir. Müşteri okuttuğunda masa otomatik dolar.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="label">Site adresi (Vercel domaini)</label>
            <input
              className="input mt-1"
              placeholder="https://noor-cafe.vercel.app"
              value={base}
              onChange={(e) => saveBase(e.target.value)}
            />
            <p className="text-xs text-coffee-500 mt-1">
              Şu an: <span className="text-coffee-700">{base || origin}</span>
            </p>
          </div>
          <div className="flex items-end">
            <button onClick={() => window.print()} className="btn-primary w-full">
              <Printer size={16} /> Yazdır
            </button>
          </div>
        </div>
        <p className="text-xs text-coffee-500 mt-2">
          Aralık değiştirmek için: <code>?from=1&to=20</code>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-2 print:gap-2">
        {nums.map((n) => {
          const url = `${base || origin}/?masa=${encodeURIComponent(n)}`;
          return (
            <div
              key={n}
              className="card p-5 text-center break-inside-avoid print:shadow-none print:border print:border-coffee-300"
            >
              <p className="label text-coffee-500">{CAFE_NAME}</p>
              <p className="serif text-2xl text-coffee-800 mt-1">Masa {n}</p>
              <div className="bg-white p-3 inline-block rounded-xl mt-3">
                <QRCodeSVG value={url} size={180} bgColor="#FFFFFF" fgColor="#3F2C1A" level="M" />
              </div>
              <p className="text-[10px] text-coffee-400 mt-2 break-all">{url}</p>
              <p className="text-xs text-coffee-500 mt-2 serif">QR'ı okutarak menüyü açın</p>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @media print {
          header, footer { display: none !important; }
          body { background: white !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}

export default function QRPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-coffee-500">...</div>}>
      <QRGrid />
    </Suspense>
  );
}
