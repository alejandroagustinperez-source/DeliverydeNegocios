"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarEstadoPedido, PedidoAdmin } from "@/app/admin/actions";

const ESTADOS = [
  { id: "pendiente", label: "Pendiente" },
  { id: "en_camino", label: "En camino" },
  { id: "entregado", label: "Entregado" },
  { id: "cancelado", label: "Cancelado" },
] as const;

const TABS = [
  { id: "pendiente", label: "Pendientes" },
  { id: "en_camino", label: "En camino" },
  { id: "entregado", label: "Entregados" },
  { id: "cancelado", label: "Cancelados" },
  { id: "todos", label: "Todos" },
] as const;

function estadoColor(estado: string) {
  switch (estado) {
    case "pendiente":
      return "bg-accent/10 text-accent-dark";
    case "en_camino":
      return "bg-brand-blue/10 text-brand-blue";
    case "entregado":
      return "bg-success/10 text-success";
    case "cancelado":
      return "bg-ink-soft/10 text-ink-soft";
    default:
      return "bg-brand-blue/10 text-brand-blue";
  }
}

export function AdminDashboard({ pedidosIniciales }: { pedidosIniciales: PedidoAdmin[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<string>("pendiente");
  const [actualizando, setActualizando] = useState<string | null>(null);

  const pedidosFiltrados =
    filtro === "todos" ? pedidosIniciales : pedidosIniciales.filter((p) => p.estado === filtro);

  const conteos: Record<string, number> = {
    pendiente: pedidosIniciales.filter((p) => p.estado === "pendiente").length,
    en_camino: pedidosIniciales.filter((p) => p.estado === "en_camino").length,
    entregado: pedidosIniciales.filter((p) => p.estado === "entregado").length,
    cancelado: pedidosIniciales.filter((p) => p.estado === "cancelado").length,
    todos: pedidosIniciales.length,
  };

  async function cambiarEstado(pedidoId: string, nuevoEstado: string) {
    setActualizando(pedidoId);
    const result = await actualizarEstadoPedido(pedidoId, nuevoEstado);
    setActualizando(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error ?? "No se pudo actualizar el estado.");
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setFiltro(t.id)}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border transition ${
              filtro === t.id
                ? "bg-brand-blue text-white border-brand-blue"
                : "bg-white text-ink-soft border-border hover:border-brand-blue/40"
            }`}
          >
            {t.label} ({conteos[t.id]})
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <p className="text-sm text-ink-soft text-center py-16">No hay pedidos en este estado.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidosFiltrados.map((p) => (
            <div key={p.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-bold text-sm">{p.comercio?.nombre ?? "Comercio"}</p>
                  <p className="text-xs text-ink-soft">{new Date(p.creado_en).toLocaleString("es-AR")}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${estadoColor(p.estado)}`}>
                  {p.estado.replace("_", " ")}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <p className="text-ink-soft mb-0.5">Cliente</p>
                  <p className="font-semibold">{p.cliente_nombre}</p>
                  <p>{p.cliente_telefono}</p>
                </div>
                <div>
                  <p className="text-ink-soft mb-0.5">Entrega</p>
                  <p className="font-semibold">{p.localidad ?? "—"}</p>
                  <p>{p.direccion_entrega}</p>
                </div>
              </div>

              <div className="border-t border-border pt-3 mb-3">
                {p.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span>
                      {it.cantidad}x {it.producto_nombre}
                    </span>
                    <span>${(it.precio_unitario * it.cantidad).toLocaleString("es-AR")}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-1.5 text-ink-soft">
                  <span>Envío</span>
                  <span>${p.costo_envio.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span>Total</span>
                  <span>${p.total_pedido.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {ESTADOS.filter((e) => e.id !== p.estado).map((e) => (
                  <button
                    key={e.id}
                    disabled={actualizando === p.id}
                    onClick={() => cambiarEstado(p.id, e.id)}
                    className="text-xs font-semibold border border-border rounded-lg px-3 py-1.5 hover:border-brand-blue hover:text-brand-blue disabled:opacity-50 transition"
                  >
                    {actualizando === p.id ? "..." : `Marcar como ${e.label.toLowerCase()}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
