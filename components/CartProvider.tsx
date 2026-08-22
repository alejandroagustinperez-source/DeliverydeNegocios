"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Producto } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto) => void;
  removeItem: (productoId: string) => void;
  setOpen: (open: boolean) => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "marketplace-sl-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // ignorar carrito corrupto
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(producto: Producto) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === producto.id);
      if (existing) {
        return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsOpen(true);
  }

  function removeItem(productoId: string) {
    setItems((prev) => prev.filter((i) => i.id !== productoId));
  }

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, isOpen, addItem, removeItem, setOpen: setIsOpen, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
