import { NextRequest, NextResponse } from "next/server";
import { getEvento, updateEvento, deleteEvento } from "@/lib/data/store";
import { cleanupOrphanImage } from "@/lib/data/cleanup";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = await getEvento(id);
  if (!evento) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(evento);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getEvento(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const updated = await updateEvento(id, body);
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
  const evento = await getEvento(id);
  const imageUrl = evento?.coverImage;
  const originalImageUrl = evento?.coverImageOriginal;
  const heroImageUrl = evento?.coverImageHero;
  const cardImageUrl = evento?.coverImageCard;

  const ok = await deleteEvento(id);
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
  if (cardImageUrl) {
    await cleanupOrphanImage(cardImageUrl);
  }

  return NextResponse.json({ ok: true });
}
