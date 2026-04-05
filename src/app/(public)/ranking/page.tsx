import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

/* ============================================
 * RANKING — Authentic Leaders
 * Premium editorial page
 * ============================================ */

const categories = [
  {
    title: "Diversidad e Inclusión",
    description:
      "Empresas que fomentan la diversidad en todas sus formas y crean entornos verdaderamente inclusivos.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Bienestar Laboral",
    description:
      "Organizaciones que priorizan la salud mental, la conciliación y el bienestar integral de sus equipos.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Liderazgo Auténtico",
    description:
      "Líderes que inspiran desde la transparencia, la vulnerabilidad y la coherencia entre valores y acción.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Impacto Social",
    description:
      "Empresas con propósito que generan valor más allá del negocio, contribuyendo activamente a la sociedad.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

const timeline = [
  { step: "01", title: "Convocatoria", desc: "Apertura de candidaturas y nominaciones por parte de empresas y profesionales." },
  { step: "02", title: "Evaluación", desc: "Un comité de expertos analiza cada candidatura en base a criterios objetivos de autenticidad." },
  { step: "03", title: "Selección", desc: "Los 100 líderes más auténticos de España son seleccionados y notificados." },
  { step: "04", title: "Reconocimiento", desc: "Ceremonia de entrega en la Gala AutentiZity junto al Diploma Empresa AutentiZity." },
];

export default function RankingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Reconocimiento
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">
            Ranking Authentic Leaders
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-2xl mx-auto">
            Reconocemos a 100 líderes en España que inspiran por promover espacios
            de trabajo donde las personas pueden ser auténticas.
          </p>
          <p className="mt-2 text-secondary-light text-sm font-light">
            En colaboración con ManpowerGroup
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
                ¿Qué es el Ranking?
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                El <strong className="font-medium">Ranking Authentic Leaders</strong> es una
                iniciativa de AutentiZity en colaboración con ManpowerGroup que identifica y
                reconoce a los 100 profesionales más auténticos de España. Líderes que, desde
                su posición, impulsan culturas corporativas donde cada persona puede ser
                quien realmente es.
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                Además, las empresas cuyos líderes sean seleccionados podrán optar al{" "}
                <strong className="font-medium">Diploma Empresa AutentiZity</strong>, un
                reconocimiento a su compromiso con la autenticidad corporativa.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4 justify-center">
              <div className="brand-line" />
              <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                Ejes de evaluación
              </span>
              <div className="brand-line" />
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] text-center uppercase">
              Categorías
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.title} delay={i * 0.1}>
                <div className="bg-white p-8 h-full group hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500">
                  <div className="text-accent group-hover:text-primary transition-colors mb-6">
                    {cat.icon}
                  </div>
                  <h3 className="font-serif text-lg text-primary font-normal mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Process */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
                Proceso de Selección
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.12}>
                <div className="relative">
                  <span className="font-serif text-6xl text-accent/15 font-light leading-none">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl text-primary font-normal mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                  {i < timeline.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 w-8 h-[1px] bg-border" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-surface-warm">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
              ¿Quieres participar?
            </h2>
            <p className="mt-5 text-text-secondary text-base leading-relaxed font-light">
              Si conoces un líder auténtico o tu empresa quiere ser parte de este
              reconocimiento, contáctanos para conocer los próximos pasos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:comunidad@autentizity.org"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-accent-light transition-all"
              >
                Nominar un líder
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 text-text-body text-[13px] font-medium tracking-[0.08em] uppercase border border-border hover:border-primary hover:text-primary transition-all"
              >
                Más sobre AutentiZity
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
