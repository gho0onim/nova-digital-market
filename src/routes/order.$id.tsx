import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEGP } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "تأكيد الطلب (تجريبي) — NOVA VAULT" },
      { name: "description", content: "تأكيد طلب تجريبي." },
      { property: "og:title", content: "تأكيد الطلب — NOVA VAULT" },
      { property: "og:description", content: "تأكيد طلب تجريبي." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { orders, ready } = useStore();
  const o = orders.find((x) => x.id === id);
  if (!ready) return null;
  if (!o) return <div className="py-24 text-center"><p className="text-xl font-semibold">الطلب مش موجود</p><Button className="mt-4" variant="hero" asChild><Link to="/">الرئيسية</Link></Button></div>;
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto size-16 text-success" />
      <h1 className="mt-4 text-3xl font-bold">تم استلام طلبك!</h1>
      <p className="mt-2 text-muted-foreground">رقم الطلب <span className="font-display font-bold text-foreground" dir="ltr">#{o.id}</span></p>
      <div className="mt-8 space-y-2 rounded-2xl border bg-card p-6 text-start text-sm">
        {o.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{formatEGP(i.price * i.qty)}</span></div>)}
        <div className="flex justify-between border-t pt-2 font-bold"><span>الإجمالي</span><span>{formatEGP(o.total)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>الدفع</span><span>{o.payment}</span></div>
      </div>
      <div className="mt-4 flex gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-start text-xs text-warning">
        <Info className="size-4 shrink-0" /> طلب تجريبي: مفيش دفع حقيقي اتعمل ومفيش أكواد هتتبعت. التسليم التلقائي لسه مش متوصل.
      </div>
      <Button variant="hero" className="mt-8" asChild><Link to="/shop">كمّل تسوق</Link></Button>
    </div>
  );
}
