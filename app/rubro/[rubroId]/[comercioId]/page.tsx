import { notFound } from "next/navigation";
import { getRubro, getComercio, getProductosPorComercio } from "@/lib/queries";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StoreCatalog } from "@/components/StoreCatalog";

export default async function ComercioPage({
  params,
}: {
  params: Promise<{ rubroId: string; comercioId: string }>;
}) {
  const { rubroId, comercioId } = await params;
  const rubro = await getRubro(rubroId);
  const comercio = await getComercio(rubroId, comercioId);
  if (!rubro || !comercio) notFound();

  const productos = await getProductosPorComercio(comercio.id);

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
