import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp, where
} from "firebase/firestore";
import { db } from "./firebase";
import { Category, MenuItem, Order, OrderStatus, Table, CartItem } from "@/types";

const CACHE_CATS = "noor-cache-cats";
const CACHE_ITEMS = "noor-cache-items";

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeCache(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota */ }
}

// ---------- Read ----------
// Anlık görüntüleme için: önbellekten varsa hemen döndürür (onCache),
// ardından Firestore'dan tazeyi getirir.
export async function fetchCategories(onCache?: (c: Category[]) => void): Promise<Category[]> {
  const cached = readCache<Category[]>(CACHE_CATS);
  if (cached && onCache) onCache(cached);
  const snap = await getDocs(query(collection(db(), "categories"), orderBy("order", "asc")));
  const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }));
  writeCache(CACHE_CATS, data);
  return data;
}

export async function fetchItems(onCache?: (i: MenuItem[]) => void): Promise<MenuItem[]> {
  const cached = readCache<MenuItem[]>(CACHE_ITEMS);
  if (cached && onCache) onCache(cached);
  const snap = await getDocs(collection(db(), "menuItems"));
  const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id">) }));
  writeCache(CACHE_ITEMS, data);
  return data;
}

// ---------- Write (admin) ----------
export async function upsertCategory(c: Category) {
  await setDoc(doc(db(), "categories", c.id), { name: c.name, order: c.order, icon: c.icon || "" });
}
export async function deleteCategory(id: string) {
  await deleteDoc(doc(db(), "categories", id));
}
export async function upsertItem(i: MenuItem) {
  const { id, ...rest } = i;
  await setDoc(doc(db(), "menuItems", id), rest);
}
export async function deleteItem(id: string) {
  await deleteDoc(doc(db(), "menuItems", id));
}

// ---------- Orders ----------
export async function createOrder(o: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">): Promise<string> {
  const payload: Record<string, any> = {
    ...o, status: "new" as OrderStatus, createdAt: Date.now(), updatedAt: Date.now()
  };
  // Firestore undefined değer kabul etmez — temizle
  for (const k of Object.keys(payload)) {
    if (payload[k] === undefined) delete payload[k];
  }
  const ref = await addDoc(collection(db(), "orders"), payload);
  return ref.id;
}
export function listenOrder(id: string, cb: (o: Order | null) => void) {
  return onSnapshot(doc(db(), "orders", id), snap => {
    cb(snap.exists() ? ({ id: snap.id, ...(snap.data() as any) }) : null);
  });
}
export function listenAllOrders(cb: (orders: Order[]) => void) {
  return onSnapshot(query(collection(db(), "orders"), orderBy("createdAt", "desc")), snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  });
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db(), "orders", id), { status, updatedAt: Date.now() });
}

// Bir masanın tüm siparişlerini canlı dinler (o masaya giren herkes görür)
export function listenOrdersByTable(tableNumber: string, cb: (orders: Order[]) => void) {
  return onSnapshot(
    query(collection(db(), "orders"), where("tableNumber", "==", tableNumber)),
    snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Order[];
      list.sort((a, b) => b.createdAt - a.createdAt);
      cb(list);
    }
  );
}

// ---------- Ortak Sepet (masa bazlı, gerçek-zamanlı) ----------
export function listenCart(tableNumber: string, cb: (items: CartItem[]) => void) {
  return onSnapshot(doc(db(), "carts", tableNumber), snap => {
    cb(snap.exists() ? ((snap.data().items as CartItem[]) || []) : []);
  });
}
export async function saveCart(tableNumber: string, items: CartItem[]) {
  await setDoc(doc(db(), "carts", tableNumber), { items, updatedAt: Date.now() });
}

// ---------- Tables ----------
export async function fetchTables(): Promise<Table[]> {
  try {
    const snap = await getDocs(collection(db(), "tables"));
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  } catch { return []; }
}
export async function upsertTable(t: Table) {
  await setDoc(doc(db(), "tables", t.id), { number: t.number, label: t.label || "" });
}
export async function deleteTable(id: string) {
  await deleteDoc(doc(db(), "tables", id));
}
