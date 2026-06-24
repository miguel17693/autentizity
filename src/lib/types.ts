/* ============================================
 * Tipos principales del proyecto
 * ============================================ */

// --- Noticias ---
export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Rich text / Markdown
  coverImage: string;
  coverImageOriginal: string;
  coverImageHero: string;
  coverImageHeroDesktop: string;
  coverImageCard: string;
  tags: string[];
  author: string;
  publishedAt: string; // ISO date string
  updatedAt: string;
  featured: boolean;
  status: "draft" | "published";
  movimientoId: string;
}

// --- Eventos ---
export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // Rich text / Markdown
  coverImage: string;
  coverImageOriginal: string;
  coverImageHero: string;
  coverImageHeroDesktop: string;
  coverImageCard: string;
  startDate: string; // ISO date string
  endDate: string;
  location: string; // Dirección física o "Online"
  type: "presencial" | "virtual" | "híbrido";
  tags: string[];
  organizer: string;
  /**
   * URL de registro externa.
   * - Si type="virtual" → enlace a Zoom
   * - Si type="presencial" o "híbrido" → enlace a Eventbrite
   * El botón "Inscríbete" en el detalle del evento redirige aquí.
   */
  registrationUrl: string;
  featured: boolean;
  status: "draft" | "published" | "cancelled";
  movimientoId: string;
}

// --- Movimientos ---
export interface Movement {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  coverImageOriginal: string;
  coverImageHero: string;
  coverImageHeroDesktop: string;
  coverImageCard: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
}

// --- Actividades ---
export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  coverImageOriginal: string;
  coverImageHero: string;
  coverImageHeroDesktop: string;
  coverImageCard: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  buttonText: string;
  buttonUrl: string;
}

// --- Navegación ---
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// --- Admin ---
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

// --- Ecosistema (dinámico desde admin) ---
export interface EcosistemaSection {
  id: string;
  name: string;         // "Empresas Impulsoras", "Entidades Colaboradoras"...
  slug: string;          // "empresas-impulsoras"
  description: string;   // Texto explicativo debajo del título
  sort_order: number;
  active: boolean;
}

export interface EcosistemaEntity {
  id: string;
  section_id: string;
  name: string;          // "ManpowerGroup", "Trabajando en Positivo"...
  logo_url: string;      // URL (Vercel Blob) o path relativo
  description: string;   // Metatexto opcional
  tags: string[];
  sort_order: number;
  active: boolean;
}
