// DompetKeluarga — program penyerahan (main.ts).
// Menyalin app/ dan screenshots/ dari repo ini ke direktori output
// (MAKEFUN_OUTPUT_DIR, default /output) lalu menulis dossier.json
// memakai buildDossier dari vendor/makefun-frontend.ts.
// Hanya memakai pustaka standar Node; tidak ada jaringan.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

const appSrc = join(repoRoot, "app");
const shotsSrc = join(repoRoot, "screenshots");

if (!existsSync(appSrc)) throw new Error("app/ tidak ditemukan di repo");
if (!existsSync(shotsSrc)) throw new Error("screenshots/ tidak ditemukan di repo");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(appSrc, join(outDir, "app"), { recursive: true });
cpSync(shotsSrc, join(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`dossier.json ditulis (${dossier.length} byte) ke ${outDir}`);
