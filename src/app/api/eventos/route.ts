import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicContent } from "@/lib/revalidate";
import { getEventos, createEvento } from "@/lib/data/store";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminRequest } from "@/lib/auth/session";
import { onlyPublic } from "@/lib/visibility";

export async function GET(request: NextRequest) {
  const items = await getEventos();
  return NextResponse.json((await isAdminRequest(request)) ? items : onlyPublic(items));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = await request.json();

  const id = String(Date.now());
  const slug = body.slug || slugify(body.title);

  const evento = {
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
    startDate: body.startDate ?? new Date().toISOString(),
    endDate: body.endDate ?? body.startDate ?? new Date().toISOString(),
    location: body.location ?? "",
    type: body.type ?? "presencial",
    tags: body.tags ?? [],
    organizer: body.organizer ?? "AutentiZity",
    registrationUrl: body.registrationUrl ?? "",
    featured: body.featured ?? false,
    status: body.status ?? "draft",
    updatedAt: new Date().toISOString(),
    movimientoId: body.movimientoId ?? "",
  };

  await createEvento(evento);
  revalidatePublicContent();
  return NextResponse.json(evento, { status: 201 });
}
