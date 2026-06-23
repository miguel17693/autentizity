import { NextRequest, NextResponse } from "next/server";
import { getActividades, createActividad } from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(await getActividades());
}

export async function POST(request: NextRequest) {
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
    tags: body.tags ?? [],
    status: body.status ?? "draft",
    featured: body.featured ?? false,
    buttonText: body.buttonText ?? "",
    buttonUrl: body.buttonUrl ?? "",
  };

  await createActividad(actividad);
  return NextResponse.json(actividad, { status: 201 });
}
