import { NextRequest, NextResponse } from "next/server";
import {
  getAllEcosistemaEntities,
  getEcosistemaEntities,
  saveEcosistemaEntity,
  deleteEcosistemaEntity,
  setEntidadMovimientos,
  getMovimientosByEmbajador,
} from "@/lib/data/store";
import type { EcosistemaEntity } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("section_id");
    const entityId = searchParams.get("entity_id");

    if (entityId) {
      const entities = sectionId
        ? await getEcosistemaEntities(sectionId)
        : await getAllEcosistemaEntities();
      const entity = entities.find((e) => e.id === entityId);
      if (!entity) return NextResponse.json({ error: "Entidad no encontrada" }, { status: 404 });

      const movimientos = await getMovimientosByEmbajador(entityId).catch(() => []);
      const movimientoIds = movimientos.map((m) => m.id);

      return NextResponse.json({ entity, movimientoIds });
    }

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
    const body = await request.json();
    const { movimientoIds, ...entityData } = body as EcosistemaEntity & { movimientoIds?: string[] };
    if (!entityData.id || !entityData.section_id || !entityData.name) {
      return NextResponse.json({ error: "Faltan campos obligatorios (id, section_id, name)" }, { status: 400 });
    }
    await saveEcosistemaEntity({
      ...entityData,
      active: entityData.active ?? true,
      sort_order: entityData.sort_order ?? 0,
      logo_url: entityData.logo_url ?? "",
      description: entityData.description ?? "",
    });
    if (movimientoIds !== undefined) {
      await setEntidadMovimientos(entityData.id, movimientoIds);
    }
    return NextResponse.json(entityData);
  } catch (e) {
    console.error("POST /api/ecosistema/entidades error:", e);
    return NextResponse.json({ error: "Error al crear entidad" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { movimientoIds, ...entityData } = body as EcosistemaEntity & { movimientoIds?: string[] };
    if (!entityData.id) {
      return NextResponse.json({ error: "Se requiere id" }, { status: 400 });
    }
    await saveEcosistemaEntity({
      ...entityData,
      active: entityData.active ?? true,
      sort_order: entityData.sort_order ?? 0,
      logo_url: entityData.logo_url ?? "",
      description: entityData.description ?? "",
    });
    if (movimientoIds !== undefined) {
      await setEntidadMovimientos(entityData.id, movimientoIds);
    }
    return NextResponse.json(entityData);
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
