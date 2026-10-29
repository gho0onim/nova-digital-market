import { describe, expect, it } from "vitest";
import { cartTotal } from "@/lib/catalog";

describe("cart total", () => {
  it("multiplies price by quantity", () => {
    expect(cartTotal([{ price: 349, qty: 2 }, { price: 520, qty: 1 }])).toBe(1218);
  });
});
