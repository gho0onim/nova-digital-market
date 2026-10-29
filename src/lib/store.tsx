import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_PRODUCTS, type Order, type Product } from "./catalog";

interface CartItem { id: string; qty: number }

interface Store {
  products: Product[];
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  resetCatalog: () => void;
  cart: CartItem[];
  addToCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrder: (id: string, status: Order["status"]) => void;
  ready: boolean;
}

const Ctx = createContext<Store | null>(null);
const KEY = "nova-demo-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setP] = useState<Product[]>(DEMO_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.products) setP(d.products);
        if (d.cart) setCart(d.cart);
        if (d.orders) setOrders(d.orders);
      }
    } catch { /* ignore corrupt demo state */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify({ products, cart, orders }));
  }, [products, cart, orders, ready]);

  const value: Store = {
    products,
    setProducts: (fn) => setP(fn),
    resetCatalog: () => setP(DEMO_PRODUCTS),
    cart,
    addToCart: (id) => {
      setCart((c) => (c.find((i) => i.id === id) ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id, qty: 1 }]));
      setCartOpen(true);
    },
    setQty: (id, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i)))),
    clearCart: () => setCart([]),
    cartOpen,
    setCartOpen,
    orders,
    addOrder: (o) => setOrders((list) => [o, ...list]),
    updateOrder: (id, status) => setOrders((l) => l.map((o) => (o.id === id ? { ...o, status } : o))),
    ready,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

export function useCartLines() {
  const { cart, products } = useStore();
  return cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { ...p, qty: c.qty } : null;
    })
    .filter(Boolean) as (Product & { qty: number })[];
}
