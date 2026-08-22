import { createClient } from "@supabase/supabase-js";

// Completá estas variables en .env.local (ver .env.local.example).
// Mientras no estén configuradas, el proyecto sigue funcionando con los
// datos de ejemplo de lib/data.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
