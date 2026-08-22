export type IconName =
  | "brake" | "filter" | "belt" | "battery" | "headlight" | "oil" | "shock" | "pump"
  | "wrench" | "hammer" | "home" | "shirt" | "paw" | "chip"
  | "today" | "box" | "store" | "plus" | "star" | "arrow" | "lock" | "chevron"
  | "pin" | "clock" | "search" | "cart" | "close";

export interface Rubro {
  id: string;
  nombre: string;
  icono: IconName;
  disponible: boolean;
  orden: number;
}

export interface Horario {
  apertura: number; // hora en formato 24hs, ej 9
  cierre: number; // ej 19
}

export interface Comercio {
  id: string;
  rubroId: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  horario: Horario;
  tags: string[];
  rating: number;
  latitud?: number;
  longitud?: number;
}

export interface Producto {
  id: string;
  comercioId: string;
  nombre: string;
  precio: number;
  categoria: string;
  icono: IconName;
  entregaHoy: boolean;
}

export interface CartItem extends Producto {
  cantidad: number;
}
