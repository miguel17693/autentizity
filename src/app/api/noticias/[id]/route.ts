import { NextRequest, NextResponse } from "next/server";
import { getNoticia, updateNoticia, deleteNoticia } from "@/lib/data/store";
import { cleanupOrphanImage } from "@/lib/data/cleanup";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noticia = await getNoticia(id);
  if (!noticia) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(noticia);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getNoticia(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  body.updatedAt = new Date().toISOString();
  const updated = await updateNoticia(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cleanup old image if coverImage changed
  if (
    body.coverImage !== undefined &&
    existing.coverImage &&
    existing.coverImage !== updated.coverImage
  ) {
    await cleanupOrphanImage(existing.coverImage);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get image URL before deleting
  const noticia = await getNoticia(id);
  const imageUrl = noticia?.coverImage;

  const ok = await deleteNoticia(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cleanup orphan image
  if (imageUrl) {
    await cleanupOrphanImage(imageUrl);
  }

  return NextResponse.json({ ok: true });
}
