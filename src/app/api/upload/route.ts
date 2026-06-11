import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Only allow images
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Solo se permiten imágenes" },
      { status: 400 }
    );
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "La imagen no puede superar 5MB" },
      { status: 400 }
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error al subir la imagen: ${message}` },
      { status: 500 }
    );
  }
}
