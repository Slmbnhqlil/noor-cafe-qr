"use client";
import { useEffect, useState } from "react";
import { Table } from "@/types";
import { fetchTables, upsertTable, deleteTable } from "@/lib/menuService";
import { QRCodeSVG } from "qrcode.react";
import { Plus, Trash2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { CAFE_NAME } from "@/lib/firebase";

export default function AdminTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [num, setNum] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    fetchTables().then(setTables);
    setOrigin(window.location.origin);
  }, []);

  const add = async () => {
    if (!num.trim()) return;
    const t: Table = { id: num.trim(), number: num.trim() };
    await upsertTable(t);
    setTables((p) => [...p.filter((x) => x.id !== t.id), t]);
    setNum("");
    toast.success("Eklendi");
  };
  const remove = async (id: string) => {
    if (!confirm("Silinsin mi?")) return;
    await deleteTable(id);
    setTables((p) => p.filter((x) => x.id !== id));
  };

  const url = (n: string) => `${origin}/?masa=${encodeURIComponent(n)}`;

  return (
    <div>
      <div className="card p-5 mb-6 print:hidden">
        <h2 className="serif text-lg text-coffee-800 mb-3">Masa Ekle</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input className="input flex-1" placeholder="Masa numarası (örn. 5)" value={num} onChange={(e) => setNum(e.target.value)} />
          <button onClick={add} className="btn-primary"><Plus size={14} /> Ekle</button>
        </div>
        <p className="text-xs text-coffee-500 mt-2">
          QR kodları yazdırıp masalara yapıştırabilirsin. Müşteri QR’ı okuttuğunda menü açılır ve masa otomatik dolar.
        </p>
      </div>

      {/* Yazdırma çubuğu */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <p className="text-sm text-coffee-600">{tables.length} masa</p>
        <button
          onClick={() => window.print()}
          disabled={tables.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          <Printer size={16} /> Tüm QR'ları Yazdır
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3" id="qr-print-area">
        {tables.map((t) => (
          <div key={t.id} className="card p-5 text-center break-inside-avoid print:shadow-none print:border print:border-coffee-300">
            <p className="label">{CAFE_NAME}</p>
            <p className="serif text-2xl text-coffee-800 mt-1">Masa {t.number}</p>
            <div className="bg-white p-3 inline-block rounded-xl mt-3">
              <QRCodeSVG value={url(t.number)} size={180} bgColor="#FFFFFF" fgColor="#3F2C1A" level="M" />
            </div>
            <p className="text-xs text-coffee-500 mt-3 serif">QR'ı okutarak menüyü açın</p>
            <div className="mt-3 flex justify-center gap-2 print:hidden">
              <button onClick={() => window.print()} className="btn-ghost"><Printer size={14} /> Yazdır</button>
              <button onClick={() => remove(t.id)} className="btn-ghost text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {tables.length === 0 && <p className="text-coffee-500 col-span-full text-center py-8">Henüz masa yok.</p>}
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
