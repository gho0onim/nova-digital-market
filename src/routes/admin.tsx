import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2, Package, Receipt, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CATEGORIES, categoryLabel, formatEGP, type Order, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم (تجريبية) — NOVA VAULT" },
      { name: "description", content: "لوحة تحكم تجريبية لإدارة المنتجات والطلبات." },
      { property: "og:title", content: "لوحة التحكم — NOVA VAULT" },
      { property: "og:description", content: "لوحة تحكم تجريبية." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const STATUS: Record<Product["status"], { l: string; c: string }> = {
  active: { l: "نشط", c: "bg-success/15 text-success" },
  draft: { l: "مسودة", c: "bg-muted text-muted-foreground" },
  out: { l: "نفذ", c: "bg-destructive/15 text-destructive" },
};
const ORDER_STATUS: Record<Order["status"], string> = { pending: "قيد الانتظار", "paid-demo": "مدفوع (تجريبي)", "delivered-demo": "تم التسليم (تجريبي)" };

function useDbOrders() {
  const [rows, setRows] = useState<Order[] | null>(null);
  const [state, setState] = useState<"loading" | "guest" | "forbidden" | "ok" | "error">("loading");
  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setState("guest"); return; }
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) { setState("error"); return; }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) { setState("forbidden"); return; }
    setRows(data.map((r) => ({ id: r.id, createdAt: r.created_at, customer: r.customer, phone: r.phone, email: r.email, payment: r.payment, items: r.items as Order["items"], total: Number(r.total), status: r.status as Order["status"] })));
    setState("ok");
  };
  useEffect(() => {
    load();
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN" || e === "SIGNED_OUT") load(); });
    return () => data.subscription.unsubscribe();
  }, []);
  return { rows, state, setRows };
}

function AdminLogin({ state }: { state: string }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false);
  if (state === "forbidden") return (
    <div className="mb-6 rounded-2xl border border-warning/50 bg-warning/10 p-4 text-sm text-warning">
      حسابك مش أدمن، فشايف طلبات جهازك بس. <button className="underline" onClick={() => supabase.auth.signOut()}>خروج</button>
    </div>
  );
  return (
    <form className="mb-6 flex flex-wrap items-end gap-2 rounded-2xl border bg-card p-4" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false); if (error) toast.error("بيانات الدخول غلط");
    }}>
      <p className="w-full text-sm text-muted-foreground">سجّل دخول كأدمن عشان تشوف كل الطلبات المحفوظة في قاعدة البيانات.</p>
      <Input dir="ltr" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 w-56" />
      <Input dir="ltr" type="password" placeholder="password" value={pw} onChange={(e) => setPw(e.target.value)} className="h-10 w-48" />
      <Button disabled={busy}>دخول</Button>
    </form>
  );
}

function Admin() {
  const { products, setProducts, resetCatalog, orders: localOrders, updateOrder: updateLocal } = useStore();
  const db = useDbOrders();
  const orders = db.state === "ok" && db.rows ? db.rows : localOrders;
  const updateOrder = async (id: string, status: Order["status"]) => {
    if (db.state === "ok") {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) return toast.error("ماقدرناش نحدث الطلب");
      db.setRows((r) => r && r.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("تم تحديث الطلب");
    } else updateLocal(id, status);
  };
  const [edit, setEdit] = useState<Product | null>(null);
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const low = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const dayAgo = Date.now() - 864e5;
  const fresh = orders.filter((o) => new Date(o.createdAt).getTime() > dayAgo);
  const pending = orders.filter((o) => o.status === "pending");
  const byPay = Object.entries(fresh.reduce<Record<string, number>>((a, o) => ((a[o.payment] = (a[o.payment] || 0) + 1), a), {}));

  const save = (p: Product) => {
    setProducts((l) => (l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [p, ...l]));
    setEdit(null);
    toast.success("تم الحفظ (محليًا)");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">نموذج تجريبي — التعديلات محفوظة في المتصفح بس، مفيش سيرفر متوصل.</p>
        </div>
        <Button variant="outline" onClick={() => { resetCatalog(); toast("رجّعنا الكتالوج الافتراضي"); }}><RotateCcw /> استرجاع الكتالوج</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="المبيعات (تجريبي)" value={formatEGP(revenue)} />
        <Stat icon={Receipt} label="الطلبات" value={String(orders.length)} />
        <Stat icon={Package} label="منتجات نشطة" value={String(products.filter((p) => p.status === "active").length)} />
        <Stat icon={AlertTriangle} label="مخزون قليل" value={String(low)} />
      </div>

      <Tabs defaultValue="products" className="mt-8" dir="rtl">
        <TabsList><TabsTrigger value="products">المنتجات</TabsTrigger><TabsTrigger value="orders">الطلبات</TabsTrigger><TabsTrigger value="integrations">التكاملات</TabsTrigger></TabsList>

        <TabsContent value="products" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button variant="hero" onClick={() => setEdit({ id: "p" + Date.now(), name: "", nameAr: "", category: "gift-cards", price: 100, stock: 10, status: "draft", region: "مصر", delivery: "كود رقمي", description: "", hue: 295 })}><Plus /> منتج جديد</Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b text-muted-foreground"><tr className="[&>th]:p-3 [&>th]:text-start"><th>المنتج</th><th>القسم</th><th>السعر (ج.م)</th><th>المخزون</th><th>الحالة</th><th /></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 [&>td]:p-3">
                    <td><div className="font-medium">{p.nameAr || "—"}</div><div className="text-xs text-muted-foreground" dir="ltr">{p.name}</div></td>
                    <td>{categoryLabel(p.category)}</td>
                    <td>
                      <Input type="number" min={0} value={p.price} aria-label="السعر" className="h-8 w-28"
                        onChange={(e) => setProducts((l) => l.map((x) => (x.id === p.id ? { ...x, price: Math.max(0, Number(e.target.value)) } : x)))} />
                    </td>
                    <td className={p.stock < 10 ? "text-warning" : ""}>{p.stock}</td>
                    <td><span className={`rounded-full px-2 py-0.5 text-xs ${STATUS[p.status].c}`}>{STATUS[p.status].l}</span></td>
                    <td className="whitespace-nowrap text-end">
                      <Button size="icon" variant="ghost" onClick={() => setEdit(p)} aria-label="تعديل"><Pencil /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" aria-label="حذف"
                        onClick={() => { if (confirm("تحذف المنتج؟")) setProducts((l) => l.filter((x) => x.id !== p.id)); }}><Trash2 /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="p-10 text-center text-muted-foreground">مفيش منتجات. ضيف منتج جديد أو استرجع الكتالوج.</p>}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">لسه مفيش طلبات. اعمل طلب تجريبي من المتجر.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b text-muted-foreground"><tr className="[&>th]:p-3 [&>th]:text-start"><th>رقم</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0 [&>td]:p-3">
                      <td dir="ltr" className="font-display">#{o.id}</td>
                      <td>{o.customer}<div className="text-xs text-muted-foreground" dir="ltr">{o.phone}</div></td>
                      <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                      <td>{formatEGP(o.total)}</td>
                      <td>
                        <select value={o.status} onChange={(e) => updateOrder(o.id, e.target.value as Order["status"])} className="h-8 rounded-md border bg-background px-2">
                          {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            { t: "بوابة الدفع", d: "مكان ربط Paymob / Fawry / InstaPay أو غيرها عن طريق السيرفر." },
            { t: "التسليم التلقائي", d: "ربط API مورد معتمد لإرسال الأكواد تلقائيًا بعد الدفع." },
            { t: "إشعارات واتساب / إيميل", d: "إرسال تأكيد الطلب والأكواد للعميل." },
            { t: "قاعدة بيانات", d: "حاليًا كل البيانات في المتصفح. محتاج backend للحفظ الدائم." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between"><h3 className="font-semibold">{x.t}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">غير متصل</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <ProductDialog product={edit} onClose={() => setEdit(null)} onSave={save} />
    </div>
  );
}

function Stat({ icon: I, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-gradient-surface p-4">
      <I className="size-5 text-primary" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold">{value}</p>
    </div>
  );
}

function ProductDialog({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const [p, setP] = useState<Product | null>(product);
  const [last, setLast] = useState(product);
  if (product !== last) { setLast(product); setP(product); }
  if (!p) return null;
  const f = (k: keyof Product, label: string, type = "text", dir?: "ltr") => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={type} dir={dir} value={String(p[k] ?? "")} onChange={(e) => setP({ ...p, [k]: type === "number" ? Number(e.target.value) : e.target.value })} />
    </div>
  );
  const valid = p.nameAr.trim() && p.name.trim() && p.price >= 0;
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{product?.name ? "تعديل منتج" : "منتج جديد"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {f("nameAr", "الاسم بالعربي")}
          {f("name", "English name", "text", "ltr")}
          {f("price", "السعر (ج.م)", "number")}
          {f("oldPrice", "السعر قبل الخصم", "number")}
          {f("stock", "المخزون", "number")}
          {f("region", "المنطقة")}
          <div className="space-y-1">
            <Label>القسم</Label>
            <select value={p.category} onChange={(e) => setP({ ...p, category: e.target.value as Product["category"] })} className="h-9 w-full rounded-md border bg-background px-2">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label>الحالة</Label>
            <select value={p.status} onChange={(e) => setP({ ...p, status: e.target.value as Product["status"] })} className="h-9 w-full rounded-md border bg-background px-2">
              <option value="active">نشط</option><option value="draft">مسودة</option><option value="out">نفذ</option>
            </select>
          </div>
          <div className="sm:col-span-2">{f("description", "الوصف")}</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" checked={!!p.featured} onChange={(e) => setP({ ...p, featured: e.target.checked })} /> مميز</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" checked={!!p.bestseller} onChange={(e) => setP({ ...p, bestseller: e.target.checked })} /> الأكثر مبيعًا</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button variant="hero" disabled={!valid} onClick={() => { const { oldPrice, ...rest } = p; onSave(oldPrice ? { ...rest, oldPrice } : rest); }}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
