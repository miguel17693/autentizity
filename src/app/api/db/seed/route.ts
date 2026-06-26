import { NextResponse } from "next/server";
import { getSQL } from "@/lib/data/db";
import { mockEvents, mockNews } from "@/lib/data/mock";

export async function GET() {
  try {
    const sql = getSQL();

    for (const e of mockEvents) {
      await sql`
        INSERT INTO eventos (id, slug, title, description, content, cover_image, start_date, end_date, location, type, tags, organizer, registration_url, featured, status)
        VALUES (${e.id}, ${e.slug}, ${e.title}, ${e.description}, ${e.content}, ${e.coverImage}, ${e.startDate}, ${e.endDate}, ${e.location}, ${e.type}, ${JSON.stringify(e.tags)}, ${e.organizer}, ${e.registrationUrl}, ${e.featured}, ${e.status})
        ON CONFLICT (id) DO NOTHING
      `;
    }

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
    console.error("DB seed error:", e);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
