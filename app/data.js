// Data awal Keluarga Santoso — November 2026.
// Semua angka dihitung dari daftar transaksi ini, jadi total di
// dashboard, grafik, anggaran, dan laporan selalu saling cocok.
export const HOUSEHOLD = {
  name: "Keluarga Santoso",
  members: "Budi & Sari + 2 anak",
  city: "Bandung",
  monthLabel: "November 2026",
  monthKey: "2026-11",
};

export const CATEGORIES = [
  { id: "belanja", label: "Belanja Harian", color: "#2e7d5b", budget: 3000000, icon: "🛒" },
  { id: "makan", label: "Makan & Jajan", color: "#e07856", budget: 600000, icon: "🍜" },
  { id: "listrik", label: "Listrik & Air", color: "#d9a441", budget: 800000, icon: "💡" },
  { id: "internet", label: "Internet & HP", color: "#5b7fa6", budget: 550000, icon: "📶" },
  { id: "transport", label: "Transportasi", color: "#7a6aa8", budget: 900000, icon: "🛵" },
  { id: "sekolah", label: "Sekolah Anak", color: "#3a8ea5", budget: 1500000, icon: "🎒" },
  { id: "kesehatan", label: "Kesehatan", color: "#c65d7b", budget: 500000, icon: "💊" },
  { id: "hiburan", label: "Hiburan", color: "#8a9a5b", budget: 400000, icon: "🎬" },
  { id: "lainnya", label: "Lainnya", color: "#8d8578", budget: 300000, icon: "📦" },
];

export const SEED_TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", desc: "Gaji Budi — PT Maju Bersama", cat: "income", kind: "in", amount: 11000000 },
  { id: "t02", date: "2026-11-02", desc: "Belanja pasar mingguan", cat: "belanja", kind: "out", amount: 425000 },
  { id: "t03", date: "2026-11-03", desc: "Listrik PLN", cat: "listrik", kind: "out", amount: 385000 },
  { id: "t04", date: "2026-11-03", desc: "Internet IndiHome", cat: "internet", kind: "out", amount: 325000 },
  { id: "t05", date: "2026-11-04", desc: "Bensin motor", cat: "transport", kind: "out", amount: 60000 },
  { id: "t06", date: "2026-11-05", desc: "Usaha sampingan Sari — kue kering", cat: "income", kind: "in", amount: 1500000 },
  { id: "t07", date: "2026-11-05", desc: "Makan siang keluarga", cat: "makan", kind: "out", amount: 145000 },
  { id: "t08", date: "2026-11-06", desc: "SPP sekolah anak", cat: "sekolah", kind: "out", amount: 750000 },
  { id: "t09", date: "2026-11-07", desc: "Belanja supermarket", cat: "belanja", kind: "out", amount: 612000 },
  { id: "t10", date: "2026-11-08", desc: "Air PDAM", cat: "listrik", kind: "out", amount: 142000 },
  { id: "t11", date: "2026-11-09", desc: "Ojek online ke kantor", cat: "transport", kind: "out", amount: 48000 },
  { id: "t12", date: "2026-11-10", desc: "Jajan anak sekolah", cat: "makan", kind: "out", amount: 35000 },
  { id: "t13", date: "2026-11-11", desc: "Pulsa & paket data", cat: "internet", kind: "out", amount: 150000 },
  { id: "t14", date: "2026-11-12", desc: "Belanja pasar mingguan", cat: "belanja", kind: "out", amount: 398000 },
  { id: "t15", date: "2026-11-13", desc: "Buku & alat tulis anak", cat: "sekolah", kind: "out", amount: 185000 },
  { id: "t16", date: "2026-11-14", desc: "Makan malam di luar", cat: "makan", kind: "out", amount: 220000 },
  { id: "t17", date: "2026-11-15", desc: "Servis motor", cat: "transport", kind: "out", amount: 275000 },
  { id: "t18", date: "2026-11-16", desc: "Obat & vitamin", cat: "kesehatan", kind: "out", amount: 120000 },
  { id: "t19", date: "2026-11-17", desc: "Belanja supermarket", cat: "belanja", kind: "out", amount: 540000 },
  { id: "t20", date: "2026-11-18", desc: "Langganan streaming film", cat: "hiburan", kind: "out", amount: 79000 },
  { id: "t21", date: "2026-11-19", desc: "Bensin motor", cat: "transport", kind: "out", amount: 65000 },
  { id: "t22", date: "2026-11-20", desc: "Les privat anak", cat: "sekolah", kind: "out", amount: 300000 },
  { id: "t23", date: "2026-11-21", desc: "Belanja pasar mingguan", cat: "belanja", kind: "out", amount: 410000 },
  { id: "t24", date: "2026-11-22", desc: "Kopi & camilan", cat: "makan", kind: "out", amount: 68000 },
  { id: "t25", date: "2026-11-23", desc: "Periksa gigi anak", cat: "kesehatan", kind: "out", amount: 250000 },
  { id: "t26", date: "2026-11-24", desc: "Parkir & tol", cat: "transport", kind: "out", amount: 92000 },
  { id: "t27", date: "2026-11-25", desc: "Nonton bioskop keluarga", cat: "hiburan", kind: "out", amount: 180000 },
  { id: "t28", date: "2026-11-25", desc: "Belanja bulanan", cat: "belanja", kind: "out", amount: 685000 },
  { id: "t29", date: "2026-11-26", desc: "Isi token listrik", cat: "listrik", kind: "out", amount: 200000 },
  { id: "t30", date: "2026-11-26", desc: "Hadiah ulang tahun nenek", cat: "lainnya", kind: "out", amount: 150000 },
];

export const SEED_GOALS = [
  { id: "g1", name: "Dana Darurat", desc: "6 bulan biaya hidup, disimpan di tabungan terpisah", target: 10000000, saved: 6250000, icon: "🛟" },
  { id: "g2", name: "Liburan Keluarga", desc: "Liburan akhir tahun ke Yogyakarta, 4 orang", target: 5000000, saved: 2150000, icon: "🏖️" },
  { id: "g3", name: "DP Motor Baru", desc: "Ganti motor lama yang sering mogok", target: 8000000, saved: 1800000, icon: "🛵" },
];

// Pengeluaran 6 bulan terakhir (untuk grafik laporan).
export const MONTHLY_HISTORY = [
  { month: "Jun 2026", income: 12500000, spent: 6800000 },
  { month: "Jul 2026", income: 12500000, spent: 7100000 },
  { month: "Agu 2026", income: 12500000, spent: 6900000 },
  { month: "Sep 2026", income: 12500000, spent: 7500000 },
  { month: "Okt 2026", income: 12500000, spent: 7050000 },
  { month: "Nov 2026", income: 12500000, spent: 7294000 },
];

export const TIPS = [
  { title: "Belanja pasar di pagi hari", body: "Harga sayur dan lauk biasanya 10–15% lebih murah sebelum pukul 08.00, dan pilihan masih lengkap." },
  { title: "Masak bekal 3x seminggu", body: "Mengganti 3 kali makan di luar dengan bekal rumah menghemat sekitar Rp300.000 sebulan untuk keluarga 4 orang." },
  { title: "Cek langganan tiap awal bulan", body: "Langganan streaming yang jarang dipakai sebaiknya dijeda — Rp79.000 sebulan jadi Rp948.000 setahun." },
];
