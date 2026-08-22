"use server";

import { supabase } from "./supabase";

export async function guardarSolicitudProducto(
  terminoBusqueda: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase no está configurado." };
  }
  const { error } = await supabase
    .from("solicitudes_producto")
    .insert({ termino_busqueda: terminoBusqueda, email });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
