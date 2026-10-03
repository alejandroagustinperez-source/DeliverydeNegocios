import Link from "next/link";
import { buildWaMeLink } from "@/lib/whatsappLink";

export function Footer() {
  const contacto = process.env.NEXT_PUBLIC_WHATSAPP_CONTACTO;
  const linkWhatsapp = contacto
    ? buildWaMeLink(contacto, "Hola! Tengo una consulta sobre Chasqui.")
    : "#";

  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-extrabold text-lg mb-2">Chasqui</p>
          <p className="text-white/65 text-sm leading-relaxed">
            Delivery en San Luis, el mismo día. Comercios locales, reparto propio.
          </p>
        </div>

        <div>
          <p className="font-bold text-sm mb-3">Comprar</p>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            <li>
              <Link href="/tienda" className="hover:text-white transition">
                Rubros
              </Link>
            </li>
            <li>
              <Link href="/tienda" className="hover:text-white transition">
                Comercios
              </Link>
            </li>
            <li>
              <Link href="/#sumate" className="hover:text-white transition">
                Costos de envío
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-sm mb-3">Comercios</p>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            <li>
              <Link href="/#sumate" className="hover:text-white transition">
                Sumar mi comercio
              </Link>
            </li>
            <li>
              <Link href="/#como-funciona" className="hover:text-white transition">
                Cómo funciona
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-sm mb-3">Contacto</p>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            <li>
              <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                WhatsApp: 266 506-6606
              </a>
            </li>
            <li>Instagram: [TU USUARIO]</li>
            <li>Horario: [TUS HORARIOS]</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-white/50">
          © 2026 Chasqui · San Luis, Argentina
        </div>
      </div>
    </footer>
  );
}
