"use client";
import { useEffect, useState } from "react";
import { Category, MenuItem } from "@/types";
import { fetchCategories, fetchItems, upsertCategory, upsertItem, deleteCategory, deleteItem } from "@/lib/menuService";
import toast from "react-hot-toast";
import { CURRENCY } from "@/lib/firebase";
import { Plus, Trash2 } from "lucide-react";

export default function AdminMenu() {
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const reload = async () => {
    setCats((await fetchCategories()).sort((a, b) => a.order - b.order));
    setItems(await fetchItems());
  };
  useEffect(() => { reload(); }, []);

  const newItem = (): MenuItem => ({
    id: "yeni-" + Date.now(),
    categoryId: cats[0]?.id || "",
    name: { tr: "", en: "" },
    description: { tr: "", en: "" },
    price: 0, available: true
  });
  const newCat = (): Category => ({ id: "kategori-" + Date.now(), name: { tr: "", en: "" }, order: cats.length + 1 });

  const saveItem = async () => {
    if (!editing) return;
    try { await upsertItem(editing); toast.success("Kaydedildi"); setEditing(null); reload(); }
    catch (e: any) { toast.error(e.message); }
  };
  const saveCat = async () => {
    if (!editingCat) return;
    try { await upsertCategory(editingCat); toast.success("Kaydedildi"); setEditingCat(null); reload(); }
    catch (e: any) { toast.error(e.message); }
  };
  const removeItem = async (id: string) => {
    if (!confirm("Silinsin mi?")) return;
    await deleteItem(id); reload();
  };
  const removeCat = async (id: string) => {
    if (!confirm("Kategori silinsin mi?")) return;
    await deleteCategory(id); reload();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Categories */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="serif text-lg text-coffee-800">Kategoriler</h2>
          <button onClick={() => setEditingCat(newCat())} className="btn-ghost"><Plus size={14} /> Yeni</button>
        </div>
        <div className="space-y-2">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-coffee-50">
              <button onClick={() => setEditingCat(c)} className="text-left flex-1 text-coffee-700">
                {c.icon} {c.name.tr} <span className="text-xs text-coffee-400">/ {c.name.en}</span>
              </button>
              <button onClick={() => removeCat(c.id)} className="text-coffee-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="lg:col-span-2 card p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="serif text-lg text-coffee-800">Ürünler</h2>
          <button onClick={() => setEditing(newItem())} className="btn-ghost"><Plus size={14} /> Yeni</button>
        </div>
        <div className="space-y-2">
          {items.map((i) => {
            const cat = cats.find((c) => c.id === i.categoryId);
            return (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-coffee-50">
                <button onClick={() => setEditing(i)} className="text-left flex-1">
                  <p className="text-coffee-800">{i.name.tr} <span className="text-xs text-coffee-400">/ {i.name.en}</span></p>
                  <p className="text-xs text-coffee-500">{cat?.name.tr} · {CURRENCY}{i.price} · {i.available ? "Aktif" : "Pasif"}</p>
                </button>
                <button onClick={() => removeItem(i.id)} className="text-coffee-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item modal */}
      {editing && (
        <Modal onClose={() => setEditing(null)} title="Ürün">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ad (TR)"><input className="input" value={editing.name.tr} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, tr: e.target.value } })} /></Field>
            <Field label="Ad (EN)"><input className="input" value={editing.name.en} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })} /></Field>
            <Field label="Açıklama (TR)"><input className="input" value={editing.description.tr} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, tr: e.target.value } })} /></Field>
            <Field label="Açıklama (EN)"><input className="input" value={editing.description.en} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })} /></Field>
            <Field label="Fiyat"><input type="number" className="input" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            <Field label="Kategori">
              <select className="input" value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name.tr}</option>)}
              </select>
            </Field>
            <Field label="Görsel URL"><input className="input" value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></Field>
            <Field label="Hazırlama (dk)"><input type="number" className="input" value={editing.prepMinutes || 0} onChange={(e) => setEditing({ ...editing, prepMinutes: Number(e.target.value) })} /></Field>
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} /> Aktif</label>
            <label className="flex items-center gap-2 col-span-2"><input type="checkbox" checked={!!editing.popular} onChange={(e) => setEditing({ ...editing, popular: e.target.checked })} /> Popüler</label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="btn-ghost">İptal</button>
            <button onClick={saveItem} className="btn-primary">Kaydet</button>
          </div>
        </Modal>
      )}

      {/* Cat modal */}
      {editingCat && (
        <Modal onClose={() => setEditingCat(null)} title="Kategori">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ad (TR)"><input className="input" value={editingCat.name.tr} onChange={(e) => setEditingCat({ ...editingCat, name: { ...editingCat.name, tr: e.target.value } })} /></Field>
            <Field label="Ad (EN)"><input className="input" value={editingCat.name.en} onChange={(e) => setEditingCat({ ...editingCat, name: { ...editingCat.name, en: e.target.value } })} /></Field>
            <Field label="Sıra"><input type="number" className="input" value={editingCat.order} onChange={(e) => setEditingCat({ ...editingCat, order: Number(e.target.value) })} /></Field>
            <Field label="İkon (emoji)"><input className="input" value={editingCat.icon || ""} onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })} /></Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditingCat(null)} className="btn-ghost">İptal</button>
            <button onClick={saveCat} className="btn-primary">Kaydet</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label><div className="mt-1">{children}</div></div>;
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-coffee-900/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="serif text-xl text-coffee-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}
