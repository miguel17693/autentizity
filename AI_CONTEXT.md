# 🤖 AI CONTEXT — AuthentiZity

> **Este archivo es el punto de entrada para la IA.** Léelo siempre antes de trabajar en el proyecto.
> Última actualización: 3 de abril de 2026

---

## 📋 Resumen del Proyecto

**AuthentiZity** es una **Aceleradora de Impacto Social** que acompaña a empresas en la consecución de objetivos de impacto social y mejora de cultura de empresa, y ayuda a ONG y asociaciones a hablar un lenguaje corporativo, dentro de un espacio impulsado por instituciones y guiado por valores compartidos.

**Web**: www.autentizity.org
**Contacto**: miguelgarzon@autentizity.org / comunidad@autentizity.org

### Qué es la web
Portal público **sin autenticación de usuarios** que funciona como:
- **Noticias** (artículos/blog posts sobre impacto social, cultura corporativa, diversidad)
- **Eventos** (con sistema de calendario: desayunos, foros, galas, talleres)
- **Panel de administración** (para gestionar noticias y eventos)

**No hay login de usuarios públicos.** Solo el panel admin requiere autenticación.

### Ecosistema AuthentiZity
- **Empresas impulsoras** (grandes empresas que se adhieren)
- **Entidades colaboradoras** (instituciones, cámaras de comercio, asociaciones)
- **Media Partners y Social Media Partners**
- **Embajadores** (~40 profesionales referentes en diversas temáticas)
- **Ruta AuthentiZity 2026-2027**: programa anual de acciones de impacto social
- **Ranking 'Authentic Leaders'** (en colaboración con ManpowerGroup)
- **Diploma 'Empresa/Institución AuthentiZity'**

### Temáticas principales
- Salud mental y prevención del suicidio
- Diversidad (género, orientación sexual, intergeneracional, cultural, discapacidad, neurodiversidad)
- Feminismo en el ámbito corporativo
- Bienestar y liderazgo auténtico
- IA y humanismo (IAuthenticity)
- No discriminación VIH
- Pensamiento creativo y soft skills
- Diplomacia corporativa y derechos humanos

---

## 🎨 Referencias de Diseño

| Referencia | URL | Qué tomamos |
|-----------|-----|-------------|
| **myGwork** | https://mygwork.com/ | Funcionalidad de eventos y noticias: listados con filtros, búsqueda, cards, detalle de evento con calendario |
| **REDI LGBTI** | https://www.redi-lgbti.org/ | Estética: estilo corporativo-institucional limpio, paleta de colores, layout general, tono visual |

### Aspectos clave de myGwork (funcionalidad):
- **Eventos**: listado con búsqueda, filtros (virtual/presencial), cards con imagen+fecha+título, detalle con mapa/calendario
- **Noticias**: listado con búsqueda, cards con imagen+título+extracto, paginación, artículo completo con rich text
- Tags/categorías en ambos

### Aspectos clave de REDI (estética):
- Diseño limpio e institucional
- Colores corporativos con acento en azul
- Tipografía clara y profesional
- Secciones con fondo blanco/gris alterno
- Iconografía simple
- Footer informativo con redes sociales

---

## 🏗️ Arquitectura Técnica

### Stack
- **Framework**: Next.js 14+ (App Router)
- **Estilos**: Tailwind CSS 4
- **Lenguaje**: TypeScript
- **CMS/Backend**: Por decidir (opciones: Supabase, Payload CMS, o JSON/MDX estático para empezar)
- **Despliegue**: Por decidir (Vercel recomendado)

### Estructura de Carpetas

```
AuthentiZity/
├── AI_CONTEXT.md              # ← ESTE ARCHIVO (léelo siempre)
├── design/                    # Recursos de diseño (imágenes, mockups, assets del cliente)
│   ├── references/            # Screenshots y referencias visuales
│   ├── assets/                # Logos, iconos, imágenes proporcionadas
│   └── notes.md               # Notas de diseño y decisiones visuales
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Layout principal (header + footer)
│   │   ├── page.tsx           # Home
│   │   ├── noticias/          
│   │   │   ├── page.tsx       # Listado de noticias (con filtros y búsqueda)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Detalle de noticia
│   │   ├── eventos/           
│   │   │   ├── page.tsx       # Listado de eventos (con calendario y filtros)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Detalle de evento
│   │   ├── about/
│   │   │   └── page.tsx       # Sobre nosotros
│   │   └── admin/             # Panel de administración (protegido)
│   │       ├── layout.tsx     # Layout admin con sidebar
│   │       ├── page.tsx       # Dashboard admin
│   │       ├── noticias/
│   │       │   ├── page.tsx   # CRUD noticias
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       └── eventos/
│   │           ├── page.tsx   # CRUD eventos
│   │           └── [id]/
│   │               └── page.tsx
│   ├── components/
│   │   ├── ui/                # Componentes base (Button, Card, Input, Modal...)
│   │   ├── layout/            # Header, Footer, Sidebar, Navigation
│   │   ├── noticias/          # NewsCard, NewsList, NewsFilters
│   │   ├── eventos/           # EventCard, EventList, EventCalendar, EventFilters
│   │   └── admin/             # AdminTable, AdminForm, RichTextEditor
│   ├── lib/                   # Utilidades, API clients, helpers
│   │   ├── types.ts           # Tipos TypeScript (Event, News, etc.)
│   │   ├── utils.ts           # Funciones helper
│   │   └── data/              # Mock data / data access layer
│   ├── hooks/                 # Custom React hooks
│   └── styles/
│       └── globals.css        # Estilos globales + Tailwind config
├── public/
│   ├── images/                # Imágenes estáticas
│   └── fonts/                 # Fuentes custom si las hay
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md                  # README público del proyecto
```

---

## 📰 Modelo de Datos

### Noticia (News)
```typescript
interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;        // Resumen corto
  content: string;        // Contenido completo (rich text / markdown)
  coverImage: string;     // URL imagen de portada
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;      // Para destacar en home
  status: 'draft' | 'published';
}
```

### Evento (Event)
```typescript
interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;    // Descripción corta
  content: string;        // Detalle completo (rich text / markdown)
  coverImage: string;
  startDate: Date;
  endDate: Date;
  location: string;       // Dirección o "Online"
  type: 'presencial' | 'virtual' | 'híbrido';
  tags: string[];
  organizer: string;
  registrationUrl?: string; // Link externo de registro si aplica
  featured: boolean;
  status: 'draft' | 'published' | 'cancelled';
}
```

---

## 🛤️ Líneas de Trabajo (Roadmap)

### Fase 1 — Estructura y Diseño Base ← **ESTAMOS AQUÍ**
- [x] Crear estructura del proyecto
- [ ] Definir paleta de colores y tipografía
- [ ] Diseñar layout principal (Header + Footer)
- [ ] Crear página Home
- [ ] Crear componentes UI base

### Fase 2 — Noticias
- [ ] Listado de noticias con cards
- [ ] Filtros y búsqueda
- [ ] Página de detalle de noticia
- [ ] Mock data para desarrollo

### Fase 3 — Eventos
- [ ] Listado de eventos con cards
- [ ] Sistema de calendario (vista mensual)
- [ ] Filtros (presencial/virtual/fecha)
- [ ] Página de detalle de evento
- [ ] Mock data para desarrollo

### Fase 4 — Panel Admin
- [ ] Autenticación admin (simple, sin registro público)
- [ ] Dashboard con estadísticas básicas
- [ ] CRUD de noticias (con editor rich text)
- [ ] CRUD de eventos
- [ ] Gestión de imágenes

### Fase 5 — Backend y Persistencia
- [ ] Elegir e integrar backend/CMS
- [ ] API routes o integración directa
- [ ] Gestión de archivos/imágenes

### Fase 6 — Polish y Deploy
- [ ] SEO y meta tags
- [ ] Responsive final
- [ ] Performance optimization
- [ ] Despliegue

---

## 🎯 Decisiones Pendientes

| Decisión | Opciones | Estado |
|----------|----------|--------|
| Paleta de colores | Verde oscuro #013F3F + rosa/granate #965458 + teal #0F9181 | ✅ Extraída del branding |
| Tipografía títulos | P22 Mackinac (verificar licencia web) | ✅ Definida |
| Tipografía cuerpo | Source Sans Pro Semibold (Google Fonts) | ✅ Definida |
| Tipografía complementaria | Chulapa (CC BY 4.0, en /public/fonts/) | ✅ Disponible |
| Logo | /public/images/logo.png + logo-full.png | ✅ Disponible |
| Backend/CMS | Supabase / Payload CMS / MDX estático | ⏳ Por decidir |
| Hosting | Vercel / Netlify / otro | ⏳ Por decidir |
| Nombre del proyecto | AuthentiZity | ✅ Decidido |
| Idioma del contenido | Español (principal) — posible bilingüe en futuro | ✅ Español |

---

## 📁 Carpeta `design/`

Esta carpeta es para que el cliente suba:
- Screenshots de referencia
- Logos y branding
- Paleta de colores
- Mockups o bocetos
- Cualquier recurso visual

La IA leerá esta carpeta para informar las decisiones de diseño.

---

## 🧭 Convenciones

- **Idioma del código**: Inglés (nombres de variables, componentes, etc.)
- **Idioma del contenido/UI**: Por decidir (probablemente español)
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Componentes**: Functional components con TypeScript
- **Estilos**: Tailwind utility-first, componentes extraídos cuando se repiten
- **Rutas**: Español para URLs públicas (`/noticias`, `/eventos`)
