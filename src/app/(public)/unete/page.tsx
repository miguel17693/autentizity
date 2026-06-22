import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";

export const dynamic = "force-dynamic";

/* ============================================
 * ÚNETE — Empresas, Organizaciones, Profesionales
 * ============================================ */

export default function UnetePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
              Forma parte
            </span>
            <div className="w-8 h-[1px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em]">
            Únete
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Forma parte del ecosistema AutentiZity
          </p>
        </div>
      </section>

      {/* Empresas */}
      <Section id="unete-empresas">
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
                  Empresas
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Empresas que quieren liderar el cambio
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                Las organizaciones tienen hoy una oportunidad única: demostrar que el éxito empresarial y el impacto positivo pueden avanzar juntos. Al adherirse a AutentiZity, las empresas pasan a formar parte de un ecosistema que impulsa, visibiliza y reconoce las buenas prácticas en diversidad, igualdad, inclusión, bienestar, sostenibilidad y liderazgo responsable.
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                Una comunidad donde compartir iniciativas, generar alianzas estratégicas y dar visibilidad al compromiso real que impulsa una nueva forma de hacer empresa. Porque la cultura corporativa no solo transforma organizaciones. También transforma la sociedad.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>

      {/* Organizaciones */}
      <Section id="unete-organizaciones">
      <section className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
                  Organizaciones
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Organizaciones que generan impacto
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                AutentiZity conecta a organizaciones que trabajan cada día para construir una sociedad más inclusiva, diversa y sostenible. Queremos crear puentes entre el ámbito social, institucional y empresarial para que las buenas prácticas tengan mayor alcance y capacidad de transformación.
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                Al adherirte, podrás colaborar con empresas comprometidas, participar en proyectos conjuntos y dar visibilidad, así convertir causas en movimientos corporativos. Fundaciones, asociaciones, entidades sociales e instituciones tienen aquí su espacio.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>

      {/* Profesionales / Embajadores */}
      <Section id="unete-profesionales">
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-gold text-[12px] font-medium tracking-[0.15em] uppercase">
                  Embajadores
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15]">
                Embajadores que inspiran
              </h2>
              <p className="mt-6 text-text-body text-base lg:text-lg leading-relaxed font-light">
                El programa de embajadores de AutentiZity reúne a profesionales que impulsan transformación en: Bienestar Integral, Salud Mental, Diversidad, Equidad e Inclusión (DEI) y Liderazgo Auténtico. A través de movimientos corporativos enmarcados en una estrategia de un año natural.
              </p>
              <p className="mt-4 text-text-secondary text-sm leading-relaxed font-light">
                En este 2026 están en activo los movimientos: IAuthentiZity, Nuestro Legado a las Siguientes Generaciones, La Diversidad También es Autenticidad, Autenticos Héroes Sin Capa, Sé tú! Liderazgo Auténtico, De Philadelphia a Madrid, Espacios Seguros para el Error, Keep the Calm & Less Burnout, Mujeres Increíbles y Aliados.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>
    </>
  );
}
