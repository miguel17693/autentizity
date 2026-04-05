"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
  { label: "Ranking", href: "/ranking" },
  { label: "Sobre Nosotros", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo — fills the full header height */}
          <Link href="/" className="shrink-0 flex items-center h-full py-2">
            <Image
              src="/images/logo-transparent.png"
              alt="AutentiZity"
              width={280}
              height={84}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>

          {/* Nav desktop — with animated underlines */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors py-2"
              >
                {item.label}
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-accent group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] bg-primary transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom line — fades on scroll */}
      <div
        className={`h-[1px] transition-opacity duration-300 ${
          scrolled ? "opacity-0" : "bg-border-light opacity-100"
        }`}
      />

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[81px] bottom-0 bg-white/[0.98] backdrop-blur-md z-40 overflow-y-auto transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 pt-8 gap-0">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group font-serif text-[1.35rem] font-light text-primary py-4 border-b border-border-light hover:text-accent hover:pl-2 transition-all duration-200 ${
                mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 60 + 80}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu footer */}
        <div className="px-6 mt-8">
          <a
            href="mailto:comunidad@autentizity.org"
            className="text-text-secondary text-sm font-light"
          >
            comunidad@autentizity.org
          </a>
        </div>
      </div>
    </header>
  );
}
