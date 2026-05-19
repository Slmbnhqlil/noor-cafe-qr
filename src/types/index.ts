export type Lang = "tr" | "en";

export type Category = {
  id: string;
  name: { tr: string; en: string };
  order: number;
  icon?: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  price: number;
  image?: string;
  available: boolean;
  popular?: boolean;
  allergens?: string[];
  prepMinutes?: number;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  image?: string;
};

export type OrderStatus =
  | "new"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  note?: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  customerName?: string;
  phone?: string;
};

export type Table = {
  id: string;
  number: string;
  label?: string;
};
