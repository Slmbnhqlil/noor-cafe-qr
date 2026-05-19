"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import { CAFE_NAME } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız");
      toast.success("Giriş yapıldı");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-coffee-700 text-cream flex items-center justify-center mx-auto">
          <Lock size={22} />
        </div>
        <p className="label mt-3">{CAFE_NAME}</p>
        <h1 className="serif text-3xl text-coffee-800 mt-1">Yönetim Girişi</h1>
        <p className="text-sm text-coffee-600 mt-1">Devam etmek için şifreyi gir.</p>
      </div>
      <form onSubmit={submit} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="label">Şifre</label>
          <input
            className="input mt-1"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            required
          />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "..." : "Giriş Yap →"}
        </button>
      </form>
      <p className="text-xs text-coffee-500 text-center mt-4">
        Şifre <code className="bg-coffee-100 px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> env değişkeninden okunur.
      </p>
    </div>
  );
}
