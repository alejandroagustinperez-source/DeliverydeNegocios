"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { guardarSolicitudProducto } from "@/lib/waitlist";

export function SolicitudProductoForm({ termino }: { termino: string }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const result = await guardarSolicitudProducto(termino, email);
    setEstado(result.success ? "listo" : "error");
  }

  if (estado === "listo") {
    return (
      <div className="bg-success/10 border border-success/25 rounded-xl p-5 text-center">
        <p className="text-sm font-semibold text-success">¡Listo! Te vamos a avisar por mail apenas lo consigamos.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-3">
        <Icon name="box" className="w-6 h-6 text-brand-blue" />
      </div>
      <p className="font-bold text-sm mb-1">Todavía no tenemos eso</p>
      <p className="text-xs text-ink-soft mb-4">
        Estamos trabajando para sumar más locales y productos. Dejanos tu mail y te avisamos apenas
        tengamos lo que buscás.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 transition text-white font-bold px-4 py-2.5 rounded-lg text-sm whitespace-nowrap"
        >
          {estado === "enviando" ? "Enviando..." : "Avisame"}
        </button>
      </form>
      {estado === "error" && (
        <p className="text-xs text-accent-dark mt-2">No se pudo guardar. Probá de nuevo en un momento.</p>
      )}
    </div>
  );
}
