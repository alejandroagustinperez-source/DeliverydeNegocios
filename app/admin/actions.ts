"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { setAdminSession, clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export interface PedidoAdmin {
  id: string;
  estado: string;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  direccion_entrega: string;
  localidad: string | null;
  costo_envio: number;
  total_productos: number;
  total_pedido: number;
  creado_en: string;
  comercio: { nombre: string; telefono: string | null } | null;
  items: { cantidad: number; precio_unitario: number; producto_nombre: string }[];
}

/** Trae todos los pedidos con su comercio y productos. Solo funciona autenticado como admin. */
export async function getPedidosAdmin(): Promise<PedidoAdmin[]> {
  if (!(await isAdminAuthenticated())) return [];
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select(
      "id, estado, cliente_nombre, cliente_telefono, direccion_entrega, localidad, costo_envio, total_productos, total_pedido, creado_en, comercios(nombre, telefono), pedido_items(cantidad, precio_unitario, productos(nombre))"
    )
    .order("creado_en", { ascending: false });

  if (error || !data) {
    console.error("[admin] Error trayendo pedidos:", error);
    return [];
  }

  return (data as unknown as Array<Record<string, unknown>>).map((p) => {
    const comercioRaw = p.comercios as { nombre: string; telefono: string | null } | null;
    const itemsRaw = (p.pedido_items as Array<Record<string, unknown>>) ?? [];
    return {
      id: p.id as string,
      estado: p.estado as string,
      cliente_nombre: p.cliente_nombre as string | null,
      cliente_telefono: p.cliente_telefono as string | null,
      direccion_entrega: p.direccion_entrega as string,
      localidad: p.localidad as string | null,
      costo_envio: Number(p.costo_envio ?? 0),
      total_productos: Number(p.total_productos ?? 0),
      total_pedido: Number(p.total_pedido ?? 0),
      creado_en: p.creado_en as string,
      comercio: comercioRaw ? { nombre: comercioRaw.nombre, telefono: comercioRaw.telefono } : null,
      items: itemsRaw.map((it) => ({
        cantidad: Number(it.cantidad),
        precio_unitario: Number(it.precio_unitario),
        producto_nombre: (it.productos as { nombre: string } | null)?.nombre ?? "Producto",
      })),
    };
  });
}

const ESTADOS_VALIDOS = ["pendiente", "en_camino", "entregado", "cancelado"];

export async function actualizarEstadoPedido(
  pedidoId: string,
  nuevoEstado: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "No autenticado." };
  }
  if (!supabaseAdmin) {
    return { success: false, error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY." };
  }
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    return { success: false, error: "Estado inválido." };
  }

  const { error } = await supabaseAdmin.from("pedidos").update({ estado: nuevoEstado }).eq("id", pedidoId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
