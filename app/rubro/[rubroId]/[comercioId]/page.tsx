import { notFound } from "next/navigation";
import { rubros, comercios, getProductosPorComercio } from "@/lib/data";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StoreCatalog } from "@/components/StoreCatalog";

export default async function ComercioPage({
  params,
}: {
  params: Promise<{ rubroId: string; comercioId: string }>;
}) {
  const { rubroId, comercioId } = await params;
  const rubro = rubros.find((r) => r.id === rubroId);
  const comercio = comercios.find((c) => c.id === comercioId && c.rubroId === rubroId);
  if (!rubro || !comercio) notFound();

  const productos = getProductosPorComercio(comercio.id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: rubro.nombre, href: `/rubro/${rubro.id}` },
          { label: comercio.nombre },
        ]}
      />
      <StoreCatalog comercio={comercio} productos={productos} />
    </div>
  );
}
