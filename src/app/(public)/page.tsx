import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { formatDate } from "@/lib/utils";

/* ============================================
 * HOME — AuthentiZity
 * Editorial premium · Scroll animations
 * ============================================ */

/* ------- Data fetching (API routes) ------- */
async function getEvents() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/eventos`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}

async function getNews() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/noticias`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}

/* ============== HERO ============== */
function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center bg-primary overflow-hidden">
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary" />

      {/* Decorative circles — centred */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white rounded-full" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20 w-full text-center">
        {/* Overline */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-accent" />
          <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
            Aceleradora de Impacto Social
          </span>
          <div className="w-8 h-[1px] bg-accent" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.08] text-white font-light tracking-[-0.02em] text-balance max-w-4xl mx-auto">
          Donde la autenticidad{" "}
          <em className="font-normal text-secondary-light">transforma</em>{" "}
          la cultura empresarial
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-white/55 text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Conectamos empresas, instituciones y sociedad civil para impulsar
          entornos de trabajo donde las personas pueden ser quienes realmente son.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/eventos"
            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-accent text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
          >
            Próximos eventos
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-white/65 text-[13px] font-medium tracking-[0.08em] uppercase border border-white/20 hover:border-white/50 hover:text-white transition-all"
          >
            Descubre el ecosistema
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-pulse">
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

/* ============== INTRODUCTION ============== */
function Introduction() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <ScrollReveal direction="left">
            <div className="flex items-center gap-4 mb-5">
              <div className="brand-line" />
              <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                El ecosistema
              </span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] tracking-[-0.01em]">
              Un espacio único de{" "}
              <em className="font-normal">valores compartidos</em>
            </h2>
            <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
              AuthentiZity es el punto de encuentro entre los valores de la
              sociedad y la cultura de las empresas. Impulsa una cultura
              empresarial basada en lo que nos une: aquello que nos identifica,
              nos hace únicos y nos posiciona en el mundo.
            </p>
            <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light">
              El potencial de «ser tú» es clave de éxito tanto para las
              empresas como para los profesionales.
            </p>
          </ScrollReveal>

          {/* Pillars grid */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="grid grid-cols-2 gap-[1px] bg-border">
              {[
                { title: "Autenticidad", desc: "Espacios donde las personas y empresas pueden ser fieles a sus valores" },
                { title: "Impacto Social", desc: "Cambio real y medible conectando empresas, instituciones y ONG" },
                { title: "Cultura", desc: "Transformar la cultura corporativa hacia el bienestar y la diversidad" },
                { title: "Reconocimiento", desc: "Ranking Authentic Leaders y Diploma Empresa AuthentiZity" },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-surface p-6 lg:p-8 group hover:bg-surface-alt transition-colors duration-300"
                >
                  <h3 className="font-serif text-lg text-primary font-normal mb-2 group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ============== EVENTS ============== */
function Events({ events }: { events: any[] }) {
  const featured = events.filter((e: any) => e.featured);

  return (
    <section className="py-16 lg:py-24 bg-surface-alt">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                  Agenda
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Próximos eventos
              </h2>
            </div>
            <Link
              href="/eventos"
              className="group flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
            >
              Ver agenda completa
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Events grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((event: any, i: number) => (
            <ScrollReveal key={event.id} delay={i * 0.1}>
              <Link
                href={`/eventos/${event.slug}`}
                className="group block bg-white overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative h-52 lg:h-60 overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-accent/90 backdrop-blur-sm px-3 py-1.5">
                      {event.type}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <span className="text-white/90 text-sm font-light">
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-primary font-normal group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-text-muted text-xs font-light">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== NEWS ============== */
function News({ news }: { news: any[] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                  Actualidad
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Últimas noticias
              </h2>
            </div>
            <Link
              href="/noticias"
              className="group flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-text-body hover:text-primary transition-colors"
            >
              Todas las noticias
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* News grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          {news.map((item: any, i: number) => (
            <ScrollReveal key={item.id} delay={i * 0.1} className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
              <Link
                href={`/noticias/${item.slug}`}
                className="group block h-full"
              >
                <div className={`relative overflow-hidden h-full ${i === 0 ? "min-h-[18rem]" : "min-h-[14rem]"}`}>
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex gap-3 mb-2">
                      {item.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className={`font-serif text-white font-normal leading-tight group-hover:text-secondary-light transition-colors ${i === 0 ? "text-2xl lg:text-3xl" : "text-lg"}`}>
                      {item.title}
                    </h3>
                    {i === 0 && (
                      <p className="mt-2 text-white/50 text-sm leading-relaxed font-light max-w-lg">
                        {item.excerpt}
                      </p>
                    )}
                    <p className="mt-3 text-white/35 text-xs font-light">
                      {formatDate(item.publishedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== STATS ============== */
function Stats() {
  const stats = [
    { number: "40+", label: "Embajadores del ecosistema" },
    { number: "12", label: "Líneas de actuación" },
    { number: "10+", label: "Empresas impulsoras" },
    { number: "2026", label: "Año de lanzamiento" },
  ];

  return (
    <section className="py-14 lg:py-20 bg-surface-warm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className="relative text-center">
                <div className="font-serif text-4xl lg:text-5xl text-primary font-light tracking-[-0.02em]">
                  {stat.number}
                </div>
                <div className="mt-1 text-text-secondary text-xs font-light">
                  {stat.label}
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-2 bottom-2 w-[1px] bg-border" />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============== CTA ============== */
function CTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-primary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl lg:text-5xl text-white font-light leading-[1.1] text-balance">
            ¿Quieres ser parte del{" "}
            <em className="font-normal text-secondary-light">cambio</em>?
          </h2>
          <p className="mt-5 text-white/45 text-base lg:text-lg leading-relaxed font-light max-w-lg mx-auto">
            Únete al ecosistema AuthentiZity y lidera la transformación
            hacia una cultura corporativa auténtica.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:comunidad@autentizity.org"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
            >
              Contactar
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 text-white/55 text-[13px] font-medium tracking-[0.08em] uppercase border border-white/20 hover:border-white/40 hover:text-white transition-all"
            >
              Conocer más
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ============== PAGE ============== */
export default async function HomePage() {
  let events, news;
  try {
    events = await getEvents();
  } catch {
    const { mockEvents } = await import("@/lib/data/mock");
    events = mockEvents;
  }
  try {
    news = await getNews();
  } catch {
    const { mockNews } = await import("@/lib/data/mock");
    news = mockNews;
  }

  return (
    <>
      <Hero />
      <Introduction />
      <Events events={events} />
      <News news={news} />
      <Stats />
      <CTA />
    </>
  );
}
