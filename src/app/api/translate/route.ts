import { NextResponse } from "next/server";

// TR -> EN otomatik çeviri (Google'ın ücretsiz gtx uç noktası, sunucu tarafında — CORS yok)
async function translateOne(text: string): Promise<string> {
  const q = (text || "").trim();
  if (!q) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    // data[0] = [[translatedSegment, originalSegment, ...], ...]
    return (data?.[0] || []).map((s: any[]) => s[0]).join("");
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const { texts } = await req.json().catch(() => ({ texts: [] }));
  if (!Array.isArray(texts)) {
    return NextResponse.json({ translations: [] }, { status: 400 });
  }
  const translations = await Promise.all(texts.map((t: string) => translateOne(t)));
  return NextResponse.json({ translations });
}
