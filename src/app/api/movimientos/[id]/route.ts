import { NextRequest, NextResponse } from "next/server";
import {
  getMovimiento,
  updateMovimiento,
  deleteMovimiento,
  getEmbajadoresByMovimiento,
  getActividadesByMovimiento,
  getNoticiasByMovimiento,
  getEventosByMovimiento,
  setMovimientoEmbajadores,
  setMovimientoActividades,
} from "@/lib/data/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mov = await getMovimiento(id);
  if (!mov) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [embajadores, actividades, noticias, eventos] = await Promise.all([
    getEmbajadoresByMovimiento(id).catch(() => []),
    getActividadesByMovimiento(id).catch(() => []),
    getNoticiasByMovimiento(id).catch(() => []),
    getEventosByMovimiento(id).catch(() => []),
  ]);

  return NextResponse.json({ ...mov, embajadores, actividades, noticias, eventos });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.content !== undefined) updates.content = body.content;
  if (body.coverImage !== undefined) updates.coverImage = body.coverImage;
  if (body.coverImageOriginal !== undefined) updates.coverImageOriginal = body.coverImageOriginal;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.status !== undefined) updates.status = body.status;
  if (body.featured !== undefined) updates.featured = body.featured;

  const updated = await updateMovimiento(id, updates as Parameters<typeof updateMovimiento>[1]);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.embajadorIds !== undefined) {
    await setMovimientoEmbajadores(id, body.embajadorIds);
  }
  if (body.actividadIds !== undefined) {
    await setMovimientoActividades(id, body.actividadIds);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteMovimiento(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
