"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, Coffee, QrCode, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { listenAllOrders } from "@/lib/menuService";
import toast from "react-hot-toast";

const nav = [
  { href: "/admin/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Siparişler", icon: ClipboardList, badge: true },
  { href: "/admin/menu", label: "Menü", icon: Coffee },
  { href: "/admin/tables", label: "Masalar & QR", icon: QrCode }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(0);
  const knownIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const unsub = listenAllOrders((orders) => {
      const active = orders.filter((o) => ["new", "preparing", "ready"].includes(o.status));
      setPending(active.length);
      // Yeni gelen siparişte sesli/görsel uyarı
      const ids = new Set(orders.map((o) => o.id));
      if (knownIds.current) {
        const fresh = orders.filter((o) => !knownIds.current!.has(o.id));
        for (const o of fresh) {
          toast.success(`Yeni sipariş • Masa ${o.tableNumber}`, { icon: "🔔", duration: 5000 });
        }
      }
      knownIds.current = ids;
    });
    return () => unsub();
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    toast.success("Çıkış yapıldı");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <h1 className="serif text-2xl text-coffee-800">Yönetim Paneli</h1>
        <button onClick={logout} className="btn-ghost">
          <LogOut size={14} /> Çıkış
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = pathname?.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`chip ${active ? "bg-coffee-700 text-cream" : "bg-coffee-100 text-coffee-700"}`}
            >
              <Icon size={14} /> {n.label}
              {n.badge && pending > 0 && (
                <span className={`ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${active ? "bg-cream text-coffee-800" : "bg-coffee-700 text-cream"}`}>
                  {pending}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
