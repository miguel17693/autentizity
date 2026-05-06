/**
 * Database schema initialization.
 * Run via: GET /api/db/setup (protected, admin only)
 */
import { getSQL } from "./db";

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
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      page TEXT NOT NULL,
      visible BOOLEAN DEFAULT true
    )
  `;

  return { success: true };
}
