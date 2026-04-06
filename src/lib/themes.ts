/* ============================================
 * THEME DEFINITIONS — AutentiZity
 * ============================================
 * 3 estilos radicalmente distintos para probar
 * con el cliente. Todos parten de la misma raíz
 * (Pantone verde, impacto social) pero con
 * identidades visuales muy diferentes.
 * ============================================ */

export type ThemeId = "editorial" | "galeria" | "organic-warm";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  /* CSS custom property overrides (injected on <html>) */
  vars: Record<string, string>;
  /* Extra body classes */
  bodyClass: string;
}

export const themes: ThemeDefinition[] = [
  /* ─── 1. EDITORIAL PREMIUM (actual) ─── */
  {
    id: "editorial",
    name: "Editorial",
    description: "Premium, clásico, mucho whitespace. El estilo actual.",
    emoji: "🖋️",
    bodyClass: "theme-editorial",
    vars: {
      "--color-primary": "#013F3F",
      "--color-primary-light": "#074040",
      "--color-primary-dark": "#012d2d",
      "--color-secondary": "#965458",
      "--color-secondary-light": "#D6BEB7",
      "--color-secondary-dark": "#7a4245",
      "--color-accent": "#0F9181",
      "--color-accent-light": "#079585",
      "--color-accent-dark": "#0a7568",
      "--color-dark-teal": "#305358",
      "--color-surface": "#ffffff",
      "--color-surface-alt": "#FAFAF8",
      "--color-surface-warm": "#F5F0EB",
      "--color-surface-dark": "#f1f5f9",
      "--color-border": "#E8E4DF",
      "--color-border-light": "#F0ECE7",
      "--color-text-primary": "#013F3F",
      "--color-text-body": "#305358",
      "--color-text-secondary": "#6B7F84",
      "--color-text-muted": "#9CAAAE",
      "--color-text-inverse": "#ffffff",
      "--font-serif": '"Chulapa", "Georgia", "Times New Roman", serif',
      "--font-sans": '"Poppins", ui-sans-serif, system-ui, sans-serif',
      "--radius-card": "0.25rem",
      "--radius-button": "0.25rem",
      "--radius-pill": "100px",
    },
  },

  /* ─── 2. GALERÍA ───
   * Inspirado en webs de museos y galerías de arte.
   * Fondo crema cálido, tipografía serif en itálica para
   * títulos, tarjetas flotantes con sombras suaves,
   * toques de dorado/bronce como accent.
   * Mismo verde teal de base pero sofisticado de otra forma.
   */
  {
    id: "galeria",
    name: "Galería",
    description: "Museo de arte: crema, serif itálica, flotante y sofisticado.",
    emoji: "🏛️",
    bodyClass: "theme-galeria",
    vars: {
      "--color-primary": "#013F3F",
      "--color-primary-light": "#0A4F4F",
      "--color-primary-dark": "#012d2d",
      "--color-secondary": "#B08968",
      "--color-secondary-light": "#D4B896",
      "--color-secondary-dark": "#8B6914",
      "--color-accent": "#1A7A6D",
      "--color-accent-light": "#238F80",
      "--color-accent-dark": "#126058",
      "--color-dark-teal": "#2A4A4A",
      "--color-surface": "#FAF7F2",
      "--color-surface-alt": "#F3EEE6",
      "--color-surface-warm": "#FFF8F0",
      "--color-surface-dark": "#EDE7DD",
      "--color-border": "#E0D8CC",
      "--color-border-light": "#EDE8DF",
      "--color-text-primary": "#013F3F",
      "--color-text-body": "#3A5050",
      "--color-text-secondary": "#6B7F7F",
      "--color-text-muted": "#9CAAAA",
      "--color-text-inverse": "#FAF7F2",
      "--font-serif": '"Chulapa", "Georgia", "Palatino Linotype", serif',
      "--font-sans": '"Poppins", ui-sans-serif, system-ui, sans-serif',
      "--radius-card": "0.75rem",
      "--radius-button": "0.375rem",
      "--radius-pill": "100px",
    },
  },

  /* ─── 3. ORGANIC WARM ───
   * Colores pastel cálidos, bordes muy redondeados,
   * mucha humanidad. Inspirado en marcas como Notion,
   * Headspace, tendencia "soft colors" 2025.
   * Colores tierra + verde salvia + melocotón.
   */
  {
    id: "organic-warm",
    name: "Orgánico",
    description: "Cálido, suave, redondeado. Colores tierra y pastel.",
    emoji: "🌿",
    bodyClass: "theme-organic-warm",
    vars: {
      "--color-primary": "#2D4A3E",
      "--color-primary-light": "#3D6354",
      "--color-primary-dark": "#1E332B",
      "--color-secondary": "#D4956A",
      "--color-secondary-light": "#E8C4A8",
      "--color-secondary-dark": "#B87A50",
      "--color-accent": "#7BAE7F",
      "--color-accent-light": "#9CC89F",
      "--color-accent-dark": "#5E9362",
      "--color-dark-teal": "#3D5C50",
      "--color-surface": "#FBF8F4",
      "--color-surface-alt": "#F3EDE5",
      "--color-surface-warm": "#FFF5EC",
      "--color-surface-dark": "#EDE6DC",
      "--color-border": "#DDD5CB",
      "--color-border-light": "#EDE8E1",
      "--color-text-primary": "#2D4A3E",
      "--color-text-body": "#4A5D54",
      "--color-text-secondary": "#7A8B82",
      "--color-text-muted": "#A8B3AD",
      "--color-text-inverse": "#FBF8F4",
      "--font-serif": '"Chulapa", "Georgia", "Palatino", serif',
      "--font-sans": '"Poppins", ui-sans-serif, system-ui, sans-serif',
      "--radius-card": "1rem",
      "--radius-button": "0.75rem",
      "--radius-pill": "100px",
    },
  },
];

export function getThemeById(id: ThemeId): ThemeDefinition {
  return themes.find((t) => t.id === id) ?? themes[0];
}
