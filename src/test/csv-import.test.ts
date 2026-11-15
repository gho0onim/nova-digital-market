import { describe, it, expect } from "vitest";
import { validateRows } from "@/lib/csv-import";
const H = "nameAr,name,category,price,oldPrice,stock,status,image\n";
describe("CSV import", () => {
  it("accepts a valid row", () => {
    const [r] = validateRows(H + 'كارت,Card,gift-cards,100,150,5,active,https://x.com/a.jpg');
    expect(r!.errors).toEqual([]); expect(r!.product?.price).toBe(100);
  });
  it("rejects zero price and bad category", () => {
    const [r] = validateRows(H + "كارت,Card,nope,0,,5,active,");
    expect(r!.product).toBeNull(); expect(r!.errors.length).toBe(2);
  });
});
