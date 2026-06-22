import { NextRequest, NextResponse } from "next/server";
import { getMovimientos, createMovimiento } from "@/lib/data/store";
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
    tags: body.tags ?? [],
    status: body.status ?? "draft",
    featured: body.featured ?? false,
  };

  await createMovimiento(movimiento);
  return NextResponse.json(movimiento, { status: 201 });
}
