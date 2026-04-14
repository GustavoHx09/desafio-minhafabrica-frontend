import Link from "next/link";

export default function AdminLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      {/* NAVBAR */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-4">Admin</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/usuarios">Usuários</Link>
          <Link href="/admin/produtos">Produtos</Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}