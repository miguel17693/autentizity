import { NextRequest, NextResponse } from "next/server";
import {
  getAllEcosistemaSections,
  saveEcosistemaSection,
  deleteEcosistemaSection,
} from "@/lib/data/store";
import type { EcosistemaSection } from "@/lib/types";

export async function GET() {
  try {
    const sections = await getAllEcosistemaSections();
    return NextResponse.json(sections);
  } catch (e) {
    console.error("GET /api/ecosistema/secciones error:", e);
    return NextResponse.json({ error: "Error al cargar secciones" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EcosistemaSection = await request.json();
    if (!body.id || !body.name || !body.slug) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, name, slug)" }, { status: 400 });
    }
    await saveEcosistemaSection({
      ...body,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
      description: body.description ?? "",
    });
    return NextResponse.json(body);
  } catch (e) {
    console.error("POST /api/ecosistema/secciones error:", e);
    return NextResponse.json({ error: "Error al crear sección" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: EcosistemaSection = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Se requiere id" }, { status: 400 });
    }
    await saveEcosistemaSection({
      ...body,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
      description: body.description ?? "",
    });
    return NextResponse.json(body);
  } catch (e) {
    console.error("PUT /api/ecosistema/secciones error:", e);
    return NextResponse.json({ error: "Error al actualizar sección" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Se requiere id" }, { status: 400 });
    }
    await deleteEcosistemaSection(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/ecosistema/secciones error:", e);
    return NextResponse.json({ error: "Error al eliminar sección" }, { status: 500 });
  }
}
