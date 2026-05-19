import { Category, MenuItem } from "@/types";

export const seedCategories: Category[] = [
  { id: "kahveler", name: { tr: "Kahveler", en: "Coffee" }, order: 1, icon: "☕" },
  { id: "soguk-icecekler", name: { tr: "Soğuk İçecekler", en: "Cold Drinks" }, order: 2, icon: "🧊" },
  { id: "caylar", name: { tr: "Çaylar", en: "Teas" }, order: 3, icon: "🍵" },
  { id: "tatlilar", name: { tr: "Tatlılar", en: "Desserts" }, order: 4, icon: "🍰" },
  { id: "atistirmaliklar", name: { tr: "Atıştırmalıklar", en: "Snacks" }, order: 5, icon: "🥐" },
  { id: "kahvalti", name: { tr: "Kahvaltı", en: "Breakfast" }, order: 6, icon: "🍳" }
];

export const seedItems: MenuItem[] = [
  {
    id: "turk-kahvesi",
    categoryId: "kahveler",
    name: { tr: "Türk Kahvesi", en: "Turkish Coffee" },
    description: { tr: "Geleneksel közde pişen Türk kahvesi", en: "Traditional Turkish coffee on ember" },
    price: 75, available: true, popular: true, prepMinutes: 7
  },
  {
    id: "espresso",
    categoryId: "kahveler",
    name: { tr: "Espresso", en: "Espresso" },
    description: { tr: "Tek shot, %100 arabica", en: "Single shot, 100% arabica" },
    price: 70, available: true, prepMinutes: 3
  },
  {
    id: "latte",
    categoryId: "kahveler",
    name: { tr: "Latte", en: "Latte" },
    description: { tr: "Espresso ve buharlanmış süt", en: "Espresso with steamed milk" },
    price: 95, available: true, popular: true, prepMinutes: 5
  },
  {
    id: "filtre-kahve",
    categoryId: "kahveler",
    name: { tr: "Filtre Kahve", en: "Filter Coffee" },
    description: { tr: "Günün çekirdeği", en: "Bean of the day" },
    price: 80, available: true, prepMinutes: 4
  },
  {
    id: "ice-latte",
    categoryId: "soguk-icecekler",
    name: { tr: "Ice Latte", en: "Iced Latte" },
    description: { tr: "Buzlu sütlü espresso", en: "Iced milk espresso" },
    price: 105, available: true, prepMinutes: 4
  },
  {
    id: "limonata",
    categoryId: "soguk-icecekler",
    name: { tr: "Ev Yapımı Limonata", en: "Homemade Lemonade" },
    description: { tr: "Naneli, taze sıkılmış", en: "Fresh-squeezed with mint" },
    price: 85, available: true, popular: true, prepMinutes: 3
  },
  {
    id: "demli-cay",
    categoryId: "caylar",
    name: { tr: "Demli Çay", en: "Black Tea" },
    description: { tr: "İnce belli bardakta", en: "In tulip glass" },
    price: 25, available: true, prepMinutes: 2
  },
  {
    id: "yesil-cay",
    categoryId: "caylar",
    name: { tr: "Yeşil Çay", en: "Green Tea" },
    description: { tr: "Sencha yaprağı", en: "Sencha leaf" },
    price: 55, available: true, prepMinutes: 3
  },
  {
    id: "cheesecake",
    categoryId: "tatlilar",
    name: { tr: "San Sebastian Cheesecake", en: "San Sebastian Cheesecake" },
    description: { tr: "Yanık yüzeyli krem peynirli", en: "Burnt top, creamy" },
    price: 145, available: true, popular: true, allergens: ["süt", "gluten", "yumurta"] },
  {
    id: "browni",
    categoryId: "tatlilar",
    name: { tr: "Çikolatalı Browni", en: "Chocolate Brownie" },
    description: { tr: "Sıcak sosla servis", en: "Served with warm sauce" },
    price: 125, available: true, allergens: ["süt", "gluten", "yumurta"] },
  {
    id: "croissant",
    categoryId: "atistirmaliklar",
    name: { tr: "Tereyağlı Kruvasan", en: "Butter Croissant" },
    description: { tr: "Günlük taze pişen", en: "Freshly baked daily" },
    price: 70, available: true, allergens: ["süt", "gluten"] },
  {
    id: "kahvalti-tabagi",
    categoryId: "kahvalti",
    name: { tr: "Serpme Kahvaltı (2 kişilik)", en: "Breakfast Platter (for 2)" },
    description: { tr: "Peynirler, zeytinler, reçeller, omlet, ekmek, çay dahil", en: "Cheeses, olives, jams, omelet, bread, tea included" },
    price: 650, available: true, popular: true, prepMinutes: 15
  }
];
