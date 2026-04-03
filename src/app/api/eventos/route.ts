import { NextRequest, NextResponse } from "next/server";
import { getEventos, createEvento } from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(getEventos());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const eventos = getEventos();
  const id = String(Date.now());
  const slug = body.slug || slugify(body.title);

  const evento = {
    id,
    slug,
    title: body.title ?? "",
    description: body.description ?? "",
    content: body.content ?? "",
    coverImage: body.coverImage ?? "",
    startDate: body.startDate ?? new Date().toISOString(),
    endDate: body.endDate ?? body.startDate ?? new Date().toISOString(),
    location: body.location ?? "",
    type: body.type ?? "presencial",
    tags: body.tags ?? [],
    organizer: body.organizer ?? "AuthentiZity",
    registrationUrl: body.registrationUrl ?? "",
    featured: body.featured ?? false,
    status: body.status ?? "draft",
  };

  createEvento(evento);
  return NextResponse.json(evento, { status: 201 });
}
