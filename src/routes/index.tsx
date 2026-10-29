import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Headphones, Wallet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/shop/ProductCard";
import { FaqList } from "@/components/shop/FaqList";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOVA VAULT — كروت هدايا وشحن ألعاب واشتراكات" },
      { name: "description", content: "متجر رقمي مصري: كروت هدايا، شحن ألعاب، رخص برامج أصلية واشتراكات بالجنيه المصري." },
      { property: "og:title", content: "NOVA VAULT — متجر المنتجات الرقمية" },
      { property: "og:description", content: "كروت هدايا، شحن ألعاب، رخص برامج أصلية واشتراكات بالجنيه المصري." },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  const live = products.filter((p) => p.status !== "draft");
  const featured = live.filter((p) => p.featured).slice(0, 4);
  const best = live.filter((p) => p.bestseller).slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex rounded-full border border-primary/40 bg-accent/60 px-3 py-1 text-xs text-accent-foreground">⚡ تسليم رقمي سريع — بالجنيه المصري</span>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              كل اللي محتاجه <span className="text-gradient">رقميًا</span>، في مكان واحد.
            </h1>
            <p className="text-lg text-muted-foreground">كروت هدايا، شحن ألعاب، رخص برامج أصلية واشتراكات — ادفع بالمحفظة أو InstaPay أو فوري.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild><Link to="/shop">تسوّق دلوقتي <ArrowLeft /></Link></Button>
              <Button variant="outline" size="lg" asChild><Link to="/faq">إزاي بنشتغل؟</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="-mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/shop" search={{ cat: c.id }}
              className="relative flex items-center gap-3 rounded-2xl border bg-card/90 p-4 backdrop-blur transition hover:border-primary hover:shadow-glow">
              <span className="text-2xl">{c.emoji}</span>
              <span className="font-semibold">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section title="منتجات مميزة" link>
        <Grid>{featured.map((p) => <ProductCard key={p.id} product={p} />)}</Grid>
      </Section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid gap-4 rounded-3xl border bg-gradient-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Zap, t: "تسليم سريع", d: "الكود يوصلك على الإيميل والواتساب" },
            { i: ShieldCheck, t: "منتجات أصلية", d: "من موزعين معتمدين فقط" },
            { i: Wallet, t: "دفع محلي", d: "محافظ، InstaPay، فوري، كروت" },
            { i: Headphones, t: "دعم بالعربي", d: "فريق يرد عليك طول اليوم" },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="flex gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent"><I className="size-5 text-primary" /></div>
              <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <Section title="الأكثر مبيعًا 🔥" link>
        <Grid>{best.map((p) => <ProductCard key={p.id} product={p} />)}</Grid>
      </Section>

      <Section title="أسئلة شائعة">
        <div className="max-w-3xl"><FaqList limit={4} /></div>
      </Section>
    </div>
  );
}

function Section({ title, link, children }: { title: string; link?: boolean; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        {link && <Link to="/shop" className="text-sm text-primary hover:underline">عرض الكل ←</Link>}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">{children}</div>;
}
