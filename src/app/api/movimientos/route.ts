import { NextRequest, NextResponse } from "next/server";
import {
  getMovimientos,
  createMovimiento,
  setMovimientoEmbajadores,
  setMovimientoActividades,
} from "@/lib/data/store";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminRequest } from "@/lib/auth/session";
import { onlyPublic } from "@/lib/visibility";

export async function GET(request: NextRequest) {
  const items = await getMovimientos();
  return NextResponse.json((await isAdminRequest(request)) ? items : onlyPublic(items));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
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
    coverImageHeroDesktop: body.coverImageHeroDesktop ?? "",
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
