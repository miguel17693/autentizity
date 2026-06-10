# Image Upload + Cleanup — Plan de Implementación

> **Goal:** Reemplazar el campo `coverImage` (URL a mano) por un sistema de subida de imágenes con Vercel Blob, preview visual, y cleanup automático de imágenes huérfanas.

**Architecture:** API route `/api/upload` recibe el archivo → lo guarda en Vercel Blob → devuelve URL. El componente `ImageUpload` reemplaza el `<input>` de URL con drag & drop + preview. Al eliminar/actualizar un evento/noticia, se verifica si la imagen antigua es huérfana y se borra del blob.

**Tech Stack:** Next.js 15, React 19, Vercel Blob (`@vercel/blob`), Tailwind 4

---

### Task 1: Instalar `@vercel/blob` y crear API route de upload

**Objective:** API endpoint que recibe un archivo, lo sube a Vercel Blob, devuelve la URL.

**Files:**
- Modificar: `package.json` (deps)
- Crear: `src/app/api/upload/route.ts`

### Task 2: Crear componente `ImageUpload` con drag & drop + preview

**Objective:** Componente reutilizable que muestra preview de imagen (si hay URL), zona de drop para subir, y fallback de pegar URL manual.

**Files:**
- Crear: `src/components/admin/ImageUpload.tsx`

### Task 3: Integrar `ImageUpload` en admin/eventos y admin/noticias

**Objective:** Reemplazar el `<input type="text">` de coverImage por `<ImageUpload>` en ambos forms.

**Files:**
- Modificar: `src/app/admin/eventos/page.tsx`
- Modificar: `src/app/admin/noticias/page.tsx`

### Task 4: Añadir lógica de cleanup de imágenes huérfanas

**Objective:** Al borrar un evento/noticia o cambiar su `coverImage`, si la URL vieja no la usa ningún otro registro, eliminarla del blob storage.

**Files:**
- Modificar: `src/lib/data/store.ts` (añadir helper `cleanupOrphanImage`)
- Modificar: `src/app/api/eventos/[id]/route.ts` (DELETE handler)
- Modificar: `src/app/api/noticias/[id]/route.ts` (DELETE handler)

### Task 5: Verificación

**Objective:** Subir imagen de prueba, ver preview, guardar evento, confirmar que la imagen persiste en el front, borrar evento y confirmar cleanup.

---

**Verificación final:** `pnpm build` debe pasar sin errores.
