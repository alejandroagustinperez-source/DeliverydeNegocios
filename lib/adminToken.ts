/**
 * Deriva un token estable a partir de ADMIN_PASSWORD, usando HMAC-SHA256
 * con la Web Crypto API (disponible tanto en el runtime de Node como en el
 * de Edge, por eso no usamos el módulo "crypto" de Node acá — así este
 * archivo funciona igual en el middleware).
 *
 * El token derivado es lo que se guarda en la cookie de sesión, en vez de
 * guardar la contraseña en texto plano.
 */
export async function computeAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode("admin-session"));

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_COOKIE_NAME = "admin_session";
