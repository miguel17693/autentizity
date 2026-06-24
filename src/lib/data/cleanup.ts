import { del } from "@vercel/blob";
import { getSQL } from "./db";

/**
 * If the given URL is a Vercel Blob URL and is no longer referenced
 * by any evento or noticia, delete it from blob storage.
 */
export async function cleanupOrphanImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  // Only clean up Vercel Blob URLs (avoid deleting external images)
  if (!imageUrl.includes("public.blob.vercel-storage.com")) return;

  try {
    const sql = getSQL();

    // Check if any evento, noticia, movimiento, or actividad still uses this URL
    const eventRows = await sql`
      SELECT id FROM eventos WHERE cover_image = ${imageUrl} OR cover_image_original = ${imageUrl} OR cover_image_hero = ${imageUrl} OR cover_image_card = ${imageUrl} LIMIT 1
    `;
    if ((eventRows as unknown[]).length > 0) return;

    const newsRows = await sql`
      SELECT id FROM noticias WHERE cover_image = ${imageUrl} OR cover_image_original = ${imageUrl} OR cover_image_hero = ${imageUrl} OR cover_image_card = ${imageUrl} LIMIT 1
    `;
    if ((newsRows as unknown[]).length > 0) return;

    const movRows = await sql`
      SELECT id FROM movimientos WHERE cover_image = ${imageUrl} OR cover_image_original = ${imageUrl} OR cover_image_hero = ${imageUrl} OR cover_image_card = ${imageUrl} LIMIT 1
    `;
    if ((movRows as unknown[]).length > 0) return;

    const actRows = await sql`
      SELECT id FROM actividades WHERE cover_image = ${imageUrl} OR cover_image_original = ${imageUrl} OR cover_image_hero = ${imageUrl} OR cover_image_card = ${imageUrl} LIMIT 1
    `;
    if ((actRows as unknown[]).length > 0) return;

    // Orphaned — delete from blob
    await del(imageUrl);
  } catch (error) {
    // Don't fail the main operation if cleanup fails
    console.error("Failed to clean up orphan image:", error);
  }
}
