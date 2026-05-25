import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";

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
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Forma parte
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">
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
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                  Empresas
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
                Empresas
              </h2>
              <p className="mt-4 text-text-muted text-sm font-light border border-dashed border-border p-4">
                Estamos viviendo una de las grandes revoluciones de nuestro tiempo: una revolución tecnológica impulsada por la inteligencia artificial. Pero surgen preguntas clave:
 ¿cómo pueden las aplicaciones y la IA convertirse en una herramienta para potenciar nuestra dimensión más humana? y ¿Cómo conseguir potenciar el uso de la IA en el propio personal?
  
La generación de contenidos mediante IA ha acelerado la producción de materiales de trabajo. Sin embargo, en muchos casos estos se perciben como productos excesivamente “tecnológicos”, carentes del componente humano, lo que puede generar distancia y pérdida de interés.

A este escenario se suman importantes retos éticos y morales. De la mano de expertos en inteligencia artificial, abordaremos estos desafíos y exploraremos cómo afrontarlos de forma responsable, integrando la tecnología al servicio de las personas y de una cultura organizativa más consciente.
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
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                  Organizaciones
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
                Organizaciones
              </h2>
              <p className="mt-4 text-text-muted text-sm font-light border border-dashed border-border p-4">
                Estamos viviendo una de las grandes revoluciones de nuestro tiempo: una revolución tecnológica impulsada por la inteligencia artificial. Pero surgen preguntas clave:
 ¿cómo pueden las aplicaciones y la IA convertirse en una herramienta para potenciar nuestra dimensión más humana? y ¿Cómo conseguir potenciar el uso de la IA en el propio personal?
  
La generación de contenidos mediante IA ha acelerado la producción de materiales de trabajo. Sin embargo, en muchos casos estos se perciben como productos excesivamente “tecnológicos”, carentes del componente humano, lo que puede generar distancia y pérdida de interés.

A este escenario se suman importantes retos éticos y morales. De la mano de expertos en inteligencia artificial, abordaremos estos desafíos y exploraremos cómo afrontarlos de forma responsable, integrando la tecnología al servicio de las personas y de una cultura organizativa más consciente.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>

      {/* Profesionales */}
      <Section id="unete-profesionales">
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="brand-line" />
                <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
                  Profesionales
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
                Profesionales
              </h2>
              <p className="mt-4 text-text-muted text-sm font-light border border-dashed border-border p-4">
                Estamos viviendo una de las grandes revoluciones de nuestro tiempo: una revolución tecnológica impulsada por la inteligencia artificial. Pero surgen preguntas clave:
 ¿cómo pueden las aplicaciones y la IA convertirse en una herramienta para potenciar nuestra dimensión más humana? y ¿Cómo conseguir potenciar el uso de la IA en el propio personal?
  
La generación de contenidos mediante IA ha acelerado la producción de materiales de trabajo. Sin embargo, en muchos casos estos se perciben como productos excesivamente “tecnológicos”, carentes del componente humano, lo que puede generar distancia y pérdida de interés.

A este escenario se suman importantes retos éticos y morales. De la mano de expertos en inteligencia artificial, abordaremos estos desafíos y exploraremos cómo afrontarlos de forma responsable, integrando la tecnología al servicio de las personas y de una cultura organizativa más consciente.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </Section>
    </>
  );
}
