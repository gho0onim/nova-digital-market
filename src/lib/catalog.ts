// DEMO CATALOG — all products, prices and stock are editable placeholders.
export type CategoryId = "gift-cards" | "game-topups" | "software" | "subscriptions" | "tools";
export type ProductStatus = "active" | "draft" | "out";

export interface Product {
  id: string;
  name: string; // English product name
  nameAr: string;
  category: CategoryId;
  price: number; // EGP
  oldPrice?: number;
  stock: number;
  status: ProductStatus;
  bestseller?: boolean;
  featured?: boolean;
  region: string;
  delivery: string;
  description: string;
  hue: number; // card art hue
}

export interface Order {
  id: string;
  createdAt: string;
  customer: string;
  phone: string;
  email: string;
  payment: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "paid-demo" | "delivered-demo";
}

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "gift-cards", label: "كروت هدايا", emoji: "🎁" },
  { id: "game-topups", label: "شحن ألعاب", emoji: "🎮" },
  { id: "software", label: "رخص برامج", emoji: "🔑" },
  { id: "subscriptions", label: "اشتراكات", emoji: "📺" },
  { id: "tools", label: "أدوات رقمية", emoji: "🛠️" },
];

export const PAYMENT_METHODS = [
  { id: "card", label: "كارت بنكي (Visa / Meeza)" },
  { id: "wallet", label: "محفظة موبايل (Vodafone Cash وغيرها)" },
  { id: "instapay", label: "InstaPay" },
  { id: "fawry", label: "Fawry" },
];

const p = (o: Omit<Product, "status"> & { status?: ProductStatus }): Product => ({ status: "active", ...o });

export const DEMO_PRODUCTS: Product[] = [
  p({ id: "gc-store-500", name: "Store Gift Card 500 EGP", nameAr: "كارت هدايا متجر ٥٠٠ جنيه", category: "gift-cards", price: 520, stock: 40, bestseller: true, featured: true, region: "مصر", delivery: "كود فوري بعد الدفع", description: "كارت هدايا رقمي بقيمة ٥٠٠ جنيه، مناسب كهدية لأي مناسبة. (منتج تجريبي)", hue: 295 }),
  p({ id: "gc-play-25", name: "Play Wallet Card $25", nameAr: "كارت محفظة ألعاب ٢٥ دولار", category: "gift-cards", price: 1290, oldPrice: 1350, stock: 18, featured: true, region: "US", delivery: "كود رقمي", description: "رصيد محفظة لمتاجر الألعاب الرسمية. (منتج تجريبي)", hue: 230 }),
  p({ id: "gc-music-10", name: "Music Gift Card $10", nameAr: "كارت هدايا موسيقى", category: "gift-cards", price: 540, stock: 0, status: "out", region: "Global", delivery: "كود رقمي", description: "رصيد لخدمات الموسيقى الرقمية. (منتج تجريبي)", hue: 155 }),
  p({ id: "gt-arena-1000", name: "Arena Legends 1000 Gems", nameAr: "١٠٠٠ جوهرة Arena Legends", category: "game-topups", price: 349, oldPrice: 399, stock: 120, bestseller: true, featured: true, region: "MENA", delivery: "شحن على الـ ID بتاعك", description: "شحن رسمي مباشر على حسابك باستخدام الـ Player ID. (منتج تجريبي)", hue: 330 }),
  p({ id: "gt-battle-pass", name: "Battle Royale Season Pass", nameAr: "باتل باس الموسم", category: "game-topups", price: 299, stock: 75, bestseller: true, region: "Global", delivery: "شحن على الـ ID", description: "باس الموسم الكامل بمكافآت حصرية. (منتج تجريبي)", hue: 20 }),
  p({ id: "gt-coins-5000", name: "Football Ultimate 5000 Points", nameAr: "٥٠٠٠ نقطة Football Ultimate", category: "game-topups", price: 1450, stock: 22, region: "Global", delivery: "كود رقمي", description: "نقاط داخل اللعبة لفتح الباكات. (منتج تجريبي)", hue: 140 }),
  p({ id: "sw-office", name: "Office Suite Home – 1 Year", nameAr: "حزمة أوفيس منزلي – سنة", category: "software", price: 1899, oldPrice: 2299, stock: 30, featured: true, bestseller: true, region: "Global", delivery: "مفتاح ترخيص أصلي", description: "رخصة أصلية لمدة سنة لجهاز واحد من موزع معتمد. (منتج تجريبي)", hue: 25 }),
  p({ id: "sw-antivirus", name: "Total Security Antivirus – 3 Devices", nameAr: "برنامج حماية – ٣ أجهزة", category: "software", price: 749, stock: 55, region: "Global", delivery: "مفتاح ترخيص", description: "حماية شاملة من الفيروسات لثلاث أجهزة لمدة سنة. (منتج تجريبي)", hue: 200 }),
  p({ id: "sw-os-pro", name: "OS Pro License", nameAr: "رخصة نظام تشغيل Pro", category: "software", price: 2650, stock: 8, region: "Global", delivery: "مفتاح ترخيص أصلي", description: "ترخيص رسمي لنظام التشغيل. (منتج تجريبي)", hue: 260 }),
  p({ id: "sub-stream-3m", name: "StreamPlus Premium – 3 Months", nameAr: "اشتراك StreamPlus بريميوم – ٣ شهور", category: "subscriptions", price: 690, stock: 60, bestseller: true, featured: true, region: "مصر", delivery: "كود تفعيل على حسابك", description: "كود اشتراك رسمي يتفعل على حسابك الشخصي. (منتج تجريبي)", hue: 350 }),
  p({ id: "sub-cloud-1y", name: "Cloud Storage 2TB – 1 Year", nameAr: "تخزين سحابي ٢ تيرا – سنة", category: "subscriptions", price: 1590, stock: 25, region: "Global", delivery: "كود تفعيل", description: "مساحة تخزين سحابية آمنة لمدة سنة. (منتج تجريبي)", hue: 210 }),
  p({ id: "sub-vpn", name: "SecureVPN – 1 Year", nameAr: "SecureVPN – سنة", category: "subscriptions", price: 899, stock: 0, status: "draft", region: "Global", delivery: "كود تفعيل", description: "خدمة VPN للخصوصية لمدة سنة. (منتج تجريبي)", hue: 180 }),
  p({ id: "tl-design", name: "Design Studio Pro – Monthly", nameAr: "Design Studio Pro – شهري", category: "tools", price: 450, stock: 90, featured: true, region: "Global", delivery: "كود تفعيل", description: "أداة تصميم احترافية بقوالب جاهزة. (منتج تجريبي)", hue: 300 }),
  p({ id: "tl-ai-writer", name: "AI Writing Assistant – 6 Months", nameAr: "مساعد كتابة بالذكاء الاصطناعي", category: "tools", price: 1190, oldPrice: 1400, stock: 35, bestseller: true, region: "Global", delivery: "كود تفعيل", description: "مساعد كتابة ذكي بالعربي والإنجليزي. (منتج تجريبي)", hue: 270 }),
  p({ id: "tl-templates", name: "Social Media Templates Pack", nameAr: "باكدج قوالب سوشيال ميديا", category: "tools", price: 199, stock: 999, region: "Global", delivery: "رابط تحميل", description: "+٥٠٠ قالب قابل للتعديل للسوشيال. (منتج تجريبي)", hue: 45 }),
];

export const formatEGP = (n: number) =>
  new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(n) + " ج.م";

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function cartTotal(items: { price: number; qty: number }[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
