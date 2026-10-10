<div align="center">

<img src="assets/banner.svg" width="100%" alt="CryptoKu â€” Harga Kripto Real-Time" />

# â‚¿ CryptoKu

**Pantau harga kripto secara real-time dalam Rupiah** â€” 100 koin teratas, grafik interaktif,
watchlist pribadi, dan kalkulator konversi. Semua dalam satu halaman ringan yang enak dipakai di HP.

<a href="https://superrrkyy.github.io/cryptoku/">
  <img src="https://img.shields.io/badge/â–¶%20Buka%20CryptoKu-f59e0b?style=for-the-badge&logo=bitcoin&logoColor=white" alt="Demo" />
</a>
<a href="https://github.com/superrrkyy/cryptoku">
  <img src="https://img.shields.io/badge/â­%20Star%20repo%20ini-1f2937?style=for-the-badge&logo=github" alt="Star" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/CoinGecko_API-8DC63F?style=flat-square&logo=coingecko&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square" />
<img src="https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=githubactions&logoColor=white" />

<img src="https://komarev.com/ghpvc/?username=superrrkyy&repo=cryptoku&color=f59e0b&style=flat-square&label=Views" alt="Views" />

</div>

---

## âœ¨ Sorotan

<table>
  <tr>
    <td align="center" width="25%">
      <div style="font-size:28px">âš¡</div>
      <b>Real-Time</b><br/>
      <sub>Harga diperbarui tiap 60 detik &amp; berkedip hijau/merah saat berubah</sub>
    </td>
    <td align="center" width="25%">
      <div style="font-size:28px">ðŸ‡®ðŸ‡©</div>
      <b>Rupiah Native</b><br/>
      <sub>Semua harga ditampilkan dalam IDR (bisa diganti ke USD)</sub>
    </td>
    <td align="center" width="25%">
      <div style="font-size:28px">ðŸ“ˆ</div>
      <b>Grafik SVG</b><br/>
      <sub>Chart 24 jam &amp; 7 hari buatan sendiri, nol library tambahan</sub>
    </td>
    <td align="center" width="25%">
      <div style="font-size:28px">ðŸ“±</div>
      <b>Mobile First</b><br/>
      <sub>Navigasi bawah ala aplikasi, nyaman dipakai satu tangan</sub>
    </td>
  </tr>
</table>

---

## ðŸ“± Fitur Lengkap

### ðŸ  Beranda
- Total **kapitalisasi pasar global** + perubahan 24 jam
- Statistik pasar: volume 24 jam, **dominasi BTC**, jumlah koin aktif
- ðŸ”¥ **Top Naik** &amp; ðŸ§Š **Top Turun** dalam 24 jam
- Pencarian koin langsung saat mengetik
- Indikator **LIVE** beserta label *"diperbarui X detik lalu"*

### ðŸ“Š Pasar
- **100 koin teratas** lengkap dengan logo, harga, persentase, dan sparkline 7 hari
- Urutkan berdasarkan: `Kapitalisasi` Â· `Naik` Â· `Turun` Â· `Volume`
- Tombol muat ulang manual kapan saja

### ðŸª™ Detail Koin
- Grafik area interaktif â€” pilihan **24 jam** atau **7 hari**
- Statistik lengkap: kapitalisasi, volume, tertinggi &amp; terendah 24 jam, suplai beredar/maksimum
- ðŸ”ï¸ **Progress bar ATH** â€” seberapa jauh harga sekarang dari puncak tertingginya
- Persentase perubahan 24 jam **dan** 7 hari
- Kalkulator konversi langsung di halaman
- Tombol pantau (&starf;) dan link ke CoinGecko

### â­ Watchlist
- Simpan koin incaran, tersimpan otomatis di perangkat (`localStorage`)
- Harga tetap live mengikuti pembaruan pasar

### ðŸ§® Kalkulator
- Konversi dua arah **Kripto â‡„ Rupiah** dengan harga live
- Tombol cepat: `0.01 Â· 0.1 Â· 1 Â· 10` atau `100rb Â· 500rb Â· 1jt Â· 10jt`
- Otomatis memakai desimal lebih banyak untuk angka sangat kecil

---

## ðŸ› ï¸ Teknologi

| Lapisan | Pilihan | Alasan |
|:--|:--|:--|
| Antarmuka | **React 18** + **TypeScript** | Komponen rapi &amp; aman dari salah ketik |
| Styling | **Tailwind CSS 3** | Cepat, konsisten, ukuran kecil |
| Grafik | **SVG buatan sendiri** | Tanpa library chart â†’ bundle tetap ringan |
| Build | **Vite 6** | Dev server instan, build super cepat |
| Data | **CoinGecko API** | Gratis, tanpa API key, mendukung IDR |
| Penyimpanan | **localStorage** | Watchlist &amp; preferensi tersimpan di perangkat |
| Deploy | **GitHub Actions â†’ Pages** | Otomatis setiap kali push ke `main` |

---

## ðŸ§  Cara Kerja Singkat

1. **`src/api.ts`** â€” memanggil CoinGecko, menyimpan hasil ke cache 45 detik,
   dan menangani *rate limit* (HTTP 429) dengan memakai data terakhir yang tersedia.
2. **`src/useData.ts`** â€” hook React yang memuat ulang data tiap 60 detik (`useTick`).
3. **`src/store.ts`** â€” watchlist, pilihan mata uang, dan detak waktu berbasis `useSyncExternalStore`.
4. **`src/components/Charts.tsx`** â€” mengubah deretan angka harga menjadi `polyline` SVG + gradient.

> detail koin **tidak memanggil API lagi**: datanya diambil dari daftar pasar yang sudah dimuat,
> sehingga hemat kuota dan halaman langsung tampil.

<details>
<summary><b>ðŸ“‚ Struktur folder</b></summary>

```
cryptoku/
â”œâ”€â”€ .github/workflows/deploy.yml   # deploy otomatis ke GitHub Pages
â”œâ”€â”€ assets/banner.svg              # banner README
â”œâ”€â”€ public/favicon.svg
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Charts.tsx             # sparkline & grafik area SVG
â”‚   â”‚   â”œâ”€â”€ CoinRow.tsx            # baris koin + efek kedip harga
â”‚   â”‚   â”œâ”€â”€ Converter.tsx          # kalkulator konversi
â”‚   â”‚   â””â”€â”€ ui.tsx                 # skeleton & error box
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ Beranda.tsx
â”‚   â”‚   â”œâ”€â”€ Pasar.tsx
â”‚   â”‚   â”œâ”€â”€ Detail.tsx
â”‚   â”‚   â”œâ”€â”€ Watchlist.tsx
â”‚   â”‚   â””â”€â”€ Kalkulator.tsx
â”‚   â”œâ”€â”€ api.ts                     # CoinGecko + cache + format angka
â”‚   â”œâ”€â”€ store.ts                   # watchlist, mata uang, detak waktu
â”‚   â”œâ”€â”€ useData.ts                 # hook pengambilan data
â”‚   â”œâ”€â”€ App.tsx                    # router hash + navigasi
â”‚   â”œâ”€â”€ main.tsx
â”‚   â””â”€â”€ index.css
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â”œâ”€â”€ vite.config.ts                 # base: "/cryptoku/"
â”œâ”€â”€ tailwind.config.js
â”œâ”€â”€ postcss.config.js
â””â”€â”€ tsconfig.json
```

</details>

---

## ðŸš€ Jalankan di Komputer Sendiri

```bash
git clone https://github.com/superrrkyy/cryptoku.git
cd cryptoku
npm install
npm run dev
```

Lalu buka `http://localhost:5173/cryptoku/`.

<details>
<summary><b>â“ Pertanyaan yang sering muncul</b></summary>

**Q: Apakah aplikasi ini bisa dipakai jual/beli kripto?**
Tidak. CryptoKu murni **penampil data harga**. Tidak ada dompet, tidak ada transaksi.

**Q: Seberapa cepat harga diperbarui?**
Tiap **60 detik** sekali. Kalau CoinGecko sedang membatasi permintaan, aplikasi tetap menampilkan harga terakhir yang tersimpan.

**Q: Kenapa harga kadang beda dengan exchange langganan saya?**
Harga CoinGecko adalah **rata-rata dari banyak exchange**, jadi wajar bila sedikit berbeda dengan satu platform tertentu.

**Q: Watchlist saya hilang, kenapa?**
Watchlist tersimpan di browser perangkat. Kalau kamu membersihkan data browser atau memakai mode samaran, datanya ikut terhapus.

**Q: Bisa diganti ke mata uang lain?**
Bisa. Tekan tombol **IDR / USD** di pojok kanan atas â€” pilihannya tersimpan.

</details>

---

## ðŸ—ºï¸ Rencana Selanjutnya

- [x] Harga real-time &amp; grafik 7 hari
- [x] Watchlist + kalkulator
- [x] Toggle IDR / USD
- [ ] Mode gelap/terang
- [ ] Grafik 30 hari &amp; 1 tahun
- [ ] Peringatan harga (alert) sederhana
- [ ] Portofolio: catat modal &amp; lihat untung/rugi

---

## âš ï¸ Catatan Penting

> **CryptoKu hanya menampilkan data harga â€” bukan tempat jual/beli, dan bukan saran investasi.**
>
> â€¢ Harga mengikuti CoinGecko dan bisa tertunda beberapa menit.
> â€¢ Paket gratis CoinGecko punya batas permintaan; saat terlampaui, aplikasi memakai data terakhir.
> â€¢ Keputusan investasi sepenuhnya risiko dan tanggung jawab masing-masing.

---

## ðŸ”— Proyek Lainnya

<div align="center">

| ðŸŒ¦ï¸ CuacaKu | ðŸŽ¬ AnimeKu | ðŸ›’ AXRYZURE Store | ðŸ’¼ Portofolio |
|:--:|:--:|:--:|:--:|
| [Demo](https://superrrkyy.github.io/cuacaku/) | [Demo](https://superrrkyy.github.io/animeku/) | [Demo](https://superrrkyy.github.io/axryzure-store/) | [Demo](https://superrrkyy.github.io/) |
| [Repo](https://github.com/superrrkyy/cuacaku) | [Repo](https://github.com/superrrkyy/animeku) | [Repo](https://github.com/superrrkyy/axryzure-store) | [Repo](https://github.com/superrrkyy/superrrkyy.github.io) |

</div>

---

<div align="center">

Dibuat dengan ðŸ’œ oleh [**AXRYZURE**](https://github.com/superrrkyy) â€¢ ðŸ‡®ðŸ‡©

<sub>Data harga oleh <a href="https://www.coingecko.com/">CoinGecko</a> â€¢ Deploy di <a href="https://pages.github.com/">GitHub Pages</a></sub>

**â­ Kalau kamu suka proyek ini, bantu bintanginya ya!**

<a href="https://github.com/superrrkyy/cryptoku"><img src="https://img.shields.io/github/stars/superrrkyy/cryptoku?style=social" alt="Stars" /></a>

</div>
