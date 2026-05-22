"use client";
import { useCart } from "@/lib/cartStore";
import { useLang } from "@/lib/langStore";
import { t } from "@/lib/i18n";
import { CURRENCY } from "@/lib/firebase";
import { useState } from "react";
import { createOrder } from "@/lib/menuService";
import { useRouter } from "next/navigation";
import { toE164TR, sendOtp, resetRecaptcha } from "@/lib/phoneAuth";
import { ConfirmationResult } from "firebase/auth";
import toast from "react-hot-toast";
import { ShieldCheck, Phone } from "lucide-react";

type Step = "form" | "otp";

export default function CheckoutPage() {
  const { lang } = useLang();
  const router = useRouter();
  const { items, subtotal, tableNumber, setTable, clear } = useCart();
  const [table] = useState(tableNumber);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [code, setCode] = useState("");
  const [phoneE164, setPhoneE164] = useState("");

  const isTr = lang === "tr";

  // 1) Form → OTP gönder
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table.trim()) {
      toast.error(isTr ? "Masa numarası gerekli" : "Table number required");
      return;
    }
    const e164 = toE164TR(phone);
    if (!e164) {
      toast.error(isTr ? "Geçerli bir cep telefonu girin (5XX XXX XX XX)" : "Enter a valid mobile number");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const conf = await sendOtp(e164, "recaptcha-container");
      setConfirmation(conf);
      setPhoneE164(e164);
      setStep("otp");
      toast.success(isTr ? "Doğrulama kodu gönderildi" : "Verification code sent");
    } catch (err: any) {
      resetRecaptcha();
      toast.error(err?.message || (isTr ? "Kod gönderilemedi" : "Could not send code"));
    } finally {
      setLoading(false);
    }
  };

  // 2) OTP doğrula → siparişi oluştur
  const handleVerifyAndOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmation || code.trim().length < 6) {
      toast.error(isTr ? "6 haneli kodu girin" : "Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await confirmation.confirm(code.trim());
      setTable(table);
      const id = await createOrder({
        tableNumber: table,
        items,
        subtotal: subtotal(),
        note: note || undefined,
        customerName: name || undefined,
        phone: phoneE164
      });
      const list = JSON.parse(localStorage.getItem("noor-orders") || "[]");
      localStorage.setItem("noor-orders", JSON.stringify([id, ...list].slice(0, 20)));
      clear();
      resetRecaptcha();
      toast.success(t(lang, "orderReceived"));
      router.push(`/orders/${id}`);
    } catch (err: any) {
      toast.error(err?.code === "auth/invalid-verification-code"
        ? (isTr ? "Kod hatalı" : "Invalid code")
        : (err?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="serif text-3xl text-coffee-800 mb-6">{t(lang, "order")}</h1>

      {step === "form" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="label">{t(lang, "tableNo")}</label>
            <input
              className="input mt-1 bg-coffee-50 text-coffee-700 cursor-not-allowed"
              value={table || (isTr ? "QR okutarak gelin" : "Scan a QR")}
              readOnly
              aria-readonly="true"
              tabIndex={-1}
            />
            <p className="text-xs text-coffee-500 mt-1">
              {isTr ? "Masa numarası QR kodundan otomatik gelir, değiştirilemez." : "Table number is set automatically from the QR code."}
            </p>
          </div>
          <div>
            <label className="label">{t(lang, "name")} <span className="text-coffee-400">({t(lang, "optional")})</span></label>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">{t(lang, "phone")} *</label>
            <div className="relative mt-1">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input
                className="input pl-10"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5XX XXX XX XX"
                required
              />
            </div>
            <p className="text-xs text-coffee-500 mt-1">
              {isTr ? "Numaranıza SMS ile doğrulama kodu gönderilecek." : "An SMS verification code will be sent."}
            </p>
          </div>
          <div>
            <label className="label">{t(lang, "note")}</label>
            <textarea className="input mt-1 min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(lang, "notePh")} />
          </div>

          <OrderSummary items={items} total={subtotal()} lang={lang} />

          <button disabled={loading || items.length === 0} className="btn-primary w-full">
            {loading ? "..." : (isTr ? "Doğrulama Kodu Gönder →" : "Send Verification Code →")}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndOrder} className="space-y-4">
          <div className="card p-6 text-center">
            <ShieldCheck className="mx-auto text-coffee-700" size={36} />
            <p className="serif text-lg text-coffee-800 mt-2">{isTr ? "Telefonunu doğrula" : "Verify your phone"}</p>
            <p className="text-sm text-coffee-600 mt-1">
              {isTr ? `${phoneE164} numarasına gönderilen 6 haneli kodu gir.` : `Enter the 6-digit code sent to ${phoneE164}.`}
            </p>
            <input
              className="input mt-4 text-center text-2xl tracking-[0.5em] font-semibold"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              autoFocus
            />
            <button
              type="button"
              onClick={() => { setStep("form"); setCode(""); resetRecaptcha(); }}
              className="text-xs text-coffee-500 underline mt-3"
            >
              {isTr ? "Numarayı değiştir" : "Change number"}
            </button>
          </div>

          <OrderSummary items={items} total={subtotal()} lang={lang} />

          <button disabled={loading} className="btn-primary w-full">
            {loading ? "..." : (isTr ? "Doğrula ve Siparişi Onayla" : "Verify & Place Order")}
          </button>
        </form>
      )}

      {/* Invisible reCAPTCHA hedefi */}
      <div id="recaptcha-container" />
    </div>
  );
}

function OrderSummary({ items, total, lang }: { items: any[]; total: number; lang: any }) {
  return (
    <div className="card p-5">
      <p className="label mb-3">{t(lang, "yourOrder")}</p>
      <div className="space-y-2 text-sm">
        {items.map((i) => (
          <div key={i.itemId} className="flex justify-between">
            <span className="text-coffee-700">{i.name} × {i.qty}</span>
            <span className="text-coffee-800">{CURRENCY}{i.price * i.qty}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-coffee-100 mt-3 pt-3 flex justify-between">
        <span className="text-coffee-600">{t(lang, "total")}</span>
        <span className="serif text-xl text-coffee-800">{CURRENCY}{total}</span>
      </div>
    </div>
  );
}
