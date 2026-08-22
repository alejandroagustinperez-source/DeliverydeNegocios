import { loginAdmin } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="bg-white border border-border rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-lg font-bold mb-1">Panel de administración</h1>
        <p className="text-sm text-ink-soft mb-5">Ingresá la contraseña para ver y gestionar los pedidos.</p>
        <form action={loginAdmin} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Contraseña"
            className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
          />
          {error && <p className="text-xs text-accent-dark">Contraseña incorrecta.</p>}
          <button
            type="submit"
            className="bg-brand-blue hover:bg-brand-blue-dark transition text-white font-bold py-2.5 rounded-lg text-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
