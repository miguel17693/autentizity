import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initSchema } from "@/lib/data/schema";

export async function GET() {
  try {
    const result = await initSchema();
    revalidatePath("/ecosistema");
    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error("DB setup error:", e);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
