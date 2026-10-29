import { createFileRoute } from "@tanstack/react-router";
import { FaqList } from "@/components/shop/FaqList";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — NOVA VAULT" },
      { name: "description", content: "إجابات عن الدفع والتسليم وأصالة المنتجات الرقمية في NOVA VAULT." },
      { property: "og:title", content: "الأسئلة الشائعة — NOVA VAULT" },
      { property: "og:description", content: "إجابات عن الدفع والتسليم وأصالة المنتجات الرقمية." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">الأسئلة الشائعة</h1>
      <p className="mb-8 text-muted-foreground">كل اللي محتاج تعرفه قبل ما تطلب.</p>
      <FaqList />
    </div>
  ),
});
