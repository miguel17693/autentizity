import Link from "next/link";
import Image from "next/image";

const nav = [
  { label: "Noticias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
  { label: "Sobre Nosotros", href: "/about" },
];

const ecosystem = [
  { label: "Empresas Impulsoras", href: "/about#empresas" },
  { label: "Embajadores", href: "/about#embajadores" },
  { label: "Ruta AuthentiZity", href: "/about#ruta" },
  { label: "Ranking Authentic Leaders", href: "/about#ranking" },
];

export default function Footer() {
  return (
    <footer className="bg-[#012D2D] text-white">
      {/* ── Top band ── */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Brand */}
            <div className="lg:col-span-5">
              <Image
                src="/images/logo-transparent.png"
                alt="AuthentiZity"
                width={200}
                height={60}
                className="h-10 w-auto brightness-0 invert"
              />
              <p className="mt-6 text-white/40 text-sm leading-relaxed max-w-sm font-light">
                Aceleradora de Impacto Social. Impulsamos una cultura
                empresarial basada en la autenticidad, el bienestar y el
                compromiso social.
              </p>

              {/* Social */}
              <div className="flex items-center gap-5 mt-8">
                <a
                  href="https://www.linkedin.com/company/authentizity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/authentizity"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <div className="lg:col-span-3">
              <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/25 mb-6">
                Navegación
              </h4>
              <ul className="space-y-4">
                {nav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm font-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/25 mb-6">
                Ecosistema
              </h4>
              <ul className="space-y-4">
                {ecosystem.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm font-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact info inline */}
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/25 mb-4">
                  Contacto
                </h4>
                <div className="space-y-2 text-sm font-light">
                  <a
                    href="mailto:comunidad@autentizity.org"
                    className="block text-white/50 hover:text-white transition-colors"
                  >
                    comunidad@autentizity.org
                  </a>
                  <a
                    href="https://www.autentizity.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white/50 hover:text-white transition-colors"
                  >
                    www.autentizity.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-white/20 text-xs font-light">
          © {new Date().getFullYear()} AuthentiZity. Todos los derechos reservados.
        </p>
        <div className="flex gap-8 text-xs text-white/20 font-light">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">
            Privacidad
          </Link>
          <Link href="/cookies" className="hover:text-white/50 transition-colors">
            Cookies
          </Link>
          <Link href="/legal" className="hover:text-white/50 transition-colors">
            Aviso Legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
