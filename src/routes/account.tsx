import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircle, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي — NOVA VAULT" },
      { name: "description", content: "إدارة بيانات ملفك الشخصي في NOVA VAULT." },
      { property: "og:title", content: "حسابي — NOVA VAULT" },
      { property: "og:description", content: "راجع بيانات ملفك الشخصي وحدّث اسمك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, setDisplayName } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.displayName ?? "");
  }, [user?.id, user?.displayName]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const displayName = name.trim();
    if (!displayName) {
      toast.error("اكتب اسمك الأول.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error("ماقدرناش نحفظ الاسم. جرب تاني.");
      return;
    }
    setDisplayName(displayName);
    toast.success("تم تحديث بياناتك.");
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("ماقدرناش نسجل خروج دلوقتي.");
      return;
    }
    await navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center" aria-label="جاري تحميل الحساب"><LoaderCircle className="size-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-4 py-12" dir="rtl">
        <UserRound className="size-8 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">سجّل الدخول لحسابك</h1>
        <p className="mt-3 leading-7 text-muted-foreground">ادخل أو أنشئ حسابًا عشان تدير بيانات ملفك.</p>
        <Button asChild variant="hero" className="mt-6"><Link to="/auth">تسجيل الدخول</Link></Button>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[65vh] max-w-4xl px-4 py-12" dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-sm font-semibold text-primary">NOVA VAULT</p>
          <h1 className="mt-2 text-3xl font-bold">حسابي</h1>
          <p className="mt-2 text-sm text-muted-foreground">بيانات ملفك الشخصي.</p>
        </div>
        <Button type="button" variant="outline" onClick={signOut}><LogOut /> تسجيل الخروج</Button>
      </div>

      <form onSubmit={saveProfile} className="mt-8 max-w-lg space-y-5">
        <div className="space-y-2">
          <Label htmlFor="account-name">الاسم الظاهر</Label>
          <Input id="account-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-email">البريد الإلكتروني</Label>
          <Input id="account-email" type="email" dir="ltr" value={user.email} readOnly className="text-left" />
        </div>
        <Button type="submit" variant="hero" disabled={saving}>{saving && <LoaderCircle className="animate-spin" />}حفظ التغييرات</Button>
      </form>
    </section>
  );
}