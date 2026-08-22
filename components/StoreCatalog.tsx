"use client";

import { useEffect, useMemo, useState } from "react";
import { Comercio, Producto } from "@/lib/types";
import { Icon } from "./icons";
import { ProductCard } from "./ProductCard";
import { isStoreOpen, searchProductos } from "@/lib/data";

function fmtHour(h: number) {
  return `${h}hs`;
}

export function StoreCatalog({ comercio, productos }: { comercio: Comercio; productos: Producto[] }) {
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isStoreOpen(comercio.horario));
  }, [comercio.horario]);

  const categorias = useMemo(() => {
    const set = Array.from(new Set(productos.map((p) => p.categoria)));
    return [
      { nombre: "Todos", cantidad: productos.length },
      ...set.map((c) => ({ nombre: c, cantidad: productos.filter((p) => p.categoria === c).length })),
    ];
  }, [productos]);

  const filtrados = useMemo(() => {
    let list = productos;
    if (categoria !== "Todos") list = list.filter((p) => p.categoria === categoria);
    list = searchProductos(list, busqueda);
    return list;
  }, [productos, categoria, busqueda]);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex gap-4 items-center bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-5 mb-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/14 to-accent/5 flex items-center justify-center shrink-0">
            <Icon name="store" className="w-8 h-8 text-accent-dark" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-[19px] font-bold mb-1">{comercio.nombre}</h2>
            <div className="flex gap-3.5 flex-wrap text-xs text-ink-soft">
              <span className="flex items-center gap-1">
                <Icon name="star" className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={1.6} />
                {comercio.rating}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="pin" className="w-3.5 h-3.5" />
                {comercio.direccion}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="clock" className="w-3.5 h-3.5" />
                {fmtHour(comercio.horario.apertura)} a {fmtHour(comercio.horario.cierre)}
              </span>
              {open !== null && (
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${
                    open ? "text-success" : "text-ink-soft"
                  }`}
                >
                  <span className={`w-[7px] h-[7px] rounded-full ${open ? "bg-success" : "bg-gray-400"}`} />
                  {open ? "Abierto ahora" : "Cerrado ahora"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <aside className="bg-white/85 backdrop-blur-sm border border-border rounded-xl p-4 h-fit">
          <h3 className="text-xs uppercase tracking-wide text-ink-soft font-semibold mb-2.5">Categorías</h3>
          <div className="flex flex-col gap-1">
            {categorias.map((c) => (
              <button
                key={c.nombre}
                onClick={() => setCategoria(c.nombre)}
                className={`text-[13px] px-2 py-1.5 rounded-lg flex justify-between transition text-left ${
                  categoria === c.nombre
                    ? "bg-brand-blue text-white font-bold"
                    : "hover:bg-brand-blue/5 hover:text-brand-blue"
                }`}
              >
                <span>{c.nombre}</span>
                <span className={categoria === c.nombre ? "text-white/85" : ""}>{c.cantidad}</span>
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-border rounded-xl px-3.5 py-2.5 mb-3.5">
            <Icon name="search" className="w-4 h-4 text-ink-soft" />
            <input
              type="text"
              placeholder="Buscar en este local (ej: filtro, batería, freno...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 outline-none text-[13.5px] bg-transparent"
            />
          </div>

          <div className="flex justify-between items-center mb-3.5 text-[13px] text-ink-soft">
            <span>
              {filtrados.length} {filtrados.length === 1 ? "producto encontrado" : "productos encontrados"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((p, i) => (
              <ProductCard key={p.id} producto={p} alt={i % 2 === 1} />
            ))}
          </div>

          {filtrados.length === 0 && (
            <p className="text-ink-soft text-sm text-center py-10">
              No encontramos productos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
