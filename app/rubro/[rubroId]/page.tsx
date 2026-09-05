import { notFound } from "next/navigation";
import { getRubro, getComerciosPorRubro, getConteoProductosPorComercios } from "@/lib/queries";
import { StoreCard } from "@/components/StoreCard";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function RubroPage({
  params,
}: {
  params: Promise<{ rubroId: string }>;
}) {
  const { rubroId } = await params;

  // Estas dos consultas no dependen una de la otra, así que las pedimos
  // al mismo tiempo en vez de esperar una para recién pedir la otra.
  const [rubro, comercios] = await Promise.all([
    getRubro(rubroId),
    getComerciosPorRubro(rubroId),
  ]);

  if (!rubro || !rubro.disponible) notFound();

  const conteos = await getConteoProductosPorComercios(comercios.map((c) => c.id));

  return (
    <div>
      <Breadcrumb items={[{ label: rubro.nombre }]} />
      <section className="max-w-6xl mx-auto px-6 pt-4 pb-10">
        <div className="mb-4">
          <h2 className="text-[17px] font-bold">{rubro.nombre}</h2>
          <p className="text-[13px] text-ink-soft mt-0.5">Locales disponibles en San Luis Capital</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comercios.map((comercio, i) => (
            <StoreCard
              key={comercio.id}
              comercio={comercio}
              cantidadProductos={conteos[comercio.id] ?? 0}
              alt={i % 2 === 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
