import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { initSchema } from "@/lib/data/schema";
import { isSameOriginRequest, requireAdmin } from "@/lib/auth/admin";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

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
