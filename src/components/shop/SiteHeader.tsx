import { Link } from "@tanstack/react-router";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" dir="ltr">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary font-display font-bold text-primary-foreground shadow-glow">N</span>
      <span className="font-display text-lg font-bold tracking-[0.2em]">NOVA<span className="text-gradient">VAULT</span></span>
    </Link>
  );
}

export function SiteHeader() {
  const { cart, setCartOpen } = useStore();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      <div className="bg-gradient-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
        نسخة تجريبية (DEMO) — الأسعار والمنتجات للعرض فقط ولا يتم أي دفع حقيقي
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>الرئيسية</Link>
            <Link to="/shop" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>كل المنتجات</Link>
            <Link to="/faq" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>الأسئلة الشائعة</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="لوحة التحكم">
              <Link to="/admin"><LayoutDashboard /></Link>
            </Button>
            <Button variant="outline" className="relative" onClick={() => setCartOpen(true)} aria-label="السلة">
              <ShoppingBag /> <span className="hidden sm:inline">السلة</span>
              {count > 0 && <span className="absolute -top-2 -start-2 grid size-5 place-items-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground">{count}</span>}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
