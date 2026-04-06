"use client";

import { useState, useEffect, useRef } from "react";
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
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(81);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure actual header height for mobile menu offset
  useEffect(() => {
    if (headerRef.current) {
      setHeaderH(headerRef.current.offsetHeight);
    }
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
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 sm:h-24 lg:h-28">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center h-full py-1.5">
              <Image
                src="/images/logo-transparent.png"
                alt="AutentiZity"
                width={340}
                height={100}
                className="h-full w-auto object-contain max-h-16 sm:max-h-20 lg:max-h-24"
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

            {/* Mobile toggle — larger tap target */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden relative z-50 flex items-center justify-center w-10 h-10 -mr-2"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div className="w-[22px] flex flex-col gap-[5px]">
                <span
                  className={`block h-[2px] bg-primary rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-primary rounded-full transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-primary rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
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
      </header>

      {/* ====== Mobile menu (outside header to avoid stacking context issues) ====== */}

      {/* Backdrop overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Menu panel */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 bg-white z-50 overflow-y-auto transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ top: `${headerH}px` }}
      >
        <nav className="flex flex-col px-5 sm:px-6 pt-6 pb-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-[1.25rem] sm:text-[1.35rem] font-light text-primary py-4 border-b border-border-light active:text-accent active:pl-1 transition-all duration-150"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="mailto:comunidad@autentizity.org"
            className="mt-8 text-text-secondary text-sm font-light"
          >
            comunidad@autentizity.org
          </a>
        </nav>
      </div>
    </>
  );
}
