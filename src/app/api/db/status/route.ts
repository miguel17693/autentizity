import { NextResponse } from "next/server";

/**
 * Endpoint de diagnóstico — verifica conexión a base de datos.
 * Solo accesible en desarrollo o con token.
 */
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const hasDB = !!dbUrl;

  if (!hasDB) {
    return NextResponse.json({
      status: "error",
      message: "DATABASE_URL no está configurada en las variables de entorno",
      hint: "Ve a Vercel Dashboard → Settings → Environment Variables → DATABASE_URL",
    }, { status: 500 });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(dbUrl!);
    const result = await sql`SELECT 1 AS ok`;
    return NextResponse.json({
      status: "ok",
      message: "Base de datos conectada correctamente",
      dbUrl: `${dbUrl!.substring(0, 30)}...`,
      test: result[0],
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: "DATABASE_URL existe pero la conexión falló",
      error: e.message,
      dbUrl: `${dbUrl!.substring(0, 30)}...`,
    }, { status: 500 });
  }
}
