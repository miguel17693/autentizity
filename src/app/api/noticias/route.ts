import { NextResponse } from "next/server";
import { mockNews } from "@/lib/data/mock";

export async function GET() {
  // TODO: Replace with Supabase query
  return NextResponse.json(mockNews);
}
