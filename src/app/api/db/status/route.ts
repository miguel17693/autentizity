import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return NextResponse.json({
      status: "error",
      message: "DATABASE_URL no está configurada",
    }, { status: 500 });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(dbUrl);
    const result = await sql`SELECT 1 AS ok`;
    return NextResponse.json({
      status: "ok",
      message: "Base de datos conectada correctamente",
      test: result[0],
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error desconocido";
    console.error("DB status error:", message);
    return NextResponse.json({
      status: "error",
      message: "La conexión a la base de datos falló",
    }, { status: 500 });
  }
}
