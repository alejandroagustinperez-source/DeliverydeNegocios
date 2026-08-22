import { Rubro, Comercio, Producto } from "./types";

/**
 * RUBROS
 * "Repuestos de Auto" arranca disponible. El resto existe en el modelo
 * de datos para que la home muestre "Próximamente" y comunique que la
 * plataforma va a escalar a otros rubros.
 */
export const rubros: Rubro[] = [
  { id: "auto", nombre: "Repuestos de Auto", icono: "wrench", disponible: true, orden: 1 },
  { id: "ferreteria", nombre: "Ferretería", icono: "hammer", disponible: false, orden: 2 },
  { id: "hogar", nombre: "Hogar y Deco", icono: "home", disponible: false, orden: 3 },
  { id: "indumentaria", nombre: "Indumentaria", icono: "shirt", disponible: false, orden: 4 },
  { id: "tecnologia", nombre: "Tecnología", icono: "chip", disponible: false, orden: 5 },
  { id: "mascotas", nombre: "Mascotas", icono: "paw", disponible: false, orden: 6 },
];

export const comercios: Comercio[] = [
  {
    id: "centro",
    rubroId: "auto",
    nombre: "Repuestos Centro",
    direccion: "Av. Illia 1250, San Luis Capital",
    horario: { apertura: 9, cierre: 19 },
    tags: ["Motor", "Filtros"],
    rating: 4.8,
  },
  {
    id: "sur",
    rubroId: "auto",
    nombre: "Autopartes del Sur",
    direccion: "Ruta Prov. 20, Km 3, San Luis Capital",
    horario: { apertura: 8, cierre: 18 },
    tags: ["Suspensión", "Eléctrico"],
    rating: 4.6,
  },
  {
    id: "frenos",
    rubroId: "auto",
    nombre: "Frenos San Luis",
    direccion: "San Martín 640, San Luis Capital",
    horario: { apertura: 9, cierre: 13 },
    tags: ["Frenos", "Lubricantes"],
    rating: 4.9,
  },
];

export const productos: Producto[] = [
  { id: "p1", comercioId: "frenos", nombre: "Pastillas de freno delanteras Fiat Cronos", precio: 38500, categoria: "Frenos", icono: "brake", entregaHoy: true },
  { id: "p2", comercioId: "centro", nombre: "Filtro de aceite Ford Focus 2.0", precio: 9800, categoria: "Filtros", icono: "filter", entregaHoy: true },
  { id: "p3", comercioId: "centro", nombre: "Correa de distribución Chevrolet Onix", precio: 27300, categoria: "Motor", icono: "belt", entregaHoy: true },
  { id: "p4", comercioId: "sur", nombre: "Batería 12x65 Willard", precio: 112000, categoria: "Eléctrico", icono: "battery", entregaHoy: true },
  { id: "p5", comercioId: "sur", nombre: "Kit de lámparas H4 Osram", precio: 14200, categoria: "Eléctrico", icono: "headlight", entregaHoy: true },
  { id: "p6", comercioId: "frenos", nombre: "Aceite 20W50 mineral 4L", precio: 21900, categoria: "Lubricantes", icono: "oil", entregaHoy: true },
  { id: "p7", comercioId: "sur", nombre: "Amortiguador trasero Peugeot 208", precio: 64500, categoria: "Suspensión", icono: "shock", entregaHoy: true },
  { id: "p8", comercioId: "centro", nombre: "Bomba de agua Volkswagen Gol", precio: 32700, categoria: "Motor", icono: "pump", entregaHoy: true },
];

/** Devuelve true si el comercio está abierto en este momento, según su horario cargado. */
export function isStoreOpen(horario: { apertura: number; cierre: number }, now: Date = new Date()): boolean {
  const h = now.getHours() + now.getMinutes() / 60;
  return h >= horario.apertura && h < horario.cierre;
}

/**
 * Fórmula de tarifa de envío.
 * Se recalibra con datos reales de las primeras 15-20 entregas: por ahora
 * son constantes fáciles de tocar acá mismo.
 */
export const TARIFA_BASE = 2200; // cubre hasta 2 km
export const TARIFA_POR_KM_ADICIONAL = 200;
export const KM_CUBIERTOS_EN_BASE = 2;

export function calcularCostoEnvio(distanciaKm: number): number {
  const kmExtra = Math.max(0, distanciaKm - KM_CUBIERTOS_EN_BASE);
  return TARIFA_BASE + kmExtra * TARIFA_POR_KM_ADICIONAL;
}

/** Normaliza texto para búsqueda aproximada: minúsculas y sin acentos. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchProductos(list: Producto[], query: string): Producto[] {
  const q = normalizeText(query.trim());
  if (!q) return list;
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  return list.filter((p) => {
    const name = normalizeText(p.nombre);
    return name.includes(q) || words.some((w) => name.includes(w));
  });
}

export function getComerciosPorRubro(rubroId: string): Comercio[] {
  return comercios.filter((c) => c.rubroId === rubroId);
}

export function getProductosPorComercio(comercioId: string): Producto[] {
  return productos.filter((p) => p.comercioId === comercioId);
}
