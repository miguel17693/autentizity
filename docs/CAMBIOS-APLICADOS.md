# ✅ Cambios aplicados — Revisión web AutentiZity

**Fecha**: 9 de junio 2026
**Rama**: `main` (commit `fd95180`)
**Repositorio**: github.com/miguel17693/autentizity

---

## 🏠 HOME (`/`)

| Elemento | Cambio |
|---|---|
| Hero — subtítulo | **"autenticidad"** ahora en **negrita** `<strong>` |
| Hero — subtítulo | Texto: "Conectamos empresas, instituciones, asociaciones y profesionales en un ecosistema que promueve la **«autenticidad»**: poder ser tú, en tu lugar de trabajo" |

---

## 🌐 ECOSISTEMA (`/ecosistema`)

| Elemento | Antes | Ahora |
|---|---|---|
| Sección "Asociaciones" | ASOCIACIONES | **ENTIDADES COLABORADORAS** |
| Sección "Instituciones" | Instituciones | **Instituciones, Cámaras de Comercio y Asociaciones Corporativas** |
| Logos empresas | 8 placeholders "LOGO" | **4 logos reales**: ManpowerGroup, El Corte Inglés, MSD, Helion + 4 placeholders |

---

## 📅 EVENTOS (`/eventos`) — Sección Movimientos

| # | Antes | Ahora |
|---|---|---|
| 1 | Foro IAuthentiCity (IA & Uso Humano) | **AuthentiZity** + texto real sobre IA y ética |
| 2 | Nuestro Legado como Generación (Bullying) | **Nuestro Legado a las Siguientes Generaciones** + texto campaña bullying con It Gets Better |
| 3 | La Diversidad También es Autenticidad | Igual + texto real sobre interseccionalidad |
| 4 | ~~Interseccionalidad – Pride in the Zity~~ | **ELIMINADO** |
| 5 | Héroes Sin Capa (Prevención del Suicidio) | **Autenticos Héroes Sin Capa** + texto prevención suicidio |
| 6 | De Philadelphia a Madrid (VIH) | **De Philadelphia a Madrid** + texto I=I |
| 7 | ¡Sé tú! Liderazgo Auténtico | Igual + texto liderazgo auténtico |
| 8 | Espacios Seguros para el Error | Igual + texto espacios seguros |
| 9 | Keep the Calm & Less Burnout | Igual + texto burnout (7/10 afectados) |
| 10 | Mujeres Increíbles y Aliados | Igual + texto mujeres y aliados |

---

## 🏆 RANKING (`/ranking`)

| Elemento | Antes | Ahora |
|---|---|---|
| Título hero | Ranking Authentic Leaders | **Ranking líderes de la autenticidad** |
| Subtítulo hero | "Reconocemos a 100 líderes..." | "Los líderes que están redefiniendo la cultura empresarial en España" |
| Intro ranking | "Ranking Authentic Leaders" | **"Ranking Líderes de la Autenticidad"** |
| Categorías | "salud mental, bienestar, diversidad y liderazgo inclusivo" | "Bienestar Integral, Salud Mental, Diversidad, Equidad e Inclusión (DEI) y Liderazgo Auténtico" |
| Timeline paso 4 | "...Ranking Authentic Leaders" | "...Ranking líderes de la autenticidad" |
| CTA "¿Quieres participar?" | "...ranking Authentic Leaders..." | "...ranking líderes de la autenticidad..." |
| CTA subtítulo | "Presenta tu candidatura o ayúdanos a compartir..." | "Presenta tu candidatura o comparte este enlace con esa persona que inspira a otros a ser auténticos..." |
| Diploma — frase final | "Porque el verdadero liderazgo no se declara: se demuestra" | **"Cuando mejoramos la cultura corporativa de una empresa, también estamos impactando en positivo en la sociedad"** |

---

## 🤝 ÚNETE (`/unete`)

| Sección | Antes | Ahora |
|---|---|---|
| Empresas | "Empresas" + texto placeholder IA | **"Empresas que quieren liderar el cambio"** + texto real |
| Organizaciones | "Organizaciones" + texto placeholder IA | **"Organizaciones que generan impacto"** + texto real |
| Profesionales | "Profesionales" + texto placeholder IA | **"Profesionales que inspiran"** + texto real embajadores |

---

## 🔤 TIPOGRAFÍA

| Elemento | Antes | Ahora |
|---|---|---|
| Cuerpo / minúsculas | Source Sans 3 | **Poppins** (Google Fonts) |
| Títulos / mayúsculas | Fraunces | Fraunces (CHULAPA pendiente de archivo) |

---

## 🗄️ BACKEND

| Cambio | Detalle |
|---|---|
| Mock fallbacks **ELIMINADOS** | `store.ts` ahora lanza error si no hay `DATABASE_URL` — ya no hay fallos silenciosos |
| Fetch sin mocks | `eventos/page.tsx`, `noticias/page.tsx`, `page.tsx`, páginas `[slug]` — sin fallback a datos falsos |
| Mock data actualizado | `mock.ts` con nombres corregidos (solo usado por seed) |

---

## ⚠️ PENDIENTE

| Tarea |
|---|
| Archivo de fuente **CHULAPA** (.woff2/.otf) |
| Imágenes PNG de logos en `/public/logos/` (manpower.png, corteingles.png, msd.png, helion.png) |
| `DATABASE_URL` de Neon para conectar base de datos |
| Deploy en Vercel (token nuevo en https://vercel.com/account/tokens) |
| Componente upload/recorte de imágenes en admin |
| Sincronización back-office → front (depende de DATABASE_URL) |
