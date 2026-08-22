# Marketplace SL — Delivery de repuestos en San Luis

MVP funcional del marketplace: comercios locales publican su catálogo, los
clientes compran online, y el delivery se hace de forma propia (moto/auto).
Arranca con el rubro **Repuestos de Auto**; el resto de los rubros aparecen
como "Próximamente" en la home.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (preparado, no obligatorio para correr el proyecto en local)

## Cómo correrlo en tu máquina

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

Por defecto el sitio usa los datos de ejemplo de `lib/data.ts` (3 comercios,
8 productos del rubro Repuestos de Auto), así que **funciona sin configurar
nada más**.

## Conectar Supabase (opcional, para pasar a datos reales)

1. Creá un proyecto gratis en supabase.com.
2. Copiá `.env.local.example` a `.env.local` y completá con la URL y la
   `anon key` de tu proyecto (Project Settings -> API).
3. Corré el script `supabase/schema.sql` en el SQL Editor de Supabase — crea
   las tablas y carga los mismos datos de ejemplo.
4. Reemplazá progresivamente las funciones de `lib/data.ts` por consultas a
   `lib/supabase.ts` a medida que quieras que los datos vengan de la base
   real en vez de estar hardcodeados.

## Estructura del proyecto

```
app/
  page.tsx                        -> Home: grilla de rubros
  rubro/[rubroId]/page.tsx        -> Lista de comercios del rubro
  rubro/[rubroId]/[comercioId]/   -> Catálogo del comercio (filtro + búsqueda)
components/                       -> Header, carrito, tarjetas, íconos
lib/
  types.ts                        -> Tipos de TypeScript
  data.ts                         -> Datos de ejemplo + lógica de negocio
                                      (estado abierto/cerrado, tarifa de envío,
                                      búsqueda aproximada)
  supabase.ts                     -> Cliente de Supabase
supabase/schema.sql                -> Tablas + seed para Supabase
```

## Fórmula de tarifa de envío

Está en `lib/data.ts` (`calcularCostoEnvio`), como constantes fáciles de
tocar. El próximo paso es calcular la distancia real con la API de Google
Maps Distance Matrix (lat/lng del comercio vs. dirección de entrega) y
pasarla a esa función.

## Subir a GitHub

```bash
git init
git add .
git commit -m "MVP inicial del marketplace"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## Deploy en Vercel

1. Importá el repo en vercel.com/new.
2. Si conectaste Supabase, cargá las mismas variables de entorno de
   `.env.local` en la configuración del proyecto en Vercel.
3. Deploy.

## Pendientes principales (ver informe del proyecto)

- Migrar `lib/data.ts` a consultas reales contra Supabase
- Cálculo de distancia real con Google Maps Distance Matrix API
- Panel de administración para cargar productos por comercio
- Sistema de pedidos con estados (pendiente / en camino / entregado)
- Definir método de pago (transferencia, contra entrega, o Mercado Pago)
