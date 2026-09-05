import Link from "next/link";
import { Icon } from "@/components/icons";
import { zonas, calcularCostoEnvio } from "@/lib/data";
import { buildWaMeLink } from "@/lib/whatsappLink";

const beneficiosClientes = [
  {
    icon: "today" as const,
    titulo: "Envío el mismo día",
    texto: "Hacés el pedido y te lo llevamos nosotros mismos, sin esperar días.",
  },
  {
    icon: "box" as const,
    titulo: "Precio de envío claro",
    texto: "Sabés cuánto pagás de envío antes de confirmar, según tu localidad.",
  },
  {
    icon: "store" as const,
    titulo: "Comercios reales de San Luis",
    texto: "Comprás en los locales de siempre, con stock y precios actualizados.",
  },
  {
    icon: "search" as const,
    titulo: "Buscás y encontrás",
    texto: "Un solo buscador para todos los rubros y comercios, sin ir local por local.",
  },
];

const stats = [
  { big: "0%", texto: "De comisión por venta, mientras dure el lanzamiento." },
  { big: "100%", texto: "Del delivery lo cubrimos nosotros — moto y auto propios." },
  { big: "+1", texto: "Canal de venta nuevo, sin cambiar cómo trabajás hoy." },
];

export default function SumatePage() {
  const contacto = process.env.NEXT_PUBLIC_WHATSAPP_CONTACTO;
  const linkWhatsapp = contacto
    ? buildWaMeLink(contacto, "Hola! Quiero sumar mi comercio a Chasqui.")
    : "#sumate";

  return (
    <div>
      {/* Hero */}
      <div className="bg-brand-blue-dark px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-white font-extrabold text-3xl md:text-5xl leading-tight mb-6">
            Todo San Luis, entregado <span className="text-accent">el mismo día</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Conectamos a los comercios de la ciudad con la gente que los necesita. Comprás
            desde tu casa, o vendés sin pagar comisión — el reparto lo hacemos nosotros.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link
              href="/"
              className="bg-accent hover:bg-accent-dark transition text-white font-bold px-7 py-3.5 rounded-lg text-sm"
            >
              Quiero comprar
            </Link>
            <a
              href="#sumate"
              className="border border-white/35 text-white font-bold px-7 py-3.5 rounded-lg text-sm"
            >
              Sumar mi comercio
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto">
        {/* Clientes */}
        <section className="px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14">
            <div>
              <h2 className="text-2xl md:text-[32px] leading-tight font-bold mb-4 max-w-[340px]">
                Comprá sin moverte de tu casa
              </h2>
              <p className="text-ink-soft text-[15px] leading-relaxed max-w-[340px]">
                Repuestos de auto hoy, y pronto ferretería, hogar y mucho más — todo en un
                mismo lugar.
              </p>
            </div>
            <div className="flex flex-col">
              {beneficiosClientes.map((b, i) => (
                <div
                  key={b.titulo}
                  className={`flex gap-5 py-6 border-t border-border ${
                    i === beneficiosClientes.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0">
                    <Icon name={b.icon} className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1.5">{b.titulo}</h3>
                    <p className="text-ink-soft text-sm leading-relaxed">{b.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comercios */}
        <section className="px-8 py-16 md:py-20" id="sumate">
          <div className="bg-ink rounded-3xl p-8 md:p-16 text-white">
            <div className="max-w-lg mb-12">
              <p className="text-accent font-bold text-[13px] uppercase tracking-wide mb-3.5">
                Para tu comercio
              </p>
              <h2 className="text-white text-2xl md:text-[30px] leading-tight font-bold mb-4">
                Vendé más, sin pagar comisión
              </h2>
              <p className="text-white/65 text-[15px] leading-relaxed">
                Por tiempo limitado, publicá tu catálogo gratis mientras lanzamos la
                plataforma. Vos atendé el mostrador — del reparto nos encargamos nosotros.
              </p>
            </div>
            <div className="grid md:grid-cols-3 border-t border-white/14">
              {stats.map((s, i) => (
                <div
                  key={s.big}
                  className={`pt-8 px-2 md:px-6 ${
                    i < stats.length - 1 ? "md:border-r border-white/14" : ""
                  } ${i > 0 ? "border-t md:border-t-0 border-white/14" : ""}`}
                >
                  <div className="font-extrabold text-4xl text-accent mb-2.5">{s.big}</div>
                  <p className="text-white/70 text-[13.5px] leading-relaxed max-w-[200px]">
                    {s.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zonas */}
        <section className="px-8 py-16 md:py-20">
          <div className="flex justify-between items-end gap-5 flex-wrap mb-8">
            <h2 className="text-2xl md:text-[30px] font-bold max-w-[420px]">
              Llegamos a toda la ciudad y alrededores
            </h2>
            <p className="text-ink-soft text-sm max-w-[280px]">
              El precio de envío ya está calculado para cada localidad.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14.5px] min-w-[480px]">
              <thead>
                <tr>
                  <th className="bg-brand-blue text-white text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wide rounded-tl-lg">
                    Localidad
                  </th>
                  <th className="bg-brand-blue text-white text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wide">
                    Distancia
                  </th>
                  <th className="bg-brand-blue text-white text-right px-5 py-3.5 font-bold text-xs uppercase tracking-wide rounded-tr-lg">
                    Costo de envío
                  </th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((z, i) => (
                  <tr key={z.id} className={i % 2 === 1 ? "bg-bg" : ""}>
                    <td className="px-5 py-4 border-b border-border font-bold">{z.nombre}</td>
                    <td className="px-5 py-4 border-b border-border text-ink-soft">
                      {z.kmReferencia} km
                    </td>
                    <td className="px-5 py-4 border-b border-border text-right font-extrabold text-brand-blue">
                      ${calcularCostoEnvio(z.kmReferencia).toLocaleString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* CTA final */}
      <div className="bg-gradient-to-br from-brand-blue to-brand-blue-dark px-8 py-16 md:py-20 text-center">
        <h2 className="text-white text-2xl md:text-[28px] font-bold mb-3.5">
          ¿Listo para empezar?
        </h2>
        <p className="text-white/72 text-[15px] mb-8">
          Comprá ahora mismo, o contanos sobre tu comercio.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-accent hover:bg-accent-dark transition text-white font-bold px-7 py-3.5 rounded-lg text-sm"
          >
            Ir a comprar
          </Link>
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/35 text-white font-bold px-7 py-3.5 rounded-lg text-sm"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
