"use server";

import { randomUUID } from "crypto";
import { supabase } from "./supabase";
import { calcularCostoEnvio } from "./data";
import { getComercioById } from "./queries";
import { notificarWhatsapp } from "./whatsapp";

interface OrderItemInput {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CreateOrderGroupParams {
  comercioId: string;
  items: OrderItemInput[];
  clienteNombre: string;
  clienteTelefono: string;
  direccionEntrega: string;
}

interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  comercioId: string;
  error?: string;
}

/**
 * Crea un pedido para UN comercio (con sus items). El checkout del sitio
 * agrupa el carrito por comercio y llama esta función una vez por grupo,
 * porque cada comercio implica un viaje de entrega distinto.
 *
 * La distancia real (para calcular el envío con precisión) todavía no está
 * conectada a un servicio de mapas — por ahora se usa una distancia de
 * referencia. Reemplazar `distanciaEstimadaKm` por el resultado de la API
 * de Google Maps Distance Matrix es parte de las tareas pendientes.
 */
async function createOrderForStore(params: CreateOrderGroupParams): Promise<CreateOrderResult> {
  if (!supabase) {
    return {
      success: false,
      comercioId: params.comercioId,
      error: "Supabase no está configurado (faltan las variables de entorno).",
    };
  }

  const totalProductos = params.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const distanciaEstimadaKm = 3; // TODO: reemplazar por distancia real (Google Maps Distance Matrix API)
  const costoEnvio = calcularCostoEnvio(distanciaEstimadaKm);
  const totalPedido = totalProductos + costoEnvio;
  const pedidoId = randomUUID();

  const { error: pedidoError } = await supabase.from("pedidos").insert({
    id: pedidoId,
    comercio_id: params.comercioId,
    cliente_nombre: params.clienteNombre,
    cliente_telefono: params.clienteTelefono,
    direccion_entrega: params.direccionEntrega,
    distancia_km: distanciaEstimadaKm,
    costo_envio: costoEnvio,
    total_productos: totalProductos,
    total_pedido: totalPedido,
    estado: "pendiente",
  });

  if (pedidoError) {
    return {
      success: false,
      comercioId: params.comercioId,
      error: pedidoError.message,
    };
  }

  const itemsToInsert = params.items.map((i) => ({
    pedido_id: pedidoId,
    producto_id: i.productoId,
    cantidad: i.cantidad,
    precio_unitario: i.precio,
  }));

  const { error: itemsError } = await supabase.from("pedido_items").insert(itemsToInsert);

  if (itemsError) {
    return { success: false, comercioId: params.comercioId, error: itemsError.message };
  }

  // Notificación de WhatsApp (no bloquea ni hace fallar el pedido si falla).
  const comercio = await getComercioById(params.comercioId);
  const detalleProductos = params.items
    .map((i) => `• ${i.nombre} x${i.cantidad} — $ ${(i.precio * i.cantidad).toLocaleString("es-AR")}`)
    .join("\n");
  const mensaje = [
    `🛵 *Pedido nuevo*`,
    "",
    `*Comercio:* ${comercio?.nombre ?? params.comercioId}`,
    comercio?.direccion ? `*Dirección del comercio:* ${comercio.direccion}` : null,
    comercio?.telefono ? `*Tel. del comercio:* ${comercio.telefono}` : null,
    "",
    `*Cliente:* ${params.clienteNombre}`,
    `*Teléfono cliente:* ${params.clienteTelefono}`,
    `*Entregar en:* ${params.direccionEntrega}`,
    "",
    "Productos:",
    detalleProductos,
    "",
    `Subtotal productos: $ ${totalProductos.toLocaleString("es-AR")}`,
    `Envío estimado: $ ${costoEnvio.toLocaleString("es-AR")}`,
    `Total: $ ${totalPedido.toLocaleString("es-AR")}`,
    "",
    `ID pedido: ${pedidoId.slice(0, 8)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  await notificarWhatsapp(mensaje);

  return { success: true, orderId: pedidoId, comercioId: params.comercioId };
}

export interface CheckoutCartItem {
  productoId: string;
  nombre: string;
  comercioId: string;
  precio: number;
  cantidad: number;
}

export interface CheckoutParams {
  items: CheckoutCartItem[];
  clienteNombre: string;
  clienteTelefono: string;
  direccionEntrega: string;
}

export interface CheckoutResult {
  success: boolean;
  results: CreateOrderResult[];
}

/** Agrupa el carrito por comercio y crea un pedido por cada grupo. */
export async function checkoutCart(params: CheckoutParams): Promise<CheckoutResult> {
  const grupos = new Map<string, OrderItemInput[]>();
  for (const item of params.items) {
    const list = grupos.get(item.comercioId) ?? [];
    list.push({
      productoId: item.productoId,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
    });
    grupos.set(item.comercioId, list);
  }

  const results = await Promise.all(
    Array.from(grupos.entries()).map(([comercioId, items]) =>
      createOrderForStore({
        comercioId,
        items,
        clienteNombre: params.clienteNombre,
        clienteTelefono: params.clienteTelefono,
        direccionEntrega: params.direccionEntrega,
      })
    )
  );

  return { success: results.every((r) => r.success), results };
}
