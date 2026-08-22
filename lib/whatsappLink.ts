/**
 * Genera links de WhatsApp (wa.me) con el mensaje ya escrito, para que con
 * un clic se abra el chat listo para mandar. No requiere ninguna API ni
 * costo — es el mismo mecanismo que usan los botones de "Comprar por
 * WhatsApp" en la mayoría de los comercios chicos.
 */

/**
 * Intenta normalizar un teléfono argentino al formato que espera WhatsApp
 * (549 + código de área + número, sin 0 ni 15). Es una heurística best-effort
 * sobre un texto libre que cargó el cliente en el checkout — puede no ser
 * perfecta en todos los casos, conviene revisar el número antes de mandar
 * si el chat no abre bien.
 */
export function normalizePhoneAR(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  if (digits.startsWith("9")) return "54" + digits;
  return "549" + digits.replace(/^0/, "").replace(/^15/, "");
}

export function buildWaMeLink(phone: string, message: string): string {
  const normalized = normalizePhoneAR(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export const MENSAJES_POR_ESTADO: Record<string, (idCorto: string) => string> = {
  pendiente: (id) => `Hola! Recibimos tu pedido #${id}, ya lo estamos preparando. Te aviso en cuanto salga en camino 🛵`,
  en_camino: (id) => `Hola! Tu pedido #${id} ya está en camino, llegamos en breve 🛵`,
  entregado: (id) => `Hola! Tu pedido #${id} fue entregado. ¡Gracias por tu compra! 🙌`,
  cancelado: (id) => `Hola, tu pedido #${id} fue cancelado. Cualquier consulta, escribinos por acá.`,
};
