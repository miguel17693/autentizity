# 🤖 AI CONTEXT — AutentiZity

> **Este archivo es el punto de entrada para la IA.** Léelo siempre antes de trabajar en el proyecto.
> Última actualización: 16 de noviembre de 2026

---

## 🚨 REGLAS ABSOLUTAS

- **SIEMPRE commitea y pushea** al terminar una tarea, sin preguntar. El usuario quiere commit + push automático.
- **El dominio canónico de producción es `https://autentizity.org`** (`https://autentizity.vercel.app` también sirve la web).
- **Para migraciones de BD**: son automáticas en cada deploy de producción (`pnpm build` ejecuta `scripts/migrate.ts` antes de `next build`). Para añadir una, añádela al final de `MIGRATIONS` en `src/lib/data/schema.ts`.
- **Para diagnóstico de BD**: visita `https://autentizity.org/api/db/status`.
- **Idioma del código**: Inglés (variables, componentes, comentarios).
- **Idioma del contenido/UI**: Español.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).

---

## 📋 Resumen del Proyecto

**AutentiZity** es una **Aceleradora de Impacto Social** que acompaña a empresas en la consecución de objetivos de impacto social y mejora de cultura de empresa.

**Web**: https://autentizity.org (también responde en https://autentizity.vercel.app)
**Contacto**: miguelgarzon@autentizity.org / comunidad@autentizity.org

### Qué es la web
Portal público **sin autenticación de usuarios** con:
- **Noticias** — artículos/blog posts
- **Eventos** — con calendario, filtros por tipo, botón "Inscríbete"
- **Movimientos** — páginas de movimiento con embajadores, actividades y noticias/eventos vinculados
- **Actividades** — contenido independiente con botón CTA
- **Ecosistema** — secciones dinámicas (Empresas Impulsoras, Entidades Colaboradoras...) con entidades (logo + nombre)
- **Ranking** — página "Referentes de la Autenticidad 2026" (con ManpowerGroup) y Diploma "Empresa AutentiZity"
- **Actividad** — hub `/actividad` con eventos, movimientos y actividades
- **Únete** — página de contacto/registro
- **Legales** — aviso legal, privacidad, cookies y código ético
- **Panel de administración** — CRUD completo para todo lo anterior + visibilidad de secciones (sesión de admin firmada)

---

## 🏗️ Arquitectura Técnica

### Stack
| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 15.5 (App Router) + React 19 |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS 4 |
| **Base de datos** | Neon Postgres (serverless) via `@neondatabase/serverless` |
| **Almacenamiento** | Vercel Blob (`@vercel/blob`) para imágenes |
| **ORM** | Ninguno — SQL crudo con tagged templates (`sql\`...\``) |
| **Hosting** | Vercel |
| **Package manager** | pnpm (CI fija 12.21.0) — Node 24 (`.nvmrc`) |
| **Calidad** | ESLint 9 (flat config `eslint.config.mjs`), TypeScript, Vitest (`tests/`) |

### Librerías clave
- `react-advanced-cropper` — selección del área de recorte en admin (`CropModal`, `MultiContextCropModal`)
- `sharp` — recorte real en servidor (`/api/crop`) y generación de la imagen social (`scripts/generate-social-preview.mjs`)
- `@vercel/blob` — upload/delete de imágenes en Vercel Blob
- `@neondatabase/serverless` — driver SQL para Neon Postgres
- `@tiptap/*` — editor de texto enriquecido (`RichTextEditor`); `sanitize-html` limpia el HTML al mostrarlo (`renderRichText`)
- `@dnd-kit/*` — reordenación drag & drop en admin de Ecosistema
- `date-fns` + `date-fns-tz` — fechas en zona `Europe/Madrid` (`src/lib/dates.ts`)

### Estructura de Carpetas (actual)

```
autentizity/
├── AI_CONTEXT.md              # ← ESTE ARCHIVO
├── .github/workflows/ci.yml   # CI: tsc, lint, tests, build y pnpm audit
├── eslint.config.mjs          # ESLint (next/core-web-vitals + next/typescript)
├── scripts/                   # migrate.ts (migraciones en deploy), generate-social-preview.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout raíz (metadata, fuentes)
│   │   ├── robots.ts / sitemap.ts
│   │   ├── (public)/          # Web pública (layout con Header/Footer)
│   │   │   ├── page.tsx       # Home
│   │   │   ├── noticias/ eventos/ movimientos/ actividades/   # Listado + [slug]
│   │   │   ├── actividad/     # Hub de actividad
│   │   │   ├── ecosistema/ ranking/ unete/ about/
│   │   │   └── aviso-legal/ privacidad/ cookies/ codigo-etico/
│   │   ├── admin/             # Panel admin (protegido por middleware)
│   │   │   ├── login/         # Login admin
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── noticias/ eventos/ actividades/   # CRUD (hook useCrud)
│   │   │   ├── movimientos/   # CRUD + embajadores/actividades vinculadas
│   │   │   ├── ecosistema/    # Secciones + entidades (componentes en components/admin/ecosistema)
│   │   │   └── secciones/     # Visibilidad de secciones
│   │   └── api/
│   │       ├── noticias/ eventos/ movimientos/ actividades/ (+ [id]/)   # Re-exportan createContentRoutes()
│   │       ├── ecosistema/    # secciones + entidades
│   │       ├── sections/      # GET, PUT
│   │       ├── upload/        # POST → upload a Vercel Blob
│   │       ├── crop/          # POST → recorte con sharp y subida a Blob
│   │       ├── preview/       # Activa/desactiva draftMode (solo admin)
│   │       ├── auth/          # login/logout
│   │       ├── db/status/     # GET → diagnóstico de conexión BD
│   │       └── db/seed/       # POST (admin) → carga datos mock; 404 en producción
│   ├── components/
│   │   ├── admin/             # ImageUpload, CropModal, MultiContextCropModal, RichTextEditor, FormActions, AdminAlert...
│   │   │   └── ecosistema/    # SortableSection, SortableEntity, SectionFormModal, EntityFormModal
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Section, Card, FilterBar, PreviewToggle...
│   ├── hooks/
│   │   └── useCrud.ts         # useCrud/useList para el admin (errores en español)
│   ├── lib/
│   │   ├── types.ts           # Interfaces TypeScript
│   │   ├── utils.ts           # slugify, parseTags, stripHtml, formatDate...
│   │   ├── dates.ts           # Fechas en hora de Madrid (próximos/pasados/este mes)
│   │   ├── revalidate.ts      # revalidatePublicContent() tras mutaciones de contenido
│   │   ├── visibility.ts      # Filtrado de borradores
│   │   ├── ids.ts             # generateId() con crypto.randomUUID()
│   │   ├── request-json.ts    # fetch JSON del admin que comprueba res.ok
│   │   ├── auth/              # session.ts (token firmado), admin.ts (requireAdmin), preview.ts
│   │   ├── api/               # content-routes.ts (fábrica CRUD), content-resources.ts, validation.ts
│   │   └── data/
│   │       ├── db.ts           # getSQL() — conexión Neon
│   │       ├── schema.ts       # ensureSchema() (DDL idempotente) + MIGRATIONS (cambios de datos, una vez por id)
│   │       ├── migrate.ts      # runMigrations() — ejecutor usado por scripts/migrate.ts
│   │       ├── rehost-images.ts # rehostExternalImages() — sube a Blob las imágenes externas (en el deploy)
│   │       ├── store.ts        # CRUD de todas las tablas
│   │       ├── sections.ts     # Visibilidad de secciones
│   │       ├── cleanup.ts      # cleanupOrphanImage() — borra blobs huérfanos
│   │       ├── image-cleanup.ts # Limpieza de imágenes reemplazadas/borradas
│   │       └── mock.ts         # Datos mock (usados por /api/db/seed)
│   └── middleware.ts          # Protege /admin (excepto /admin/login) y las mutaciones de la API con la cookie firmada "admin_session"
├── tests/                     # Vitest
├── public/
│   ├── images/                # logo-transparent.png, og-autentizity-v3.png
│   ├── logos/                 # Logos de entidades
│   └── documents/             # PDFs (código ético)
├── docs/                      # Documentación adicional
├── design/                    # Recursos de diseño
└── package.json
```

---

## 🗄️ Base de Datos — Neon Postgres

### Tablas principales

| Tabla | Columnas de imagen |
|-------|-------------------|
| `eventos` | `cover_image`, `cover_image_original`, `cover_image_hero`, `cover_image_hero_desktop`, `cover_image_card` |
| `noticias` | ídem |
| `movimientos` | ídem |
| `actividades` | ídem |
| `ecosistema_secciones` | (sin imágenes) |
| `ecosistema_entidades` | `logo_url TEXT` |
| `sections` | (visibilidad de secciones públicas) |
| `movimiento_embajadores` | M:N movimiento ↔ entidad |
| `movimiento_actividades` | M:N movimiento ↔ actividad |

### Migraciones

Las migraciones son **automáticas en cada deploy de producción**: el script `build` de `package.json` (`tsx scripts/migrate.ts && next build`) las ejecuta antes de `next build`, así las páginas prerenderizadas ya usan los datos migrados. No hay botón ni endpoint manual.

- Solo se ejecutan si `VERCEL_ENV=production` (o `RUN_MIGRATIONS=1`). En local, CI y previews de Vercel (que pueden compartir la BD de producción) se omiten con el log `skipping migrations`.
- En producción, si falta `DATABASE_URL` o una migración falla, el build termina con error y sigue publicada la versión anterior.
- Todo corre en **una transacción** con `pg_advisory_xact_lock` (conexión WebSocket de Neon): si algo falla no se aplica nada, y dos deploys simultáneos se esperan entre sí.
- `ensureSchema()` en `src/lib/data/schema.ts` ejecuta en cada deploy el DDL idempotente (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN IF NOT EXISTS`) y crea `schema_migrations`.
- Los cambios de datos van en la lista `MIGRATIONS` del mismo archivo y se ejecutan **una sola vez por `id`** (registrado en `schema_migrations`). **Para añadir una migración, añádela al final de la lista**; nunca edites ni reordenes las ya aplicadas.
- Deben ser compatibles con la versión publicada (solo añadir), porque se aplican antes de que el nuevo código esté en línea.
- Ejecución manual: `RUN_MIGRATIONS=1 DATABASE_URL=... pnpm migrate`.
- El Build Command del proyecto en Vercel debe ser el predeterminado (`pnpm build`); si se sobrescribe, las migraciones no se ejecutan.
- Tras las migraciones, el mismo script ejecuta `rehostExternalImages()` (`src/lib/data/rehost-images.ts`): busca en las columnas de imagen (`cover_image*` y `ecosistema_entidades.logo_url`, no el HTML de `content`) URLs http(s) que no son de Vercel Blob (p. ej. imgur), las descarga una vez cada una, las valida con `sharp` (PNG/JPEG/WebP/GIF, máx. 10 MB), las sube a Blob en `rehosted/` y actualiza todas las columnas que las usan. Mismas condiciones (`VERCEL_ENV=production` o `RUN_MIGRATIONS=1`) y además necesita `BLOB_READ_WRITE_TOKEN`. **No es fatal**: si una imagen falla solo se avisa (`[rehost-images] warning: …`) y el deploy sigue; el resumen sale como `[rehost-images] rehosted N, failed M`. Es idempotente y nunca borra nada.

### Acceso a datos
- `store.ts` usa SQL crudo. Los borrados usan `RETURNING id` y devuelven si se borró algo (la API responde 404 si no existía).
- Las relaciones M:N (`movimiento_embajadores`, `movimiento_actividades`) se reescriben en una transacción (`sql.transaction`).
- IDs nuevos: `generateId()` de `src/lib/ids.ts` (`crypto.randomUUID()`, con prefijo opcional p. ej. `eco_…`).

---

## 🖼️ Sistema de Imágenes y Recorte

### Flujo de upload + crop

1. Usuario selecciona archivo en `ImageUpload`
2. **Original se sube primero** a Vercel Blob (`/api/upload`)
3. Se abre `CropModal` (un solo encuadre) o `MultiContextCropModal` (hero móvil 16:10, hero escritorio 3.5:1 y tarjeta 2.5:1), ambos con `react-advanced-cropper`
4. Las áreas elegidas se envían a `/api/crop`, que recorta con `sharp` (JPEG) y sube cada recorte a Vercel Blob
5. Las URLs se persisten en BD:
   - `cover_image` = imagen principal (hero)
   - `cover_image_hero` / `cover_image_hero_desktop` / `cover_image_card` = recortes por contexto
   - `cover_image_original` = URL original (para re-recortar)
6. Al reemplazar o borrar contenido, `src/lib/data/image-cleanup.ts` borra los blobs que ya no se usan (`cleanupOrphanImage()`)

### Componentes clave
- `src/components/admin/ImageUpload.tsx` — componente principal de subida
- `src/components/admin/CropModal.tsx` / `MultiContextCropModal.tsx` — selección del recorte
- `src/app/api/crop/route.ts` — recorte con `sharp`
- `src/app/api/upload/route.ts` — endpoint de upload a Vercel Blob
- `src/lib/data/cleanup.ts` — `cleanupOrphanImage()` — borra blobs no referenciados

### Re-crop (recortar de nuevo)
- El botón "Recortar" en el admin usa `cover_image_original` como fuente
- El usuario puede hacer zoom out y redefinir el área de recorte desde la original
- Los nuevos recortes reemplazan a los anteriores; la original se mantiene

---

## 📰 Modelo de Datos (TypeScript)

```typescript
// Todos los contenidos con portada tienen además:
// coverImageHero, coverImageHeroDesktop y coverImageCard (string)

interface News {
  id: string; slug: string; title: string; excerpt: string; content: string;
  coverImage: string; coverImageOriginal: string; tags: string[];
  author: string; publishedAt: string; updatedAt: string;
  featured: boolean; status: "draft" | "published"; movimientoId: string;
}

interface Event {
  id: string; slug: string; title: string; description: string; content: string;
  coverImage: string; coverImageOriginal: string;
  startDate: string; endDate: string; location: string;
  type: "presencial" | "virtual" | "híbrido"; tags: string[];
  organizer: string; registrationUrl: string;
  featured: boolean; status: "draft" | "published" | "cancelled"; movimientoId: string;
}

interface Movement {
  id: string; slug: string; title: string; description: string; content: string;
  coverImage: string; coverImageOriginal: string; tags: string[];
  status: "draft" | "published"; featured: boolean;
}

interface Activity {
  id: string; slug: string; title: string; description: string; content: string;
  coverImage: string; coverImageOriginal: string; tags: string[];
  status: "draft" | "published"; featured: boolean;
  buttonText: string; buttonUrl: string;
}

interface EcosistemaSection {
  id: string; name: string; slug: string; description: string;
  sort_order: number; active: boolean;
}

interface EcosistemaEntity {
  id: string; section_id: string; name: string; logo_url: string;
  description: string; tags: string[]; sort_order: number; active: boolean;
}
```

### Naming convention
- TypeScript: `camelCase` (ej. `coverImage`, `coverImageOriginal`, `movimientoId`)
- Base de datos: `snake_case` (ej. `cover_image`, `cover_image_original`, `movimiento_id`)
- Los row mappers en `store.ts` convierten entre ambos

---

## 🎨 Diseño

### Colores
- Primario: `#013F3F` (verde oscuro)
- Secundario: `#E8788A` (rosa)
- Terciario: `#E8C547` (amarillo)
- Accent: `#0F9181` (teal)
- Definidos como variables `--color-*` en `src/app/globals.css` (Tailwind 4 `@theme`)

### Variante de fondos blancos (`?color=blanco`)
- Prueba para el cliente: `?color=blanco` en cualquier URL pública pone en blanco todos los fondos gris/crema (`--color-surface*`). Persiste en la pestaña (sessionStorage `autentizity-fondo`); `?color=gris` o `?color=normal` la desactiva.
- Lógica en `src/lib/fondo.ts` (`resolveFondo`, script inline anti-parpadeo), aplicada en `src/app/(public)/layout.tsx` con `FondoSwitch` (quita el atributo al salir a `/admin`). CSS: `html[data-fondo="blanco"]` en `globals.css`. No usa searchParams en servidor: las rutas siguen estáticas/ISR.

### Tipografía
- Títulos: Montserrat (`--font-serif`, clase `font-serif`)
- Cuerpo: Poppins (`--font-sans`)
- Se cargan desde Google Fonts con un `<link>` en `src/app/layout.tsx`

---

## 🔐 Admin Auth

- Middleware (`src/middleware.ts`) protege todas las rutas `/admin/*` excepto `/admin/login` y los métodos no públicos de `/api/*`
- Además, cada handler que muta datos (POST/PUT/DELETE) llama a `requireAdmin(request)` de `src/lib/auth/admin.ts`
- Sesión: cookie httpOnly `admin_session` con token `exp.nonce.hmac` firmado con HMAC-SHA256 (`src/lib/auth/session.ts`, Web Crypto), caduca a las 8 h
- Variables de entorno obligatorias: `ADMIN_USER`, `ADMIN_PASS` y `SESSION_SECRET` (sin valor por defecto: si falta, el login devuelve 500 y nadie entra al admin)
- Borradores: las APIs públicas y las páginas `[slug]` solo muestran contenido `published` (o `cancelled`); con sesión de admin las APIs devuelven todo (`src/lib/visibility.ts`)
- Vista previa: `PreviewToggle` llama a `/api/preview?enable=1&redirect=/ruta`, que activa `draftMode()` solo con sesión válida; las páginas usan `isAdminPreview()` (`src/lib/auth/preview.ts`)
- Sin roles complejos, sin registro público

---

## 🧭 Convenciones

- **Idioma código**: Inglés
- **Idioma UI**: Español
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Componentes**: Functional components con TypeScript, "use client" donde sea necesario
- **Estilos**: Tailwind utility-first, clases en español para labels/textos de UI
- **Rutas**: Español para URLs públicas (`/noticias`, `/eventos`, `/movimientos`, `/actividades`, `/ecosistema`, `/ranking`, `/unete`)
- **API routes**: Next.js App Router route handlers. Noticias, eventos, movimientos y actividades usan `createContentRoutes()` (`src/lib/api/content-routes.ts`): `requireAdmin`, filtrado de borradores, validación mínima del body (400 en español), 404 si no existe, 409 si el slug ya existe, limpieza de imágenes y `revalidatePublicContent()`. Configuración por recurso en `content-resources.ts`
- **Admin**: `useCrud`/`useList` (`src/hooks/useCrud.ts`) y `requestJson` comprueban `res.ok`; si falla, el formulario sigue abierto y muestra el error en español
- **Caché ISR**: toda mutación de contenido público llama a `revalidatePublicContent()` justo antes de responder con éxito
- **Fechas**: `startDate`/`endDate` se guardan sin zona (`YYYY-MM-DDTHH:mm`) y se interpretan como hora de Madrid (`Europe/Madrid`); usar `@/lib/dates` y `formatDate`/`formatDateTime`, nunca `new Date(e.startDate)` directo
- **Imágenes**: el optimizador de `next/image` solo acepta rutas locales y Vercel Blob (`images.remotePatterns`). Toda `<Image>` con URL de la BD debe llevar `unoptimized={!isOptimizableImage(src)}` (`@/lib/images`) para que las URLs externas (p. ej. imgur) las cargue el navegador directamente (CSP `img-src https:`)
- **Sin comentarios** en el código a menos que sea estrictamente necesario
- **NO crear archivos .md de documentación** a menos que se pida explícitamente

---

## ✅ Calidad y CI

```bash
pnpm lint          # eslint .
npx tsc --noEmit   # tipos
pnpm test          # vitest run
pnpm build         # migraciones (solo en producción) + next build, que también ejecuta ESLint: un error de lint rompe el deploy
pnpm audit --prod --audit-level=high
```

- CI: `.github/workflows/ci.yml` ejecuta todo lo anterior en cada push y PR a `main` (Node 24 de `.nvmrc`, pnpm 12.21.0, `pnpm install --frozen-lockfile`). No necesita secretos: las migraciones se omiten fuera de producción y sin `DATABASE_URL` el build solo avisa.
