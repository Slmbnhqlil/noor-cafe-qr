"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, Coffee, QrCode, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const nav = [
  { href: "/admin/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Siparişler", icon: ClipboardList },
  { href: "/admin/menu", label: "Menü", icon: Coffee },
  { href: "/admin/tables", label: "Masalar & QR", icon: QrCode }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    toast.success("Çıkış yapıldı");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="serif text-2xl text-coffee-800">Yönetim Paneli</h1>
        <button onClick={logout} className="btn-ghost">
          <LogOut size={14} /> Çıkış
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
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
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
