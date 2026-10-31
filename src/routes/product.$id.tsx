import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_PRODUCTS, categoryLabel, formatEGP } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/shop/ProductArt";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/product/$id")({
  staticData: { sitemap: true },
  head: ({ params }) => {
    const product = DEMO_PRODUCTS.find((x) => x.id === params.id && x.status !== "draft");
    if (!product) {
      return { meta: [{ title: "المنتج مش متاح — NOVA VAULT" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${product.nameAr} (${product.name}) — NOVA VAULT`;
    const description = `${product.description} السعر ${formatEGP(product.price)} — ${product.delivery}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, addToCart, ready } = useStore();
  const p = products.find((x) => x.id === id);

  if (!ready) return <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2"><Skeleton className="aspect-square rounded-3xl" /><Skeleton className="h-80 rounded-3xl" /></div>;
  if (!p || p.status === "draft")
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-semibold">المنتج ده مش متاح</p>
        <Button variant="hero" className="mt-4" asChild><Link to="/shop">ارجع للمنتجات</Link></Button>
      </div>
    );

  const out = p.stock <= 0 || p.status === "out";
  const related = products.filter((x) => x.category === p.category && x.id !== p.id && x.status !== "draft").slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">الرئيسية</Link> / <Link to="/shop" search={{ cat: p.category }} className="hover:text-foreground">{categoryLabel(p.category)}</Link>
      </nav>
      <div className="grid gap-8 md:grid-cols-2">
        <ProductArt product={p} className="aspect-square shadow-glow [&>div:first-child]:text-8xl" />
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold">{p.nameAr}</h1>
            <p className="mt-1 font-display text-muted-foreground" dir="ltr">{p.name}</p>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-gradient">{formatEGP(p.price)}</span>
            {p.oldPrice && <span className="text-muted-foreground line-through">{formatEGP(p.oldPrice)}</span>}
          </div>
          <p className="text-muted-foreground">{p.description}</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-2"><Zap className="size-4 text-primary" /> {p.delivery}</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> منتج أصلي من موزع معتمد</li>
            <li className="flex items-center gap-2"><Check className="size-4 text-primary" /> المنطقة: {p.region}</li>
            <li className="flex items-center gap-2"><Check className={`size-4 ${out ? "text-destructive" : "text-success"}`} /> {out ? "نفذت الكمية" : `متاح (${p.stock})`}</li>
          </ul>
          <Button variant="hero" size="lg" className="w-full sm:w-auto" disabled={out} onClick={() => addToCart(p.id)}>
            <ShoppingBag /> {out ? "غير متاح حاليًا" : "أضف للسلة"}
          </Button>
          <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning">منتج وسعر تجريبي للعرض فقط.</p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-bold">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  );
}
