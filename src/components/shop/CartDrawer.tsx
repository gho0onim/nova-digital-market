import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cartTotal, formatEGP } from "@/lib/catalog";
import { useCartLines, useStore } from "@/lib/store";
import { ProductArt } from "./ProductArt";

export function CartDrawer() {
  const { cartOpen, setCartOpen, setQty } = useStore();
  const lines = useCartLines();
  const total = cartTotal(lines);
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md" dir="rtl">
        <SheetHeader>
          <SheetTitle>سلة المشتريات</SheetTitle>
          <SheetDescription>{lines.length ? `${lines.length} منتج` : "السلة فاضية"}</SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-accent"><ShoppingBag className="size-8 text-primary" /></div>
            <p className="text-muted-foreground">لسه مضفتش أي حاجة للسلة.</p>
            <Button variant="hero" asChild onClick={() => setCartOpen(false)}><Link to="/shop">تصفح المنتجات</Link></Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3 rounded-xl border bg-card p-2">
                  <ProductArt product={l} className="size-16 shrink-0 [&>div:last-child]:hidden [&>div]:text-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{l.nameAr}</p>
                    <p className="text-sm text-primary">{formatEGP(l.price)}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Button size="icon" variant="outline" className="size-7" onClick={() => setQty(l.id, l.qty + 1)} aria-label="زيادة"><Plus /></Button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <Button size="icon" variant="outline" className="size-7" onClick={() => setQty(l.id, l.qty - 1)} aria-label="تقليل"><Minus /></Button>
                      <Button size="icon" variant="ghost" className="ms-auto size-7 text-destructive" onClick={() => setQty(l.id, 0)} aria-label="حذف"><Trash2 /></Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t p-4">
              <div className="flex justify-between font-semibold"><span>الإجمالي</span><span className="font-display text-lg">{formatEGP(total)}</span></div>
              <Button variant="hero" size="lg" className="w-full" asChild onClick={() => setCartOpen(false)}>
                <Link to="/checkout">إتمام الطلب (Demo)</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
