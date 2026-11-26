// DompetKeluarga — router hash dan semua kontrol interaktif.
// Tanpa framework: hash routes #/, #/transactions, #/budgets,
// #/goals, #/reports. Semua perubahan tersimpan di localStorage.
import { HOUSEHOLD } from "./data.js";
import { loadState, saveState, resetState, addTransaction, updateTransaction, deleteTransaction, addToGoal } from "./store.js";
import { viewDashboard, viewTransactions, viewBudgets, viewGoals, viewReports, viewNotFound } from "./views.js";

const root = document.getElementById("app");
const navLinks = [...document.querySelectorAll(".nav-link")];
let state = loadState();
let txFilter = { cat: "all", q: "" };
let editCtx = null;

const ROUTES = {
  "/": () => viewDashboard(state),
  "/transactions": () => viewTransactions(state, { ...txFilter, ...(editCtx || {}) }),
  "/budgets": () => viewBudgets(state),
  "/goals": () => viewGoals(state),
  "/reports": () => viewReports(state),
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : "/404";
}

function render() {
  const route = currentRoute();
  root.innerHTML = ROUTES[route] ? ROUTES[route]() : viewNotFound();
  navLinks.forEach((a) => {
    const href = a.getAttribute("href").replace(/^#/, "");
    a.classList.toggle("active", href === route);
    if (href === "/" && route === "/") a.classList.add("active");
  });
  document.title = "DompetKeluarga — " + ({ "/": "Dashboard", "/transactions": "Transaksi", "/budgets": "Anggaran", "/goals": "Target Tabungan", "/reports": "Laporan" }[route] || "DompetKeluarga");
  window.scrollTo(0, 0);
}

function rerender(keepEdit) {
  if (!keepEdit) editCtx = null;
  render();
}

// --- Form transaksi: tambah / ubah ---
root.addEventListener("submit", (e) => {
  const form = e.target;
  // Pakai getAttribute: input bernama "id" di dalam form menutupi form.id.
  if (form.getAttribute("id") === "tx-form") {
    e.preventDefault();
    const fd = new FormData(form);
    const tx = {
      date: String(fd.get("date")),
      desc: String(fd.get("desc")).trim(),
      kind: String(fd.get("kind")),
      cat: String(fd.get("cat")),
      amount: Math.round(Number(fd.get("amount"))),
    };
    if (!tx.desc || !(tx.amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) return;
    if (tx.kind === "in") tx.cat = "income";
    const id = String(fd.get("txid") || "");
    if (id) updateTransaction(state, id, tx);
    else addTransaction(state, tx);
    document.getElementById("tx-msg").textContent = "✓ Tersimpan — dashboard, anggaran, dan laporan sudah ikut berubah.";
    rerender(false);
    const msg = document.getElementById("tx-msg");
    if (msg) msg.textContent = "✓ Tersimpan — dashboard, anggaran, dan laporan sudah ikut berubah.";
  }
  if (form.classList.contains("goal-form")) {
    e.preventDefault();
    const fd = new FormData(form);
    const amount = Math.round(Number(fd.get("amount")));
    if (amount > 0 && addToGoal(state, form.dataset.goal, amount)) {
      // Catat setoran tabungan sebagai pengeluaran agar saldo konsisten.
      addTransaction(state, {
        date: "2026-11-26", desc: "Setoran tabungan — " + state.goals.find((g) => g.id === form.dataset.goal).name,
        cat: "lainnya", kind: "out", amount,
      });
      rerender(false);
    }
  }
});

// --- Klik: ubah / hapus transaksi, filter, cari ---
root.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "del-tx") {
    const tx = state.transactions.find((x) => x.id === id);
    if (tx && confirm(`Hapus "${tx.desc}" (${tx.amount.toLocaleString("id-ID")})?`)) {
      deleteTransaction(state, id);
      rerender(false);
    }
  }
  if (action === "edit-tx") {
    const tx = state.transactions.find((x) => x.id === id);
    if (tx) {
      editCtx = { editId: tx.id, editDate: tx.date, editDesc: tx.desc, editKind: tx.kind, editCat: tx.cat, editAmount: tx.amount };
      render();
      document.getElementById("tx-form").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  if (action === "cancel-edit") rerender(false);
});

root.addEventListener("input", (e) => {
  if (e.target.id === "tx-search") {
    txFilter.q = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const input = document.getElementById("tx-search");
    if (input) { input.focus(); input.setSelectionRange(pos, pos); }
  }
});

root.addEventListener("change", (e) => {
  if (e.target.id === "tx-filter") {
    txFilter.cat = e.target.value;
    render();
  }
  if (e.target.name === "kind" && e.target.closest("#tx-form")) {
    const catSel = e.target.closest("#tx-form").querySelector('select[name="cat"]');
    if (catSel) catSel.disabled = e.target.value === "in";
  }
});

// --- Reset data demo ---
document.getElementById("reset-data").addEventListener("click", () => {
  if (confirm("Kembalikan semua data ke contoh awal Keluarga Santoso?")) {
    state = resetState();
    txFilter = { cat: "all", q: "" };
    rerender(false);
  }
});

document.getElementById("year").textContent = String(new Date().getFullYear());
window.addEventListener("hashchange", () => rerender(false));
render();
