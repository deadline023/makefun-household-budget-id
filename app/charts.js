// Grafik SVG buatan sendiri: grafik garis arus kas, batang bulanan,
// dan donat kategori. Tanpa pustaka, tanpa gambar luar.
import { rupiahShort } from "./format.js";

function svgOpen(w, h, label) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet">`;
}

// Grafik area arus kas: saldo berjalan harian selama sebulan.
export function cashflowChart(points, width = 640, height = 220) {
  const padL = 8, padR = 8, padT = 14, padB = 22;
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(0, ...points.map((p) => p.value));
  const span = max - min || 1;
  const x = (i) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const y = (v) => padT + (1 - (v - min) / span) * (height - padT - padB);
  const line = points.map((p, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(p.value).toFixed(1)).join(" ");
  const area = line + ` L${x(points.length - 1).toFixed(1)} ${y(min).toFixed(1)} L${x(0).toFixed(1)} ${y(min).toFixed(1)} Z`;
  const dots = points
    .filter((p) => p.mark)
    .map((p) => {
      const i = points.indexOf(p);
      const px = x(i), py = y(p.value);
      const below = py < 30;
      const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
      const tx = i === 0 ? px + 7 : i === points.length - 1 ? px - 7 : px;
      const ty = below ? py + 18 : py - 10;
      return `<circle cx="${px}" cy="${py}" r="4.5" fill="#e07856" stroke="#fff" stroke-width="2"/><text x="${tx}" y="${ty}" font-size="11" font-weight="700" fill="#5b4636" text-anchor="${anchor}">${p.mark}</text>`;
    })
    .join("");
  const labels = [0, 7, 14, 21, 29]
    .map((i) => `<text x="${x(i)}" y="${height - 6}" font-size="11" fill="#8a7a68" text-anchor="middle">${points[i].label}</text>`)
    .join("");
  return `${svgOpen(width, height, "Grafik arus kas November 2026")}
  <path d="${area}" fill="#2e7d5b" opacity="0.14"/>
  <path d="${line}" fill="none" stroke="#2e7d5b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${dots}${labels}</svg>`;
}

// Grafik batang: pemasukan vs pengeluaran per bulan.
export function monthlyBars(rows, width = 640, height = 230) {
  const padL = 52, padR = 10, padT = 18, padB = 24;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent))) * 1.08;
  const slot = (width - padL - padR) / rows.length;
  const bw = Math.min(22, (slot - 14) / 2);
  const y = (v) => padT + (1 - v / max) * (height - padT - padB);
  let bars = "";
  rows.forEach((r, i) => {
    const cx = padL + slot * i + slot / 2;
    bars += `<rect x="${cx - bw - 2}" y="${y(r.income)}" width="${bw}" height="${height - padB - y(r.income)}" rx="3" fill="#2e7d5b"/>`;
    bars += `<rect x="${cx + 2}" y="${y(r.spent)}" width="${bw}" height="${height - padB - y(r.spent)}" rx="3" fill="#e07856"/>`;
    bars += `<text x="${cx}" y="${height - 6}" font-size="11" fill="#8a7a68" text-anchor="middle">${r.month}</text>`;
  });
  const grid = [0.5, 1].map((f) => {
    const gy = padT + (1 - f) * (height - padT - padB);
    return `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="#e8dcc8" stroke-width="1"/><text x="${padL - 6}" y="${gy + 4}" font-size="10" fill="#8a7a68" text-anchor="end">${rupiahShort(max * f)}</text>`;
  }).join("");
  return `${svgOpen(width, height, "Grafik batang pemasukan dan pengeluaran 6 bulan")}
  ${grid}${bars}
  <g font-size="12" font-weight="600"><circle cx="${padL}" cy="8" r="5" fill="#2e7d5b"/><text x="${padL + 10}" y="12" fill="#5b4636">Pemasukan</text><circle cx="${padL + 110}" cy="8" r="5" fill="#e07856"/><text x="${padL + 120}" y="12" fill="#5b4636">Pengeluaran</text></g></svg>`;
}

// Donat kategori pengeluaran.
export function donutChart(slices, size = 240) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 30;
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  let a0 = -Math.PI / 2;
  let paths = "";
  slices.forEach((s) => {
    const frac = s.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    paths += `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${s.color}"/>`;
    a0 = a1;
  });
  return `${svgOpen(size, size, "Donat pengeluaran per kategori")}
  ${paths}<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#fffdf6"/>
  <text x="${cx}" y="${cy - 4}" font-size="13" fill="#8a7a68" text-anchor="middle">Total keluar</text>
  <text x="${cx}" y="${cy + 16}" font-size="15" font-weight="700" fill="#2c3a32" text-anchor="middle">${rupiahShort(total)}</text></svg>`;
}

// Bilah progres sederhana (dipakai anggaran & target).
export function progressBar(ratio, color) {
  const w = Math.max(0, Math.min(100, ratio * 100));
  return `<div class="bar"><div class="bar-fill" style="width:${w.toFixed(1)}%;background:${color}"></div></div>`;
}
