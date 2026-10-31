import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartTotal, formatEGP, PAYMENT_METHODS, type Order } from "@/lib/catalog";
import { useCartLines, useStore } from "@/lib/store";
import { processPaymentDemo } from "@/lib/integrations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب (تجريبي) — NOVA VAULT" },
      { name: "description", content: "صفحة إتمام طلب تجريبية — لا يتم أي دفع حقيقي." },
      { property: "og:title", content: "إتمام الطلب — NOVA VAULT" },
      { property: "og:description", content: "صفحة إتمام طلب تجريبية." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const lines = useCartLines();
  const { addOrder, clearCart, ready } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", payment: "wallet" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const total = cartTotal(lines);

  if (ready && lines.length === 0)
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-semibold">السلة فاضية</p>
        <Button variant="hero" className="mt-4" asChild><Link to="/shop">ابدأ التسوق</Link></Button>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 3) er["name"] = "اكتب اسمك بالكامل";
    if (!/^01[0125]\d{8}$/.test(form.phone)) er["phone"] = "رقم موبايل مصري غير صحيح (مثال 01012345678)";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er["email"] = "إيميل غير صحيح";
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const order: Order = {
      id: "NV" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      customer: form.name, phone: form.phone, email: form.email,
      payment: PAYMENT_METHODS.find((m) => m.id === form.payment)!.label,
      items: lines.map((l) => ({ id: l.id, name: l.nameAr, qty: l.qty, price: l.price })),
      total, status: "pending",
    };
    try {
      const res = await processPaymentDemo(order);
      const final = { ...order, status: (res.ok ? "paid-demo" : "pending") as Order["status"] };
      const { error } = await supabase.from("orders").insert({
        id: final.id, customer: final.customer, phone: final.phone, email: final.email,
        payment: final.payment, items: final.items, total: final.total, status: final.status,
      });
      if (error) toast.warning("الطلب اتحفظ على جهازك بس، هنحاول نزامنه بعدين");
      addOrder(final);
      clearCart();
      nav({ to: "/order/$id", params: { id: order.id } });
    } catch {
      toast.error("حصلت مشكلة، حاول تاني");
      setBusy(false);
    }
  };

  const field = (k: "name" | "phone" | "email", label: string, type = "text", dir?: "ltr") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} dir={dir} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!err[k]} className="h-11" />
      {err[k] && <p className="text-xs text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/50 bg-warning/10 p-4 text-warning">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <p className="text-sm"><b>DEMO ONLY:</b> ده دفع تجريبي. مفيش أي بوابة دفع متوصلة ومش هيتخصم أي فلوس. متكتبش بيانات كارت حقيقية.</p>
      </div>
      <h1 className="mb-6 text-3xl font-bold">إتمام الطلب</h1>
      <form onSubmit={submit} className="grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">بياناتك</h2>
          {field("name", "الاسم بالكامل")}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("phone", "رقم الموبايل (واتساب)", "tel", "ltr")}
            {field("email", "الإيميل (هيوصلك عليه الكود)", "email", "ltr")}
          </div>
          <h2 className="pt-2 font-semibold">طريقة الدفع</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${form.payment === m.id ? "border-primary bg-accent" : ""}`}>
                <input type="radio" name="pay" className="accent-primary" checked={form.payment === m.id} onChange={() => setForm({ ...form, payment: m.id })} />
                {m.label}
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">🔌 مكان ربط بوابة الدفع مستقبلاً — غير مفعّل حاليًا.</p>
        </div>
        <aside className="h-fit space-y-4 rounded-2xl border bg-gradient-surface p-6">
          <h2 className="font-semibold">ملخص الطلب</h2>
          <ul className="space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-2"><span className="truncate">{l.nameAr} × {l.qty}</span><span>{formatEGP(l.price * l.qty)}</span></li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-3 font-bold"><span>الإجمالي</span><span className="font-display text-xl">{formatEGP(total)}</span></div>
          <Button variant="hero" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Loader2 className="animate-spin" /> جاري المعالجة…</> : <><Lock /> تأكيد الطلب (Demo)</>}
          </Button>
        </aside>
      </form>
    </div>
  );
}
