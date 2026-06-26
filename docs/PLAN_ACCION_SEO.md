# Plan de Acción SEO — AutentiZity

**Puntuación actual: 35/100**  
**Objetivo: +90/100**

---

## Lo urgente (hacer YA)

### 1. Arreglar el viewport (5 min)
Sin esto Google penaliza en móvil.  
**Archivo:** `src/app/layout.tsx`  
**Qué:** Añadir estas 6 líneas al principio del archivo (después de los imports):

```ts
import type { Viewport } from "next";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#013F3F",
};
```

### 2. Configurar OpenGraph y Twitter Cards (15 min)
Para que cuando alguien comparta un link aparezca imagen y descripción.  
**Archivo:** `src/app/layout.tsx`  
**Qué:** Añadir esto al objeto `metadata` (antes de cerrar la llave):

```ts
metadataBase: new URL("https://autentizity.org"),
openGraph: {
  type: "website",
  locale: "es_ES",
  url: "https://autentizity.org",
  siteName: "AutentiZity",
  images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
},
twitter: {
  card: "summary_large_image",
  images: ["/images/og-default.jpg"],
},
```

Y crear una imagen `public/images/og-default.jpg` de 1200x630 con el logo.

### 3. Crear robots.txt (5 min)
**Archivo nuevo:** `src/app/robots.ts`
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: "https://autentizity.org/sitemap.xml",
  };
}
```

### 4. Crear sitemap.xml (30 min)
**Archivo nuevo:** `src/app/sitemap.ts`  
Qué: lista de todas las URLs del sitio. Las estáticas (home, ecosistema, ranking...) se ponen a mano. Las dinámicas (noticias, eventos...) se sacan de la base de datos.

### 5. Poner títulos y descripciones POR PÁGINA (1h)
Ahora mismo TODAS las páginas tienen el mismo título: "AutentiZity — Aceleradora de Impacto Social".  
**Qué:** En cada página, añadir metadatos únicos.

Ejemplo para `src/app/(public)/noticias/[slug]/page.tsx`:
```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return { title: "Noticia no encontrada" };
  return {
    title: noticia.title,
    description: stripHtml(noticia.excerpt).slice(0, 160),
  };
}
```

Repetir para: `eventos/[slug]`, `movimientos/[slug]`, `actividades/[slug]`.

Para páginas fijas:
```ts
// ranking/page.tsx
export const metadata: Metadata = {
  title: "Ranking Líderes de la Autenticidad",
  description: "Los 100 líderes que transforman la cultura empresarial en España",
};

// ecosistema/page.tsx
export const metadata: Metadata = {
  title: "Ecosistema",
  description: "Empresas, entidades e instituciones que impulsan la autenticidad",
};

// noticias/page.tsx
export const metadata: Metadata = {
  title: "Noticias",
  description: "Actualidad del ecosistema AutentiZity",
};
```

---

## Lo importante (hacer esta semana)

### 6. Usar ISR en vez de force-dynamic (1h)
Todas las páginas tienen `export const dynamic = "force-dynamic"` → se generan en cada visita, lentas para Google.  
**Qué:** Cambiar por `export const revalidate = 3600` (1 hora) en páginas que no cambian a cada minuto. Ejemplo:

```ts
// En vez de:
export const dynamic = "force-dynamic";

// Usar:
export const revalidate = 3600; // Se actualiza cada hora
```

Aplica a: `noticias/page.tsx`, `ecosistema/page.tsx`, `ranking/page.tsx`, `unete/page.tsx`, `about/page.tsx`.

### 7. Añadir datos estructurados JSON-LD (30 min)
Para que Google muestre rich snippets (estrellas, eventos, breadcrumbs...).  
**Archivo:** `src/app/layout.tsx` — Meter esto en el `<head>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AutentiZity",
      url: "https://autentizity.org",
      logo: "https://autentizity.org/images/logo-transparent.png",
      sameAs: [
        "https://www.linkedin.com/company/autentizity",
        "https://www.instagram.com/autentizity",
      ],
    }),
  }}
/>
```

### 8. Poner URLs canónicas (10 min)
Evitar que Google vea contenido duplicado.  
**Archivo:** `src/app/layout.tsx` — Añadir en metadata:
```ts
alternates: { canonical: "https://autentizity.org" },
```

---

## Lo que suma (cuando haya tiempo)

### 9. Cambiar `<img>` por `<Image>` en ranking (5 min)
**Archivo:** `src/app/(public)/ranking/page.tsx:81-82`  
Ahora usa `<img>`, Next.js no las optimiza. Cambiar por `<Image>` de next/image.

### 10. Páginas de /privacy, /cookies, /legal (30 min)
El footer enlaza a estas páginas pero NO EXISTEN → 404. O las creas o quitas los enlaces del footer.

### 11. Página /about con contenido real (30 min)
Ahora pone "Próximamente". Mientras no tenga contenido, ocultarla de Google:
```ts
export const metadata: Metadata = { robots: { index: false } };
```

---

## Resumen de tiempos

| Tarea | Tiempo |
|-------|--------|
| Viewport | 5 min |
| OpenGraph + Twitter | 15 min |
| robots.txt | 5 min |
| Sitemap | 30 min |
| Metadatos por página | 1 h |
| ISR | 1 h |
| JSON-LD | 30 min |
| URLs canónicas | 10 min |
| `<img>` → `<Image>` | 5 min |
| Páginas legales | 30 min |
| About page | 30 min |
| **TOTAL** | **~5 horas** |
