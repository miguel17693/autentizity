import { NextRequest, NextResponse } from "next/server";
import { getActividad, updateActividad, deleteActividad, getMovimientosByActividad, setActividadMovimientos } from "@/lib/data/store";
import { cleanupOrphanImage } from "@/lib/data/cleanup";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const act = await getActividad(id);
    if (!act) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const movimientos = await getMovimientosByActividad(id).catch(() => []);
    return NextResponse.json({ ...act, movimientos });
  } catch (err) {
    console.error("[GET /api/actividades/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getActividad(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { movimientoIds, ...actData } = body;

    const updated = await updateActividad(id, actData);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.coverImage !== undefined && existing.coverImage && existing.coverImage !== updated.coverImage) {
      await cleanupOrphanImage(existing.coverImage);
    }
    if (body.coverImageOriginal !== undefined && existing.coverImageOriginal && existing.coverImageOriginal !== updated.coverImageOriginal) {
      await cleanupOrphanImage(existing.coverImageOriginal);
    }
    if (body.coverImageHero !== undefined && existing.coverImageHero && existing.coverImageHero !== updated.coverImageHero) {
      await cleanupOrphanImage(existing.coverImageHero);
    }
    if (body.coverImageCard !== undefined && existing.coverImageCard && existing.coverImageCard !== updated.coverImageCard) {
      await cleanupOrphanImage(existing.coverImageCard);
    }

    if (movimientoIds !== undefined) {
      await setActividadMovimientos(id, movimientoIds);
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/actividades/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const act = await getActividad(id);
    const imageUrl = act?.coverImage;
    const originalImageUrl = act?.coverImageOriginal;
    const heroImageUrl = act?.coverImageHero;
    const cardImageUrl = act?.coverImageCard;

    const ok = await deleteActividad(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (imageUrl) await cleanupOrphanImage(imageUrl);
    if (originalImageUrl) await cleanupOrphanImage(originalImageUrl);
    if (heroImageUrl) await cleanupOrphanImage(heroImageUrl);
    if (cardImageUrl) await cleanupOrphanImage(cardImageUrl);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/actividades/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
