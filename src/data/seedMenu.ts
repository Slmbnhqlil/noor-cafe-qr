import { Category, MenuItem } from "@/types";

export const seedCategories: Category[] = [
  { id: "atistirmaliklar",  name: { tr: "Atıştırmalıklar",     en: "Snacks" },           order: 1,  icon: "🍔" },
  { id: "ara-sicaklar",     name: { tr: "Ara Sıcaklar",        en: "Hot Bites" },        order: 2,  icon: "🍳" },
  { id: "kahvalti",         name: { tr: "Kahvaltı",            en: "Breakfast" },        order: 3,  icon: "🥞" },
  { id: "alakart-kahvalti", name: { tr: "Alakart Kahvaltı",    en: "À la Carte" },       order: 4,  icon: "🧀" },
  { id: "rezervasyon",      name: { tr: "Rezervasyon Menüsü",  en: "Reservation Menu" }, order: 5,  icon: "📖" },
  { id: "sicak-icecekler",  name: { tr: "Sıcak İçecekler",     en: "Hot Drinks" },       order: 6,  icon: "☕" },
  { id: "soguk-icecekler",  name: { tr: "Soğuk İçecekler",     en: "Cold Drinks" },      order: 7,  icon: "🧊" },
  { id: "tatlilar",         name: { tr: "Tatlılar",            en: "Desserts" },         order: 8,  icon: "🍰" },
  { id: "ozel",             name: { tr: "Özel",                en: "Specials" },         order: 9,  icon: "✨" }
];

// helper
const item = (
  id: string,
  categoryId: string,
  tr: string,
  en: string,
  price: number,
  descTr = "",
  descEn = "",
  extra: Partial<MenuItem> = {}
): MenuItem => ({
  id,
  categoryId,
  name: { tr, en },
  description: { tr: descTr, en: descEn },
  price,
  available: true,
  ...extra
});

export const seedItems: MenuItem[] = [
  // ───── Atıştırmalıklar ─────
  item("kofte", "atistirmaliklar", "Köfte", "Meatballs", 600, "Yanında patates kızartması ve söğüş ile servis edilir", "Served with fries and salad", { popular: true }),
  item("manti", "atistirmaliklar", "Mantı", "Mantı", 600, "Üstünde yoğurt ve sosu ile servis edilir", "Served with yogurt and sauce"),
  item("citir-manti", "atistirmaliklar", "Çıtır Mantı", "Crispy Mantı", 600, "Üstünde yoğurt ve sosu ile servis edilir", "Served with yogurt and sauce"),
  item("hamburger", "atistirmaliklar", "Hamburger", "Hamburger", 600, "Yanında patates kızartması ile servis edilir", "Served with fries"),
  item("gozleme", "atistirmaliklar", "Gözleme", "Gözleme", 400, "Peynirli, Ispanaklı, Patatesli, Kaşarlı (Kıymalı +40₺)", "Cheese, Spinach, Potato, Cheddar (Minced +40₺)"),
  item("bazlama-tost", "atistirmaliklar", "Bazlama Tost", "Bazlama Toast", 450, "İçinde sucuk, kaşar; yanında patates ve söğüş", "With sausage and cheddar, served with fries and salad"),
  item("hindi-fumeli-tost", "atistirmaliklar", "Hindi Fümeli Tost", "Smoked Turkey Toast", 450, "İçinde hindi füme, kaşar; yanında patates ve söğüş", "Smoked turkey & cheddar, with fries and salad"),
  item("kasarli-tost", "atistirmaliklar", "Kaşarlı Tost", "Cheddar Toast", 450, "Yanında patates ve söğüş ile servis edilir", "Served with fries and salad"),
  item("karisik-tost", "atistirmaliklar", "Karışık Tost", "Mixed Toast", 450, "İçinde sucuk, kaşar; yanında patates ve söğüş", "Sausage & cheddar, with fries and salad"),
  item("haslama-icli-kofte", "atistirmaliklar", "Haşlama İçli Köfte (3 adet)", "Boiled Stuffed Köfte (3 pcs)", 600, "Üstünde soslu ve yoğurtlu şekilde servis edilir", "Served with sauce and yogurt"),
  item("icli-kofte", "atistirmaliklar", "İçli Köfte", "Stuffed Köfte", 160, "Tek adet içli köfte olarak servis edilir", "Single piece"),

  // ───── Ara Sıcaklar ─────
  item("patates-kizartmasi", "ara-sicaklar", "Patates Kızartması", "French Fries", 200),
  item("sigara-boregi", "ara-sicaklar", "Sigara Böreği (6 adet)", "Cigar Börek (6 pcs)", 250),
  item("pisi", "ara-sicaklar", "Pişi (2 adet)", "Pişi (2 pcs)", 200),
  item("omlet", "ara-sicaklar", "Omlet", "Omelet", 200),
  item("pacanga", "ara-sicaklar", "Paçanga", "Pastrami Roll", 160),
  item("sahanda-yumurta", "ara-sicaklar", "Sahanda Yumurta (2y.)", "Fried Eggs (2)", 225),
  item("kavurmali-yumurta", "ara-sicaklar", "Kavurmalı Yumurta", "Eggs with Kavurma", 375),
  item("sucuklu-yumurta", "ara-sicaklar", "Sucuklu Yumurta", "Eggs with Sausage", 350),
  item("sucuk-tava", "ara-sicaklar", "Sucuk Tava", "Pan Sausage", 300),
  item("kavurma", "ara-sicaklar", "Kavurma", "Kavurma", 300),
  item("menemen", "ara-sicaklar", "Menemen", "Menemen", 275),
  item("muhlama", "ara-sicaklar", "Muhlama", "Muhlama", 350),
  item("pogaca", "ara-sicaklar", "Poğaça", "Poğaça", 120),
  item("kurabiye", "ara-sicaklar", "Kurabiye", "Cookie", 120),
  item("kek", "ara-sicaklar", "Kek", "Cake Slice", 120),
  item("borek", "ara-sicaklar", "Börek", "Börek", 120),
  item("elmali-kurabiye-as", "ara-sicaklar", "Elmalı Kurabiye", "Apple Cookie", 120),

  // ───── Kahvaltı ─────
  item("serpme-kahvalti", "kahvalti", "Serpme Kahvaltı (2 kişilik)", "Breakfast Platter (for 2)", 1800,
    "Kaşar, beyaz peynir, tulum peyniri, çeçil peyniri, tereyağı, tahin-pekmez, bal, kaymak, nutella, söğüş, siyah-yeşil zeytin, reçel, acuka, pişi, sucuk tava, menemen, patates, sigara böreği, kızartma tabağı, sınırsız çay",
    "Cheeses, butter, tahini-molasses, honey, kaymak, nutella, olives, jam, acuka, pişi, sausage, menemen, potatoes, börek, unlimited tea",
    { popular: true, prepMinutes: 15 }),

  // ───── Alakart Kahvaltı ─────
  item("ak-kasar",      "alakart-kahvalti", "Kaşar",                "Cheddar Cheese",        90),
  item("ak-beyaz",      "alakart-kahvalti", "Beyaz Peynir",         "White Cheese",          90),
  item("ak-cecil",      "alakart-kahvalti", "Çeçil Peyniri",        "Çeçil Cheese",          90),
  item("ak-nutella",    "alakart-kahvalti", "Nutella",              "Nutella",               90),
  item("ak-recel",      "alakart-kahvalti", "Reçel Çeşitleri",      "Assorted Jams",         90),
  item("ak-acuka",      "alakart-kahvalti", "Acuka",                "Acuka",                 90),
  item("ak-tulum",      "alakart-kahvalti", "Tulum Peyniri",        "Tulum Cheese",          90),
  item("ak-tereyagi",   "alakart-kahvalti", "Tereyağı",             "Butter",                90),
  item("ak-tahin",      "alakart-kahvalti", "Tahin-Pekmez",         "Tahini-Molasses",       90),
  item("ak-bal",        "alakart-kahvalti", "Bal",                  "Honey",                 90),
  item("ak-kaymak",     "alakart-kahvalti", "Kaymak",               "Clotted Cream",         90),
  item("ak-zeytin",     "alakart-kahvalti", "Siyah-Yeşil Zeytin",   "Olives (Black-Green)",  90),
  item("ak-sogus",      "alakart-kahvalti", "Söğüş",                "Fresh Vegetables",     120),
  item("ak-termos-cay", "alakart-kahvalti", "Termos Çay",           "Thermos Tea",          350),

  // ───── Rezervasyon Menüsü ─────
  item("rez-menu", "rezervasyon", "Rezervasyon Menüsü (Kişi başı)", "Reservation Menu (per person)", 900,
    "5 çeşit beş çayı ürünü; sınırsız çay ile birlikte. Günün böreği/poğaçası, günün keki, günün kurabiyesi, günün salatası, sarma. Rezervasyon ile çalışıyoruz, önceden arayınız: +90 533 721 65 18",
    "5 afternoon tea items with unlimited tea. By reservation only — please call ahead.",
    { prepMinutes: 20 }),

  // ───── Sıcak İçecekler ─────
  item("turk-kahvesi", "sicak-icecekler", "Türk Kahvesi", "Turkish Coffee", 160, "", "", { popular: true, prepMinutes: 7 }),
  item("duble-turk-kahvesi", "sicak-icecekler", "Duble Türk Kahvesi", "Double Turkish Coffee", 220, "", "", { prepMinutes: 7 }),
  item("fistikli-turk-kahvesi", "sicak-icecekler", "Fıstıklı Türk Kahvesi", "Pistachio Turkish Coffee", 200, "", "", { prepMinutes: 7 }),
  item("duble-fistikli-turk-kahvesi", "sicak-icecekler", "Duble Fıstıklı Türk Kahvesi", "Double Pistachio Turkish Coffee", 260, "", "", { prepMinutes: 7 }),
  item("findikli-turk-kahvesi", "sicak-icecekler", "Fındıklı Türk Kahvesi", "Hazelnut Turkish Coffee", 200, "", "", { prepMinutes: 7 }),
  item("duble-findikli-turk-kahvesi", "sicak-icecekler", "Duble Fındıklı Türk Kahvesi", "Double Hazelnut Turkish Coffee", 260, "", "", { prepMinutes: 7 }),
  item("filtre-kahve", "sicak-icecekler", "Filtre Kahve", "Filter Coffee", 200, "Günün çekirdeği", "Bean of the day", { prepMinutes: 4 }),
  item("espresso", "sicak-icecekler", "Espresso", "Espresso", 175, "Tek shot", "Single shot", { prepMinutes: 3 }),
  item("double-espresso", "sicak-icecekler", "Double Espresso", "Double Espresso", 230, "Çift shot", "Double shot", { prepMinutes: 3 }),
  item("cappuccino", "sicak-icecekler", "Cappuccino", "Cappuccino", 250, "", "", { popular: true, prepMinutes: 5 }),
  item("americano", "sicak-icecekler", "Americano", "Americano", 225, "", "", { prepMinutes: 4 }),
  item("ice-americano", "sicak-icecekler", "Ice Americano", "Iced Americano", 240, "", "", { prepMinutes: 4 }),
  item("latte", "sicak-icecekler", "Latte", "Latte", 225, "", "", { popular: true, prepMinutes: 5 }),
  item("ice-latte", "sicak-icecekler", "Ice Latte", "Iced Latte", 240, "", "", { prepMinutes: 4 }),
  item("cafe-cream", "sicak-icecekler", "Cafe Cream", "Cafe Cream", 250, "", "", { prepMinutes: 5 }),
  item("flat-white", "sicak-icecekler", "Flat White", "Flat White", 250, "", "", { prepMinutes: 5 }),
  item("nescafe", "sicak-icecekler", "Nescafe", "Nescafe", 200),
  item("sutlu-nescafe", "sicak-icecekler", "Sütlü Nescafe", "Nescafe with Milk", 250),
  item("sicak-cikolata", "sicak-icecekler", "Sıcak Çikolata", "Hot Chocolate", 250, "", "", { prepMinutes: 5 }),
  item("ihlamur", "sicak-icecekler", "Ihlamur", "Linden Tea", 270),
  item("cay", "sicak-icecekler", "Çay", "Black Tea", 60, "İnce belli bardakta", "In tulip glass", { prepMinutes: 2 }),
  item("duble-cay", "sicak-icecekler", "Duble Çay", "Double Tea", 80),
  item("kis-cayi", "sicak-icecekler", "Kış Çayı", "Winter Tea", 250),
  item("gul-cayi", "sicak-icecekler", "Gül Çayı", "Rose Tea", 250),
  item("elma-cayi", "sicak-icecekler", "Elma Çayı", "Apple Tea", 250),
  item("nar-cayi", "sicak-icecekler", "Nar Çayı", "Pomegranate Tea", 250),
  item("salep", "sicak-icecekler", "Salep", "Salep", 270, "", "", { prepMinutes: 5 }),
  item("termos-cay", "sicak-icecekler", "Termos Çay", "Thermos Tea", 350),
  item("sut", "sicak-icecekler", "Süt", "Milk", 125),

  // ───── Soğuk İçecekler ─────
  item("sariyer-kola", "soguk-icecekler", "Sarıyer Kola", "Sarıyer Cola", 130),
  item("sariyer-kola-sekersiz", "soguk-icecekler", "Sarıyer Kola Şekersiz", "Sarıyer Cola Sugar-Free", 130),
  item("sariyer-portakalli-gazoz", "soguk-icecekler", "Sarıyer Portakallı Gazoz", "Sarıyer Orange Soda", 130),
  item("nigde-gazozu", "soguk-icecekler", "Niğde Gazozu", "Niğde Soda", 130),
  item("didi-soguk-cay-seftali", "soguk-icecekler", "Didi Soğuk Çay Şeftali", "Didi Iced Tea Peach", 130),
  item("didi-soguk-cay-limon", "soguk-icecekler", "Didi Soğuk Çay Limon", "Didi Iced Tea Lemon", 130),
  item("dimes-seftali", "soguk-icecekler", "Dimes Şeftali", "Dimes Peach Juice", 130),
  item("dimes-visne", "soguk-icecekler", "Dimes Vişne", "Dimes Sour Cherry Juice", 130),
  item("dimes-kayisi", "soguk-icecekler", "Dimes Kayısı", "Dimes Apricot Juice", 130),
  item("dimes-karisik", "soguk-icecekler", "Dimes Karışık", "Dimes Mixed Juice", 130),
  item("limonata", "soguk-icecekler", "Limonata (ev yapımı)", "Homemade Lemonade", 250, "Taze sıkılmış, naneli", "Fresh-squeezed with mint", { popular: true, prepMinutes: 3 }),
  item("uzum-suyu", "soguk-icecekler", "Üzüm Suyu (ev yapımı)", "Homemade Grape Juice", 250, "", "", { prepMinutes: 3 }),
  item("ayran", "soguk-icecekler", "Ayran", "Ayran", 130),
  item("soda", "soguk-icecekler", "Soda", "Sparkling Water", 100),
  item("churchill", "soguk-icecekler", "Churchill", "Churchill", 150),
  item("kucuk-su", "soguk-icecekler", "Küçük Su", "Small Water", 60),
  item("buyuk-su", "soguk-icecekler", "Büyük Su", "Large Water", 100),

  // ───── Tatlılar ─────
  item("antep-fistikli-marlenka", "tatlilar", "Antep Fıstıklı Marlenka", "Pistachio Marlenka", 350, "", "", { popular: true, allergens: ["süt", "gluten", "fıstık"] }),
  item("limonlu-cheesecake", "tatlilar", "Limonlu Cheesecake", "Lemon Cheesecake", 300, "", "", { allergens: ["süt", "gluten", "yumurta"] }),
  item("frambuazli-cheesecake", "tatlilar", "Frambuazlı Cheesecake", "Raspberry Cheesecake", 300, "", "", { allergens: ["süt", "gluten", "yumurta"] }),
  item("belcika-cikolatali-browni", "tatlilar", "Belçika Çikolatalı Browni", "Belgian Chocolate Brownie", 350, "", "", { popular: true, allergens: ["süt", "gluten", "yumurta"] }),
  item("manhattan-snickers", "tatlilar", "Manhattan Snickers Pasta", "Manhattan Snickers Cake", 300, "", "", { allergens: ["süt", "gluten", "fıstık"] }),
  item("lotus-pasta", "tatlilar", "Lotus Pasta", "Lotus Cake", 300, "", "", { allergens: ["süt", "gluten"] }),
  item("mozaik-pasta", "tatlilar", "Mozaik Pasta", "Mosaic Cake", 300, "", "", { allergens: ["süt", "gluten"] }),
  item("belcika-cikolatali-sufle", "tatlilar", "Belçika Çikolatalı Sufle", "Belgian Chocolate Soufflé", 350, "", "", { allergens: ["süt", "gluten", "yumurta"], prepMinutes: 10 }),
  item("dondurma-dilim", "tatlilar", "Dondurma Dilim", "Ice Cream Slice", 125, "", "", { allergens: ["süt"] }),
  item("elmali-kurabiye", "tatlilar", "Elmalı Kurabiye", "Apple Cookie", 120, "", "", { allergens: ["gluten"] }),

  // ───── Özel ─────
  item("haftasonu-waffle", "ozel", "Haftasonuna Özel Waffle", "Weekend Special Waffle", 380, "Sadece hafta sonu", "Weekends only", { popular: true, allergens: ["süt", "gluten", "yumurta"], prepMinutes: 10 })
];
