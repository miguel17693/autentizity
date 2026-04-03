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
  registrationUrl?: string;
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
