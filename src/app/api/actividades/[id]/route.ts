import { NextRequest, NextResponse } from "next/server";
import { getActividad, updateActividad, deleteActividad, getMovimientosByActividad, setActividadMovimientos } from "@/lib/data/store";

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

    const { movimientoIds, ...actData } = body;

    const updated = await updateActividad(id, actData);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
    const ok = await deleteActividad(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/actividades/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
