// Format angka dan tanggal ke Bahasa Indonesia.
export function rupiah(n) {
  return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function rupiahShort(n) {
  if (n >= 1000000) return "Rp" + (n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (n >= 1000) return "Rp" + Math.round(n / 1000) + " rb";
  return rupiah(n);
}

export function pct(n) {
  return Math.round(n * 100) + "%";
}

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function tanggalId(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return d + " " + MONTHS_ID[m - 1] + " " + y;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
