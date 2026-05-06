import { NextResponse } from "next/server";
import { initSchema } from "@/lib/data/schema";

/**
 * GET /api/db/setup
 * Initializes the database schema. Call once after creating the Neon database.
 * In production, you'd protect this with auth — for now it's open.
 */
export async function GET() {
  try {
    const result = await initSchema();
    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
