import Link from "next/link";
import { Rubro } from "@/lib/types";
import { Icon } from "./icons";

export function RubroCard({ rubro, cantidadLocales }: { rubro: Rubro; cantidadLocales: number }) {
  const content = (
    <div
      className={`relative bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-5 flex flex-col gap-2.5 transition ${
        rubro.disponible
          ? "cursor-pointer hover:shadow-lg hover:shadow-brand-blue/10 hover:-translate-y-0.5 hover:border-brand-blue/25"
          : "opacity-60"
      }`}
    >
      <span
        className={`absolute top-3.5 right-3.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
          rubro.disponible ? "bg-success/10 text-success" : "bg-ink-soft/10 text-ink-soft"
        }`}
      >
        {rubro.disponible ? "Disponible" : "Próximamente"}
      </span>
      <span
        className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center ${
          rubro.disponible ? "bg-brand-blue/10" : "bg-ink-soft/10"
        }`}
      >
        <Icon
          name={rubro.disponible ? rubro.icono : "lock"}
          className={`w-6 h-6 ${rubro.disponible ? "text-brand-blue" : "text-ink-soft"}`}
        />
      </span>
      <span className="font-bold text-[14.5px]">{rubro.nombre}</span>
      <span className="text-xs text-ink-soft">
        {rubro.disponible ? `${cantidadLocales} locales` : "Muy pronto"}
      </span>
    </div>
  );

  if (!rubro.disponible) return content;

  return <Link href={`/rubro/${rubro.id}`}>{content}</Link>;
}
