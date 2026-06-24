# 🤖 AI CONTEXT — AutentiZity

> **Este archivo es el punto de entrada para la IA.** Léelo siempre antes de trabajar en el proyecto.
> Última actualización: 24 de junio de 2026

---

## 🚨 REGLAS ABSOLUTAS

- **SIEMPRE commitea y pushea** al terminar una tarea, sin preguntar. El usuario quiere commit + push automático.
- **El dominio de producción es `https://autentizity.vercel.app/`** (NO `.org`).
- **Para migraciones de BD**: visita `https://autentizity.vercel.app/api/db/setup` (devuelve `{"success":true}`).
- **Para diagnóstico de BD**: visita `https://autentizity.vercel.app/api/db/status`.
- **Idioma del código**: Inglés (variables, componentes, comentarios).
- **Idioma del contenido/UI**: Español.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).

---

## 📋 Resumen del Proyecto

**AutentiZity** es una **Aceleradora de Impacto Social** que acompaña a empresas en la consecución de objetivos de impacto social y mejora de cultura de empresa.

**Web**: https://autentizity.vercel.app/
**Contacto**: miguelgarzon@autentizity.org / comunidad@autentizity.org

### Qué es la web
Portal público **sin autenticación de usuarios** con:
- **Noticias** — artículos/blog posts
- **Eventos** — con calendario, filtros por tipo, botón "Inscríbete"
- **Movimientos** — páginas de movimiento con embajadores, actividades y noticias/eventos vinculados
- **Actividades** — contenido independiente con botón CTA
- **Ecosistema** — secciones dinámicas (Empresas Impulsoras, Entidades Colaboradoras...) con entidades (logo + nombre)
- **Ranking** — página de ranking "Authentic Leaders"
- **Únete** — página de contacto/registro
- **Panel de administración** — CRUD completo para todo lo anterior (protegido con sesión simple)

---

## 🏗️ Arquitectura Técnica

### Stack
| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS 4 |
| **Base de datos** | Neon Postgres (serverless) via `@neondatabase/serverless` |
| **Almacenamiento** | Vercel Blob (`@vercel/blob`) para imágenes |
| **ORM** | Ninguno — SQL crudo con tagged templates (`sql\`...\``) |
| **Hosting** | Vercel |
| **Package manager** | pnpm |

### Librerías clave
- `react-easy-crop` — recorte de imágenes en admin
- `@vercel/blob` — upload/delete de imágenes en Vercel Blob
- `@neondatabase/serverless` — driver SQL para Neon Postgres

### Estructura de Carpetas (actual)

```
autentizity/
├── AI_CONTEXT.md              # ← ESTE ARCHIVO
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Home
│   │   ├── noticias/          # Listado + [slug]
│   │   ├── eventos/           # Listado + [slug]
│   │   ├── movimientos/       # [slug]
│   │   ├── actividades/       # [slug]
│   │   ├── ecosistema/        # Página ecosistema
│   │   ├── ranking/           # Página ranking
│   │   ├── unete/             # Página únete
│   │   ├── about/             # Sobre nosotros
│   │   ├── admin/             # Panel admin (protegido por middleware)
│   │   │   ├── login/         # Login admin
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── noticias/      # CRUD noticias
│   │   │   ├── eventos/       # CRUD eventos
│   │   │   ├── movimientos/   # CRUD movimientos (con embajadores/actividades vinculadas)
│   │   │   ├── actividades/   # CRUD actividades
│   │   │   ├── ecosistema/    # CRUD secciones + entidades
│   │   │   └── secciones/     # Gestión de secciones visibles
│   │   └── api/               # API routes
│   │       ├── db/setup/      # GET → ejecuta initSchema() (migraciones)
│   │       ├── db/status/     # GET → diagnóstico de conexión BD
│   │       ├── db/seed/       # GET → carga datos mock en BD
│   │       ├── upload/        # POST → upload a Vercel Blob
│   │       ├── auth/          # login/logout
│   │       ├── eventos/       # GET (lista), POST (crear)
│   │       ├── eventos/[id]/  # GET, PUT, DELETE
│   │       ├── noticias/      # GET, POST
│   │       ├── noticias/[id]/ # GET, PUT, DELETE
│   │       ├── movimientos/   # GET, POST
│   │       ├── movimientos/[id]/ # GET, PUT, DELETE + embajadores/actividades
│   │       ├── actividades/   # GET, POST
│   │       ├── actividades/[id]/ # GET, PUT, DELETE
│   │       ├── ecosistema/    # secciones + entidades
│   │       └── sections/      # GET, PUT
│   ├── components/
│   │   ├── admin/             # AdminTable, ImageUpload, CropModal, MultiSelectCheckbox...
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Componentes base reutilizables
│   ├── lib/
│   │   ├── types.ts           # Interfaces TypeScript
│   │   ├── utils.ts           # slugify, etc.
│   │   ├── crop.ts            # getCroppedImg() — Canvas API cropping
│   │   └── data/
│   │       ├── db.ts           # getSQL() — conexión Neon
│   │       ├── schema.ts       # initSchema() — CREATE TABLE + ALTER TABLE migrations
│   │       ├── store.ts        # CRUD operations para todas las tablas
│   │       ├── cleanup.ts      # cleanupOrphanImage() — borra blobs huérfanos
│   │       └── mock.ts         # Datos mock (usados por /api/db/seed)
│   └── middleware.ts          # Protege /admin (excepto /admin/login) con cookie "admin_session"
├── public/
│   ├── images/                # Logo, iconos estáticos
│   └── fonts/                 # Chulapa, P22 Mackinac
├── docs/                      # Documentación adicional
├── design/                    # Recursos de diseño
└── package.json
```

---

## 🗄️ Base de Datos — Neon Postgres

### Tablas principales

| Tabla | Columnas de imagen |
|-------|-------------------|
| `eventos` | `cover_image TEXT`, `cover_image_original TEXT` |
| `noticias` | `cover_image TEXT`, `cover_image_original TEXT` |
| `movimientos` | `cover_image TEXT`, `cover_image_original TEXT` |
| `actividades` | `cover_image TEXT`, `cover_image_original TEXT` |
| `ecosistema_secciones` | (sin imágenes) |
| `ecosistema_entidades` | `logo_url TEXT` |
| `movimiento_embajadores` | M:N movimiento ↔ entidad |
| `movimiento_actividades` | M:N movimiento ↔ actividad |

### Migraciones

Las migraciones se ejecutan visitando `GET /api/db/setup`. El archivo `src/lib/data/schema.ts`:
1. Crea las tablas con `CREATE TABLE IF NOT EXISTS`
2. Ejecuta `ALTER TABLE ADD COLUMN IF NOT EXISTS` para columnas añadidas posteriormente

**Es idempotente** — se puede llamar múltiples veces sin romper nada.

---

## 🖼️ Sistema de Imágenes y Recorte

### Flujo de upload + crop

1. Usuario selecciona archivo en `ImageUpload`
2. **Original se sube primero** a Vercel Blob → URL se guarda en `originalUrlRef`
3. Se abre `CropModal` (usa `react-easy-crop`) con la imagen original
4. Usuario recorta → `getCroppedImg()` (Canvas API en `crop.ts`) genera un nuevo JPEG
5. **Imagen recortada se sube** a Vercel Blob como blob separado
6. `onChange(croppedUrl, originalUrl)` → ambas URLs se persisten en BD:
   - `cover_image` = URL recortada (la que se muestra)
   - `cover_image_original` = URL original (para re-recortar con zoom out)

### Componentes clave
- `src/components/admin/ImageUpload.tsx` — componente principal de subida
- `src/components/admin/CropModal.tsx` — modal de recorte con react-easy-crop
- `src/lib/crop.ts` — `getCroppedImg()` — recorte vía Canvas API
- `src/app/api/upload/route.ts` — endpoint de upload a Vercel Blob
- `src/lib/data/cleanup.ts` — `cleanupOrphanImage()` — borra blobs no referenciados

### Re-crop (recortar de nuevo)
- El botón "Recortar" en el admin usa `cover_image_original` como fuente
- El usuario puede hacer zoom out y redefinir el área de recorte desde la original
- La nueva imagen recortada reemplaza `cover_image`, la original se mantiene

---

## 📰 Modelo de Datos (TypeScript)

```typescript
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
- Secundario: `#965458` (rosa/granate)
- Accent: `#0F9181` (teal)

### Tipografía
- Títulos: P22 Mackinac
- Cuerpo: Source Sans Pro Semibold
- Complementaria: Chulapa (en `/public/fonts/`)

---

## 🔐 Admin Auth

- Middleware (`src/middleware.ts`) protege todas las rutas `/admin/*` excepto `/admin/login`
- Autenticación simple: cookie `admin_session=authenticated`
- Login en `/admin/login` con contraseña hardcodeada (variable de entorno `ADMIN_PASSWORD`)
- Sin roles complejos, sin registro público

---

## 🧭 Convenciones

- **Idioma código**: Inglés
- **Idioma UI**: Español
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Componentes**: Functional components con TypeScript, "use client" donde sea necesario
- **Estilos**: Tailwind utility-first, clases en español para labels/textos de UI
- **Rutas**: Español para URLs públicas (`/noticias`, `/eventos`, `/movimientos`, `/actividades`, `/ecosistema`, `/ranking`, `/unete`)
- **API routes**: Next.js App Router route handlers (`export async function GET/POST/PUT/DELETE`)
- **Sin comentarios** en el código a menos que sea estrictamente necesario
- **NO crear archivos .md de documentación** a menos que se pida explícitamente
