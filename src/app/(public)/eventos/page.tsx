import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { formatDate } from "@/lib/utils";
import Section from "@/components/ui/Section";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getEventos(): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/eventos`, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    const { mockEvents } = await import("@/lib/data/mock");
    return mockEvents;
  }
}

export default async function EventosPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";
  const isPreview = isAdmin && cookieStore.get("preview_mode")?.value === "on";
  const eventos = await getEventos();
  const items = isPreview ? eventos : eventos.filter((e) => e.status === "published");

  return (
    <>
      {/* Hero banner */}
      <section className="bg-primary py-14 sm:py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Agenda
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-white font-light tracking-[-0.02em] uppercase">
            Actividad
          </h1>
          <p className="mt-4 text-white/45 text-base lg:text-lg font-light max-w-xl mx-auto">
            Descubre los próximos encuentros, foros y experiencias del ecosistema AutentiZity
          </p>
        </div>
      </section>

      <Section id="act-eventos">
      {/* Listing */}
      <section id="eventos" className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          {items.length === 0 ? (
            <p className="text-text-secondary text-center py-20 font-light">
              No hay eventos publicados todavía
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 -mx-5 sm:mx-0">
              {items.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className={`group block bg-white border overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 ${event.status === "draft" ? "border-secondary border-dashed" : "border-border-light"}`}
                >
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    {event.status === "draft" && (
                      <div className="absolute top-4 right-4 z-10 bg-secondary text-white text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1">
                        Borrador
                      </div>
                    )}
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-accent/90 backdrop-blur-sm px-3 py-1.5">
                        {event.type}
                      </span>
                      {event.featured && (
                        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white bg-secondary/80 backdrop-blur-sm px-3 py-1.5">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 text-text-muted text-xs font-light mb-3">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(event.startDate)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl lg:text-2xl text-primary font-normal leading-tight group-hover:text-accent transition-colors">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-5 flex items-center gap-3 flex-wrap">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted border border-border px-2.5 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      </Section>

      <Section id="act-movimientos">
      {/* ============== MOVIMIENTOS ============== */}
      <section id="movimientos" className="py-12 sm:py-16 lg:py-24 bg-surface-alt">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="brand-line" />
            <span className="text-accent text-[12px] font-medium tracking-[0.15em] uppercase">
              Movimientos
            </span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl text-primary font-light leading-[1.15] uppercase">
            Movimientos
          </h2>
          <p className="mt-4 text-text-body text-base font-light max-w-3xl">
            Líneas de acción del ecosistema AutentiZity
          </p>

          {/* NOTA PARA EL CLIENTE: Miguel, necesitamos el copy/descripción de cada movimiento. Por ahora están solo con el título. */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "AuthentiZity", desc: "Estamos viviendo una de las grandes revoluciones de nuestro tiempo: una revolución tecnológica impulsada por la inteligencia artificial. Pero surgen preguntas clave: ¿cómo pueden las aplicaciones y la IA convertirse en una herramienta para potenciar nuestra dimensión más humana? y ¿Cómo conseguir potenciar el uso de la IA en el propio personal? La generación de contenidos mediante IA ha acelerado la producción de materiales de trabajo. Sin embargo, en muchos casos estos se perciben como productos excesivamente \"tecnológicos\" carentes del componente humano, lo que puede generar distancia y pérdida de interés. A este escenario se suman importantes retos éticos y morales. De la mano de expertos en inteligencia artificial, abordaremos estos desafíos y exploraremos cómo afrontarlos de forma responsable, integrando la tecnología al servicio de las personas y de una cultura organizativa más consciente." },
              { title: "Nuestro Legado a las Siguientes Generaciones", desc: "AutentiZity, en colaboración con It Gets Better España, impulsa este movimiento corporativo centrado en uno de los retos sociales más importantes de nuestro tiempo: frenar el bullying. Y queremos contar contigo partiendo de una pregunta sencilla, pero poderosa: ¿Qué legado queremos dejar a las siguientes generaciones? El objetivo de esta iniciativa es sensibilizar sobre el bullying (acoso escolar) desde los entornos laborales, corporativos y universitarios. Muchas situaciones de acoso nacen de prejuicios, sesgos y comportamientos normalizados entre las personas adultas. Si no existe una verdadera concienciación, estos patrones terminan trasladándose a las nuevas generaciones. Por ello, te invitamos a participar en el concurso creativo y campaña de concienciación: ¡Esta historia MEJORA contigo! Un concurso de relato corto, fotografía o vídeo que invita a reflexionar y actuar para eliminar prejuicios y discriminaciones. Además, podrás ganar increíbles premios, como un vuelo para dos personas a Canadá, cortesía de Air Canada, o selecciones exclusivas de artículos de LVMH. Sumarte a #EstaHistoriaMejoraContigo es contribuir a mejorar tu entorno laboral y generar un impacto positivo más allá de la organización, ayudando a construir una sociedad más respetuosa, inclusiva y libre de acoso." },
              { title: "La Diversidad También es Autenticidad", desc: "Ponemos en valor la interseccionalidad de las diversidades, entendida como el encuentro y la interacción de diferentes realidades y experiencias, propias y compartidas, que nos ayudan a comprender mejor las vivencias de las personas con las que trabajamos, al tiempo que favorecen un mayor conocimiento de nosotros mismos y de nuestro entorno. A través de esta campaña se trabajarán las principales dimensiones de la diversidad: interseccional, intergeneracional, neurodiversidad, orientación sexual e identidad de género, género, diversidad cultural y étnica, discapacidad y diversidad cognitiva." },
              { title: "Autenticos Héroes Sin Capa", desc: "Nos centramos en la prevención del suicidio, abordando esta realidad desde la información, la sensibilización y la responsabilidad compartida. Existe la creencia de que el suicidio es un tema del que no se debe hablar. Sin embargo, los estudios demuestran que el enfoque adecuado es precisamente el contrario: darle visibilidad, aprender a identificar situaciones de riesgo y saber cómo actuar en momentos en los que es fundamental ofrecer apoyo a un compañero o compañera de trabajo. El objetivo es proporcionar herramientas claras y procedimientos adecuados que permitan acompañar, orientar y actuar de manera responsable y efectiva." },
              { title: "De Philadelphia a Madrid", desc: "Desde la película Philadelphia, esta historia ha cambiado mucho! Queremos dar la vuelta a los prejuicios de una forma cercana, participativa y entretenida. Para ello, contaremos con testimonios en primera persona de personas VIHsibles y profesionales expertos que ayudarán a desmontar mitos y a acercar la realidad actual del VIH a la sociedad. Porque hoy sabemos algo fundamental: Indetectable = Intransmisible (I=I). Una persona que vive con VIH, al estar tratada, no puede transmitir el virus. El movimiento corporativo \"De Philadelphia a Madrid\" se presentará en un evento en el Ilustre Colegio de la Abogacía de Madrid. La comparación entre Philadelphia y Madrid nos invita a imaginar una nueva historia. Porque esta vez, el final de la película podemos escribirlo entre todos." },
              { title: "¡Sé tú! Liderazgo Auténtico", desc: "¿Es posible ser uno mismo en el trabajo? De la mano de líderes empresariales, reflexionaremos sobre cómo construir culturas corporativas que permitan a las personas desarrollar todo su potencial desde la autenticidad, encontrando el equilibrio entre la identidad individual y los valores compartidos de la organización. Exploraremos cómo liderar poniendo a las personas en el centro, entendiendo que los entornos donde las personas pueden mostrarse tal y como son generan mayor compromiso, bienestar, innovación y mejores resultados para el negocio. Porque humanizar los lugares de trabajo no es solo una cuestión de cultura; es también una apuesta estratégica para construir organizaciones más sostenibles, diversas y exitosas." },
              { title: "Espacios Seguros para el Error", desc: "Aceptar que equivocarse forma parte del proceso crea entornos más honestos, seguros y libres de máscaras. ¿Te atreverías a crear un Currículum de Fracasos? Exploraremos las claves para impulsar espacios de trabajo en los que sea posible compartir ideas sin miedo, fomentando el pensamiento creativo y la participación." },
              { title: "Keep the Calm & Less Burnout", desc: "Se estima que afecta a 7 de cada 10 personas trabajadoras, y que un 55% de los profesionales declara sentirse en un estado de agotamiento total. Exploraremos buenas prácticas en las organizaciones y compartiremos herramientas concretas para prevenir el burnout y promover entornos de trabajo más saludables y sostenibles." },
              { title: "Mujeres Increíbles y Aliados", desc: "Desde el ecosistema AutentiZity impulsamos acciones que conectan el talento de mujeres que destacan por su autenticidad, su capacidad de liderazgo. Ofrecemos herramientas y espacios de reflexión para hombres que entienden que las iniciativas de igualdad de género representan una oportunidad para impulsar un liderazgo más inclusivo. AutentiZity identifica y visibiliza también a hombres que destacan como \"Aliados\"." },
            ].map((mov) => (
              <div
                key={mov.title}
                className="bg-white border border-border-light p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif text-lg text-primary font-normal">
                  {mov.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed font-light line-clamp-5">
                  {mov.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Section>
    </>
  );
}
