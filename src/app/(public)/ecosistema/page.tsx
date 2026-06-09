import ScrollReveal from "@/components/ui/ScrollReveal";
import Section from "@/components/ui/Section";
import Image from "next/image";

/* ============================================
 * ECOSISTEMA — Empresas, Entidades Colaboradoras, Instituciones, Embajadores
 * ============================================ */

const empresasReales = [
  { id: "manpower", name: "ManpowerGroup", logo: "/logos/manpower.png" },
  { id: "corteingles", name: "El Corte Inglés", logo: "/logos/corteingles.png" },
  { id: "msd", name: "MSD", logo: "/logos/msd.png" },
  { id: "helion", name: "Helion", logo: "/logos/helion.png" },
];

const empresas = Array.from({ length: 4 }, (_, i) => ({ id: `emp${i + 1}`, name: `Empresa ${i + 1}` }));
const entidades = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, name: `Entidad ${i + 1}` }));
const instituciones = Array.from({ length: 4 }, (_, i) => ({ id: i + 1, name: `Institución ${i + 1}` }));
const embajadores = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Embajador/a ${i + 1}` }));

function LogoPlaceholder({ name, logo }: { name?: string; logo?: string }) {
  const hasLogo = logo != null;

  return (
    <div className="flex items-center justify-center h-20 bg-white border border-border-light px-6">
      {hasLogo ? (
        <Image src={logo} alt={name ?? ""} width={120} height={48} className="object-contain max-h-12 max-w-[120px]" />
      ) : (
        <span className="text-text-muted text-xs font-medium tracking-[0.1em] uppercase">
          {name ?? "LOGO"}
        </span>
      )}
    </div>
  );
}

function AvatarPlaceholder({ name }: { name: string }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-surface-alt border border-border-light flex items-center justify-center mb-3">
        <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <p className="text-text-secondary text-sm font-light">{name}</p>
    </div>
  );
}

export default function EcosistemaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Ecosistema</span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">Ecosistema</h1>
        </div>
      </section>

      <Section id="eco-empresas">
        <section id="empresas" className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4"><div className="brand-line" /><span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Empresas</span></div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase max-w-3xl">Empresas</h2>
              <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">Empresas que no se conforman con la cultura que tienen, sino que construyen la que quieren. Organizaciones que entienden que el cambio real empieza dentro… y se proyecta fuera</p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {empresasReales.map((e) => <LogoPlaceholder key={e.id} name={e.name} logo={e.logo} />)}
              {empresas.map((e) => <LogoPlaceholder key={e.id} name={e.name} />)}
            </div>
          </div>
        </section>
      </Section>

      <Section id="eco-entidades">
        <section id="entidades" className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4"><div className="brand-line" /><span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Entidades Colaboradoras</span></div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase max-w-3xl">Entidades Colaboradoras</h2>
              <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos. Porque somos personas en todos los ámbitos de nuestra vida, también en nuestros lugares de trabajo</p>
              <p className="mt-2 text-text-secondary text-sm leading-relaxed font-light max-w-3xl">Sus mensajes nos ayudan a potenciar el talento, evitar situaciones de discriminación, mejorar nuestra salud mental, bienestar, y por supuesto que los lugares de trabajo sean un reflejo de la sociedad</p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {entidades.map((a) => <LogoPlaceholder key={a.id} />)}
            </div>
          </div>
        </section>
      </Section>

      <Section id="eco-instituciones">
        <section id="instituciones" className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4"><div className="brand-line" /><span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Instituciones, Cámaras de Comercio y Asociaciones Corporativas</span></div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase max-w-3xl">Instituciones, Cámaras de Comercio y Asociaciones Corporativas</h2>
              <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">Cuando lo público y lo privado dejan de ir en paralelo y empiezan a avanzar juntos, el impacto se multiplica. Aquí es donde nacen los cambios que transforman empresas, ciudades y formas de vivir el trabajo</p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {instituciones.map((i) => <LogoPlaceholder key={i.id} />)}
            </div>
          </div>
        </section>
      </Section>

      <Section id="eco-embajadores">
        <section id="embajadores" className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4"><div className="brand-line" /><span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">Embajadores</span></div>
              <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase max-w-3xl">Embajadores</h2>
              <p className="mt-4 text-text-body text-base lg:text-lg leading-relaxed font-light max-w-3xl">Voces que inspiran desde su propia identidad y experiencia, llevando una forma más auténtica de entender el trabajo a las organizaciones. Profesionales que, desde sus ámbitos, impulsan el cambio y generan impacto</p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {embajadores.map((e) => <AvatarPlaceholder key={e.id} name={e.name} />)}
            </div>
          </div>
        </section>
      </Section>
    </>
  );
}
