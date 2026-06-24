import { clsx, type ClassValue } from "clsx";

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
  return raw;
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
