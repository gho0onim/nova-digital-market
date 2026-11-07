import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "تغيير كلمة المرور — NOVA VAULT" },
      { name: "description", content: "أنشئ كلمة مرور جديدة لحسابك في NOVA VAULT." },
      { property: "og:title", content: "تغيير كلمة المرور — NOVA VAULT" },
      { property: "og:description", content: "استعد الوصول إلى حسابك بكلمة مرور جديدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [recoveryLink, setRecoveryLink] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setRecoveryLink(params.get("type") === "recovery");
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recoveryLink) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("ماقدرناش نغيّر كلمة المرور. افتح رابط الاستعادة من بريدك وجرب تاني.");
      return;
    }
    toast.success("تم تغيير كلمة المرور. سجّل الدخول بكلمتك الجديدة.");
    await navigate({ to: "/auth", replace: true });
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12" dir="rtl">
      <div className="w-full border-t border-border pt-8">
        <p className="text-sm font-semibold text-primary">NOVA VAULT</p>
        <h1 className="mt-3 text-3xl font-bold">كلمة مرور جديدة</h1>
        {recoveryLink ? (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">اكتب كلمة المرور الجديدة</Label>
              <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />}حفظ كلمة المرور</Button>
          </form>
        ) : (
          <div className="mt-5 space-y-5">
            <p className="leading-7 text-muted-foreground">رابط الاستعادة غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا من صفحة الدخول.</p>
            <Button asChild variant="outline"><Link to="/auth">العودة لتسجيل الدخول</Link></Button>
          </div>
        )}
      </div>
    </section>
  );
}