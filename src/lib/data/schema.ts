/**
 * Database schema initialization.
 * Run via: GET /api/db/setup (protected, admin only)
 */
import { getSQL } from "./db";

const DEFAULT_ECOSISTEMA_SECTIONS = [
  {
    id: "eco-empresas",
    name: "Empresas Impulsoras",
    slug: "empresas-impulsoras",
    description: "Empresas comprometidas con la construcción de culturas corporativas más auténticas, inclusivas y humanas. Organizaciones que entienden que el cambio real comienza dentro y que su impacto se proyecta mucho más allá del lugar de trabajo.",
    previousDescriptions: [
      "Empresas que no se conforman con la cultura que tienen, sino que construyen la que quieren.",
      "Empresas que no se conforman con la cultura que tienen, sino que construyen la que quieren. Organizaciones que entienden que el cambio real empieza dentro… y se proyecta fuera",
    ],
    sort_order: 1,
    active: true,
  },
  {
    id: "eco-entidades",
    name: "Entidades Colaboradoras",
    slug: "entidades-colaboradoras",
    description: "ONG y asociaciones con las que colaboramos y que aportan su conocimiento, experiencia y compromiso para promover el bienestar, la inclusión y la salud mental también en los lugares de trabajo.",
    previousDescriptions: [
      "Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos.",
      "Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos",
      "Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos. Porque somos personas en todos los ámbitos de nuestra vida, también en nuestros lugares de trabajo",
    ],
    sort_order: 2,
    active: true,
  },
  {
    id: "eco-instituciones",
    name: "Instituciones, Cámaras de Comercio y Asociaciones Corporativas",
    slug: "instituciones",
    description: "Entidades con las que generamos alianzas y espacios de colaboración entre el ámbito público, empresarial y social. Porque cuando avanzamos juntos, el impacto se multiplica.",
    previousDescriptions: [
      "Cuando lo público y lo privado avanzan juntos, el impacto se multiplica.",
      "Cuando lo público y lo privado dejan de ir en paralelo y empiezan a avanzar juntos, el impacto se multiplica",
      "Cuando lo público y lo privado dejan de ir en paralelo y empiezan a avanzar juntos, el impacto se multiplica. Aquí es donde nacen los cambios que transforman empresas, ciudades y formas de vivir el trabajo",
    ],
    sort_order: 3,
    active: true,
  },
  {
    id: "eco-embajadores",
    name: "Embajadores",
    slug: "embajadores",
    description: "Profesionales que impulsan los movimientos corporativos de AutentiZity.",
    sort_order: 4,
    active: true,
  },
  {
    id: "eco-consejo-consultivo",
    name: "Consejo Consultivo de Impacto Social",
    slug: "consejo-consultivo-impacto-social",
    description: "Representantes de instituciones públicas, universidades, empresas, asociaciones y entidades empresariales que aportan su conocimiento y experiencia para ayudarnos a definir nuestras prioridades y los movimientos corporativos con los que generar un impacto social positivo desde el ámbito empresarial.",
    sort_order: 5,
    active: true,
  },
];

export async function initSchema() {
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      start_date TEXT DEFAULT '',
      end_date TEXT DEFAULT '',
      location TEXT DEFAULT '',
      type TEXT DEFAULT 'presencial',
      tags JSONB DEFAULT '[]',
      organizer TEXT DEFAULT '',
      registration_url TEXT DEFAULT '',
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      movimiento_id TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS noticias (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      author TEXT DEFAULT '',
      published_at TEXT DEFAULT '',
      updated_at TEXT DEFAULT '',
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      movimiento_id TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movimientos (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS actividades (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      content TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      featured BOOLEAN DEFAULT false,
      button_text TEXT DEFAULT '',
      button_url TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Migrations: add columns that may be missing from previously-created tables
  await sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS movimiento_id TEXT`;
  await sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS cover_image_original TEXT DEFAULT ''`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS movimiento_id TEXT`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS cover_image_original TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS button_url TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS cover_image_original TEXT DEFAULT ''`;
  await sql`ALTER TABLE movimientos ADD COLUMN IF NOT EXISTS cover_image_original TEXT DEFAULT ''`;
  await sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS cover_image_hero TEXT DEFAULT ''`;
  await sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS cover_image_card TEXT DEFAULT ''`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS cover_image_hero TEXT DEFAULT ''`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS cover_image_card TEXT DEFAULT ''`;
  await sql`ALTER TABLE movimientos ADD COLUMN IF NOT EXISTS cover_image_hero TEXT DEFAULT ''`;
  await sql`ALTER TABLE movimientos ADD COLUMN IF NOT EXISTS cover_image_card TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS cover_image_hero TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS cover_image_card TEXT DEFAULT ''`;
  await sql`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS cover_image_hero_desktop TEXT DEFAULT ''`;
  await sql`ALTER TABLE noticias ADD COLUMN IF NOT EXISTS cover_image_hero_desktop TEXT DEFAULT ''`;
  await sql`ALTER TABLE movimientos ADD COLUMN IF NOT EXISTS cover_image_hero_desktop TEXT DEFAULT ''`;
  await sql`ALTER TABLE actividades ADD COLUMN IF NOT EXISTS cover_image_hero_desktop TEXT DEFAULT ''`;

  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      page TEXT NOT NULL,
      visible BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ecosistema_secciones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ecosistema_entidades (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL REFERENCES ecosistema_secciones(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      logo_url TEXT DEFAULT '',
      description TEXT DEFAULT '',
      tags JSONB DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE ecosistema_secciones ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
  await sql`ALTER TABLE ecosistema_secciones ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`;
  await sql`ALTER TABLE ecosistema_secciones ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`;
  await sql`ALTER TABLE ecosistema_entidades ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT ''`;
  await sql`ALTER TABLE ecosistema_entidades ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
  await sql`ALTER TABLE ecosistema_entidades ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'`;
  await sql`ALTER TABLE ecosistema_entidades ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`;
  await sql`ALTER TABLE ecosistema_entidades ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`;

  for (const section of DEFAULT_ECOSISTEMA_SECTIONS) {
    await sql`
      INSERT INTO ecosistema_secciones (id, name, slug, description, sort_order, active)
      VALUES (${section.id}, ${section.name}, ${section.slug}, ${section.description}, ${section.sort_order}, ${section.active})
      ON CONFLICT DO NOTHING
    `;
    // Only replace known legacy copy; preserve custom admin text and empty descriptions.
    for (const previousDescription of section.previousDescriptions ?? []) {
      await sql`
        UPDATE ecosistema_secciones SET description = ${section.description}
        WHERE id = ${section.id} AND description = ${previousDescription}
      `;
    }
  }

  await sql`
    CREATE TABLE IF NOT EXISTS movimiento_embajadores (
      id TEXT PRIMARY KEY,
      movimiento_id TEXT NOT NULL REFERENCES movimientos(id) ON DELETE CASCADE,
      entidad_id TEXT NOT NULL REFERENCES ecosistema_entidades(id) ON DELETE CASCADE,
      UNIQUE(movimiento_id, entidad_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS movimiento_actividades (
      id TEXT PRIMARY KEY,
      movimiento_id TEXT NOT NULL REFERENCES movimientos(id) ON DELETE CASCADE,
      actividad_id TEXT NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
      UNIQUE(movimiento_id, actividad_id)
    )
  `;

  return { success: true };
}
