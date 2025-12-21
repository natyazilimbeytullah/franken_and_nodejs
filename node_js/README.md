# 
 Template V3

Bu proje **Nuxt 3** ve **PrimeVue** ile oluşturulmuş profesyonel bir başlangıç şablonudur.

## 🚀 Özellikler

- ✅ **Nuxt 3** - Son sürüm Vue.js Framework
- ✅ **PrimeVue** - Zengin UI bileşen kütüphanesi
- ✅ **TypeScript** - Tip güvenli geliştirme
- ✅ **Auto-import** - Otomatik bileşen ve composable import
- ✅ **Örnek Sayfalar** - Hazır kullanıma uygun örnekler

## 📦 Kurulum

```bash
# Bağımlılıkları kur
npm install

# Cache temizleme (gerekirse)
rm -rf .nuxt .output

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🛠️ Kullanılabilir Komutlar

```bash
# Geliştirme sunucusu (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production önizleme
npm run preview

# Static site oluştur
npm run generate

# Cache temizleme
rm -rf .nuxt .output
```

## ⚠️ Sorun Giderme

Eğer CSS veya modül bulunamadı hatası alırsanız:

```bash
# Nuxt cache'ini temizle
rm -rf .nuxt .output

# Tekrar başlat
npm run dev
```

## 📚 PrimeVue Bileşenleri

Bu şablonda kullanılan bazı PrimeVue bileşenleri:

- **Button** - Çeşitli buton stilleri
- **Card** - İçerik kartları
- **DataTable** - Veri tabloları
- **InputText** - Metin girdileri
- **Select** - Açılır menüler
- **Textarea** - Çok satırlı metin
- **Tag** - Durum etiketleri
- **Column** - Tablo kolonları

Daha fazla bileşen için: [PrimeVue Dokümantasyonu](https://primevue.org/)

## 🎨 Tema

Proje, PrimeVue'nun modern **Aura** temasını kullanmaktadır.

## 📁 Proje Yapısı

```
nuxt_template_v3/
├── app/
│   ├── pages/
│   │   └── index.vue
│   └── app.vue
├── assets/
│   └── css/
│       └── main.css
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

## 📖 Daha Fazla Bilgi

- [Nuxt 3 Dokümantasyonu](https://nuxt.com/)
- [PrimeVue Dokümantasyonu](https://primevue.org/)
- [Vue 3 Dokümantasyonu](https://vuejs.org/)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request gönderin.

## 📝 Lisans

MIT
