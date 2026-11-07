import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول أو إنشاء حساب — NOVA VAULT" },
      { name: "description", content: "سجّل الدخول أو أنشئ حسابك في NOVA VAULT لمتابعة مشترياتك وبيانات ملفك." },
      { property: "og:title", content: "حسابك في NOVA VAULT" },
      { property: "og:description", content: "دخول آمن أو إنشاء حساب جديد لمتابعة مشترياتك الرقمية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function explainAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "الإيميل أو كلمة المرور غير صحيحة.";
  if (normalized.includes("already registered") || normalized.includes("already been registered")) return "الإيميل مسجل بالفعل. جرّب تسجيل الدخول.";
  if (normalized.includes("password") && normalized.includes("least")) return "كلمة المرور أقصر من الحد المسموح.";
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) return "محاولات كثيرة في وقت قصير. استنى شوية وجرب تاني.";
  return "ماقدرناش نكمل الطلب دلوقتي. راجع البيانات وجرب تاني.";
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim() },
          },
        });
        if (error) {
          toast.error(explainAuthError(error.message));
          return;
        }
        if (!data.session) {
          setNotice("بعتنالك رابط تأكيد على بريدك الإلكتروني. افتحه لتفعيل الحساب، وبعدها سجّل الدخول.");
          setMode("signin");
          setPassword("");
          return;
        }
        toast.success("تم إنشاء حسابك بنجاح.");
        await navigate({ to: "/account" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(explainAuthError(error.message));
        return;
      }
      await navigate({ to: "/account" });
    } catch {
      toast.error("حصلت مشكلة في الاتصال. جرب تاني بعد شوية.");
    } finally {
      setBusy(false);
    }
  };

  const signInWithProvider = async (provider: "google" | "lovable") => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) {
        toast.error("ماقدرناش نبدأ تسجيل الدخول بالطريقة دي. جرب تاني.");
        return;
      }
      if (!result.redirected) await navigate({ to: "/account" });
    } catch {
      toast.error("ماقدرناش نبدأ تسجيل الدخول بالطريقة دي. جرب تاني.");
    } finally {
      setBusy(false);
    }
  };

  const sendResetLink = async () => {
    if (!email.trim()) {
      toast.error("اكتب بريدك الإلكتروني الأول.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(explainAuthError(error.message));
      else toast.success("لو البريد مسجل، هيوصلك رابط لتغيير كلمة المرور.");
    } catch {
      toast.error("ماقدرناش نبعت الرابط دلوقتي. جرب تاني.");
    } finally {
      setBusy(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <section className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-[1fr_420px] lg:py-20" dir="rtl">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-primary">NOVA VAULT · حساب العميل</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">مشترياتك الرقمية، <span className="text-gradient">في مكان واحد.</span></h1>
        <p className="mt-5 max-w-lg leading-8 text-muted-foreground">أنشئ حسابك أو سجّل الدخول عشان تتابع مشترياتك وتحافظ على بيانات ملفك محدثة.</p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><LockKeyhole className="size-4 text-primary" /> حساب محمي</span>
          <span>·</span>
          <span>بياناتك خاصة بحسابك</span>
        </div>
      </div>

      <div className="w-full border-t border-border pt-8 lg:border-t-0 lg:border-r lg:pt-0 lg:pr-10">
        <div className="mb-6 grid grid-cols-2 border-b border-border" role="tablist" aria-label="اختيار نوع الدخول">
          <Button type="button" role="tab" aria-selected={!isSignup} variant="ghost" className={`rounded-none border-b-2 ${!isSignup ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`} onClick={() => { setMode("signin"); setNotice(""); }}>تسجيل الدخول</Button>
          <Button type="button" role="tab" aria-selected={isSignup} variant="ghost" className={`rounded-none border-b-2 ${isSignup ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`} onClick={() => { setMode("signup"); setNotice(""); }}>حساب جديد</Button>
        </div>

        {notice && <p role="status" className="mb-5 border-r-2 border-success bg-success/10 px-4 py-3 text-sm leading-6 text-success">{notice}</p>}

        <form onSubmit={submit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="display-name">الاسم</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="display-name" autoComplete="name" className="pr-10" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="الاسم اللي تحب يظهر" required maxLength={80} />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" dir="ltr" autoComplete="email" className="pl-3 pr-10 text-left" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} className="pr-10" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
          </div>
          {!isSignup && <div className="text-left"><Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={sendResetLink} disabled={busy}>نسيت كلمة المرور؟</Button></div>}
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : <ArrowLeft />}
            {isSignup ? "إنشاء الحساب" : "دخول"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />أو كمّل باستخدام<span className="h-px flex-1 bg-border" /></div>
        <div className="grid gap-3">
          <Button type="button" variant="outline" className="h-11 gap-2 border-[#747775] bg-[#FFFFFF] px-3 text-sm font-medium text-[#1F1F1F] hover:bg-[#F2F2F2] hover:text-[#1F1F1F]" onClick={() => signInWithProvider("google")} disabled={busy}>
            <GoogleMark />
            متابعة باستخدام Google
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={() => signInWithProvider("lovable")} disabled={busy}>متابعة باستخدام Lovable</Button>
        </div>
        <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">بإنشاء حساب، أنت توافق على استخدام بيانات الحساب لحفظ ملفك ومشترياتك.</p>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}