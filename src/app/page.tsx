import Link from "next/link";
import Image from "next/image";
import { mockEvents, mockNews } from "@/lib/data/mock";
import { formatDate } from "@/lib/utils";

/* ============================================
 * HOME — AuthentiZity
 * Diseño editorial premium
 * ============================================ */

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-100" />
      
      {/* Textura geométrica sutil */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] border border-white rounded-full" />
        <div className="absolute top-1/3 right-16 w-[400px] h-[400px] border border-white rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] border border-white rounded-full" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-0 w-full">
        <div className="max-w-3xl">
          {/* Overline */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-accent" />
            <span className="text-accent text-[13px] font-medium tracking-[0.15em] uppercase">
              Aceleradora de Impacto Social
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] text-white font-light tracking-[-0.02em] text-balance">
            Donde la autenticidad
            <br />
            <em className="font-normal text-secondary-light">
              transforma
            </em>{" "}
            la cultura
            <br />
            empresarial
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-white/60 text-lg lg:text-xl leading-relaxed max-w-xl font-light">
            Conectamos empresas, instituciones y sociedad civil para
            impulsar entornos de trabajo donde las personas pueden ser
            quienes realmente son.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/eventos"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
            >
              Próximos eventos
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 text-white/70 text-[13px] font-medium tracking-[0.08em] uppercase border border-white/20 hover:border-white/50 hover:text-white transition-all"
            >
              Descubre el ecosistema
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="py-28 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="brand-line" />
              <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                El ecosistema
              </span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary font-light leading-[1.15] tracking-[-0.01em]">
              Un espacio único de
              <br />
              <em className="font-normal">valores compartidos</em>
            </h2>
            <p className="mt-8 text-text-body text-lg leading-relaxed font-light">
              AuthentiZity es el punto de encuentro entre los valores de la
              sociedad y la cultura de las empresas. Impulsa una cultura
              empresarial basada en lo que nos une: aquello que nos
              identifica, nos hace únicos y nos posiciona en el mundo.
            </p>
            <p className="mt-4 text-text-secondary text-base leading-relaxed font-light">
              El potencial de «ser tú» es clave de éxito tanto para las
              empresas como para los profesionales. Cuentan con el apoyo de
              instituciones, ONG, equipos internos y referentes de la
              sociedad que ayudan a que estas acciones generen impacto real.
            </p>
          </div>

          {/* Pillars grid */}
          <div className="grid grid-cols-2 gap-[1px] bg-border">
            {[
              { title: "Autenticidad", desc: "Espacios donde las personas y empresas pueden ser fieles a sus valores" },
              { title: "Impacto Social", desc: "Cambio real y medible conectando empresas, instituciones y ONG" },
              { title: "Cultura", desc: "Transformar la cultura corporativa hacia el bienestar y la diversidad" },
              { title: "Reconocimiento", desc: "Ranking Authentic Leaders y Diploma Empresa AuthentiZity" },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-surface p-8 lg:p-10 group hover:bg-surface-alt transition-colors"
              >
                <h3 className="font-serif text-xl text-primary font-normal mb-3">
                  {pillar.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Events() {
  const featured = mockEvents.filter((e) => e.featured);

  return (
    <section className="py-28 lg:py-40 bg-surface-alt">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="brand-line" />
              <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                Agenda
              </span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary font-light leading-[1.15]">
              Próximos eventos
            </h2>
          </div>
          <Link
            href="/eventos"
            className="group flex items-center gap-3 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
          >
            Ver agenda completa
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((event) => (
            <Link
              key={event.id}
              href={`/eventos/${event.slug}`}
              className="group block bg-white overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
            >
              <div className="relative h-64 lg:h-72 overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Type badge */}
                <div className="absolute top-6 left-6">
                  <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-accent/90 backdrop-blur-sm px-4 py-2">
                    {event.type}
                  </span>
                </div>
                {/* Date overlay */}
                <div className="absolute bottom-6 left-6">
                  <span className="text-white/90 text-sm font-light">
                    {formatDate(event.startDate)}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-primary font-normal group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-text-muted text-sm font-light">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
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

function News() {
  return (
    <section className="py-28 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="brand-line" />
              <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                Actualidad
              </span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-primary font-light leading-[1.15]">
              Últimas noticias
            </h2>
          </div>
          <Link
            href="/noticias"
            className="group flex items-center gap-3 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
          >
            Todas las noticias
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* News grid — editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mockNews.map((news, i) => (
            <Link
              key={news.id}
              href={`/noticias/${news.slug}`}
              className={`group block ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-72 lg:h-full" : "h-56"}`}>
                <Image
                  src={news.coverImage}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex gap-3 mb-3">
                    {news.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className={`font-serif text-white font-normal leading-tight group-hover:text-secondary-light transition-colors ${i === 0 ? "text-3xl lg:text-4xl" : "text-xl"}`}>
                    {news.title}
                  </h3>
                  {i === 0 && (
                    <p className="mt-3 text-white/60 text-sm leading-relaxed font-light max-w-lg">
                      {news.excerpt}
                    </p>
                  )}
                  <p className="mt-4 text-white/40 text-xs font-light">
                    {formatDate(news.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { number: "40+", label: "Embajadores del ecosistema" },
    { number: "12", label: "Líneas de actuación" },
    { number: "10+", label: "Empresas impulsoras" },
    { number: "2026", label: "Año de lanzamiento" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-surface-warm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="font-serif text-5xl lg:text-6xl text-primary font-light tracking-[-0.02em]">
                {stat.number}
              </div>
              <div className="mt-2 text-text-secondary text-sm font-light">
                {stat.label}
              </div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32 lg:py-44 bg-primary overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl lg:text-6xl text-white font-light leading-[1.1] text-balance">
          ¿Quieres ser parte
          <br />
          del <em className="font-normal text-secondary-light">cambio</em>?
        </h2>
        <p className="mt-8 text-white/50 text-lg leading-relaxed font-light max-w-lg mx-auto">
          Únete al ecosistema AuthentiZity y lidera la transformación
          hacia una cultura corporativa auténtica.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:comunidad@autentizity.org"
            className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
          >
            Contactar
          </a>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-10 py-4 text-white/60 text-[13px] font-medium tracking-[0.08em] uppercase border border-white/20 hover:border-white/40 hover:text-white transition-all"
          >
            Conocer más
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Events />
      <News />
      <Stats />
      <CTA />
    </>
  );
}
