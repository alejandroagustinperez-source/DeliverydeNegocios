import Link from "next/link";
import Image from "next/image";
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

const pasos = [
  {
    n: 1,
    titulo: "Elegís",
    texto: "Buscás el producto entre los comercios de San Luis y lo sumás al carrito.",
  },
  {
    n: 2,
    titulo: "Confirmás",
    texto: "Ves el costo de envío según tu localidad antes de pagar.",
  },
  {
    n: 3,
    titulo: "Te llega hoy",
    texto: "Lo retiramos del comercio y te lo llevamos el mismo día.",
  },
];

const stats = [
  { big: "0%", texto: "De comisión por venta, mientras dure el lanzamiento." },
  { big: "100%", texto: "Del delivery lo cubrimos nosotros — moto y auto propios." },
  { big: `${zonas.length}`, texto: "Localidades cubiertas: San Luis Capital y alrededores." },
];

// Zonas ordenadas de la más cercana a la más lejana, para la tabla de cobertura.
const zonasOrdenadas = [...zonas].sort((a, b) => a.kmReferencia - b.kmReferencia);

export default function HomePage() {
  const contacto = process.env.NEXT_PUBLIC_WHATSAPP_CONTACTO;
  const linkWhatsapp = contacto
    ? buildWaMeLink(contacto, "Hola! Quiero sumar mi comercio a Chasqui.")
    : "#sumate";

  const capital = zonas.find((z) => z.id === "san_luis_capital");
  const precioCapital = capital ? calcularCostoEnvio(capital.kmReferencia) : null;

  return (
    <div>
      {/* Hero */}
      <div className="bg-brand-blue-dark px-6 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Delivery propio en San Luis y alrededores
            </span>
            <h1 className="text-white font-extrabold text-4xl md:text-5xl leading-tight mb-5">
              Todo San Luis, entregado <span className="text-accent">el mismo día</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-7 max-w-md">
              Conectamos a los comercios de la ciudad con la gente que los necesita. Comprás
              desde tu casa, o vendés sin pagar comisión — el reparto lo hacemos nosotros.
            </p>
            <div className="flex gap-3 flex-wrap mb-6">
              <Link
                href="/tienda"
                className="bg-accent hover:bg-accent-dark transition text-white font-bold px-6 py-3 rounded-lg text-sm"
              >
                Quiero comprar
              </Link>
              <a
                href="#sumate"
                className="border border-white/35 hover:bg-white/10 transition text-white font-bold px-6 py-3 rounded-lg text-sm"
              >
                Sumar mi comercio
              </a>
            </div>
            <div className="flex gap-5 flex-wrap text-xs text-white/75">
              <span className="flex items-center gap-1.5">
                <span className="text-accent font-bold">✓</span> Envío el mismo día
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-accent font-bold">✓</span> Precio de envío claro
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-accent font-bold">✓</span> Comercios locales
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/hero-vehiculo.jpg"
                alt="Vehículo de Chasqui San Luis"
                fill
                className="object-cover"
                priority
              />
            </div>
            {precioCapital !== null && (
              <div className="absolute -bottom-5 left-6 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <Icon name="today" className="w-4 h-4 text-brand-blue" />
                </span>
                <div>
                  <p className="text-[11px] text-ink-soft leading-tight">
                    Envío a San Luis Capital
                  </p>
                  <p className="font-extrabold text-ink text-lg leading-tight">
                    ${precioCapital.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Para vos */}
      <section className="bg-bg px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent-dark font-bold text-xs uppercase tracking-wide mb-2">Para vos</p>
          <h2 className="text-2xl md:text-[32px] font-bold mb-3 max-w-md">
            Comprá sin moverte de tu casa
          </h2>
          <p className="text-ink-soft text-[15px] leading-relaxed max-w-lg mb-9">
            Repuestos de auto hoy, y pronto ferretería, hogar y mucho más — todo en un mismo
            lugar.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {beneficiosClientes.map((b) => (
              <div key={b.titulo} className="bg-white border border-border rounded-2xl p-6 flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0">
                  <Icon name={b.icon} className="w-5 h-5 text-brand-blue" />
                </span>
                <div>
                  <h3 className="font-bold text-[15px] mb-1.5">{b.titulo}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{b.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-white px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-[30px] font-bold mb-12">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            {pasos.map((p) => (
              <div key={p.n}>
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white text-sm mb-4 ${
                    p.n === 3 ? "bg-accent" : "bg-brand-blue-dark"
                  }`}
                >
                  {p.n}
                </span>
                <h3 className="font-bold text-base mb-1.5">{p.titulo}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zonas de cobertura */}
      <section className="bg-bg px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-wide mb-2">Cobertura</p>
          <h2 className="text-2xl md:text-[30px] font-bold mb-3 max-w-md">
            ¿Cuánto sale el envío a tu localidad?
          </h2>
          <p className="text-ink-soft text-[15px] leading-relaxed max-w-lg mb-8">
            El precio de envío ya está calculado para cada localidad — sin sorpresas al
            confirmar tu pedido.
          </p>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-brand-blue text-white text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wide">
                    Localidad
                  </th>
                  <th className="bg-brand-blue text-white text-left px-5 py-3.5 font-bold text-xs uppercase tracking-wide">
                    Distancia
                  </th>
                  <th className="bg-brand-blue text-white text-right px-5 py-3.5 font-bold text-xs uppercase tracking-wide">
                    Costo de envío
                  </th>
                </tr>
              </thead>
              <tbody>
                {zonasOrdenadas.map((z, i) => (
                  <tr key={z.id} className={i % 2 === 1 ? "bg-bg" : ""}>
                    <td className="px-5 py-3.5 border-b border-border font-bold">{z.nombre}</td>
                    <td className="px-5 py-3.5 border-b border-border text-ink-soft">
                      {z.kmReferencia} km
                    </td>
                    <td className="px-5 py-3.5 border-b border-border text-right font-extrabold text-brand-blue">
                      ${calcularCostoEnvio(z.kmReferencia).toLocaleString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Para tu comercio */}
      <section className="bg-bg px-6 py-16 md:py-20" id="sumate">
        <div className="max-w-6xl mx-auto">
          <div className="bg-brand-blue-dark rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <div className="max-w-lg">
                <p className="text-accent font-bold text-xs uppercase tracking-wide mb-2.5">
                  Para tu comercio
                </p>
                <h2 className="text-white text-2xl md:text-[28px] font-bold mb-3">
                  Vendé más, sin pagar comisión
                </h2>
                <p className="text-white/65 text-sm leading-relaxed">
                  Por tiempo limitado, publicá tu catálogo gratis mientras lanzamos la
                  plataforma. Vos atendé el mostrador — del reparto nos encargamos nosotros.
                </p>
              </div>
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent hover:bg-accent-dark transition text-white font-bold px-6 py-3 rounded-lg text-sm whitespace-nowrap self-start"
              >
                Sumar mi comercio
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.big} className="bg-white/8 border border-white/10 rounded-xl p-5">
                  <div className="font-extrabold text-3xl text-accent mb-2">{s.big}</div>
                  <p className="text-white/70 text-[13px] leading-relaxed">{s.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
