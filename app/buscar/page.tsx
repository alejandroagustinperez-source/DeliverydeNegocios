import { buscarGlobal, getProductosPorComercio } from "@/lib/queries";
import { StoreCard } from "@/components/StoreCard";
import { SearchProductCard } from "@/components/SearchProductCard";
import { SolicitudProductoForm } from "@/components/SolicitudProductoForm";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Buscar" }]} />
        <section className="max-w-6xl mx-auto px-6 pt-8 pb-10 text-center">
          <p className="text-sm text-ink-soft">Escribí algo en el buscador de arriba para empezar.</p>
        </section>
      </div>
    );
  }

  const { comercios, productos } = await buscarGlobal(query);

  const comerciosConCantidad = await Promise.all(
    comercios.map(async (c) => ({
      comercio: c,
      cantidadProductos: (await getProductosPorComercio(c.id)).length,
    }))
  );

  const sinResultados = comercios.length === 0 && productos.length === 0;

  return (
    <div>
      <Breadcrumb items={[{ label: `Resultados para "${query}"` }]} />
      <section className="max-w-6xl mx-auto px-6 pt-4 pb-10">
        {comerciosConCantidad.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[17px] font-bold mb-4">Locales</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {comerciosConCantidad.map(({ comercio, cantidadProductos }, i) => (
                <StoreCard key={comercio.id} comercio={comercio} cantidadProductos={cantidadProductos} alt={i % 2 === 1} />
              ))}
            </div>
          </div>
        )}

        {productos.length > 0 && (
          <div>
            <h2 className="text-[17px] font-bold mb-4">Productos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map((p, i) => (
                <SearchProductCard key={p.id} producto={p} alt={i % 2 === 1} />
              ))}
            </div>
          </div>
        )}

        {sinResultados && (
          <div className="pt-6">
            <SolicitudProductoForm termino={query} />
          </div>
        )}
      </section>
    </div>
  );
}
