"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { useCart } from "./CartProvider";
import { comercios, zonas, calcularCostoEnvio } from "@/lib/data";
import { checkoutCart } from "@/lib/actions";
import { buildWaMeLink } from "@/lib/whatsappLink";

type Step = "cart" | "form" | "submitting" | "success" | "error";

export function CartDrawer() {
  const { items, isOpen, setOpen, total, removeItem, updateQuantity, clearItems } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [zonaId, setZonaId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pedidosCreados, setPedidosCreados] = useState(0);
  const [linkConfirmacion, setLinkConfirmacion] = useState<string | null>(null);

  const subtotalPorComercio = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.comercioId] = (acc[item.comercioId] ?? 0) + item.precio * item.cantidad;
    return acc;
  }, {});
  const comerciosEnCarrito = Array.from(new Set(items.map((i) => i.comercioId)));
  const zonaSeleccionada = zonas.find((z) => z.id === zonaId);
  const envioPorComercio = zonaSeleccionada ? calcularCostoEnvio(zonaSeleccionada.kmReferencia) : 0;
  const envioTotal = zonaSeleccionada ? envioPorComercio * comerciosEnCarrito.length : 0;
  const totalConEnvio = total + envioTotal;

  function handleClose() {
    setOpen(false);
    if (step === "success") {
      setStep("cart");
      setNombre("");
      setTelefono("");
      setDireccion("");
      setZonaId("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("submitting");
    setErrorMsg("");

    const result = await checkoutCart({
      items: items.map((i) => ({
        productoId: i.id,
        nombre: i.nombre,
        comercioId: i.comercioId,
        precio: i.precio,
        cantidad: i.cantidad,
      })),
      clienteNombre: nombre,
      clienteTelefono: telefono,
      direccionEntrega: direccion,
      zonaId,
    });

    if (result.success) {
      setPedidosCreados(result.results.length);

      // Armamos el mensaje ANTES de vaciar el carrito, con el detalle real.
      const contacto = process.env.NEXT_PUBLIC_WHATSAPP_CONTACTO;
      if (contacto) {
        const detalle = items.map((i) => `- ${i.nombre} x${i.cantidad}`).join("\n");
        const zona = zonas.find((z) => z.id === zonaId);
        const mensaje = [
          "Hola! Quiero confirmar mi pedido:",
          "",
          detalle,
          "",
          `Localidad: ${zona?.nombre ?? ""}`,
          `Dirección: ${direccion}`,
          "",
          `Subtotal productos: $${total.toLocaleString("es-AR")}`,
          `Envío: $${envioTotal.toLocaleString("es-AR")}`,
          `Total: $${totalConEnvio.toLocaleString("es-AR")}`,
          "",
          "¡Gracias!",
        ].join("\n");
        setLinkConfirmacion(buildWaMeLink(contacto, mensaje));
      }

      setStep("success");
      clearItems();
    } else {
      const primerError = result.results.find((r) => !r.success)?.error;
      setErrorMsg(primerError ?? "Algo falló al crear el pedido. Probá de nuevo.");
      setStep("error");
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/35 backdrop-blur-[2px] z-30 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />
      <aside
        className={`fixed top-0 right-0 h-dvh w-[380px] max-w-[92vw] bg-white/97 backdrop-blur-md border-l border-border z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-bold text-base">
            {step === "cart" && "Tu carrito"}
            {step === "form" && "Datos de entrega"}
            {step === "submitting" && "Confirmando..."}
            {step === "success" && "¡Pedido confirmado!"}
            {step === "error" && "Hubo un problema"}
          </h3>
          <button onClick={handleClose} className="text-ink-soft">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Paso 1: carrito */}
        {(step === "cart" || step === "error") && (
          <>
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4">
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
                        <div className="text-xs text-ink-soft mb-1.5">
                          ${item.precio.toLocaleString("es-AR")} · {comercio?.nombre}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                              className="w-6 h-6 flex items-center justify-center text-ink-soft hover:text-brand-blue text-sm"
                              aria-label="Restar"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-xs font-semibold">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                              className="w-6 h-6 flex items-center justify-center text-ink-soft hover:text-brand-blue text-sm"
                              aria-label="Sumar"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-bold text-ink">
                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ink-soft hover:text-accent-dark text-xs shrink-0 self-start"
                      >
                        Quitar
                      </button>
                    </div>
                  );
                })
              )}
              {step === "error" && (
                <p className="text-accent-dark text-xs bg-accent/10 border border-accent/25 rounded-lg p-3 mt-3">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border">
              <div className="flex justify-between font-bold mb-3">
                <span>Total productos</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>
              <p className="text-[11px] text-ink-soft mb-3">
                El costo de envío se calcula en el siguiente paso, según tu localidad.
              </p>
              <button
                disabled={items.length === 0}
                onClick={() => setStep("form")}
                className="w-full bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-bold py-3 rounded-lg text-sm"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Paso 2: formulario de datos de entrega */}
        {(step === "form" || step === "submitting") && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Nombre y apellido</label>
                <input
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Teléfono</label>
                <input
                  required
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                  placeholder="Ej: 266 4 123456"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Localidad</label>
                <select
                  required
                  value={zonaId}
                  onChange={(e) => setZonaId(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue bg-white"
                >
                  <option value="" disabled>
                    Elegí tu localidad...
                  </option>
                  {zonas.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Dirección de entrega</label>
                <textarea
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue resize-none"
                  rows={3}
                  placeholder="Calle, número, barrio, referencias..."
                />
              </div>

              {zonaSeleccionada && (
                <div className="border border-border rounded-lg p-3.5 flex flex-col gap-2.5">
                  <p className="text-xs font-semibold text-ink">Costo de envío</p>
                  {comerciosEnCarrito.map((comercioId) => {
                    const comercio = comercios.find((c) => c.id === comercioId);
                    return (
                      <div key={comercioId} className="text-xs">
                        <div className="flex justify-between text-ink-soft mb-0.5">
                          <span>{comercio?.nombre ?? "Comercio"} — productos</span>
                          <span>${(subtotalPorComercio[comercioId] ?? 0).toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex justify-between text-ink-soft">
                          <span>{comercio?.nombre ?? "Comercio"} — envío</span>
                          <span>${envioPorComercio.toLocaleString("es-AR")}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-sm border-t border-border pt-2">
                    <span>Total</span>
                    <span>${totalConEnvio.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              )}

              <div className="bg-bg rounded-lg p-3 text-xs text-ink-soft leading-relaxed">
                Si tenés productos de más de un comercio, se van a crear pedidos
                separados (uno por local), ya que cada uno implica un viaje de
                entrega distinto.
              </div>
            </div>

            <div className="px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-border flex flex-col gap-2">
              <button
                type="submit"
                disabled={step === "submitting"}
                className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 transition text-white font-bold py-3 rounded-lg text-sm"
              >
                {step === "submitting" ? "Confirmando..." : "Confirmar pedido"}
              </button>
              <button
                type="button"
                onClick={() => setStep("cart")}
                disabled={step === "submitting"}
                className="w-full text-ink-soft text-xs py-1"
              >
                Volver al carrito
              </button>
            </div>
          </form>
        )}

        {/* Paso 3: éxito */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
              <Icon name="today" className="w-7 h-7 text-success" />
            </div>
            <h4 className="font-bold text-base">
              {pedidosCreados > 1 ? `${pedidosCreados} pedidos confirmados` : "Pedido confirmado"}
            </h4>
            <p className="text-sm text-ink-soft">
              Te vamos a contactar al teléfono que dejaste para coordinar la entrega.
            </p>
            {linkConfirmacion && (
              <a
                href={linkConfirmacion}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:brightness-95 transition text-white font-bold px-5 py-2.5 rounded-lg text-sm"
              >
                <Icon name="today" className="w-4 h-4" />
                Confirmar por WhatsApp
              </a>
            )}
            <button
              onClick={handleClose}
              className="mt-2 bg-brand-blue hover:bg-brand-blue-dark transition text-white font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              Listo
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
