// State aplikasi: data awal dari data.js, perubahan pengguna
// disimpan di localStorage dan dimuat lagi saat dibuka.
import { CATEGORIES, SEED_GOALS, SEED_TRANSACTIONS } from "./data.js";

const KEY = "dompetkeluarga-v1";

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (Array.isArray(s.transactions) && Array.isArray(s.goals)) return s;
    }
  } catch (e) { /* penyimpanan rusak: kembali ke data awal */ }
  return { transactions: clone(SEED_TRANSACTIONS), goals: clone(SEED_GOALS) };
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) { /* mode privat: perubahan hanya bertahan di sesi ini */ }
}

export function resetState() {
  localStorage.removeItem(KEY);
  return { transactions: clone(SEED_TRANSACTIONS), goals: clone(SEED_GOALS) };
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: "Lainnya", color: "#8d8578", budget: 0, icon: "📦" };
}

export function totals(state) {
  let income = 0, spent = 0;
  for (const t of state.transactions) {
    if (t.kind === "in") income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, balance: income - spent, saveRate: income ? (income - spent) / income : 0 };
}

export function spentByCategory(state) {
  const map = {};
  for (const c of CATEGORIES) map[c.id] = 0;
  for (const t of state.transactions) {
    if (t.kind === "out" && map[t.cat] !== undefined) map[t.cat] += t.amount;
  }
  return map;
}

// Saldo berjalan harian (untuk grafik arus kas), 1–30 November.
export function dailyBalance(state) {
  const days = [];
  for (let d = 1; d <= 30; d++) days.push({ day: d, value: 0, label: d + " Nov" });
  const sorted = [...state.transactions].sort((a, b) => a.date.localeCompare(b.date));
  let run = 0;
  let idx = 0;
  for (const day of days) {
    const iso = "2026-11-" + String(day.day).padStart(2, "0");
    while (idx < sorted.length && sorted[idx].date <= iso) {
      run += sorted[idx].kind === "in" ? sorted[idx].amount : -sorted[idx].amount;
      idx++;
    }
    day.value = run;
  }
  // Tandai titik penting: gaji masuk dan saldo akhir.
  const marks = new Map([[1, "Gaji"], [5, "+Usaha"]]);
  return days.map((d) => ({ ...d, mark: marks.get(d.day) || (d.day === 30 ? "Akhir" : "") }));
}

export function addTransaction(state, tx) {
  const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  state.transactions.push({ id, ...tx });
  state.transactions.sort((a, b) => a.date.localeCompare(b.date) || b.amount - a.amount);
  saveState(state);
  return id;
}

export function updateTransaction(state, id, patch) {
  const t = state.transactions.find((x) => x.id === id);
  if (!t) return false;
  Object.assign(t, patch);
  state.transactions.sort((a, b) => a.date.localeCompare(b.date) || b.amount - a.amount);
  saveState(state);
  return true;
}

export function deleteTransaction(state, id) {
  const i = state.transactions.findIndex((x) => x.id === id);
  if (i < 0) return false;
  state.transactions.splice(i, 1);
  saveState(state);
  return true;
}

export function addToGoal(state, id, amount) {
  const g = state.goals.find((x) => x.id === id);
  if (!g || !(amount > 0)) return false;
  g.saved = Math.min(g.target, g.saved + amount);
  saveState(state);
  return true;
}
