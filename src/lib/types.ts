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
  tags: string[];
  author: string;
  publishedAt: string; // ISO date string
  updatedAt: string;
  featured: boolean;
  status: "draft" | "published";
}

// --- Eventos ---
export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // Rich text / Markdown
  coverImage: string;
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
