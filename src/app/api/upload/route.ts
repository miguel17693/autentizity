import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.\./g, ".")
    .substring(0, 200);
}

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Solo se permiten imágenes PNG, JPG o WebP" },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "La imagen no puede superar 5MB" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await sharp(buffer).metadata();
  } catch {
    return NextResponse.json(
      { error: "El archivo no es una imagen válida" },
      { status: 400 }
    );
  }

  try {
    const safeName = sanitizeFilename(file.name);
    const blob = await put(safeName, buffer, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
