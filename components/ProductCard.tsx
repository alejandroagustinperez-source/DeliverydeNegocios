"use client";

import { Producto } from "@/lib/types";
import { Icon } from "./icons";
import { useCart } from "./CartProvider";

export function ProductCard({ producto, alt }: { producto: Producto; alt?: boolean }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-3.5 flex flex-col gap-2.5 transition hover:shadow-lg hover:shadow-brand-blue/10 hover:-translate-y-0.5">
      <div
        className={`h-[104px] rounded-xl flex items-center justify-center border ${
          alt ? "bg-gradient-to-br from-accent/12 to-accent/4 border-accent/10" : "bg-gradient-to-br from-brand-blue/10 to-brand-blue/4 border-brand-blue/8"
        }`}
      >
        <Icon name={producto.icono} className={`w-10 h-10 ${alt ? "text-accent-dark" : "text-brand-blue"}`} />
      </div>
      <div className="text-[13.5px] font-semibold leading-snug min-h-[36px]">{producto.nombre}</div>
      <div className="font-extrabold text-lg">${producto.precio.toLocaleString("es-AR")}</div>
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg w-fit ${
          producto.entregaHoy ? "bg-accent/10 text-accent-dark" : "bg-success/10 text-success"
        }`}
      >
        <Icon name={producto.entregaHoy ? "today" : "box"} className="w-3 h-3" />
        {producto.entregaHoy ? "Envío hoy" : "Envío mañana"}
      </span>
      <button
        onClick={() => addItem(producto)}
        className="mt-0.5 flex items-center justify-center gap-1.5 bg-brand-blue hover:bg-brand-blue-dark transition text-white text-xs font-bold py-2.5 rounded-lg"
      >
        <Icon name="plus" className="w-3.5 h-3.5" strokeWidth={2.4} />
        Agregar al carrito
      </button>
    </div>
  );
}
