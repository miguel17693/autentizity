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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo-transparent.png"
              alt="AuthentiZity"
              width={180}
              height={54}
              className="h-11 lg:h-14 w-auto"
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:block">
            <Link
              href="/eventos"
              className="text-[13px] font-medium tracking-[0.08em] uppercase text-primary border border-primary px-6 py-3 hover:bg-primary hover:text-white transition-all"
            >
              Eventos
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[7.5px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Subtle bottom line */}
      <div className="h-[1px] bg-border-light" />

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[81px] bottom-0 bg-white z-40 overflow-y-auto transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-12">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-3xl font-light text-primary py-4 border-b border-border-light hover:text-accent transition-colors"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/eventos"
            onClick={() => setMobileOpen(false)}
            className="mt-10 inline-block text-center text-[13px] font-medium tracking-[0.08em] uppercase text-primary border border-primary px-8 py-4 hover:bg-primary hover:text-white transition-all"
          >
            Ver Eventos
          </Link>
        </nav>
      </div>
    </header>
  );
}
