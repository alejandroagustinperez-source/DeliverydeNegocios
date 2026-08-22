-- Marketplace SL — schema de base de datos (Supabase / Postgres)
-- Corré este script en el SQL Editor de tu proyecto de Supabase.

create table if not exists rubros (
  id text primary key,
  nombre text not null,
  icono text not null,
  disponible boolean not null default false,
  orden int not null default 0
);

create table if not exists comercios (
  id text primary key,
  rubro_id text not null references rubros(id),
  nombre text not null,
  direccion text not null,
  latitud double precision,
  longitud double precision,
  horario_apertura numeric not null,
  horario_cierre numeric not null,
  telefono text,
  foto_url text,
  rating numeric default 5,
  activo boolean not null default true
);

create table if not exists categorias_producto (
  id serial primary key,
  comercio_id text not null references comercios(id),
  nombre text not null
);

create table if not exists productos (
  id text primary key,
  comercio_id text not null references comercios(id),
  categoria text not null,
  nombre text not null,
  descripcion text,
  precio numeric not null,
  icono text not null default 'box',
  stock int default 0,
  activo boolean not null default true
);

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  direccion_default text
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id),
  comercio_id text not null references comercios(id),
  estado text not null default 'pendiente' check (estado in ('pendiente','en_camino','entregado','cancelado')),
  direccion_entrega text not null,
  latitud_entrega double precision,
  longitud_entrega double precision,
  distancia_km numeric,
  costo_envio numeric,
  total_productos numeric not null,
  total_pedido numeric not null,
  creado_en timestamptz not null default now()
);

create table if not exists pedido_items (
  id serial primary key,
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id text not null references productos(id),
  cantidad int not null default 1,
  precio_unitario numeric not null
);

-- ---------- Seed: rubros ----------
insert into rubros (id, nombre, icono, disponible, orden) values
  ('auto', 'Repuestos de Auto', 'wrench', true, 1),
  ('ferreteria', 'Ferretería', 'hammer', false, 2),
  ('hogar', 'Hogar y Deco', 'home', false, 3),
  ('indumentaria', 'Indumentaria', 'shirt', false, 4),
  ('tecnologia', 'Tecnología', 'chip', false, 5),
  ('mascotas', 'Mascotas', 'paw', false, 6)
on conflict (id) do nothing;

-- ---------- Seed: comercios ----------
insert into comercios (id, rubro_id, nombre, direccion, horario_apertura, horario_cierre, rating) values
  ('centro', 'auto', 'Repuestos Centro', 'Av. Illia 1250, San Luis Capital', 9, 19, 4.8),
  ('sur', 'auto', 'Autopartes del Sur', 'Ruta Prov. 20, Km 3, San Luis Capital', 8, 18, 4.6),
  ('frenos', 'auto', 'Frenos San Luis', 'San Martín 640, San Luis Capital', 9, 13, 4.9)
on conflict (id) do nothing;

-- ---------- Seed: productos ----------
insert into productos (id, comercio_id, categoria, nombre, precio, icono) values
  ('p1', 'frenos', 'Frenos', 'Pastillas de freno delanteras Fiat Cronos', 38500, 'brake'),
  ('p2', 'centro', 'Filtros', 'Filtro de aceite Ford Focus 2.0', 9800, 'filter'),
  ('p3', 'centro', 'Motor', 'Correa de distribución Chevrolet Onix', 27300, 'belt'),
  ('p4', 'sur', 'Eléctrico', 'Batería 12x65 Willard', 112000, 'battery'),
  ('p5', 'sur', 'Eléctrico', 'Kit de lámparas H4 Osram', 14200, 'headlight'),
  ('p6', 'frenos', 'Lubricantes', 'Aceite 20W50 mineral 4L', 21900, 'oil'),
  ('p7', 'sur', 'Suspensión', 'Amortiguador trasero Peugeot 208', 64500, 'shock'),
  ('p8', 'centro', 'Motor', 'Bomba de agua Volkswagen Gol', 32700, 'pump')
on conflict (id) do nothing;
