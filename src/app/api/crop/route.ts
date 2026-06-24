import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { imageUrl, crops } = body as {
      imageUrl: string;
      crops: Record<string, CropArea>;
    };

    if (!imageUrl || !crops || Object.keys(crops).length === 0) {
      return NextResponse.json(
        { error: "imageUrl and crops are required" },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(imageBuffer).metadata();
    const imgW = metadata.width ?? 0;
    const imgH = metadata.height ?? 0;

    if (imgW === 0 || imgH === 0) {
      return NextResponse.json(
        { error: "Could not read image dimensions" },
        { status: 400 }
      );
    }

    const entries = Object.entries(crops);
    const results: Record<string, string> = {};

    await Promise.all(
      entries.map(async ([key, area]) => {
        const left = Math.max(0, Math.round(area.x));
        const top = Math.max(0, Math.round(area.y));
        const width = Math.min(Math.round(area.width), imgW - left);
        const height = Math.min(Math.round(area.height), imgH - top);

        if (width <= 0 || height <= 0) {
          throw new Error(`Invalid crop area for "${key}"`);
        }

        const croppedBuffer = await sharp(imageBuffer)
          .extract({ left, top, width, height })
          .jpeg({ quality: 85, mozjpeg: true })
          .toBuffer();

        const blob = await put(`crop-${key}.jpg`, croppedBuffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: "image/jpeg",
        });

        results[key] = blob.url;
      })
    );

    return NextResponse.json({ urls: results });
  } catch (error) {
    console.error("Crop error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
