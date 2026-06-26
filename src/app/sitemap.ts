import type { MetadataRoute } from "next";
import { getNoticias, getEventos, getMovimientos, getActividades } from "@/lib/data/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://autentizity.org";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ecosistema`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/ranking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/unete`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/actividad`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/actividad/eventos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/actividad/movimientos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/actividad/actividades`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/noticias`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const noticias = await getNoticias();
    for (const n of noticias.filter((n) => n.status === "published")) {
      dynamicRoutes.push({
        url: `${baseUrl}/noticias/${n.slug}`,
        lastModified: new Date(n.updatedAt || n.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch { /* DB not available — skip dynamic routes */ }

  try {
    const eventos = await getEventos();
    for (const e of eventos.filter((e) => e.status === "published")) {
      dynamicRoutes.push({
        url: `${baseUrl}/eventos/${e.slug}`,
        lastModified: new Date(e.startDate),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch { /* skip */ }

  try {
    const movimientos = await getMovimientos();
    for (const m of movimientos.filter((m) => m.status === "published")) {
      dynamicRoutes.push({
        url: `${baseUrl}/movimientos/${m.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch { /* skip */ }

  try {
    const actividades = await getActividades();
    for (const a of actividades.filter((a) => a.status === "published")) {
      dynamicRoutes.push({
        url: `${baseUrl}/actividades/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch { /* skip */ }

  return [...staticRoutes, ...dynamicRoutes];
}
