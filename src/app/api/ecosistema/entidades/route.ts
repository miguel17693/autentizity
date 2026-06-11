import { NextRequest, NextResponse } from "next/server";
import {
  getAllEcosistemaEntities,
  getEcosistemaEntities,
  saveEcosistemaEntity,
  deleteEcosistemaEntity,
} from "@/lib/data/store";
import type { EcosistemaEntity } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("section_id");

    const entities = sectionId
      ? await getEcosistemaEntities(sectionId)
      : await getAllEcosistemaEntities();

    return NextResponse.json(entities);
  } catch (e) {
    console.error("GET /api/ecosistema/entidades error:", e);
    return NextResponse.json({ error: "Error al cargar entidades" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EcosistemaEntity = await request.json();
    if (!body.id || !body.section_id || !body.name) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, section_id, name)" }, { status: 400 });
    }
    await saveEcosistemaEntity({
      ...body,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
      logo_url: body.logo_url ?? "",
      description: body.description ?? "",
    });
    return NextResponse.json(body);
  } catch (e) {
    console.error("POST /api/ecosistema/entidades error:", e);
    return NextResponse.json({ error: "Error al crear entidad" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: EcosistemaEntity = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Se requiere id" }, { status: 400 });
    }
    await saveEcosistemaEntity({
      ...body,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
      logo_url: body.logo_url ?? "",
      description: body.description ?? "",
    });
    return NextResponse.json(body);
  } catch (e) {
    console.error("PUT /api/ecosistema/entidades error:", e);
    return NextResponse.json({ error: "Error al actualizar entidad" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Se requiere id" }, { status: 400 });
    }
    await deleteEcosistemaEntity(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/ecosistema/entidades error:", e);
    return NextResponse.json({ error: "Error al eliminar entidad" }, { status: 500 });
  }
}
