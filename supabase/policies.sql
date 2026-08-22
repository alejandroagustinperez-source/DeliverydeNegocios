-- Políticas de Row Level Security (RLS)
-- Corré esto DESPUÉS de que schema.sql haya creado las tablas con RLS activado.

-- Habilitar RLS explícitamente en todas las tablas (por si alguna quedó sin marcar)
alter table rubros enable row level security;
alter table comercios enable row level security;
alter table categorias_producto enable row level security;
alter table productos enable row level security;
alter table clientes enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;

-- Lectura pública del catálogo: cualquier visitante de la web tiene que poder
-- VER rubros, comercios y productos (es lo que se muestra en el sitio).
create policy "Lectura pública de rubros"
  on rubros for select
  using (true);

create policy "Lectura pública de comercios"
  on comercios for select
  using (true);

create policy "Lectura pública de categorías"
  on categorias_producto for select
  using (true);

create policy "Lectura pública de productos"
  on productos for select
  using (true);

-- clientes, pedidos y pedido_items NO reciben política de lectura/escritura
-- pública acá a propósito: por ahora quedan bloqueados desde el navegador.
-- Cuando armemos el flujo de "Confirmar pedido", la creación de pedidos va
-- a pasar por una función de servidor (no directo desde el cliente), para
-- no exponer esas tablas con la clave pública (anon key).
