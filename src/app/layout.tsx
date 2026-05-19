import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CAFE_NAME } from "@/lib/firebase";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: `${CAFE_NAME} — QR Menü & Sipariş`,
  description: "Sade. Şık. Sıcak bir nefes. QR menü ile masanızdan kolay sipariş."
};
export const viewport: Viewport = {
  themeColor: "#3F2C1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#3F2C1A", color: "#F7F1E8", borderRadius: 12 }
          }}
        />
      </body>
    </html>
  );
}
