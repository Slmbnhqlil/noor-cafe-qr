import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp, where
} from "firebase/firestore";
import { db } from "./firebase";
import { Category, MenuItem, Order, OrderStatus, Table } from "@/types";
import { seedCategories, seedItems } from "@/data/seedMenu";

// ---------- Read ----------
export async function fetchCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(query(collection(db(), "categories"), orderBy("order", "asc")));
    if (snap.empty) return seedCategories;
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }));
  } catch {
    return seedCategories;
  }
}

export async function fetchItems(): Promise<MenuItem[]> {
  try {
    const snap = await getDocs(collection(db(), "menuItems"));
    if (snap.empty) return seedItems;
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MenuItem, "id">) }));
  } catch {
    return seedItems;
  }
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

// ---------- Seed ----------
export async function seedIfEmpty() {
  const cats = await getDocs(collection(db(), "categories"));
  if (cats.empty) {
    for (const c of seedCategories) await upsertCategory(c);
  }
  const items = await getDocs(collection(db(), "menuItems"));
  if (items.empty) {
    for (const it of seedItems) await upsertItem(it);
  }
}

// ---------- Orders ----------
export async function createOrder(o: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">): Promise<string> {
  const ref = await addDoc(collection(db(), "orders"), {
    ...o, status: "new" as OrderStatus, createdAt: Date.now(), updatedAt: Date.now()
  });
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
