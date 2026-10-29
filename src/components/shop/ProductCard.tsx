import { Link } from "@tanstack/react-router";
import { ShoppingBag, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEGP, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const out = product.stock <= 0 || product.status === "out";
  return (
    <article className="group flex flex-col rounded-2xl border bg-card p-3 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block">
        <ProductArt product={product} className="aspect-[4/3]" />
        {product.bestseller && (
          <span className="absolute top-2 start-2 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            <Flame className="size-3" /> الأكثر مبيعًا
          </span>
        )}
        {out && <span className="absolute top-2 end-2 rounded-full bg-background/80 px-2 py-0.5 text-[11px]">نفذت الكمية</span>}
      </Link>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-1 font-semibold hover:text-primary">{product.nameAr}</Link>
        <p className="line-clamp-1 text-xs text-muted-foreground" dir="ltr">{product.name}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="font-display text-lg font-bold">{formatEGP(product.price)}</div>
            {product.oldPrice && <div className="text-xs text-muted-foreground line-through">{formatEGP(product.oldPrice)}</div>}
          </div>
          <Button size="icon" variant="hero" disabled={out} onClick={() => addToCart(product.id)} aria-label={`أضف ${product.nameAr} للسلة`}>
            <ShoppingBag />
          </Button>
        </div>
      </div>
    </article>
  );
}
