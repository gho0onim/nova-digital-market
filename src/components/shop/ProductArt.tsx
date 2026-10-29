import { CATEGORIES, type Product } from "@/lib/catalog";

// Generated card art (no third-party brand assets). Hue comes from editable catalog data.
export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  const emoji = CATEGORIES.find((c) => c.id === product.category)?.emoji;
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-surface ${className}`}
      style={{
        backgroundImage: `radial-gradient(120% 80% at 100% 0%, oklch(0.55 0.22 ${product.hue} / 0.75), transparent 60%), radial-gradient(80% 80% at 0% 100%, oklch(0.45 0.2 ${(product.hue + 40) % 360} / 0.5), transparent 60%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 grid place-items-center text-5xl drop-shadow-lg">{emoji}</div>
      <div className="absolute bottom-3 start-3 end-3 truncate font-display text-xs font-semibold tracking-wide text-foreground/90" dir="ltr">
        {product.name}
      </div>
    </div>
  );
}
