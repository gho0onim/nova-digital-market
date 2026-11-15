import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQS = [
  { q: "الكود بيوصل إمتى؟", a: "بعد مراجعة إيصال التحويل بنبعتلك الكود على واتساب أو الإيميل خلال دقائق." },
  { q: "إيه طرق الدفع المتاحة؟", a: "المحافظ الإلكترونية (فودافون كاش وغيرها) و InstaPay، وبعدها تبعت صورة الإيصال على واتساب." },
  { q: "المنتجات أصلية؟", a: "المتجر مصمم لبيع منتجات رقمية رسمية من موزعين معتمدين فقط. مش بنبيع حسابات ولا بيانات دخول لأي حد." },
  { q: "شحن الألعاب بيتم إزاي؟", a: "بتكتب الـ Player ID بتاعك وقت الطلب والشحن بيتم على حسابك أنت مباشرة." },
  { q: "لو الكود مشتغلش؟", a: "تواصل مع الدعم برقم الطلب وهنراجع المشكلة مع المورد ونستبدل الكود أو نرجعلك فلوسك حسب السياسة." },
  { q: "الأسعار بالجنيه ولا بالدولار؟", a: "كل الأسعار بالجنيه المصري وشاملة أي رسوم." },
];

export function FaqList({ limit }: { limit?: number }) {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
      {FAQS.slice(0, limit ?? FAQS.length).map((f, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger className="text-start">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
