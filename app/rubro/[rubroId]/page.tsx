import { notFound } from "next/navigation";
import { getRubro, getComerciosPorRubro, getProductosPorComercio } from "@/lib/queries";
import { StoreCard } from "@/components/StoreCard";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function RubroPage({
  params,
}: {
  params: Promise<{ rubroId: string }>;
}) {
  const { rubroId } = await params;
  const rubro = await getRubro(rubroId);
  if (!rubro || !rubro.disponible) notFound();

  const comercios = await getComerciosPorRubro(rubroId);
  const comerciosConCantidad = await Promise.all(
    comercios.map(async (c) => ({
      comercio: c,
      cantidadProductos: (await getProductosPorComercio(c.id)).length,
    }))
  );

  return (
    <div>
      <Breadcrumb items={[{ label: rubro.nombre }]} />
      <section className="max-w-6xl mx-auto px-6 pt-4 pb-10">
        <div className="mb-4">
          <h2 className="text-[17px] font-bold">{rubro.nombre}</h2>
          <p className="text-[13px] text-ink-soft mt-0.5">Locales disponibles en San Luis Capital</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comerciosConCantidad.map(({ comercio, cantidadProductos }, i) => (
            <StoreCard key={comercio.id} comercio={comercio} cantidadProductos={cantidadProductos} alt={i % 2 === 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
