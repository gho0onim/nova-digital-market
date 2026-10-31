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
  p({ id: "gc-store-500", name: "Store Gift Card 500 EGP", nameAr: "كارت هدايا متجر ٥٠٠ جنيه", category: "gift-cards", price: 520, stock: 40, bestseller: true, featured: true, region: "مصر", delivery: "كود فوري بعد الدفع", description: "كارت هدايا رقمي بقيمة ٥٠٠ جنيه يشتغل على أشهر المتاجر الإلكترونية. كود واحد يُستخدم مرة واحدة ويوصلك فورًا بعد الدفع، وتقدر تبعتّه جاهز كهدية لأي مناسبة أو مكافأة.", hue: 295 }),
  p({ id: "gc-play-25", name: "Play Wallet Card $25", nameAr: "كارت محفظة ألعاب ٢٥ دولار", category: "gift-cards", price: 1290, oldPrice: 1350, stock: 18, featured: true, region: "US", delivery: "كود رقمي", description: "رصيد ٢٥ دولار يُضاف على محفظة الألعاب الرسمية لشراء الألعاب والإضافات داخل المتجر الرسمي. الكود أصلي من موزع معتمد ويُسلَّم رقميًا بعد الدفع مباشرة.", hue: 230 }),
  p({ id: "gc-music-10", name: "Music Gift Card $10", nameAr: "كارت هدايا موسيقى", category: "gift-cards", price: 540, stock: 0, status: "out", region: "Global", delivery: "كود رقمي", description: "رصيد ١٠ دولار لخدمات الموسيقى الرقمية يفتح لك استماع بدون إعلانات وتحميل الأغاني أوفلاين حسب باقتك. كود رقمي يُستخدم مرة واحدة على حسابك الشخصي.", hue: 155 }),
  p({ id: "gt-arena-1000", name: "Arena Legends 1000 Gems", nameAr: "١٠٠٠ جوهرة Arena Legends", category: "game-topups", price: 349, oldPrice: 399, stock: 120, bestseller: true, featured: true, region: "MENA", delivery: "شحن على الـ ID بتاعك", description: "١٠٠٠ جوهرة تتشحن مباشرة على حسابك في Arena Legends باستخدام الـ Player ID بتاعك فقط — بدون بيانات دخول ولا كلمة سر. التشحن رسمي من موزع معتمد في منطقة MENA ويتم خلال دقائق.", hue: 330 }),
  p({ id: "gt-battle-pass", name: "Battle Royale Season Pass", nameAr: "باتل باس الموسم", category: "game-topups", price: 299, stock: 75, bestseller: true, region: "Global", delivery: "شحن على الـ ID", description: "باتل باس الموسم الكامل: مستويات مكافآت، سكنات حصرية وعملات داخل اللعبة. يُشحن على الـ ID الخاص بحسابك بعد الدفع مباشرة وبدون أي بيانات دخول.", hue: 20 }),
  p({ id: "gt-coins-5000", name: "Football Ultimate 5000 Points", nameAr: "٥٠٠٠ نقطة Football Ultimate", category: "game-topups", price: 1450, stock: 22, region: "Global", delivery: "كود رقمي", description: "٥٠٠٠ نقطة داخل Football Ultimate تفتح لك باكتات اللاعبين وتقوّي فريقك في الموسم الحالي. الكود يُسلَّم رقميًا ويُستخدم مرة واحدة على حسابك الشخصي.", hue: 140 }),
  p({ id: "sw-office", name: "Office Suite Home – 1 Year", nameAr: "حزمة أوفيس منزلي – سنة", category: "software", price: 1899, oldPrice: 2299, stock: 30, featured: true, bestseller: true, region: "Global", delivery: "مفتاح ترخيص أصلي", description: "رخصة أصلية لمدة سنة كاملة على جهاز واحد تشمل معالجة النصوص وجداول البيانات والعروض التقديمية. مفتاح التفعيل يوصلك بالإيميل مع خطوات التنصيب خطوة بخطوة.", hue: 25 }),
  p({ id: "sw-antivirus", name: "Total Security Antivirus – 3 Devices", nameAr: "برنامج حماية – ٣ أجهزة", category: "software", price: 749, stock: 55, region: "Global", delivery: "مفتاح ترخيص", description: "حماية شاملة لمدة سنة على ٣ أجهزة: حماية لحظية من الفيروسات والتصيّد، جدار حماية، وحماية للدفع الإلكتروني. مفتاح ترخيص أصلي يُفعَّل على حسابك.", hue: 200 }),
  p({ id: "sw-os-pro", name: "OS Pro License", nameAr: "رخصة نظام تشغيل Pro", category: "software", price: 2650, stock: 8, region: "Global", delivery: "مفتاح ترخيص أصلي", description: "ترخيص رسمي دائم لنظام التشغيل Pro لجهاز واحد، مع تحديثات الأمان من الشركة الأم. المفتاح يُفعَّل مرة واحدة ويُربط بحسابك بشكل دائم.", hue: 260 }),
  p({ id: "sub-stream-3m", name: "StreamPlus Premium – 3 Months", nameAr: "اشتراك StreamPlus بريميوم – ٣ شهور", category: "subscriptions", price: 690, stock: 60, bestseller: true, featured: true, region: "مصر", delivery: "كود تفعيل على حسابك", description: "اشتراك StreamPlus بريميوم لمدة ٣ شهور: أفلام ومسلسلات بدون إعلانات بجودة 4K. الكود يتفعل على حسابك الشخصي ويحتفظ بملف المشاهدة الخاص بك.", hue: 350 }),
  p({ id: "sub-cloud-1y", name: "Cloud Storage 2TB – 1 Year", nameAr: "تخزين سحابي ٢ تيرا – سنة", category: "subscriptions", price: 1590, stock: 25, region: "Global", delivery: "كود تفعيل", description: "مساحة تخزين سحابية آمنة ٢ تيرا لمدة سنة: نسخ احتياطي تلقائي للصور والملفات ومزامنة بين كل أجهزتك. كود تفعيل يتربط بحسابك بعد الدفع.", hue: 210 }),
  p({ id: "sub-vpn", name: "SecureVPN – 1 Year", nameAr: "SecureVPN – سنة", category: "subscriptions", price: 899, stock: 0, status: "draft", region: "Global", delivery: "كود تفعيل", description: "اشتراك SecureVPN لمدة سنة بتشفير كامل للاتصال وسرعات عالية على أكثر من ٥٠ دولة، يحمي بياناتك على شبكات الواي فاي العامة.", hue: 180 }),
  p({ id: "tl-design", name: "Design Studio Pro – Monthly", nameAr: "Design Studio Pro – شهري", category: "tools", price: 450, stock: 90, featured: true, region: "Global", delivery: "كود تفعيل", description: "أداة تصميم احترافية باشتراك شهري: قوالب جاهزة للمحتوى، خطوط عربية وإنجليزية، وتصدير بجودة عالية. مناسبة لصنّاع المحتوى وأصحاب البيزنس الصغير.", hue: 300 }),
  p({ id: "tl-ai-writer", name: "AI Writing Assistant – 6 Months", nameAr: "مساعد كتابة بالذكاء الاصطناعي", category: "tools", price: 1190, oldPrice: 1400, stock: 35, bestseller: true, region: "Global", delivery: "كود تفعيل", description: "مساعد كتابة بالذكاء الاصطناعي لمدة ٦ شهور يكتب ويلخّص ويترجم بالعربي والإنجليزي — مناسب لمحتوى السوشيال ميديا والرسائل الرسمية والمقالات.", hue: 270 }),
  p({ id: "tl-templates", name: "Social Media Templates Pack", nameAr: "باكدج قوالب سوشيال ميديا", category: "tools", price: 199, stock: 999, region: "Global", delivery: "رابط تحميل", description: "باكدج فيه أكثر من ٥٠٠ قالب سوشيال ميديا قابل للتعديل بالكامل: بوستات وستوريز وأغلفة. رابط تحميل مباشر يظل شغال بدون تاريخ انتهاء.", hue: 45 }),
];

export const formatEGP = (n: number) =>
  new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(n) + " ج.م";

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function cartTotal(items: { price: number; qty: number }[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
