"use client";

import Link from "next/link";
import { logout } from "@/utils/logout";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: any) {

  return (
    
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl mb-4">Admin</h2>

          <nav className="flex flex-col gap-2">
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/usuarios">Usuários</Link>
            <Link href="/admin/produtos">Produtos</Link>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Conteudo */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div >
    </AuthGuard>
  );
}