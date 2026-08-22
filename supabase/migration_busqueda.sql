-- Migración: buscador global + lista de espera de productos no disponibles.
-- Corré esto en el SQL Editor de Supabase.

create table if not exists solicitudes_producto (
  id uuid primary key default gen_random_uuid(),
  termino_busqueda text not null,
  email text not null,
  creado_en timestamptz not null default now()
);

alter table solicitudes_producto enable row level security;

drop policy if exists "Insertar solicitudes públicas" on solicitudes_producto;
create policy "Insertar solicitudes públicas"
  on solicitudes_producto for insert
  with check (true);

-- Sin política de lectura pública a propósito: solo vos ves las solicitudes,
-- desde el Table Editor de Supabase (o el panel /admin más adelante).
