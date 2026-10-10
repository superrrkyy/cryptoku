<div align="center">

<img src="assets/banner.svg" width="100%" alt="CryptoKu" />

**Pantau harga kripto secara real-time dalam Rupiah** — 100 koin teratas, grafik interaktif, watchlist, dan kalkulator konversi.

<a href="https://superrrkyy.github.io/cryptoku/"><img src="https://img.shields.io/badge/▶_Buka_CryptoKu-f59e0b?style=for-the-badge" alt="Demo" /></a>

<img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/CoinGecko_API-8DC63F?style=flat-square&logo=coingecko&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square" />

</div>

---

## ✨ Fitur

**🏠 Beranda**
- Total kapitalisasi pasar global + perubahan 24 jam (dalam **IDR** atau **USD**)
- Volume 24 jam, dominasi BTC, jumlah koin aktif
- 🔥 **Top Naik / Top Turun** 24 jam
- Pencarian koin langsung
- Indikator **LIVE** + "diperbarui X detik lalu"

**📊 Pasar**
- 100 koin teratas dengan logo, harga, % perubahan, dan **sparkline 7 hari**
- Urutkan berdasarkan: kapitalisasi, kenaikan, penurunan, atau volume
- Harga **berkedip hijau/merah** setiap kali nilainya berubah

**🪙 Detail Koin**
- Grafik area SVG (24 jam / 7 hari) — dibuat manual, tanpa library chart
- Statistik: kapitalisasi, volume, tertinggi & terendah 24 jam, suplai beredar/maksimum
- 🏔️ Progress bar posisi harga terhadap **ATH**
- Kalkulator konversi koin ⇄ Rupiah/USD
- Link ke website resmi koin

**⭐ Watchlist**
- Pantau koin favorit, tersimpan otomatis di perangkat (localStorage)

**🧮 Kalkulator**
- Konversi dua arah kripto ⇄ Rupiah, lengkap dengan tombol cepat

**⚡ Real-time**
- Data dimuat ulang otomatis tiap **60 detik**
- Cache 45 detik + penanganan **rate limit (429)**: kalau CoinGecko membatasi, aplikasi tetap menampilkan data terakhir, bukan error

## 🛠️ Teknologi

| Bagian | Teknologi |
|:--|:--|
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Grafik | SVG buatan sendiri (polyline + gradient) |
| Build | Vite 6 |
| Data | [CoinGecko API](https://www.coingecko.com/en/api) (gratis, tanpa API key) |
| Deploy | GitHub Actions → Pages |

## 📂 Struktur

```
cryptoku/
├── .github/workflows/deploy.yml
├── assets/banner.svg
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── Charts.tsx     # sparkline & grafik area SVG
│   │   ├── CoinRow.tsx    # baris koin + kedip harga
│   │   ├── Converter.tsx  # kalkulator konversi
│   │   └── ui.tsx         # skeleton & error box
│   ├── pages/
│   │   ├── Beranda.tsx
│   │   ├── Pasar.tsx
│   │   ├── Detail.tsx
│   │   ├── Watchlist.tsx
│   │   └── Kalkulator.tsx
│   ├── api.ts             # CoinGecko + cache
│   ├── store.ts           # watchlist, mata uang, detak
│   ├── useData.ts         # hook pengambilan data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 🚀 Jalankan Lokal

```bash
npm install
npm run dev
```

> [!NOTE]
> **CryptoKu hanya menampilkan data harga** — bukan tempat jual/beli, dan bukan saran investasi.
> Harga mengikuti CoinGecko dan bisa tertunda beberapa menit.
> Paket gratis CoinGecko punya batas permintaan; kalau terlalu sering, aplikasi akan memakai data terakhir yang tersimpan.

---

<div align="center">

Dibuat dengan 💜 oleh [**AXRYZURE**](https://github.com/superrrkyy) • 🇮🇩

⭐ Beri bintang jika kamu suka!

</div>
