import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave "secret" (no la "publishable"), que
 * evita las reglas de RLS. SOLO se usa en código de servidor (Server
 * Actions, páginas del panel /admin) — nunca debe importarse desde un
 * componente cliente, porque expondría acceso total a la base de datos.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;
