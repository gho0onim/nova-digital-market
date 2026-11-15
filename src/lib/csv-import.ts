import { CATEGORIES, type Product } from "./catalog";

export const CSV_HEADERS = ["id", "nameAr", "name", "category", "price", "oldPrice", "stock", "status", "region", "description", "image"] as const;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cur = ""; let q = false;
  const t = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && t[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((c) => c.trim())) rows.push(row); row = []; }
    else cur += ch;
  }
  row.push(cur); if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

export interface ImportRow { line: number; product: Product | null; errors: string[] }

export function validateRows(text: string): ImportRow[] {
  const [head, ...body] = parseCsv(text);
  if (!head) return [];
  const idx = (k: string) => head.findIndex((h) => h.trim() === k);
  return body.map((r, i) => {
    const g = (k: string) => (idx(k) >= 0 ? (r[idx(k)] ?? "").trim() : "");
    const errors: string[] = [];
    const price = Number(g("price")); const stock = g("stock") === "" ? 0 : Number(g("stock"));
    const old = g("oldPrice") === "" ? undefined : Number(g("oldPrice"));
    const category = g("category") as Product["category"];
    const status = (g("status") || "active") as Product["status"];
    const image = g("image");
    if (!g("nameAr")) errors.push("الاسم بالعربي ناقص");
    if (!g("name")) errors.push("الاسم بالإنجليزي ناقص");
    if (!Number.isFinite(price) || price <= 0) errors.push("السعر لازم رقم أكبر من صفر");
    if (!Number.isInteger(stock) || stock < 0) errors.push("المخزون لازم رقم صحيح");
    if (old !== undefined && (!Number.isFinite(old) || old <= price)) errors.push("السعر القديم لازم أكبر من السعر");
    if (!CATEGORIES.some((c) => c.id === category)) errors.push("القسم غلط");
    if (!["active", "draft", "out"].includes(status)) errors.push("الحالة غلط");
    if (image && !/^https:\/\//.test(image)) errors.push("رابط الصورة لازم يبدأ بـ https://");
    const product: Product | null = errors.length ? null : {
      id: g("id") || "p" + Date.now() + i, nameAr: g("nameAr"), name: g("name"), category, price, ...(old ? { oldPrice: old } : {}),
      stock, status, region: g("region") || "مصر", delivery: "كود رقمي", description: g("description"), hue: (i * 47) % 360, ...(image ? { image } : {}),
    };
    return { line: i + 2, product, errors };
  });
}

const esc = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export function toCsv(rows: unknown[][]): string { return "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\n"); }
export function downloadCsv(name: string, rows: unknown[][]) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}
