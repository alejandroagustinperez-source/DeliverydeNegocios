import { supabase } from "./supabase";
import {
  rubros as rubrosEjemplo,
  comercios as comerciosEjemplo,
  productos as productosEjemplo,
} from "./data";
import { Rubro, Comercio, Producto } from "./types";

/**
 * Estas funciones consultan Supabase cuando NEXT_PUBLIC_SUPABASE_URL y
 * NEXT_PUBLIC_SUPABASE_ANON_KEY están configuradas (ver .env.local.example).
 * Si todavía no las configuraste, usan automáticamente los datos de ejemplo
 * de lib/data.ts, así el sitio nunca se rompe mientras armás la base.
 */

export async function getRubros(): Promise<Rubro[]> {
  if (!supabase) return rubrosEjemplo;
  const { data, error } = await supabase.from("rubros").select("*").order("orden");
  if (error || !data) return rubrosEjemplo;
  return data.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    icono: r.icono,
    disponible: r.disponible,
    orden: r.orden,
  }));
}

export async function getRubro(rubroId: string): Promise<Rubro | undefined> {
  const list = await getRubros();
  return list.find((r) => r.id === rubroId);
}

export async function getComerciosPorRubro(rubroId: string): Promise<Comercio[]> {
  if (!supabase) return comerciosEjemplo.filter((c) => c.rubroId === rubroId);
  const { data, error } = await supabase
    .from("comercios")
    .select("*")
    .eq("rubro_id", rubroId)
    .eq("activo", true);
  if (error || !data) return comerciosEjemplo.filter((c) => c.rubroId === rubroId);
  return data.map((c) => ({
    id: c.id,
    rubroId: c.rubro_id,
    nombre: c.nombre,
    direccion: c.direccion,
    horario: { apertura: Number(c.horario_apertura), cierre: Number(c.horario_cierre) },
    tags: [], // La tabla `comercios` todavía no tiene columna de tags — se puede sumar más adelante
    rating: c.rating ? Number(c.rating) : 5,
    latitud: c.latitud ?? undefined,
    longitud: c.longitud ?? undefined,
  }));
}

export async function getComercio(rubroId: string, comercioId: string): Promise<Comercio | undefined> {
  const list = await getComerciosPorRubro(rubroId);
  return list.find((c) => c.id === comercioId);
}

export async function getProductosPorComercio(comercioId: string): Promise<Producto[]> {
  if (!supabase) return productosEjemplo.filter((p) => p.comercioId === comercioId);
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("comercio_id", comercioId)
    .eq("activo", true);
  if (error || !data) return productosEjemplo.filter((p) => p.comercioId === comercioId);
  return data.map((p) => ({
    id: p.id,
    comercioId: p.comercio_id,
    nombre: p.nombre,
    precio: Number(p.precio),
    categoria: p.categoria,
    icono: p.icono,
    entregaHoy: true,
  }));
}
