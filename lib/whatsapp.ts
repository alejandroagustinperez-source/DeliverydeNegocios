/**
 * Notificación de WhatsApp usando CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/).
 * Es un servicio gratuito pensado justamente para esto: recibir un aviso en tu
 * propio WhatsApp cuando pasa algo en tu sitio (en este caso, un pedido nuevo).
 *
 * Requiere dos variables de entorno (WHATSAPP_PHONE y WHATSAPP_APIKEY) — ver
 * el README para cómo conseguir la clave. Si no están configuradas, esta
 * función simplemente no hace nada (no rompe la creación del pedido).
 */
export async function notificarWhatsapp(mensaje: string): Promise<void> {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.WHATSAPP_APIKEY;

  if (!phone || !apikey) {
    console.log("[whatsapp] WHATSAPP_PHONE / WHATSAPP_APIKEY no configuradas, se omite la notificación.");
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
    phone
  )}&text=${encodeURIComponent(mensaje)}&apikey=${encodeURIComponent(apikey)}`;

  try {
    await fetch(url);
  } catch (error) {
    // Un fallo al notificar no debe hacer fallar la creación del pedido.
    console.error("[whatsapp] No se pudo enviar la notificación:", error);
  }
}
