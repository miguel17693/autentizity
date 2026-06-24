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

  // Cleanup old images if changed
  if (
    body.coverImage !== undefined &&
    existing.coverImage &&
    existing.coverImage !== updated.coverImage
  ) {
    await cleanupOrphanImage(existing.coverImage);
  }
  if (
    body.coverImageOriginal !== undefined &&
    existing.coverImageOriginal &&
    existing.coverImageOriginal !== updated.coverImageOriginal
  ) {
    await cleanupOrphanImage(existing.coverImageOriginal);
  }
  if (
    body.coverImageHero !== undefined &&
    existing.coverImageHero &&
    existing.coverImageHero !== updated.coverImageHero
  ) {
    await cleanupOrphanImage(existing.coverImageHero);
  }
  if (
    body.coverImageHeroDesktop !== undefined &&
    existing.coverImageHeroDesktop &&
    existing.coverImageHeroDesktop !== updated.coverImageHeroDesktop
  ) {
    await cleanupOrphanImage(existing.coverImageHeroDesktop);
  }
  if (
    body.coverImageCard !== undefined &&
    existing.coverImageCard &&
    existing.coverImageCard !== updated.coverImageCard
  ) {
    await cleanupOrphanImage(existing.coverImageCard);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get image URLs before deleting
  const noticia = await getNoticia(id);
  const imageUrl = noticia?.coverImage;
  const originalImageUrl = noticia?.coverImageOriginal;
  const heroImageUrl = noticia?.coverImageHero;
  const heroDesktopImageUrl = noticia?.coverImageHeroDesktop;
  const cardImageUrl = noticia?.coverImageCard;

  const ok = await deleteNoticia(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Cleanup orphan images
  if (imageUrl) {
    await cleanupOrphanImage(imageUrl);
  }
  if (originalImageUrl) {
    await cleanupOrphanImage(originalImageUrl);
  }
  if (heroImageUrl) {
    await cleanupOrphanImage(heroImageUrl);
  }
  if (heroDesktopImageUrl) {
    await cleanupOrphanImage(heroDesktopImageUrl);
  }
  if (cardImageUrl) {
    await cleanupOrphanImage(cardImageUrl);
  }

  return NextResponse.json({ ok: true });
}
