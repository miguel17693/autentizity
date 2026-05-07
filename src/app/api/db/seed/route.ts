import { NextResponse } from "next/server";
import { getSQL } from "@/lib/data/db";
import { mockEvents, mockNews } from "@/lib/data/mock";

/**
 * GET /api/db/seed
 * Seeds the database with the mock data (eventos + noticias).
 * Safe to run multiple times (uses ON CONFLICT DO NOTHING).
 */
export async function GET() {
  try {
    const sql = getSQL();

    // Seed eventos
    for (const e of mockEvents) {
      await sql`
        INSERT INTO eventos (id, slug, title, description, content, cover_image, start_date, end_date, location, type, tags, organizer, registration_url, featured, status)
        VALUES (${e.id}, ${e.slug}, ${e.title}, ${e.description}, ${e.content}, ${e.coverImage}, ${e.startDate}, ${e.endDate}, ${e.location}, ${e.type}, ${JSON.stringify(e.tags)}, ${e.organizer}, ${e.registrationUrl}, ${e.featured}, ${e.status})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Seed noticias
    for (const n of mockNews) {
      await sql`
        INSERT INTO noticias (id, slug, title, excerpt, content, cover_image, tags, author, published_at, updated_at, featured, status)
        VALUES (${n.id}, ${n.slug}, ${n.title}, ${n.excerpt}, ${n.content}, ${n.coverImage}, ${JSON.stringify(n.tags)}, ${n.author}, ${n.publishedAt}, ${n.updatedAt}, ${n.featured}, ${n.status})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return NextResponse.json({
      success: true,
      seeded: { eventos: mockEvents.length, noticias: mockNews.length },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
