import { NextResponse } from "next/server";
import { getSQL } from "@/lib/data/db";
import { mockEvents, mockNews } from "@/lib/data/mock";
import { isSameOriginRequest, requireAdmin } from "@/lib/auth/admin";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

export async function GET() {
  if (isProduction()) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}

export async function POST(request: Request) {
  if (isProduction()) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

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
