import { getPedidosAdmin, logoutAdmin } from "./actions";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const pedidos = await getPedidosAdmin();

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Panel de pedidos</h1>
            <p className="text-xs text-ink-soft mt-0.5">Marketplace SL</p>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" className="text-xs text-ink-soft hover:text-accent-dark">
              Cerrar sesión
            </button>
          </form>
        </div>
        <AdminDashboard pedidosIniciales={pedidos} />
      </div>
    </div>
  );
}
