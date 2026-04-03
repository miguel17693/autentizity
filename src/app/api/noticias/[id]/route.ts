import { NextRequest, NextResponse } from "next/server";
import { getNoticia, updateNoticia, deleteNoticia } from "@/lib/data/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noticia = getNoticia(id);
  if (!noticia) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(noticia);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  body.updatedAt = new Date().toISOString();
  const updated = updateNoticia(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = deleteNoticia(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
