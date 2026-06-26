# Plan de Acción Seguridad — AutentiZity

**Puntuación actual: 35/100**  
**Objetivo: +90/100**

---

## CRÍTICO (hacer AHORA — posibles ataques reales)

### 1. Proteger TODAS las rutas de API con login
**Dónde:** `src/middleware.ts`  
**Problema:** El middleware solo protege `/admin/*`. Cualquiera puede llamar a `/api/noticias`, `/api/eventos`, etc. y crear, modificar o borrar contenido sin contraseña.

**Qué hacer:** Ampliar el matcher del middleware para que también cubra `/api/*`. El código actual:

```ts
// ANTES (líneas 1-22 actuales):
export const config = { matcher: ["/admin/:path*"] };

// DESPUÉS:
export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
```

Y añadir al principio del middleware que las rutas `/api/auth/login` y `/api/auth/logout` se salten la comprobación. Las peticiones GET públicas (noticias, eventos, etc.) también deberían estar permitidas sin login.

**Tiempo:** 30 min  
**Archivos:** `src/middleware.ts`

---

### 2. Sanitizar el HTML antes de mostrarlo (XSS)
**Dónde:** `src/lib/utils.ts` (función `renderRichText`)  
**Problema:** El HTML de la base de datos se muestra sin filtrar con `dangerouslySetInnerHTML` en 9 páginas públicas. Si alguien mete `<script>`, se ejecuta en todos los navegadores de los visitantes.

**Qué hacer:** El paquete `sanitize-html` YA está instalado pero NO se usa. Hay que importarlo y filtrar el HTML:

```ts
// Añadir al principio de utils.ts:
import sanitizeHtml from "sanitize-html";

// En la función renderRichText, cambiar:
return raw;  // línea 65 actual

// Por:
return sanitizeHtml(raw, {
  allowedTags: ["h1","h2","h3","h4","h5","h6","p","br","ul","ol","li",
    "blockquote","strong","em","u","s","a","img","iframe","div","span"],
  allowedAttributes: {
    a: ["href","title","target","rel"],
    img: ["src","alt","width","height"],
    iframe: ["src","width","height","allowfullscreen"],
  },
  allowedSchemes: ["http","https","mailto"],
  allowedIframeHostnames: ["www.youtube.com","www.youtube-nocookie.com"],
});
```

**Tiempo:** 15 min  
**Archivos:** `src/lib/utils.ts`

---

### 3. Sacar usuario y contraseña del código
**Dónde:** `src/app/api/auth/login/route.ts` (líneas 3-4)  
**Problema:** Pone `const ADMIN_USER = "admin"` y `const ADMIN_PASS = "admin1234"`. Está en el código fuente, visible para cualquiera que vea el repo.

**Qué hacer:**
1. Borrar esas 2 líneas
2. Cambiarlas por:
```ts
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
```
3. Añadir `ADMIN_USER` y `ADMIN_PASS` en las variables de entorno de Vercel
4. Usar una contraseña fuerte (ej: `openssl rand -base64 32`)

**Tiempo:** 10 min  
**Archivos:** `src/app/api/auth/login/route.ts` + Vercel dashboard

---

### 4. Arreglar la cookie de sesión
**Dónde:** `src/app/api/auth/login/route.ts` (línea 12) y `src/middleware.ts`  
**Problema:** La cookie vale literalmente `"authenticated"`. Cualquiera que lo sepa puede poner esa cookie en su navegador y entrar al admin.

**Qué hacer:** Generar un token aleatorio en vez del texto fijo:
```ts
// En login/route.ts:
import { randomBytes } from "crypto";
const token = randomBytes(32).toString("hex");
response.cookies.set("admin_session", token, {
  httpOnly: true, secure: true, sameSite: "lax",
  path: "/", maxAge: 8 * 60 * 60,
});

// En middleware.ts, guardar los tokens válidos (mientras no haya Redis):
const validSessions = new Set<string>();
// Al hacer login: validSessions.add(token)
// Al comprobar: validSessions.has(session.value)
```

**Tiempo:** 20 min  
**Archivos:** `src/app/api/auth/login/route.ts`, `src/middleware.ts`

---

## ALTO (hacer esta semana)

### 5. Eliminar la fuga de URL de base de datos
**Dónde:** `src/app/api/db/status/route.ts` (línea ~27)  
**Problema:** El endpoint `/api/db/status` devuelve los primeros 30 caracteres de la URL de la base de datos, que incluyen usuario y parte de la contraseña.

**Qué hacer:** Borrar la línea `dbUrl: \`${dbUrl!.substring(0, 30)}...\`,`.

**Tiempo:** 2 min  
**Archivos:** `src/app/api/db/status/route.ts`

---

### 6. Proteger el endpoint de crop (SSRF)
**Dónde:** `src/app/api/crop/route.ts` (línea ~29)  
**Problema:** Acepta cualquier URL y la descarga. Un atacante podría apuntar a servicios internos.

**Qué hacer:** Validar que la URL es de Vercel Blob antes de descargar:
```ts
const parsed = new URL(imageUrl);
if (!parsed.hostname.endsWith("public.blob.vercel-storage.com")) {
  return NextResponse.json({ error: "URL no permitida" }, { status: 400 });
}
```

**Tiempo:** 10 min  
**Archivos:** `src/app/api/crop/route.ts`

---

### 7. Proteger los endpoints de base de datos
**Dónde:** `src/app/api/db/setup/route.ts` y `src/app/api/db/seed/route.ts`  
**Problema:** Sin protección. Cualquiera puede crear tablas o insertar datos.

**Qué hacer:** Añadir comprobación de admin al principio (estos endpoints quedan protegidos automáticamente cuando hagas el punto 1).

**Tiempo:** Ya cubierto con el punto 1.

---

## MEDIO (hacer próximas 2 semanas)

### 8. Añadir rate limiting (evitar ataques de fuerza bruta)
**Qué:** Limitar intentos de login (5 intentos cada 15 min por IP).  
**Tiempo:** 1 h  
Se puede hacer con una librería o con un Map en memoria.

### 9. Añadir cabeceras de seguridad (CSP, HSTS...)
**Dónde:** `next.config.ts`  
**Qué:** Añadir función `headers()` con Content-Security-Policy, X-Content-Type-Options, X-Frame-Options...  
**Tiempo:** 20 min

### 10. Validar que los archivos subidos son imágenes de verdad
**Dónde:** `src/app/api/upload/route.ts`  
**Problema:** Solo comprueba el MIME type, que se puede falsificar.  
**Qué:** Usar `sharp` (ya instalado) para verificar que el archivo es una imagen real:
```ts
const buffer = Buffer.from(await file.arrayBuffer());
await sharp(buffer).metadata(); // lanza error si no es imagen
```
**Tiempo:** 15 min

---

## BAJO (ir haciendo)

### 11. No mostrar errores internos al usuario
Varias rutas devuelven el mensaje de error completo (`error.message`). Cambiar por mensajes genéricos ("Error interno") y loguear el detalle solo en servidor.

### 12. Sanitizar nombres de archivo en uploads
En vez de usar `file.name` tal cual, limpiar caracteres especiales.

---

## Orden de ejecución recomendado

```
DÍA 1 (2h):    Puntos 1 → 3 → 4 → 2
               (Middleware + Credenciales + Sesión + XSS)
               Después de esto el site es razonablemente seguro.

DÍA 2 (1h):    Puntos 5 → 6 → 7
               (Fugas de info + SSRF + DB endpoints)

DÍA 3 (2h):    Puntos 8 → 9 → 10
               (Rate limiting + Headers + Upload)
```

---

## Resumen

| Prioridad | Tareas | Tiempo total |
|-----------|--------|--------------|
| CRÍTICO | 4 tareas | ~1h 15min |
| ALTO | 3 tareas | ~45 min |
| MEDIO | 3 tareas | ~2h |
| BAJO | 2 tareas | ~30 min |
| **TOTAL** | | **~4.5 horas** |
