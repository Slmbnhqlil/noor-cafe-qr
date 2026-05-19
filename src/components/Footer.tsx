import { CAFE_NAME } from "@/lib/firebase";

export default function Footer() {
  return (
    <footer className="border-t border-coffee-100 bg-cream/60">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-coffee-600">
        <p className="serif text-base text-coffee-700">{CAFE_NAME}</p>
        <p className="mt-1">© {new Date().getFullYear()} — Sade. Şık. Sıcak bir nefes.</p>
      </div>
    </footer>
  );
}
