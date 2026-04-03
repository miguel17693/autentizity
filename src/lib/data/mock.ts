import type { News, Event } from "@/lib/types";

/* ============================================
 * Mock data para desarrollo
 * Se reemplazará por datos reales del CMS/backend
 * Basado en contenido real del PPTX de AuthentiZity
 * ============================================ */

export const mockEvents: Event[] = [
  {
    id: "1",
    slug: "nuestro-legado-como-generacion",
    title: "Nuestro Legado como Generación",
    description:
      "Sensibilización contra el bullying y acoso escolar. Un evento para reflexionar sobre el impacto que dejamos como generación.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80",
    startDate: "2026-05-15T10:00:00",
    endDate: "2026-05-15T13:00:00",
    location: "Madrid",
    type: "presencial",
    tags: ["Bullying", "Sensibilización", "Educación"],
    organizer: "AuthentiZity",
    registrationUrl: "https://www.eventbrite.es/e/nuestro-legado",
    featured: true,
    status: "published",
  },
  {
    id: "2",
    slug: "puesta-de-largo-authentizity",
    title: "Puesta de Largo AuthentiZity",
    description:
      "Presentación oficial de la primera Aceleradora de Impacto Social en España. Conoce la Ruta AuthentiZity 2026–2027.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80",
    startDate: "2026-06-20T18:00:00",
    endDate: "2026-06-20T21:00:00",
    location: "Serrería Belga, Madrid",
    type: "presencial",
    tags: ["Lanzamiento", "Networking", "Impacto Social"],
    organizer: "AuthentiZity",
    registrationUrl: "https://www.eventbrite.es/e/puesta-de-largo-authentizity",
    featured: true,
    status: "published",
  },
  {
    id: "3",
    slug: "foro-iauthenticity",
    title: "Foro IAuthenticity: IA desde el Humanismo",
    description:
      "Uso de la Inteligencia Artificial desde los valores del humanismo. Para profesionales de Innovación, Cultura, Ética y Tech.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=640&q=80",
    startDate: "2026-09-25T09:30:00",
    endDate: "2026-09-25T14:00:00",
    location: "Online + Madrid",
    type: "híbrido",
    tags: ["IA", "Ética", "Humanismo", "Tech"],
    organizer: "AuthentiZity",
    registrationUrl: "https://zoom.us/j/foro-iauthenticity",
    featured: false,
    status: "published",
  },
  {
    id: "4",
    slug: "esta-historia-va-contigo-vih",
    title: "Esta Historia va Contigo — 45 años del VIH",
    description:
      "De Philadelphia a Madrid. Campaña de sensibilización y no discriminación hacia personas con VIH en los lugares de trabajo.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=640&q=80",
    startDate: "2026-11-18T10:00:00",
    endDate: "2026-11-18T14:00:00",
    location: "Madrid",
    type: "presencial",
    tags: ["VIH", "No discriminación", "Salud"],
    organizer: "AuthentiZity",
    registrationUrl: "https://www.eventbrite.es/e/esta-historia-va-contigo",
    featured: false,
    status: "published",
  },
];

export const mockNews: News[] = [
  {
    id: "1",
    slug: "lanzamiento-ruta-authentizity-2026",
    title: "Se presenta la Ruta AuthentiZity 2026–2027",
    excerpt:
      "La primera Aceleradora de Impacto Social en España anuncia su programa de actividades con más de 12 líneas de actuación orientadas a transformar la cultura empresarial.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&q=80",
    tags: ["AuthentiZity", "Impacto Social", "Lanzamiento"],
    author: "AuthentiZity",
    publishedAt: "2026-04-01T10:00:00",
    updatedAt: "2026-04-01T10:00:00",
    featured: true,
    status: "published",
  },
  {
    id: "2",
    slug: "ranking-authentic-leaders-manpowergroup",
    title: "Ranking Authentic Leaders con ManpowerGroup",
    excerpt:
      "Reconocemos a 100 líderes en España que inspiran por promover espacios de trabajo donde las personas pueden ser auténticas.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=640&q=80",
    tags: ["Ranking", "Liderazgo", "ManpowerGroup"],
    author: "AuthentiZity",
    publishedAt: "2026-03-28T09:00:00",
    updatedAt: "2026-03-28T09:00:00",
    featured: true,
    status: "published",
  },
  {
    id: "3",
    slug: "academia-pensamiento-creativo-soft-skills",
    title: "Nueva Academia de Pensamiento Creativo y Soft Skills",
    excerpt:
      "Abrimos las puertas de nuestra academia para fomentar el pensamiento creativo y las habilidades blandas en el entorno corporativo.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80",
    tags: ["Formación", "Soft Skills", "Creatividad"],
    author: "AuthentiZity",
    publishedAt: "2026-03-20T12:00:00",
    updatedAt: "2026-03-20T12:00:00",
    featured: false,
    status: "published",
  },
];
