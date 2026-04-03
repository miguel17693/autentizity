import Link from "next/link";
import Image from "next/image";
import { mockEvents, mockNews } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";

/* ============================================
 * HOME PAGE — AuthentiZity
 * Secciones: Hero, Qué es, Próximos Eventos,
 * Últimas Noticias, Ecosistema, CTA
 * ============================================ */

function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-secondary" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Aceleradora de{" "}
            <span className="text-accent-light">Impacto Social</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            Acompañamos a las empresas en la consecución de sus objetivos de
            impacto social y mejora de cultura de empresa, dentro de un espacio
            impulsado por instituciones y guiado por valores compartidos.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/eventos"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-[var(--radius-button)] hover:bg-accent-light transition-colors text-base"
            >
              Descubre los Eventos
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-[var(--radius-button)] hover:bg-white/20 transition-colors text-base border border-white/20"
            >
              Conoce AuthentiZity
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeAreSection() {
  const pillars = [
    {
      icon: "🤝",
      title: "Autenticidad",
      description:
        "Impulsamos espacios donde las personas y las empresas pueden ser fieles a sus valores.",
    },
    {
      icon: "🌍",
      title: "Impacto Social",
      description:
        "Conectamos empresas, instituciones y ONG para generar un cambio real y medible en la sociedad.",
    },
    {
      icon: "💡",
      title: "Cultura Corporativa",
      description:
        "Transformamos la cultura de las empresas hacia el bienestar, la diversidad y el compromiso.",
    },
    {
      icon: "🏆",
      title: "Reconocimiento",
      description:
        "Ranking Authentic Leaders y Diploma Empresa AuthentiZity para quienes lideran el cambio.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
            ¿Qué es AuthentiZity?
          </h2>
          <p className="mt-4 text-text-secondary text-lg leading-relaxed">
            El ecosistema que reúne a empresas, instituciones, ONG, cámaras de
            comercio y líderes del impacto social en un espacio de valores
            compartidos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-surface-alt rounded-[var(--radius-card)] p-8 text-center hover:shadow-lg transition-shadow border border-border"
            >
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                {pillar.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingEventsSection() {
  const featured = mockEvents.filter((e) => e.featured);

  return (
    <section className="py-20 sm:py-28 bg-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
              Próximos Eventos
            </h2>
            <p className="mt-2 text-text-secondary">
              Descubre las actividades del ecosistema AuthentiZity
            </p>
          </div>
          <Link
            href="/eventos"
            className="text-accent font-semibold hover:text-accent-light transition-colors flex items-center gap-1"
          >
            Ver todos los eventos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((event) => (
            <Link
              key={event.id}
              href={`/eventos/${event.slug}`}
              className="group bg-white rounded-[var(--radius-card)] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-accent text-white rounded-full">
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.startDate)}
                </div>
                <h3 className="font-heading font-bold text-xl text-primary group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNewsSection() {
  return (
    <section className="py-20 sm:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
              Últimas Noticias
            </h2>
            <p className="mt-2 text-text-secondary">
              Actualidad del ecosistema y el impacto social
            </p>
          </div>
          <Link
            href="/noticias"
            className="text-accent font-semibold hover:text-accent-light transition-colors flex items-center gap-1"
          >
            Ver todas las noticias
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockNews.map((news) => (
            <Link
              key={news.id}
              href={`/noticias/${news.slug}`}
              className="group bg-surface-alt rounded-[var(--radius-card)] overflow-hidden hover:shadow-lg transition-all border border-border"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={news.coverImage}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  {news.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-secondary px-2 py-0.5 bg-secondary-light/30 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-heading font-bold text-lg text-primary group-hover:text-accent transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {news.excerpt}
                </p>
                <p className="mt-4 text-xs text-text-muted">
                  {formatDate(news.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  const stats = [
    { number: "40+", label: "Embajadores" },
    { number: "10+", label: "Empresas Impulsoras" },
    { number: "12", label: "Líneas de Actuación" },
    { number: "2026", label: "Lanzamiento" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl">
            El Ecosistema AuthentiZity
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Empresas, instituciones, ONG, cámaras de comercio y embajadores
            unidos por el impacto social.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-bold text-4xl sm:text-5xl text-accent-light">
                {stat.number}
              </div>
              <div className="mt-2 text-white/60 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-surface-alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary">
          ¿Quieres ser parte del cambio?
        </h2>
        <p className="mt-4 text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
          Únete al ecosistema AuthentiZity y empieza a construir una cultura
          corporativa basada en la autenticidad y el impacto social.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:comunidad@autentizity.org"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-[var(--radius-button)] hover:bg-primary-light transition-colors"
          >
            Contacta con nosotros
          </a>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-[var(--radius-button)] hover:bg-surface-dark transition-colors border border-border"
          >
            Más información
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatWeAreSection />
      <UpcomingEventsSection />
      <LatestNewsSection />
      <EcosystemSection />
      <CTASection />
    </>
  );
}
