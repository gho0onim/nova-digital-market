import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/catalog";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            متجر منتجات رقمية أصلية: كروت هدايا، شحن ألعاب، رخص برامج واشتراكات — من موزعين معتمدين فقط. لا نبيع حسابات أو بيانات دخول.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">الأقسام</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link to="/shop" search={{ cat: c.id }} className="hover:text-foreground">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">المساعدة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/faq" className="hover:text-foreground">الأسئلة الشائعة</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">لوحة التحكم (Demo)</Link></li>
            <li>support@example.com (بريد تجريبي)</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © 2026 NOVA VAULT — نموذج أولي تجريبي. جميع الأسماء التجارية والأسعار أمثلة للعرض.
      </div>
    </footer>
  );
}
