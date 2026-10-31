import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, type CategoryId } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/shop/ProductCard";

type Sort = "popular" | "low" | "high";
interface ShopSearch { cat?: CategoryId | undefined; q?: string | undefined; sort?: Sort | undefined; stock?: boolean | undefined }

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    cat: CATEGORIES.some((c) => c.id === s["cat"]) ? (s["cat"] as CategoryId) : undefined,
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    sort: s["sort"] === "low" || s["sort"] === "high" ? s["sort"] : undefined,
    stock: s["stock"] === true || s["stock"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "كل المنتجات — NOVA VAULT" },
      { name: "description", content: "ابحث وفلتر كروت الهدايا وشحن الألعاب ورخص البرامج والاشتراكات." },
      { property: "og:title", content: "كل المنتجات — NOVA VAULT" },
      { property: "og:description", content: "ابحث وفلتر المنتجات الرقمية بالجنيه المصري." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { cat, q, sort, stock } = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const { products, ready } = useStore();
  const set = (patch: Partial<ShopSearch>) => nav({ search: (s) => ({ ...s, ...patch }), replace: true });

  const list = useMemo(() => {
    let l = products.filter((p) => p.status !== "draft");
    if (cat) l = l.filter((p) => p.category === cat);
    if (stock) l = l.filter((p) => p.stock > 0 && p.status === "active");
    if (q) {
      const t = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(t) || p.nameAr.includes(q));
    }
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    else l = [...l].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
    return l;
  }, [products, cat, q, sort, stock]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">كل المنتجات</h1>
      <div className="sticky top-16 z-30 -mx-4 mt-6 space-y-3 border-b bg-background/85 px-4 py-3 backdrop-blur-xl">
        <div className="relative">
          <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="دوّر على منتج… (عربي أو English)" className="h-11 ps-10" aria-label="بحث" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!cat} onClick={() => set({ cat: undefined })}>الكل</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => set({ cat: c.id })}>{c.emoji} {c.label}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <select value={sort ?? "popular"} onChange={(e) => set({ sort: e.target.value === "popular" ? undefined : (e.target.value as Sort) })}
            className="h-9 rounded-md border bg-card px-3" aria-label="ترتيب">
            <option value="popular">الأكثر مبيعًا</option>
            <option value="low">السعر: من الأقل</option>
            <option value="high">السعر: من الأعلى</option>
          </select>
          <label className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5">
            <input type="checkbox" checked={!!stock} onChange={(e) => set({ stock: e.target.checked || undefined })} className="accent-primary" />
            المتاح فقط
          </label>
          <span className="ms-auto text-muted-foreground">{list.length} منتج</span>
        </div>
      </div>

      <div className="mt-6">
        {!ready ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed py-20 text-center">
            <PackageSearch className="size-12 text-primary" />
            <p className="font-semibold">مفيش منتجات مطابقة</p>
            <p className="text-sm text-muted-foreground">جرّب كلمة تانية أو شيل الفلاتر.</p>
            <Button variant="outline" onClick={() => nav({ search: {} })}>مسح الفلاتر</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${active ? "border-transparent bg-gradient-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>
      {children}
    </button>
  );
}
