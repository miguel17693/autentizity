// Admin layout — protegido
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Sidebar de admin */}
      <aside className="w-64 bg-surface-dark border-r border-border p-4">
        <h2 className="font-bold text-lg mb-4">⚙️ Admin</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block px-3 py-2 rounded hover:bg-surface-alt">
            Dashboard
          </a>
          <a href="/admin/noticias" className="block px-3 py-2 rounded hover:bg-surface-alt">
            Noticias
          </a>
          <a href="/admin/eventos" className="block px-3 py-2 rounded hover:bg-surface-alt">
            Eventos
          </a>
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
