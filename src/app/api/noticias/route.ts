import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicContent } from "@/lib/revalidate";
import { getNoticias, createNoticia } from "@/lib/data/store";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminRequest } from "@/lib/auth/session";
import { onlyPublic } from "@/lib/visibility";

export async function GET(request: NextRequest) {
  const items = await getNoticias();
  return NextResponse.json((await isAdminRequest(request)) ? items : onlyPublic(items));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();

  const id = String(Date.now());
  const slug = body.slug || slugify(body.title);
  const now = new Date().toISOString();

  const noticia = {
    id,
    slug,
    title: body.title ?? "",
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    coverImage: body.coverImage ?? "",
    coverImageOriginal: body.coverImageOriginal ?? "",
    coverImageHero: body.coverImageHero ?? "",
    coverImageHeroDesktop: body.coverImageHeroDesktop ?? "",
    coverImageCard: body.coverImageCard ?? "",
    tags: body.tags ?? [],
    author: body.author ?? "AutentiZity",
    publishedAt: body.publishedAt ?? now,
    updatedAt: now,
    featured: body.featured ?? false,
    status: body.status ?? "draft",
    movimientoId: body.movimientoId ?? "",
  };

  await createNoticia(noticia);
  revalidatePublicContent();
  return NextResponse.json(noticia, { status: 201 });
}
