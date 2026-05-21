import { Category, MenuItem } from "@/types";

// Firestore REST API'den sunucu tarafında menüyü çeker ve Next.js veri katmanında
// önbelleğe alır (revalidate). Böylece sayfa ilk HTML'de menüyle birlikte gelir;
// istemcide Firebase SDK yüklenmesine gerek kalmaz.

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

type FsValue = Record<string, any>;

function decode(v: FsValue): any {
  if (v == null) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("mapValue" in v) return decodeFields(v.mapValue.fields || {});
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(decode);
  return null;
}

function decodeFields(fields: Record<string, FsValue>): any {
  const out: Record<string, any> = {};
  for (const k of Object.keys(fields)) out[k] = decode(fields[k]);
  return out;
}

async function listCollection(name: string): Promise<{ id: string; data: any }[]> {
  const res = await fetch(`${BASE}/${name}?key=${KEY}&pageSize=300`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const json = await res.json();
  const docs = json.documents || [];
  return docs.map((d: any) => ({
    id: String(d.name).split("/").pop() as string,
    data: decodeFields(d.fields || {})
  }));
}

export async function fetchMenuServer(): Promise<{ categories: Category[]; items: MenuItem[] }> {
  try {
    const [catDocs, itemDocs] = await Promise.all([
      listCollection("categories"),
      listCollection("menuItems")
    ]);
    const categories = catDocs
      .map((d) => ({ id: d.id, ...d.data }) as Category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const items = itemDocs.map((d) => ({ id: d.id, ...d.data }) as MenuItem);
    return { categories, items };
  } catch {
    return { categories: [], items: [] };
  }
}
