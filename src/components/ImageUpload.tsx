"use client";
import { useRef, useState } from "react";
import { uploadItemImage } from "@/lib/uploadService";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ImageUpload({
  value,
  itemId,
  onChange
}: {
  value?: string;
  itemId: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir görsel dosyası seçin");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Görsel 5MB'dan küçük olmalı");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadItemImage(file, itemId);
      onChange(url);
      toast.success("Görsel yüklendi");
    } catch (e: any) {
      toast.error(e.message || "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="ürün" className="w-28 h-28 rounded-xl object-cover border border-coffee-200" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-coffee-700 text-cream rounded-full w-6 h-6 flex items-center justify-center"
            aria-label="kaldır"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="block mt-2 text-xs text-coffee-600 underline"
          >
            {uploading ? "Yükleniyor..." : "Değiştir"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-28 h-28 rounded-xl border-2 border-dashed border-coffee-200 flex flex-col items-center justify-center gap-1 text-coffee-500 hover:border-coffee-400 hover:bg-coffee-50 transition"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          <span className="text-[11px]">{uploading ? "Yükleniyor" : "Görsel Yükle"}</span>
        </button>
      )}
    </div>
  );
}
