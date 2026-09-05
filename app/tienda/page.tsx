import { getRubros, getComerciosPorRubro } from "@/lib/queries";
import { RubroCard } from "@/components/RubroCard";
import { Icon } from "@/components/icons";

export default async function TiendaPage() {
  const rubros = await getRubros();
  const rubrosConCantidad = await Promise.all(
    rubros.map(async (r) => ({
      rubro: r,
      cantidadLocales: r.disponible ? (await getComerciosPorRubro(r.id)).length : 0,
    }))
  );

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-5">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-2xl px-7 py-6 text-white flex justify-between items-center gap-5 flex-wrap">
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold mb-1">Todo lo que necesitás, cerca tuyo</h1>
            <p className="text-[#c9d2f5] text-sm">
              Elegí un rubro, mirá los locales de San Luis y recibí tu pedido en el día.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 bg-accent/15 border border-accent/40 backdrop-blur-sm px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap">
            <Icon name="today" className="w-4 h-4 text-accent" />
            Delivery propio
          </div>
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-accent/20 blur-2xl" />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-7">
        <div className="mb-4">
          <h2 className="text-[17px] font-bold">Elegí un rubro</h2>
          <p className="text-[13px] text-ink-soft mt-0.5">
            Empezamos por autopartes — el resto de los rubros se van sumando de a poco.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {rubrosConCantidad
            .sort((a, b) => a.rubro.orden - b.rubro.orden)
            .map(({ rubro, cantidadLocales }) => (
              <RubroCard key={rubro.id} rubro={rubro} cantidadLocales={cantidadLocales} />
            ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-7 pb-10">
        <h2 className="text-[17px] font-bold mb-4">Cómo funciona</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              n: 1,
              t: "Elegís el rubro y el local",
              d: "Mirás qué locales de San Luis venden lo que buscás y entrás a su catálogo.",
            },
            {
              n: 2,
              t: "Armás tu pedido",
              d: "Sumás los productos al carrito, tal como te los muestra el local, con precio y stock reales.",
            },
            {
              n: 3,
              t: "Te lo llevamos nosotros",
              d: "Retiramos en el local y te lo entregamos el mismo día, sin depender de terceros.",
            },
          ].map((s) => (
            <div key={s.n} className="bg-white/70 border border-border rounded-xl p-4 flex gap-3 items-start">
              <span className="w-[26px] h-[26px] rounded-full bg-brand-blue text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                {s.n}
              </span>
              <div>
                <h4 className="text-[13.5px] font-bold mb-0.5">{s.t}</h4>
                <p className="text-[12.5px] text-ink-soft leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
