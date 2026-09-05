import { supabase } from "./supabase";
import {
  rubros as rubrosEjemplo,
  comercios as comerciosEjemplo,
  productos as productosEjemplo,
  normalizeText,
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
    telefono: c.telefono ?? undefined,
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

/** Busca un comercio solo por su ID, sin necesitar saber a qué rubro pertenece. */
export async function getComercioById(comercioId: string): Promise<Comercio | undefined> {
  if (!supabase) return comerciosEjemplo.find((c) => c.id === comercioId);
  const { data, error } = await supabase.from("comercios").select("*").eq("id", comercioId).single();
  if (error || !data) return comerciosEjemplo.find((c) => c.id === comercioId);
  return {
    id: data.id,
    rubroId: data.rubro_id,
    nombre: data.nombre,
    direccion: data.direccion,
    telefono: data.telefono ?? undefined,
    horario: { apertura: Number(data.horario_apertura), cierre: Number(data.horario_cierre) },
    tags: [],
    rating: data.rating ? Number(data.rating) : 5,
    latitud: data.latitud ?? undefined,
    longitud: data.longitud ?? undefined,
  };
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

/** Trae todos los comercios activos, sin importar el rubro. Se usa para el buscador global. */
export async function getTodosLosComercios(): Promise<Comercio[]> {
  if (!supabase) return comerciosEjemplo;
  const { data, error } = await supabase.from("comercios").select("*").eq("activo", true);
  if (error || !data) return comerciosEjemplo;
  return data.map((c) => ({
    id: c.id,
    rubroId: c.rubro_id,
    nombre: c.nombre,
    direccion: c.direccion,
    telefono: c.telefono ?? undefined,
    horario: { apertura: Number(c.horario_apertura), cierre: Number(c.horario_cierre) },
    tags: [],
    rating: c.rating ? Number(c.rating) : 5,
    latitud: c.latitud ?? undefined,
    longitud: c.longitud ?? undefined,
  }));
}

export interface ProductoConComercio extends Producto {
  comercioNombre: string;
  rubroId: string;
}

/** Trae todos los productos activos junto con el nombre y rubro de su comercio. */
export async function getTodosLosProductosConComercio(): Promise<ProductoConComercio[]> {
  if (!supabase) {
    return productosEjemplo.map((p) => {
      const comercio = comerciosEjemplo.find((c) => c.id === p.comercioId);
      return { ...p, comercioNombre: comercio?.nombre ?? "Comercio", rubroId: comercio?.rubroId ?? "auto" };
    });
  }
  const { data, error } = await supabase
    .from("productos")
    .select("*, comercios(nombre, rubro_id)")
    .eq("activo", true);
  if (error || !data) {
    return productosEjemplo.map((p) => {
      const comercio = comerciosEjemplo.find((c) => c.id === p.comercioId);
      return { ...p, comercioNombre: comercio?.nombre ?? "Comercio", rubroId: comercio?.rubroId ?? "auto" };
    });
  }
  return (data as unknown as Array<Record<string, unknown>>).map((p) => {
    const comercioRaw = p.comercios as { nombre: string; rubro_id: string } | null;
    return {
      id: p.id as string,
      comercioId: p.comercio_id as string,
      nombre: p.nombre as string,
      precio: Number(p.precio),
      categoria: p.categoria as string,
      icono: p.icono as Producto["icono"],
      entregaHoy: true,
      comercioNombre: comercioRaw?.nombre ?? "Comercio",
      rubroId: comercioRaw?.rubro_id ?? "auto",
    };
  });
}

export interface ResultadoBusqueda {
  comercios: Comercio[];
  productos: ProductoConComercio[];
}

/** Búsqueda global: coincidencia aproximada de texto en nombres de comercio y de producto. */
export async function buscarGlobal(query: string): Promise<ResultadoBusqueda> {
  const q = normalizeText(query.trim());
  if (!q) return { comercios: [], productos: [] };

  const [todosComercios, todosProductos] = await Promise.all([
    getTodosLosComercios(),
    getTodosLosProductosConComercio(),
  ]);

  const comercios = todosComercios.filter((c) => normalizeText(c.nombre).includes(q));
  const productos = todosProductos.filter(
    (p) => normalizeText(p.nombre).includes(q) || normalizeText(p.categoria).includes(q)
  );

  return { comercios, productos };
}

/**
 * Trae la CANTIDAD de productos activos por cada comercio, en una sola
 * consulta a Supabase (en vez de una consulta separada por cada comercio,
 * que es más lento cuantos más locales haya en el rubro).
 */
export async function getConteoProductosPorComercios(
  comercioIds: string[]
): Promise<Record<string, number>> {
  if (comercioIds.length === 0) return {};

  if (!supabase) {
    const conteo: Record<string, number> = {};
    for (const id of comercioIds) {
      conteo[id] = productosEjemplo.filter((p) => p.comercioId === id).length;
    }
    return conteo;
  }

  const { data, error } = await supabase
    .from("productos")
    .select("comercio_id")
    .in("comercio_id", comercioIds)
    .eq("activo", true);

  if (error || !data) {
    const conteo: Record<string, number> = {};
    for (const id of comercioIds) {
      conteo[id] = productosEjemplo.filter((p) => p.comercioId === id).length;
    }
    return conteo;
  }

  const conteo: Record<string, number> = {};
  for (const id of comercioIds) conteo[id] = 0;
  for (const row of data as Array<{ comercio_id: string }>) {
    conteo[row.comercio_id] = (conteo[row.comercio_id] ?? 0) + 1;
  }
  return conteo;
}
