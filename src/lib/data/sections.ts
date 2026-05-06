import { getSQL } from "@/lib/data/db";

/*
 * Section visibility configuration backed by Neon Postgres.
 * Falls back to defaults when DATABASE_URL is not set.
 */

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

function hasDB(): boolean {
  return !!process.env.DATABASE_URL;
}

export async function getSections(): Promise<SectionConfig[]> {
  if (!hasDB()) return DEFAULT_SECTIONS;
  try {
    const sql = getSQL();
    const rows = await sql`SELECT * FROM sections ORDER BY page, id`;
    if (rows.length === 0) {
      // Seed defaults
      await seedSections();
      return DEFAULT_SECTIONS;
    }
    return rows.map((r) => ({
      id: r.id as string,
      label: r.label as string,
      page: r.page as string,
      visible: r.visible as boolean,
    }));
  } catch (e) {
    console.error("getSections error:", e);
    return DEFAULT_SECTIONS;
  }
}

export async function saveSections(sections: SectionConfig[]): Promise<void> {
  if (!hasDB()) return;
  const sql = getSQL();
  // Upsert all sections
  for (const s of sections) {
    await sql`
      INSERT INTO sections (id, label, page, visible)
      VALUES (${s.id}, ${s.label}, ${s.page}, ${s.visible})
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        page = EXCLUDED.page,
        visible = EXCLUDED.visible
    `;
  }
}

export async function toggleSection(id: string, visible: boolean): Promise<SectionConfig | null> {
  if (!hasDB()) return null;
  const sql = getSQL();
  const rows = await sql`
    UPDATE sections SET visible = ${visible} WHERE id = ${id} RETURNING *
  `;
  if (rows.length === 0) return null;
  const r = rows[0];
  return { id: r.id as string, label: r.label as string, page: r.page as string, visible: r.visible as boolean };
}

async function seedSections(): Promise<void> {
  const sql = getSQL();
  for (const s of DEFAULT_SECTIONS) {
    await sql`
      INSERT INTO sections (id, label, page, visible)
      VALUES (${s.id}, ${s.label}, ${s.page}, ${s.visible})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}
