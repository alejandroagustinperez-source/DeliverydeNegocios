"use client";

import { Icon } from "./icons";
import { useCart } from "./CartProvider";
import { comercios } from "@/lib/data";

export function CartDrawer() {
  const { items, isOpen, setOpen, total, removeItem } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/35 backdrop-blur-[2px] z-30 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] max-w-[90vw] bg-white/97 backdrop-blur-md border-l border-border z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-base">Tu carrito</h3>
          <button onClick={() => setOpen(false)} className="text-ink-soft">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-ink-soft text-sm text-center mt-10">Todavía no agregaste productos</p>
          ) : (
            items.map((item) => {
              const comercio = comercios.find((c) => c.id === item.comercioId);
              return (
                <div key={item.id} className="flex gap-2.5 py-2.5 border-b border-border items-center">
                  <div className="w-11 h-11 bg-brand-blue/5 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name={item.icono} className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{item.nombre}</div>
                    <div className="text-xs text-ink-soft">
                      ${item.precio.toLocaleString("es-AR")} × {item.cantidad} · {comercio?.nombre}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-ink-soft hover:text-accent-dark text-xs shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-4 border-t border-border">
          <div className="flex justify-between font-bold mb-3">
            <span>Total</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
          <button className="w-full bg-accent hover:bg-accent-dark transition text-white font-bold py-3 rounded-lg text-sm">
            Confirmar pedido
          </button>
        </div>
      </aside>
    </>
  );
}
