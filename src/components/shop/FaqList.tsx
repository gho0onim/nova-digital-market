import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQS = [
  { q: "الكود بيوصل إمتى؟", a: "في النسخة الحقيقية الكود هيوصل خلال دقائق على الإيميل. في النسخة التجريبية دي مفيش تسليم فعلي." },
  { q: "إيه طرق الدفع المتاحة؟", a: "مخطط ندعم الكروت البنكية وميزة، المحافظ الإلكترونية، InstaPay وفوري. حاليًا الدفع تجريبي فقط ومفيش أي خصم فلوس." },
  { q: "المنتجات أصلية؟", a: "المتجر مصمم لبيع منتجات رقمية رسمية من موزعين معتمدين فقط. مش بنبيع حسابات ولا بيانات دخول لأي حد." },
  { q: "شحن الألعاب بيتم إزاي؟", a: "بتكتب الـ Player ID بتاعك وقت الطلب والشحن بيتم على حسابك أنت مباشرة." },
  { q: "لو الكود مشتغلش؟", a: "تواصل مع الدعم برقم الطلب وهنراجع المشكلة مع المورد ونستبدل الكود أو نرجعلك فلوسك حسب السياسة." },
  { q: "الأسعار بالجنيه ولا بالدولار؟", a: "كل الأسعار بالجنيه المصري وشاملة أي رسوم. الأسعار الموجودة حاليًا أمثلة تجريبية." },
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
