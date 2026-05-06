import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/*
 * Section visibility configuration.
 * Stores which sections are visible on the public site.
 */

const DATA_DIR = join(process.cwd(), "data");
const CONFIG_FILE = join(DATA_DIR, "sections.json");

export interface SectionConfig {
  id: string;
  label: string;
  page: string;
  visible: boolean;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  // Home
  { id: "home-hero", label: "Hero", page: "Home", visible: true },
  { id: "home-ecosystem", label: "El ecosistema", page: "Home", visible: true },
  { id: "home-events", label: "Próximos eventos", page: "Home", visible: true },
  { id: "home-news", label: "Noticias", page: "Home", visible: true },
  { id: "home-stats", label: "Estadísticas", page: "Home", visible: true },
  { id: "home-cta", label: "CTA final", page: "Home", visible: true },
  // Ecosistema
  { id: "eco-empresas", label: "Empresas", page: "Ecosistema", visible: true },
  { id: "eco-asociaciones", label: "Asociaciones", page: "Ecosistema", visible: true },
  { id: "eco-instituciones", label: "Instituciones", page: "Ecosistema", visible: true },
  { id: "eco-embajadores", label: "Embajadores", page: "Ecosistema", visible: true },
  // Actividad
  { id: "act-eventos", label: "Listado de eventos", page: "Actividad", visible: true },
  { id: "act-movimientos", label: "Movimientos", page: "Actividad", visible: true },
  // Reconocimiento
  { id: "rank-intro", label: "¿Qué es el Ranking?", page: "Reconocimiento", visible: true },
  { id: "rank-categories", label: "Categorías", page: "Reconocimiento", visible: true },
  { id: "rank-process", label: "Proceso de selección", page: "Reconocimiento", visible: true },
  { id: "rank-cta", label: "¿Quieres participar?", page: "Reconocimiento", visible: true },
  { id: "rank-diploma", label: "Diploma AutentiZity", page: "Reconocimiento", visible: true },
  { id: "rank-2026", label: "Ranking 2026 (resultados)", page: "Reconocimiento", visible: false },
  // Únete
  { id: "unete-empresas", label: "Empresas", page: "Únete", visible: true },
  { id: "unete-organizaciones", label: "Organizaciones", page: "Únete", visible: true },
  { id: "unete-profesionales", label: "Profesionales", page: "Únete", visible: true },
];

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getSections(): SectionConfig[] {
  try {
    ensureDir();
    if (!existsSync(CONFIG_FILE)) {
      writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_SECTIONS, null, 2));
    }
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export function saveSections(sections: SectionConfig[]) {
  ensureDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(sections, null, 2));
}

export function toggleSection(id: string, visible: boolean): SectionConfig | null {
  const sections = getSections();
  const idx = sections.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  sections[idx].visible = visible;
  saveSections(sections);
  return sections[idx];
}
