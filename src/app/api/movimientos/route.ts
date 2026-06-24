import { NextRequest, NextResponse } from "next/server";
import {
  getMovimientos,
  createMovimiento,
  setMovimientoEmbajadores,
  setMovimientoActividades,
} from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(await getMovimientos());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const id = String(Date.now());
  const slug = body.slug || slugify(body.title);

  const movimiento = {
    id,
    slug,
    title: body.title ?? "",
    description: body.description ?? "",
    content: body.content ?? "",
    coverImage: body.coverImage ?? "",
    coverImageOriginal: body.coverImageOriginal ?? "",
    coverImageHero: body.coverImageHero ?? "",
    coverImageCard: body.coverImageCard ?? "",
    tags: body.tags ?? [],
    status: body.status ?? "draft",
    featured: body.featured ?? false,
  };

  await createMovimiento(movimiento);

  if (body.embajadorIds !== undefined) {
    await setMovimientoEmbajadores(id, body.embajadorIds);
  }
  if (body.actividadIds !== undefined) {
    await setMovimientoActividades(id, body.actividadIds);
  }

  return NextResponse.json(movimiento, { status: 201 });
}
