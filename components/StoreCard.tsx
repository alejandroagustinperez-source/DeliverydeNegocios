"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Comercio } from "@/lib/types";
import { Icon } from "./icons";
import { isStoreOpen } from "@/lib/data";

function fmtHour(h: number) {
  return `${h}hs`;
}

export function StoreCard({
  comercio,
  cantidadProductos,
  alt,
}: {
  comercio: Comercio;
  cantidadProductos: number;
  alt?: boolean;
}) {
  // El estado abierto/cerrado depende de la hora del navegador del cliente,
  // así que se calcula después del montaje para evitar mismatches de SSR.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isStoreOpen(comercio.horario));
    const id = setInterval(() => setOpen(isStoreOpen(comercio.horario)), 60_000);
    return () => clearInterval(id);
  }, [comercio.horario]);

  return (
    <div className="bg-white/92 backdrop-blur-sm border border-border rounded-2xl overflow-hidden flex flex-col transition hover:shadow-lg hover:shadow-brand-blue/10 hover:-translate-y-0.5 hover:border-brand-blue/25">
      <Link
        href={`/rubro/${comercio.rubroId}/${comercio.id}`}
        className={`h-[104px] relative flex items-center justify-center ${
          alt ? "bg-gradient-to-br from-accent/18 to-accent/4" : "bg-gradient-to-br from-brand-blue/16 to-brand-blue/4"
        }`}
      >
        <Icon name="store" className={`w-9 h-9 opacity-50 ${alt ? "text-accent-dark" : "text-brand-blue"}`} />
        {open !== null && (
          <span
            className={`absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 ${
              open ? "text-success" : "text-ink-soft"
            }`}
          >
            <span className={`w-[7px] h-[7px] rounded-full ${open ? "bg-success" : "bg-gray-400"}`} />
            {open ? "Abierto ahora" : "Cerrado"}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2.5">
        <Link href={`/rubro/${comercio.rubroId}/${comercio.id}`} className="flex justify-between items-start gap-2">
          <span className="font-bold text-[15px]">{comercio.nombre}</span>
          <span className="text-[11.5px] text-ink-soft flex items-center gap-1 whitespace-nowrap mt-0.5">
            <Icon name="star" className="w-[11px] h-[11px] text-amber-500 fill-amber-500" strokeWidth={1.6} />
            {comercio.rating}
          </span>
        </Link>

        <div className="text-xs text-ink-soft flex items-center gap-1.5">
          <Icon name="pin" className="w-3.5 h-3.5 shrink-0" />
          {comercio.direccion}
        </div>
        <div className="text-xs text-ink-soft flex items-center gap-1.5">
          <Icon name="clock" className="w-3.5 h-3.5 shrink-0" />
          {open === null
            ? "—"
            : open
            ? `Abierto hasta las ${fmtHour(comercio.horario.cierre)}`
            : `Abre a las ${fmtHour(comercio.horario.apertura)}`}{" "}
          · {fmtHour(comercio.horario.apertura)} a {fmtHour(comercio.horario.cierre)}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {comercio.tags.map((t) => (
            <span key={t} className="text-[11px] bg-brand-blue/7 text-brand-blue font-semibold px-2 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>

        <div className="text-xs font-semibold text-brand-blue flex items-center gap-1.5">
          <Icon name="box" className="w-3.5 h-3.5" />
          {cantidadProductos} productos disponibles
        </div>

        <div className="flex justify-between items-center mt-0.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
              open ? "bg-accent/10 text-accent-dark" : "bg-success/10 text-success"
            }`}
          >
            <Icon name={open ? "today" : "box"} className="w-3 h-3" />
            {open ? "Envío hoy" : "Envío al abrir"}
          </span>
          <Link
            href={`/rubro/${comercio.rubroId}/${comercio.id}`}
            className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue-dark transition text-white text-xs font-bold px-3.5 py-2 rounded-lg"
          >
            Ver local
            <Icon name="arrow" className="w-3 h-3" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
