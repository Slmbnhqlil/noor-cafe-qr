# Noor Cafe — QR Menü & Sipariş

Sade, şık ve modern bir QR menü + sipariş uygulaması. Next.js 14 (App Router) + TypeScript + Tailwind + Firebase. Vercel’e tek tıkla deploy.

## Özellikler

**Müşteri tarafı**
- QR ile masaya gelen müşteri menüyü açar, masa numarası otomatik dolar (`/?masa=5`).
- Kategorilere göre filtreleme, arama, popüler etiketleri, alerjen bilgisi, tahmini hazırlık süresi.
- Sepet (LocalStorage’a kalıcı), miktar değiştirme, sipariş notu.
- Checkout: masa no, ad–telefon (isteğe bağlı), genel not.
- Gerçek zamanlı sipariş takibi (Firestore onSnapshot): Alındı → Hazırlanıyor → Hazır → Teslim edildi.
- TR/EN çoklu dil.

**Yönetici paneli (`/admin`)**
- Firebase Auth ile giriş. `NEXT_PUBLIC_ADMIN_EMAIL` ile admin kısıtlanır.
- Dashboard: günlük sipariş, bekleyen, tamamlanan, gelir.
- Sipariş yönetimi: durum değiştirme (canlı liste).
- Menü CRUD: kategori ve ürün ekle/düzenle/sil (TR + EN).
- Masa & QR oluşturucu: her masa için yazdırılabilir QR kart.

## Kurulum

```bash
cd noor-cafe-qr
npm install
cp .env.local.example .env.local   # değerleri doldur
npm run dev
```

### Firebase

1. https://console.firebase.google.com → Yeni proje.
2. **Authentication** → Sign-in method → Email/Password aktif. Admin kullanıcısını "Users" sekmesinden ekle.
3. **Firestore Database** → Test modunda başlat.
4. Proje Ayarları → Web uygulaması ekle → `firebaseConfig` değerlerini `.env.local` dosyasına koy.
5. `.env.local` içinde `NEXT_PUBLIC_ADMIN_EMAIL` değerini admin e-postasıyla aynı yap.

İlk kurulumdan sonra **Admin → Panel → "Firestore'a örnek menüyü yükle"** butonuna bas.

### Önerilen Firestore kuralları (basit başlangıç)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /categories/{id}   { allow read; allow write: if request.auth != null; }
    match /menuItems/{id}    { allow read; allow write: if request.auth != null; }
    match /tables/{id}       { allow read; allow write: if request.auth != null; }
    match /orders/{id} {
      allow create: if true;
      allow read, update: if request.auth != null
        || resource.data.tableNumber is string; // müşteri sipariş takibi için
    }
  }
}
```

Üretimde admin işlemlerini `request.auth.token.email == 'admin@..'` ile sıkılaştır.

## Vercel’e Deploy

1. Bu klasörü bir Git repository’ye yükle.
2. https://vercel.com → New Project → repo seç.
3. **Environment Variables** kısmına `.env.local` içindeki tüm `NEXT_PUBLIC_*` değerlerini ekle.
4. Deploy.

## Sayfalar

| URL | Açıklama |
| --- | --- |
| `/` | Karşılama, hero, masa parametresi yakalama |
| `/menu` | Menü |
| `/cart` | Sepet |
| `/checkout` | Sipariş onayı |
| `/orders` | Geçmiş siparişler |
| `/orders/[id]` | Gerçek zamanlı sipariş takibi |
| `/admin/login` | Yönetim girişi |
| `/admin/dashboard` | İstatistik |
| `/admin/orders` | Sipariş yönetimi |
| `/admin/menu` | Menü düzenleme |
| `/admin/tables` | Masa & QR oluşturma |

## QR Akışı

`https://noorcafe.example.com/?masa=12` linki bir QR’a basılır. Müşteri okuttuğunda:
- Açılan ana sayfada üstte `Masa: 12` etiketi görünür,
- Sepet localStorage’da, masa numarası store’da tutulur,
- Checkout sırasında masa otomatik dolu gelir.

## Geliştirilebilir Alanlar

- iyzico / Stripe ile online ödeme
- Yazıcı entegrasyonu (mutfak fişi)
- Push bildirimi (FCM) — sipariş hazır olduğunda müşteriye
- Sadakat puanı, kupon, set menü
- Restoran rezervasyonu
- Çoklu şube
