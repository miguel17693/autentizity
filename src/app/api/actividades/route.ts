import { NextRequest, NextResponse } from "next/server";
import { getActividades, createActividad, setActividadMovimientos } from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    return NextResponse.json(await getActividades());
  } catch (err) {
    console.error("[GET /api/actividades]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
