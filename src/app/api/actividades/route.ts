import { NextRequest, NextResponse } from "next/server";
import { getActividades, createActividad, setActividadMovimientos } from "@/lib/data/store";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminRequest } from "@/lib/auth/session";
import { onlyPublic } from "@/lib/visibility";

export async function GET(request: NextRequest) {
  try {
    const items = await getActividades();
    return NextResponse.json((await isAdminRequest(request)) ? items : onlyPublic(items));
  } catch (err) {
    console.error("[GET /api/actividades]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;
    const body = await request.json();
    const id = String(Date.now());
    const slug = body.slug || slugify(body.title);

    const actividad = {
      id,
      slug,
      title: body.title ?? "",
      description: body.description ?? "",
      content: body.content ?? "",
      coverImage: body.coverImage ?? "",
      coverImageOriginal: body.coverImageOriginal ?? "",
      coverImageHero: body.coverImageHero ?? "",
      coverImageHeroDesktop: body.coverImageHeroDesktop ?? "",
      coverImageCard: body.coverImageCard ?? "",
      tags: body.tags ?? [],
      status: body.status ?? "draft",
      featured: body.featured ?? false,
      buttonText: body.buttonText ?? "",
      buttonUrl: body.buttonUrl ?? "",
    };

    await createActividad(actividad);

    if (body.movimientoIds !== undefined) {
      await setActividadMovimientos(id, body.movimientoIds);
    }

    return NextResponse.json(actividad, { status: 201 });
  } catch (err) {
    console.error("[POST /api/actividades]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
