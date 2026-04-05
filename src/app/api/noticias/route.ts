import { NextRequest, NextResponse } from "next/server";
import { getNoticias, createNoticia } from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(getNoticias());
}

export async function POST(request: NextRequest) {
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
    tags: body.tags ?? [],
    author: body.author ?? "AutentiZity",
    publishedAt: body.publishedAt ?? now,
    updatedAt: now,
    featured: body.featured ?? false,
    status: body.status ?? "draft",
  };

  createNoticia(noticia);
  return NextResponse.json(noticia, { status: 201 });
}
