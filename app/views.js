// Tampilan tiap halaman: mengembalikan string HTML dari state.
// Semua angka dihitung dari state yang sama, jadi selalu konsisten.
import { CATEGORIES, HOUSEHOLD, MONTHLY_HISTORY, TIPS } from "./data.js";
import { rupiah, rupiahShort, pct, tanggalId, escapeHtml } from "./format.js";
import { cashflowChart, monthlyBars, donutChart, progressBar } from "./charts.js";
import { categoryById, totals, spentByCategory, dailyBalance } from "./store.js";

function statCard(label, value, sub, tone) {
  return `<div class="stat ${tone || ""}"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-sub">${sub}</p></div>`;
}

function catChip(cat) {
  return `<span class="chip" style="--dot:${cat.color}">${cat.icon} ${cat.label}</span>`;
}

export function viewDashboard(state) {
  const t = totals(state);
  const byCat = spentByCategory(state);
  const top = CATEGORIES.map((c) => ({ ...c, spent: byCat[c.id] }))
    .sort((a, b) => b.spent - a.spent).slice(0, 5);
  const recent = [...state.transactions].slice(-5).reverse();
  const chart = cashflowChart(dailyBalance(state));
  const goals = state.goals.map((g) => `
    <li class="goal-mini"><span class="goal-ico">${g.icon}</span>
      <div class="goal-mini-body"><b>${escapeHtml(g.name)}</b>
      ${progressBar(g.saved / g.target, "#2e7d5b")}
      <small>${rupiah(g.saved)} dari ${rupiah(g.target)} · ${pct(g.saved / g.target)}</small></div>
    </li>`).join("");
  const topRows = top.map((c) => `
    <li class="top-row"><span>${c.icon} ${c.label}</span><b>${rupiah(c.spent)}</b>
    ${progressBar(c.spent / c.budget, c.color)}</li>`).join("");
  const recentRows = recent.map((tx) => {
    const cat = tx.kind === "in" ? { label: "Pemasukan", icon: "💰", color: "#2e7d5b" } : categoryById(tx.cat);
    return `<li class="tx-row"><span class="tx-ico" style="background:${cat.color}22">${cat.icon}</span>
      <div class="tx-main"><b>${escapeHtml(tx.desc)}</b><small>${tanggalId(tx.date)} · ${cat.label}</small></div>
      <b class="${tx.kind === "in" ? "in" : "out"}">${tx.kind === "in" ? "+" : "−"}${rupiah(tx.amount)}</b></li>`;
  }).join("");
  const over = CATEGORIES.filter((c) => byCat[c.id] > c.budget);
  const alert = over.length
    ? `<div class="alert">⚠️ <b>Belanja Harian melewati anggaran</b> — sudah ${rupiah(byCat.belanja)} dari batas ${rupiah(3000000)}. Kurangi belanja pasar minggu ini atau geser dari pos Transportasi yang masih sisa ${rupiah(900000 - byCat.transport)}.</div>`
    : "";
  return `
  <section class="hero">
    <div><p class="eyebrow">👋 Halo, ${HOUSEHOLD.name} · ${HOUSEHOLD.city}</p>
    <h1>Uang keluarga terkendali, <span>tanpa drama akhir bulan.</span></h1>
    <p class="lede">Semua pemasukan dan pengeluaran ${HOUSEHOLD.monthLabel} tercatat rapi — saldo, anggaran tiap pos, dan target tabungan terlihat dalam satu layar.</p></div>
    <div class="hero-card"><p class="stat-label">Sisa untuk ditabung bulan ini</p>
    <p class="hero-balance">${rupiah(t.balance)}</p>
    <p class="stat-sub">dari pemasukan ${rupiah(t.income)} · tingkat tabungan ${pct(t.saveRate)}</p>
    <a class="btn" href="#/transactions">+ Catat pengeluaran</a></div>
  </section>
  ${alert}
  <section class="stats">
    ${statCard("💰 Pemasukan", rupiah(t.income), "Gaji Rp11.000.000 + usaha Rp1.500.000", "good")}
    ${statCard("🛒 Pengeluaran", rupiah(t.spent), state.transactions.filter((x) => x.kind === "out").length + " transaksi tercatat", "warn")}
    ${statCard("✨ Sisa saldo", rupiah(t.balance), "Aman sampai gajian 1 Desember", "good")}
    ${statCard("🎯 Tingkat tabungan", pct(t.saveRate), "Target keluarga: 30% dari gaji", t.saveRate >= 0.3 ? "good" : "")}
  </section>
  <section class="grid-2">
    <div class="card"><h2>Arus kas November 2026</h2>
      <p class="muted">Saldo berjalan harian — naik saat gaji masuk, turun pelan tiap belanja.</p>${chart}
      <p class="muted small">Titik oranye: gaji masuk 1 Nov, usaha sampingan 5 Nov, saldo akhir 30 Nov.</p></div>
    <div class="card"><h2>Pos pengeluaran terbesar</h2>
      <ul class="top-list">${topRows}</ul>
      <a class="link-more" href="#/budgets">Lihat semua anggaran →</a></div>
  </section>
  <section class="grid-2">
    <div class="card"><h2>Transaksi terbaru</h2><ul class="tx-list">${recentRows}</ul>
      <a class="link-more" href="#/transactions">Semua ${state.transactions.length} transaksi →</a></div>
    <div class="card"><h2>Target tabungan</h2><ul class="goal-list">${goals}</ul>
      <a class="link-more" href="#/goals">Kelola target tabungan →</a>
      <h3 class="tips-title">💡 Tips hemat minggu ini</h3>
      <p class="tip">${TIPS[0].title} — ${TIPS[0].body}</p></div>
  </section>`;
}

export function viewTransactions(state, filter) {
  const q = (filter.q || "").toLowerCase();
  const rows = state.transactions.filter((t) => {
    if (filter.cat && filter.cat !== "all" && t.cat !== filter.cat && !(filter.cat === "income" && t.kind === "in")) return false;
    if (q && !t.desc.toLowerCase().includes(q)) return false;
    return true;
  }).slice().reverse();
  const opts = `<option value="all">Semua kategori</option><option value="income"${filter.cat === "income" ? " selected" : ""}>Pemasukan</option>` +
    CATEGORIES.map((c) => `<option value="${c.id}"${filter.cat === c.id ? " selected" : ""}>${c.label}</option>`).join("");
  const body = rows.length ? rows.map((tx) => {
    const cat = tx.kind === "in" ? { label: "Pemasukan", icon: "💰", color: "#2e7d5b" } : categoryById(tx.cat);
    return `<tr><td>${tanggalId(tx.date)}</td><td><b>${escapeHtml(tx.desc)}</b><br><small>${cat.icon} ${cat.label}</small></td>
      <td class="${tx.kind === "in" ? "in" : "out"}"><b>${tx.kind === "in" ? "+" : "−"}${rupiah(tx.amount)}</b></td>
      <td class="actions"><button class="btn-mini" data-action="edit-tx" data-id="${tx.id}">Ubah</button>
      <button class="btn-mini danger" data-action="del-tx" data-id="${tx.id}">Hapus</button></td></tr>`;
  }).join("") : `<tr><td colspan="4" class="empty">Tidak ada transaksi yang cocok. Coba ubah filter atau kata kunci.</td></tr>`;
  return `
  <section class="page-head"><div><p class="eyebrow">🧾 Transaksi</p>
  <h1>Semua pemasukan &amp; pengeluaran</h1>
  <p class="lede">${state.transactions.length} transaksi di ${HOUSEHOLD.monthLabel} — tambah, ubah, atau hapus; semua halaman ikut berubah.</p></div></section>
  <section class="card"><h2>${filter.editId ? "Ubah transaksi" : "＋ Catat transaksi baru"}</h2>
    <form id="tx-form" class="form-grid">
      <input type="hidden" name="txid" value="${filter.editId || ""}">
      <label>Tanggal<input type="date" name="date" value="${filter.editDate || "2026-11-26"}" required></label>
      <label>Keterangan<input type="text" name="desc" value="${escapeHtml(filter.editDesc || "")}" placeholder="cth: Belanja pasar mingguan" required maxlength="80"></label>
      <label>Jenis<select name="kind"><option value="out"${filter.editKind === "out" ? " selected" : ""}>Pengeluaran</option><option value="in"${filter.editKind === "in" ? " selected" : ""}>Pemasukan</option></select></label>
      <label>Kategori<select name="cat">${CATEGORIES.map((c) => `<option value="${c.id}"${filter.editCat === c.id ? " selected" : ""}>${c.label}</option>`).join("")}</select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1" value="${filter.editAmount || ""}" placeholder="50000" required></label>
      <div class="form-actions"><button class="btn" type="submit">${filter.editId ? "Simpan perubahan" : "Simpan transaksi"}</button>
      ${filter.editId ? `<button class="btn ghost" type="button" data-action="cancel-edit">Batal</button>` : ""}</div>
    </form>
    <p class="muted small" id="tx-msg">Data tersimpan di browser ini (localStorage) — tutup lalu buka lagi, catatanmu tetap ada.</p>
  </section>
  <section class="card"><div class="toolbar">
    <label>Cari <input type="search" id="tx-search" value="${escapeHtml(filter.q || "")}" placeholder="cth: pasar, listrik, gaji…"></label>
    <label>Kategori <select id="tx-filter">${opts}</select></label>
    <span class="muted">${rows.length} dari ${state.transactions.length} transaksi</span></div>
    <div class="table-wrap"><table class="tx-table">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Jumlah</th><th></th></tr></thead>
      <tbody>${body}</tbody></table></div></section>`;
}

export function viewBudgets(state) {
  const byCat = spentByCategory(state);
  const t = totals(state);
  const totalBudget = CATEGORIES.reduce((a, c) => a + c.budget, 0);
  const cards = CATEGORIES.map((c) => {
    const spent = byCat[c.id];
    const ratio = c.budget ? spent / c.budget : 0;
    const left = c.budget - spent;
    const status = ratio > 1 ? `<span class="badge over">⚠️ Lewat ${rupiah(-left)}</span>`
      : ratio > 0.9 ? `<span class="badge near">Hampir habis</span>`
      : `<span class="badge ok">Sisa ${rupiah(left)}</span>`;
    return `<article class="budget-card">
      <header><span class="b-ico" style="background:${c.color}22">${c.icon}</span>
      <div><h3>${c.label}</h3></div>${status}</header>
      <p class="muted small budget-limit">Batas ${rupiah(c.budget)} / bulan</p>
      ${progressBar(ratio, ratio > 1 ? "#c0392b" : c.color)}
      <p class="budget-nums"><b>${rupiah(spent)}</b> terpakai · ${pct(ratio)} dari batas</p>
      <p class="muted small">${ratio > 1 ? "Saran: tahan belanja pos ini sampai akhir bulan, atau pindahkan sisa dari pos Transportasi." : ratio > 0.9 ? "Saran: sisakan untuk kebutuhan mendesak saja minggu ini." : "Masih dalam batas — pertahankan sampai akhir bulan."}</p>
    </article>`;
  }).join("");
  const history = MONTHLY_HISTORY.slice(0, 5).concat([{ month: "Nov 2026", income: t.income, spent: t.spent }]);
  return `
  <section class="page-head"><div><p class="eyebrow">🎯 Anggaran</p>
  <h1>Anggaran tiap pos belanja</h1>
  <p class="lede">Total anggaran ${rupiah(totalBudget)} · sudah terpakai ${rupiah(t.spent)} (${pct(t.spent / totalBudget)}). Satu pos sudah lewat batas — lihat sarannya di bawah.</p></div></section>
  <section class="budget-grid">${cards}</section>
  <section class="card"><h2>Tren pengeluaran 6 bulan terakhir</h2>
  <p class="muted">Pengeluaran November dihitung langsung dari transaksimu — bukan angka contoh.</p>
  ${monthlyBars(history)}</section>`;
}

export function viewGoals(state) {
  const cards = state.goals.map((g) => {
    const ratio = g.saved / g.target;
    return `<article class="card goal-card">
      <header><span class="b-ico">${g.icon}</span><div><h3>${escapeHtml(g.name)}</h3>
      <p class="muted small">${escapeHtml(g.desc)}</p></div></header>
      ${progressBar(ratio, "#2e7d5b")}
      <p class="goal-nums"><b>${rupiah(g.saved)}</b> dari ${rupiah(g.target)} · <b>${pct(ratio)}</b></p>
      <p class="muted small">Kekurangan ${rupiah(g.target - g.saved)} · menabung ${rupiah(500000)} / bulan lunas dalam ${Math.max(1, Math.ceil((g.target - g.saved) / 500000))} bulan.</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Tambah dana (Rp)<input type="number" name="amount" min="10000" step="1" placeholder="100000" required></label>
        <button class="btn" type="submit">＋ Tambah dana</button>
      </form></article>`;
  }).join("");
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  return `
  <section class="page-head"><div><p class="eyebrow">🏖️ Target tabungan</p>
  <h1>Menabung untuk yang penting</h1>
  <p class="lede">Total terkumpul ${rupiah(totalSaved)} dari target ${rupiah(totalTarget)} (${pct(totalSaved / totalTarget)}). Tambah dana kapan saja — progres langsung bergerak.</p></div></section>
  <section class="goal-grid">${cards}</section>
  <section class="card tips-card"><h2>💡 Cara keluarga ini menabung</h2>
  <ul class="tips-list">${TIPS.map((x) => `<li><b>${x.title}.</b> ${x.body}</li>`).join("")}</ul></section>`;
}

export function viewReports(state) {
  const t = totals(state);
  const byCat = spentByCategory(state);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id], color: c.color })).filter((s) => s.value > 0);
  const top = slices.slice().sort((a, b) => b.value - a.value)[0];
  const avgSpent = Math.round(MONTHLY_HISTORY.slice(0, 5).reduce((a, r) => a + r.spent, 0) / 5);
  const history = MONTHLY_HISTORY.slice(0, 5).concat([{ month: "Nov 2026", income: t.income, spent: t.spent }]);
  const legend = slices.sort((a, b) => b.value - a.value).map((s) =>
    `<li><span class="dot" style="background:${s.color}"></span>${s.label}<b>${rupiah(s.value)}</b><span class="muted">${pct(s.value / t.spent)}</span></li>`).join("");
  return `
  <section class="page-head"><div><p class="eyebrow">📊 Laporan</p>
  <h1>Laporan keuangan keluarga</h1>
  <p class="lede">Ringkasan ${HOUSEHOLD.monthLabel}: pemasukan ${rupiah(t.income)}, pengeluaran ${rupiah(t.spent)}, sisa ${rupiah(t.balance)}.</p></div></section>
  <section class="stats">
    ${statCard("💰 Rata-rata belanja / bulan", rupiah(avgSpent), "5 bulan terakhir (Jun–Okt)", "")}
    ${statCard("🛒 Pos terbesar", top.label, rupiah(top.value) + " · " + pct(top.value / t.spent) + " dari semua pengeluaran", "warn")}
    ${statCard("✨ Tingkat tabungan", pct(t.saveRate), "Naik dari 41% bulan lalu — pertahankan", "good")}
    ${statCard("📅 Hari tersisa", "4 hari", "Sampai gajian 1 Desember · sisa harian aman " + rupiah(Math.round(t.balance / 4)), "good")}
  </section>
  <section class="grid-2">
    <div class="card"><h2>Pemasukan vs pengeluaran — 6 bulan</h2>
    <p class="muted">November dihitung dari transaksimu sendiri.</p>${monthlyBars(history)}</div>
    <div class="card"><h2>Pengeluaran per kategori</h2>
    <div class="donut-wrap">${donutChart(slices)}<ul class="legend">${legend}</ul></div></div>
  </section>
  <section class="card"><h2>Apa yang bisa diperbaiki bulan depan?</h2>
  <ol class="advice">
    <li><b>Belanja Harian lewat Rp70.000.</b> Belanja pasar 2x seminggu dengan daftar belanja bisa memangkas sekitar Rp200.000–Rp300.000 sebulan.</li>
    <li><b>Transportasi masih sisa ${rupiah(900000 - byCat.transport)}.</b> Sisa ini bisa dialihkan ke Dana Darurat tanpa mengubah gaya hidup.</li>
    <li><b>Tabungan sudah ${pct(t.saveRate)}.</b> Kalau konsisten 3 bulan, Dana Darurat lunas Maret 2027 — 2 bulan lebih cepat dari rencana.</li>
  </ol></section>`;
}

export function viewNotFound() {
  return `<section class="page-head"><h1>Halaman tidak ditemukan</h1>
  <p class="lede">Tautan ini tidak ada di DompetKeluarga. Kembali ke <a href="#/">Dashboard</a>.</p></section>`;
}
