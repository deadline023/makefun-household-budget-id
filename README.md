# DompetKeluarga — Anggaran Rumah Tangga

[![best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/deadline023/makefun-household-budget-id/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/deadline023/makefun-household-budget-id/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga untuk keluarga Indonesia: catat pemasukan dan
pengeluaran, pantau anggaran tiap pos belanja, kejar target tabungan, dan
baca laporan bulanan — semuanya dari file statis, tanpa jaringan, dan data
tersimpan di browser (localStorage).

## Yang ada di situs

- **Dashboard** — saldo, pemasukan vs pengeluaran November 2026, grafik arus
  kas harian, pos pengeluaran terbesar, transaksi terbaru, dan target tabungan.
- **Transaksi** — daftar 30 transaksi nyata Keluarga Santoso; tambah, ubah,
  hapus, saring per kategori, dan cari berdasarkan keterangan.
- **Anggaran** — batas tiap pos belanja dengan bilah progres, sisa anggaran,
  dan peringatan saat pos melewati batas (Belanja Harian sudah lewat Rp70.000).
- **Target Tabungan** — Dana Darurat, Liburan Keluarga, dan DP Motor Baru
  dengan progres dan tombol tambah dana yang benar-benar bekerja.
- **Laporan** — grafik batang pemasukan vs pengeluaran 6 bulan, donat kategori,
  dan saran perbaikan untuk bulan depan.

## Cara jalan

```sh
python3 -m http.server 8080 --directory app
```

Lalu buka http://localhost:8080 di desktop atau HP. Tidak ada build step
dan tidak ada permintaan jaringan.

## Penyerahan

`main.ts` menyalin `app/` dan `screenshots/` ke direktori output dan menulis
`dossier.json` memakai `buildDossier` dari `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

<sub>Built for the make.fun bounty — https://make.fun/?ref=yh628p52</sub>
