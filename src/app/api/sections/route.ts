import { NextRequest, NextResponse } from "next/server";
import { getSections, saveSections } from "@/lib/data/sections";

export async function GET() {
  return NextResponse.json(getSections());
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  // body = { id: string, visible: boolean } or full array
  if (Array.isArray(body)) {
    saveSections(body);
    return NextResponse.json(body);
  }
  // Single toggle
  const sections = getSections();
  const idx = sections.findIndex((s) => s.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  sections[idx].visible = body.visible;
  saveSections(sections);
  return NextResponse.json(sections[idx]);
}
