"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre Nosotros", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo-transparent.png"
              alt="AuthentiZity"
              width={200}
              height={60}
              className="h-12 sm:h-14 w-auto"
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface-alt"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/eventos"
              className="ml-4 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-[var(--radius-button)] hover:bg-primary-light transition-colors"
            >
              Próximos Eventos
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-alt transition-colors"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-base font-semibold text-text-secondary hover:text-primary hover:bg-surface-alt rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/eventos"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 px-4 py-3 bg-primary text-white text-base font-bold rounded-[var(--radius-button)] text-center hover:bg-primary-light transition-colors"
            >
              Próximos Eventos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
