"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ noticias: 0, eventos: 0, movimientos: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/noticias").then((r) => r.json()),
      fetch("/api/eventos").then((r) => r.json()),
      fetch("/api/movimientos").then((r) => r.json()),
    ]).then(([noticias, eventos, movimientos]) => {
      setStats({ noticias: noticias.length, eventos: eventos.length, movimientos: movimientos.length });
    });
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary font-light">
        Dashboard
      </h1>
      <p className="mt-2 text-text-secondary text-sm font-light">
        Bienvenido al panel de administración de AutentiZity.
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link
          href="/admin/noticias"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted">
                Noticias
              </p>
              <p className="font-serif text-4xl text-primary font-light mt-1">
                {stats.noticias}
              </p>
            </div>
            <svg className="w-8 h-8 text-text-muted group-hover:text-rose transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-rose opacity-0 group-hover:opacity-100 transition-opacity">
            Gestionar noticias →
          </p>
        </Link>

        <Link
          href="/admin/eventos"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted">
                Eventos
              </p>
              <p className="font-serif text-4xl text-primary font-light mt-1">
                {stats.eventos}
              </p>
            </div>
            <svg className="w-8 h-8 text-text-muted group-hover:text-rose transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-rose opacity-0 group-hover:opacity-100 transition-opacity">
            Gestionar eventos →
          </p>
        </Link>

        <Link
          href="/admin/movimientos"
          className="group bg-white border border-border rounded-2xl p-6 hover:border-accent hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted">
                Movimientos
              </p>
              <p className="font-serif text-4xl text-primary font-light mt-1">
                {stats.movimientos}
              </p>
            </div>
            <svg className="w-8 h-8 text-text-muted group-hover:text-rose transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-rose opacity-0 group-hover:opacity-100 transition-opacity">
            Gestionar movimientos →
          </p>
        </Link>
      </div>
    </div>
  );
}
