import Link from "next/link";
import { Rubro } from "@/lib/types";
import { Icon } from "./icons";

export function RubroCard({ rubro, cantidadLocales }: { rubro: Rubro; cantidadLocales: number }) {
  const content = (
    <div
      className={`group relative bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 overflow-hidden transition ${
        rubro.disponible
          ? "cursor-pointer hover:shadow-lg hover:shadow-brand-blue/10 hover:-translate-y-0.5 hover:border-brand-blue/30"
          : ""
      }`}
    >
      {rubro.disponible && (
        <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-blue to-accent" />
      )}

      <div className="flex items-start justify-between gap-2">
        <span
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            rubro.disponible ? "bg-brand-blue/10" : "bg-ink-soft/8"
          }`}
        >
          <Icon
            name={rubro.disponible ? rubro.icono : "lock"}
            className={`w-6 h-6 ${rubro.disponible ? "text-brand-blue" : "text-ink-soft/70"}`}
          />
        </span>

        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md whitespace-nowrap ${
            rubro.disponible ? "bg-success/10 text-success" : "bg-ink-soft/8 text-ink-soft/70"
          }`}
        >
          {rubro.disponible ? "Disponible" : "Pronto"}
        </span>
      </div>

      <div>
        <h3 className={`font-bold text-[15px] leading-snug mb-1 ${rubro.disponible ? "text-ink" : "text-ink-soft"}`}>
          {rubro.nombre}
        </h3>
        <p className="text-xs text-ink-soft/80 flex items-center gap-1.5">
          {rubro.disponible ? (
            <>
              <Icon name="store" className="w-3.5 h-3.5" />
              {cantidadLocales} {cantidadLocales === 1 ? "local" : "locales"}
            </>
          ) : (
            "Muy pronto"
          )}
        </p>
      </div>
    </div>
  );

  if (!rubro.disponible) return content;

  return <Link href={`/rubro/${rubro.id}`}>{content}</Link>;
}
