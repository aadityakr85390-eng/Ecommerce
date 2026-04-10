import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

const loadCart = () => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((acc, it) => acc + (it.qty || 1), 0);
    const subtotal = items.reduce((acc, it) => acc + it.price * (it.qty || 1), 0);

    const addItem = (product) => {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === product.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + 1 };
          return copy;
        }
        return [...prev, { ...product, qty: 1 }];
      });
      toast.success("Added to cart successfully");
    };

    const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

    const setQty = (id, qty) => {
      const q = Number(qty);
      if (!Number.isFinite(q) || q < 1) return;
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: q } : p)));
    };

    const clear = () => setItems([]);

    return { items, count, subtotal, addItem, removeItem, setQty, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

