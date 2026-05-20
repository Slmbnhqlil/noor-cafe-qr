// Tek seferlik: menüyü Firestore'a yükler.
// Çalıştır: node scripts/seed.mjs
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";

// .env.local'i basitçe oku
const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
});
const db = getFirestore(app);

const categories = [
  { id: "atistirmaliklar",  name: { tr: "Atıştırmalıklar",     en: "Snacks" },           order: 1, icon: "🍔" },
  { id: "ara-sicaklar",     name: { tr: "Ara Sıcaklar",        en: "Hot Bites" },        order: 2, icon: "🍳" },
  { id: "kahvalti",         name: { tr: "Kahvaltı",            en: "Breakfast" },        order: 3, icon: "🥞" },
  { id: "alakart-kahvalti", name: { tr: "Alakart Kahvaltı",    en: "À la Carte" },       order: 4, icon: "🧀" },
  { id: "rezervasyon",      name: { tr: "Rezervasyon Menüsü",  en: "Reservation Menu" }, order: 5, icon: "📖" },
  { id: "sicak-icecekler",  name: { tr: "Sıcak İçecekler",     en: "Hot Drinks" },       order: 6, icon: "☕" },
  { id: "soguk-icecekler",  name: { tr: "Soğuk İçecekler",     en: "Cold Drinks" },      order: 7, icon: "🧊" },
  { id: "tatlilar",         name: { tr: "Tatlılar",            en: "Desserts" },         order: 8, icon: "🍰" },
  { id: "ozel",             name: { tr: "Özel",                en: "Specials" },         order: 9, icon: "✨" }
];

const it = (id, categoryId, tr, en, price, descTr = "", descEn = "", extra = {}) => ({
  id, categoryId, name: { tr, en }, description: { tr: descTr, en: descEn }, price, available: true, ...extra
});

const items = [
  it("kofte", "atistirmaliklar", "Köfte", "Meatballs", 600, "Yanında patates kızartması ve söğüş ile servis edilir", "Served with fries and salad", { popular: true }),
  it("manti", "atistirmaliklar", "Mantı", "Mantı", 600, "Üstünde yoğurt ve sosu ile servis edilir", "Served with yogurt and sauce"),
  it("citir-manti", "atistirmaliklar", "Çıtır Mantı", "Crispy Mantı", 600, "Üstünde yoğurt ve sosu ile servis edilir", "Served with yogurt and sauce"),
  it("hamburger", "atistirmaliklar", "Hamburger", "Hamburger", 600, "Yanında patates kızartması ile servis edilir", "Served with fries"),
  it("gozleme", "atistirmaliklar", "Gözleme", "Gözleme", 400, "Peynirli, Ispanaklı, Patatesli, Kaşarlı (Kıymalı +40₺)", "Cheese, Spinach, Potato, Cheddar (Minced +40₺)"),
  it("bazlama-tost", "atistirmaliklar", "Bazlama Tost", "Bazlama Toast", 450, "İçinde sucuk, kaşar; yanında patates ve söğüş", "With sausage and cheddar, served with fries and salad"),
  it("hindi-fumeli-tost", "atistirmaliklar", "Hindi Fümeli Tost", "Smoked Turkey Toast", 450, "İçinde hindi füme, kaşar; yanında patates ve söğüş", "Smoked turkey & cheddar, with fries and salad"),
  it("kasarli-tost", "atistirmaliklar", "Kaşarlı Tost", "Cheddar Toast", 450, "Yanında patates ve söğüş ile servis edilir", "Served with fries and salad"),
  it("karisik-tost", "atistirmaliklar", "Karışık Tost", "Mixed Toast", 450, "İçinde sucuk, kaşar; yanında patates ve söğüş", "Sausage & cheddar, with fries and salad"),
  it("haslama-icli-kofte", "atistirmaliklar", "Haşlama İçli Köfte (3 adet)", "Boiled Stuffed Köfte (3 pcs)", 600, "Üstünde soslu ve yoğurtlu şekilde servis edilir", "Served with sauce and yogurt"),
  it("icli-kofte", "atistirmaliklar", "İçli Köfte", "Stuffed Köfte", 160, "Tek adet içli köfte olarak servis edilir", "Single piece"),

  it("patates-kizartmasi", "ara-sicaklar", "Patates Kızartması", "French Fries", 200),
  it("sigara-boregi", "ara-sicaklar", "Sigara Böreği (6 adet)", "Cigar Börek (6 pcs)", 250),
  it("pisi", "ara-sicaklar", "Pişi (2 adet)", "Pişi (2 pcs)", 200),
  it("omlet", "ara-sicaklar", "Omlet", "Omelet", 200),
  it("pacanga", "ara-sicaklar", "Paçanga", "Pastrami Roll", 160),
  it("sahanda-yumurta", "ara-sicaklar", "Sahanda Yumurta (2y.)", "Fried Eggs (2)", 225),
  it("kavurmali-yumurta", "ara-sicaklar", "Kavurmalı Yumurta", "Eggs with Kavurma", 375),
  it("sucuklu-yumurta", "ara-sicaklar", "Sucuklu Yumurta", "Eggs with Sausage", 350),
  it("sucuk-tava", "ara-sicaklar", "Sucuk Tava", "Pan Sausage", 300),
  it("kavurma", "ara-sicaklar", "Kavurma", "Kavurma", 300),
  it("menemen", "ara-sicaklar", "Menemen", "Menemen", 275),
  it("muhlama", "ara-sicaklar", "Muhlama", "Muhlama", 350),
  it("pogaca", "ara-sicaklar", "Poğaça", "Poğaça", 120),
  it("kurabiye", "ara-sicaklar", "Kurabiye", "Cookie", 120),
  it("kek", "ara-sicaklar", "Kek", "Cake Slice", 120),
  it("borek", "ara-sicaklar", "Börek", "Börek", 120),
  it("elmali-kurabiye-as", "ara-sicaklar", "Elmalı Kurabiye", "Apple Cookie", 120),

  it("serpme-kahvalti", "kahvalti", "Serpme Kahvaltı (2 kişilik)", "Breakfast Platter (for 2)", 1800,
    "Kaşar, beyaz peynir, tulum peyniri, çeçil peyniri, tereyağı, tahin-pekmez, bal, kaymak, nutella, söğüş, siyah-yeşil zeytin, reçel, acuka, pişi, sucuk tava, menemen, patates, sigara böreği, kızartma tabağı, sınırsız çay",
    "Cheeses, butter, tahini-molasses, honey, kaymak, nutella, olives, jam, acuka, pişi, sausage, menemen, potatoes, börek, unlimited tea",
    { popular: true, prepMinutes: 15 }),

  it("ak-kasar", "alakart-kahvalti", "Kaşar", "Cheddar Cheese", 90),
  it("ak-beyaz", "alakart-kahvalti", "Beyaz Peynir", "White Cheese", 90),
  it("ak-cecil", "alakart-kahvalti", "Çeçil Peyniri", "Çeçil Cheese", 90),
  it("ak-nutella", "alakart-kahvalti", "Nutella", "Nutella", 90),
  it("ak-recel", "alakart-kahvalti", "Reçel Çeşitleri", "Assorted Jams", 90),
  it("ak-acuka", "alakart-kahvalti", "Acuka", "Acuka", 90),
  it("ak-tulum", "alakart-kahvalti", "Tulum Peyniri", "Tulum Cheese", 90),
  it("ak-tereyagi", "alakart-kahvalti", "Tereyağı", "Butter", 90),
  it("ak-tahin", "alakart-kahvalti", "Tahin-Pekmez", "Tahini-Molasses", 90),
  it("ak-bal", "alakart-kahvalti", "Bal", "Honey", 90),
  it("ak-kaymak", "alakart-kahvalti", "Kaymak", "Clotted Cream", 90),
  it("ak-zeytin", "alakart-kahvalti", "Siyah-Yeşil Zeytin", "Olives (Black-Green)", 90),
  it("ak-sogus", "alakart-kahvalti", "Söğüş", "Fresh Vegetables", 120),
  it("ak-termos-cay", "alakart-kahvalti", "Termos Çay", "Thermos Tea", 350),

  it("rez-menu", "rezervasyon", "Rezervasyon Menüsü (Kişi başı)", "Reservation Menu (per person)", 900,
    "5 çeşit beş çayı ürünü; sınırsız çay ile birlikte. Günün böreği/poğaçası, günün keki, günün kurabiyesi, günün salatası, sarma. Rezervasyon ile çalışıyoruz, önceden arayınız: +90 533 721 65 18",
    "5 afternoon tea items with unlimited tea. By reservation only — please call ahead.", { prepMinutes: 20 }),

  it("turk-kahvesi", "sicak-icecekler", "Türk Kahvesi", "Turkish Coffee", 160, "", "", { popular: true, prepMinutes: 7 }),
  it("duble-turk-kahvesi", "sicak-icecekler", "Duble Türk Kahvesi", "Double Turkish Coffee", 220, "", "", { prepMinutes: 7 }),
  it("fistikli-turk-kahvesi", "sicak-icecekler", "Fıstıklı Türk Kahvesi", "Pistachio Turkish Coffee", 200, "", "", { prepMinutes: 7 }),
  it("duble-fistikli-turk-kahvesi", "sicak-icecekler", "Duble Fıstıklı Türk Kahvesi", "Double Pistachio Turkish Coffee", 260, "", "", { prepMinutes: 7 }),
  it("findikli-turk-kahvesi", "sicak-icecekler", "Fındıklı Türk Kahvesi", "Hazelnut Turkish Coffee", 200, "", "", { prepMinutes: 7 }),
  it("duble-findikli-turk-kahvesi", "sicak-icecekler", "Duble Fındıklı Türk Kahvesi", "Double Hazelnut Turkish Coffee", 260, "", "", { prepMinutes: 7 }),
  it("filtre-kahve", "sicak-icecekler", "Filtre Kahve", "Filter Coffee", 200, "Günün çekirdeği", "Bean of the day", { prepMinutes: 4 }),
  it("espresso", "sicak-icecekler", "Espresso", "Espresso", 175, "Tek shot", "Single shot", { prepMinutes: 3 }),
  it("double-espresso", "sicak-icecekler", "Double Espresso", "Double Espresso", 230, "Çift shot", "Double shot", { prepMinutes: 3 }),
  it("cappuccino", "sicak-icecekler", "Cappuccino", "Cappuccino", 250, "", "", { popular: true, prepMinutes: 5 }),
  it("americano", "sicak-icecekler", "Americano", "Americano", 225, "", "", { prepMinutes: 4 }),
  it("ice-americano", "sicak-icecekler", "Ice Americano", "Iced Americano", 240, "", "", { prepMinutes: 4 }),
  it("latte", "sicak-icecekler", "Latte", "Latte", 225, "", "", { popular: true, prepMinutes: 5 }),
  it("ice-latte", "sicak-icecekler", "Ice Latte", "Iced Latte", 240, "", "", { prepMinutes: 4 }),
  it("cafe-cream", "sicak-icecekler", "Cafe Cream", "Cafe Cream", 250, "", "", { prepMinutes: 5 }),
  it("flat-white", "sicak-icecekler", "Flat White", "Flat White", 250, "", "", { prepMinutes: 5 }),
  it("nescafe", "sicak-icecekler", "Nescafe", "Nescafe", 200),
  it("sutlu-nescafe", "sicak-icecekler", "Sütlü Nescafe", "Nescafe with Milk", 250),
  it("sicak-cikolata", "sicak-icecekler", "Sıcak Çikolata", "Hot Chocolate", 250, "", "", { prepMinutes: 5 }),
  it("ihlamur", "sicak-icecekler", "Ihlamur", "Linden Tea", 270),
  it("cay", "sicak-icecekler", "Çay", "Black Tea", 60, "İnce belli bardakta", "In tulip glass", { prepMinutes: 2 }),
  it("duble-cay", "sicak-icecekler", "Duble Çay", "Double Tea", 80),
  it("kis-cayi", "sicak-icecekler", "Kış Çayı", "Winter Tea", 250),
  it("gul-cayi", "sicak-icecekler", "Gül Çayı", "Rose Tea", 250),
  it("elma-cayi", "sicak-icecekler", "Elma Çayı", "Apple Tea", 250),
  it("nar-cayi", "sicak-icecekler", "Nar Çayı", "Pomegranate Tea", 250),
  it("salep", "sicak-icecekler", "Salep", "Salep", 270, "", "", { prepMinutes: 5 }),
  it("termos-cay", "sicak-icecekler", "Termos Çay", "Thermos Tea", 350),
  it("sut", "sicak-icecekler", "Süt", "Milk", 125),

  it("sariyer-kola", "soguk-icecekler", "Sarıyer Kola", "Sarıyer Cola", 130),
  it("sariyer-kola-sekersiz", "soguk-icecekler", "Sarıyer Kola Şekersiz", "Sarıyer Cola Sugar-Free", 130),
  it("sariyer-portakalli-gazoz", "soguk-icecekler", "Sarıyer Portakallı Gazoz", "Sarıyer Orange Soda", 130),
  it("nigde-gazozu", "soguk-icecekler", "Niğde Gazozu", "Niğde Soda", 130),
  it("didi-soguk-cay-seftali", "soguk-icecekler", "Didi Soğuk Çay Şeftali", "Didi Iced Tea Peach", 130),
  it("didi-soguk-cay-limon", "soguk-icecekler", "Didi Soğuk Çay Limon", "Didi Iced Tea Lemon", 130),
  it("dimes-seftali", "soguk-icecekler", "Dimes Şeftali", "Dimes Peach Juice", 130),
  it("dimes-visne", "soguk-icecekler", "Dimes Vişne", "Dimes Sour Cherry Juice", 130),
  it("dimes-kayisi", "soguk-icecekler", "Dimes Kayısı", "Dimes Apricot Juice", 130),
  it("dimes-karisik", "soguk-icecekler", "Dimes Karışık", "Dimes Mixed Juice", 130),
  it("limonata", "soguk-icecekler", "Limonata (ev yapımı)", "Homemade Lemonade", 250, "Taze sıkılmış, naneli", "Fresh-squeezed with mint", { popular: true, prepMinutes: 3 }),
  it("uzum-suyu", "soguk-icecekler", "Üzüm Suyu (ev yapımı)", "Homemade Grape Juice", 250, "", "", { prepMinutes: 3 }),
  it("ayran", "soguk-icecekler", "Ayran", "Ayran", 130),
  it("soda", "soguk-icecekler", "Soda", "Sparkling Water", 100),
  it("churchill", "soguk-icecekler", "Churchill", "Churchill", 150),
  it("kucuk-su", "soguk-icecekler", "Küçük Su", "Small Water", 60),
  it("buyuk-su", "soguk-icecekler", "Büyük Su", "Large Water", 100),

  it("antep-fistikli-marlenka", "tatlilar", "Antep Fıstıklı Marlenka", "Pistachio Marlenka", 350, "", "", { popular: true, allergens: ["süt", "gluten", "fıstık"] }),
  it("limonlu-cheesecake", "tatlilar", "Limonlu Cheesecake", "Lemon Cheesecake", 300, "", "", { allergens: ["süt", "gluten", "yumurta"] }),
  it("frambuazli-cheesecake", "tatlilar", "Frambuazlı Cheesecake", "Raspberry Cheesecake", 300, "", "", { allergens: ["süt", "gluten", "yumurta"] }),
  it("belcika-cikolatali-browni", "tatlilar", "Belçika Çikolatalı Browni", "Belgian Chocolate Brownie", 350, "", "", { popular: true, allergens: ["süt", "gluten", "yumurta"] }),
  it("manhattan-snickers", "tatlilar", "Manhattan Snickers Pasta", "Manhattan Snickers Cake", 300, "", "", { allergens: ["süt", "gluten", "fıstık"] }),
  it("lotus-pasta", "tatlilar", "Lotus Pasta", "Lotus Cake", 300, "", "", { allergens: ["süt", "gluten"] }),
  it("mozaik-pasta", "tatlilar", "Mozaik Pasta", "Mosaic Cake", 300, "", "", { allergens: ["süt", "gluten"] }),
  it("belcika-cikolatali-sufle", "tatlilar", "Belçika Çikolatalı Sufle", "Belgian Chocolate Soufflé", 350, "", "", { allergens: ["süt", "gluten", "yumurta"], prepMinutes: 10 }),
  it("dondurma-dilim", "tatlilar", "Dondurma Dilim", "Ice Cream Slice", 125, "", "", { allergens: ["süt"] }),
  it("elmali-kurabiye", "tatlilar", "Elmalı Kurabiye", "Apple Cookie", 120, "", "", { allergens: ["gluten"] }),

  it("haftasonu-waffle", "ozel", "Haftasonuna Özel Waffle", "Weekend Special Waffle", 380, "Sadece hafta sonu", "Weekends only", { popular: true, allergens: ["süt", "gluten", "yumurta"], prepMinutes: 10 })
];

async function run() {
  let b = writeBatch(db);
  let n = 0;
  for (const c of categories) {
    b.set(doc(db, "categories", c.id), { name: c.name, order: c.order, icon: c.icon });
    if (++n % 400 === 0) { await b.commit(); b = writeBatch(db); }
  }
  for (const i of items) {
    const { id, ...rest } = i;
    b.set(doc(db, "menuItems", id), rest);
    if (++n % 400 === 0) { await b.commit(); b = writeBatch(db); }
  }
  await b.commit();
  console.log(`✓ ${categories.length} kategori, ${items.length} ürün Firestore'a yüklendi.`);
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
