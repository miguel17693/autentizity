import { clsx, type ClassValue } from "clsx";
import sanitizeHtml from "sanitize-html";

/**
 * Combina clases de Tailwind de forma condicional
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatea una fecha en español
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Formatea fecha y hora en español
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Genera un slug a partir de un string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Trunca texto a un número máximo de caracteres
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "strong", "em", "u", "s", "del",
    "a", "img", "iframe",
    "figure", "figcaption",
    "div", "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
    "*": ["class", "style"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/],
    },
  },
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
};

/**
 * Convierte contenido legacy (texto plano con \n) o HTML a HTML sanitizado.
 * Para usar con dangerouslySetInnerHTML en páginas de detalle.
 */
export function renderRichText(raw: string): string {
  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return raw
      .split("\n")
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}

/**
 * Elimina tags HTML y devuelve texto plano. Usar en tarjetas/listings.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
