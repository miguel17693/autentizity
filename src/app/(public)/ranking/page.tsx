import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";

export const dynamic = "force-dynamic";

/* ============================================
 * RANKING — Authentic Leaders
 * Premium editorial page
 * ============================================ */

const categories = [
  {
    title: "Bienestar Integral",
    description:
      "Impulsan iniciativas que mejoran el bienestar físico, emocional y motivacional de las personas, creando entornos donde el equipo puede rendir mejor y sentirse mejor",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Cultura de Salud Mental",
    description:
      "Promueven activamente el cuidado de la salud mental en la organización, generando espacios seguros, previniendo el burnout y normalizando el bienestar psicológico en el día a día",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: "Diversidad, Equidad e Inclusión",
    description:
      "Desarrollan culturas verdaderamente inclusivas donde la diversidad se valora, se integra y se traduce en oportunidades reales para todas las personas",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Liderazgo Auténtico",
    description:
      "Lideran desde la coherencia, la transparencia y el propósito, generando confianza y construyendo culturas que impactan positivamente tanto dentro como fuera de la empresa",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

const timeline = [
  { step: "01", title: "Convocatoria", desc: "La convocatoria 2026 ya está abierta. Es el momento de dar visibilidad a tu liderazgo" },
  { step: "02", title: "Evaluación", desc: "Un comité independiente de expertos del ámbito corporativo y la sociedad civil evalúa cada candidatura con criterios rigurosos en las cuatro categorías" },
  { step: "03", title: "Selección", desc: "Se seleccionan los 100 líderes más auténticos de España, que serán reconocidos por su impacto y coherencia" },
  { step: "04", title: "Presentación", desc: "Los líderes seleccionados se anuncian en la Gala AutentiZity, en el marco del evento 'Liderazgo Auténtico & Ranking líderes de la autenticidad' junto a ManpowerGroup" },
];

export default function RankingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
              Reconocimiento
            </span>
            <div className="w-8 h-[1px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">
            Ranking líderes de la autenticidad
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-2xl mx-auto">
            Los líderes que están redefiniendo la cultura empresarial en España
          </p>
          <p className="mt-2 text-rose-light text-sm font-light">
            Organiza AutentiZity &amp; ManpowerGroup
          </p>
        </div>
      </section>

      {/* Introduction */}
      <Section id="rank-intro">
      <section id="ranking" className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                ¿Qué es el Ranking?
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                El <strong className="font-medium">Ranking Líderes de la Autenticidad</strong> es una
                iniciativa de AutentiZity y ManpowerGroup que reconoce a los 100 profesionales que más contribuyen a impulsar la autenticidad en España. Personas que, desde organizaciones, entidades sociales o proyectos propios, promueven entornos donde cada individuo puede desarrollar su potencial sin renunciar a quién es
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                Su impacto se articula en cuatro ámbitos clave: Bienestar Integral, Salud Mental, Diversidad, Equidad e Inclusión (DEI) y Liderazgo Auténtico
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
      </Section>

      {/* Categories */}
      <Section id="rank-categories">
      <section className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4 justify-center">
              <div className="brand-line" />
              <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
                Ejes de evaluación
              </span>
              <div className="brand-line" />
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] text-center">
              Categorías
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-10 sm:mt-12">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.title} delay={i * 0.1}>
                <div className="bg-white p-8 h-full group hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500">
                  <div className="text-rose group-hover:text-rose-dark transition-colors mb-6">
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
      </Section>

      {/* Timeline / Process */}
      <Section id="rank-process">
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Proceso de Selección
              </h2>
              <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                Un reconocimiento a las personas que, día a día, estáis transformando la cultura empresarial en España
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.12}>
                <div className="relative">
                  <span className="font-serif text-6xl text-gold/20 font-light leading-none">
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
      </Section>

      {/* CTA */}
      <Section id="rank-cta">
      <section className="py-12 sm:py-16 lg:py-24 bg-surface-warm">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
              ¿Quieres participar?
            </h2>
            <p className="mt-5 text-text-secondary text-base leading-relaxed font-light">
              ¿Quieres formar parte del ranking líderes de la autenticidad de AutentiZity
              y ManpowerGroup o nominar a alguien de tu organización?
            </p>
            <p className="mt-2 text-text-secondary text-sm leading-relaxed font-light">
              Presenta tu candidatura o comparte este enlace con esa persona que inspira a otros a ser auténticos y que está impulsando un cambio positivo en su organización o en la sociedad
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:comunidad@autentizity.org"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-rose text-white rounded-full text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-rose-light transition-all"
              >
                Participa
              </a>
              <a
                href="mailto:comunidad@autentizity.org?subject=Nominar%20l%C3%ADder"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-text-body text-[13px] font-medium tracking-[0.08em] uppercase border border-border hover:border-primary hover:text-primary transition-all"
              >
                Comparte
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>

      {/* ============== DIPLOMA AUTENTIZITY ============== */}
      <Section id="rank-diploma">
      <section id="diploma" className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center gap-4 mb-4 justify-center">
                <div className="brand-line" />
                <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
                  Reconocimiento
                </span>
                <div className="brand-line" />
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Diploma AutentiZity
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                En colaboración con instituciones públicas, reconocemos a las
                organizaciones que están redefiniendo la forma de hacer empresa
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                El Diploma AutentiZity distingue a aquellas compañías que impulsan
                culturas auténticas, coherentes y con impacto real en la sociedad
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                Un reconocimiento respaldado por acciones integradas en el Estado
                de Información No Financiera (EINF), el Plan de Igualdad, el Plan
                de Inclusión de Personas con Discapacidad y el Plan LGTBI+
              </p>
              <p className="mt-6 text-text-body text-base font-medium">
                Cuando mejoramos la cultura corporativa de una empresa, también estamos impactando en positivo en la sociedad
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>
    </>
  );
}
