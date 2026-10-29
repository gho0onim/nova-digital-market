// INTEGRATION HOOKS — placeholders only. Nothing here processes real payments
// or delivers real codes. Replace these with a server-side implementation
// (e.g. a payment gateway such as Paymob/Fawry/Stripe and a supplier API).
import type { Order } from "./catalog";

export interface PaymentResult { ok: boolean; reference: string; demo: true }

/** TODO: connect a real payment gateway on the server. */
export async function processPaymentDemo(order: Order): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return { ok: true, reference: "DEMO-" + order.id, demo: true };
}

/** TODO: connect automatic fulfillment (supplier/codes API) on the server. */
export async function fulfillOrderDemo(_order: Order): Promise<{ delivered: false; note: string }> {
  return { delivered: false, note: "التسليم التلقائي غير مفعّل — نسخة تجريبية" };
}
