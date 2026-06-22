# Hechos - 3ª Revisión

## Completado
- [x] 1. Database schema: movimientos, actividades, junction tables (movimiento_embajadores, movimiento_actividades), nuevos campos (movimiento_id, tags)
- [x] 2. TypeScript types: Movement, Activity, campos nuevos en News/Event/EcosistemaEntity
- [x] 3. Data store: CRUD completo para movimientos y actividades + queries de relaciones
- [x] 4. API routes: /api/movimientos, /api/actividades CRUD
- [x] 5. Admin: páginas CRUD de Movimientos y Actividades + sidebar links
- [x] 6. Public: páginas de detalle de Movimiento y Actividad con relaciones
- [x] 7. Actividad page: secciones Eventos + Movimientos + Actividades desde BBDD
- [x] 8. Noticias/Eventos: dropdown de Movimiento en editor backoffice
- [x] 9. Eventos: fecha fin = fecha inicio + 2h (auto-fill al crear)
- [x] 10. Diseño: bordes redondeados — rounded-2xl en todas las cards, rounded-full en todos los botones y CTAs, header dropdown redondeado
- [x] 11. Diseño: nuevos colores —rose (#E8788A) y —gold (#E8C547)
- [x] 12. Header: fondo sólido bg-primary, sin borde inferior, mismo color que hero, fusionado
- [x] 13. Header: logo más pequeño (max-h-10/12/14) + header menos alto (h-16/18/20)
- [x] 14. Header: cambia de color según fondo detrás (IntersectionObserver) — blanco detrás→header verde, oscuro detrás→header blanco
- [x] 15. Logos: fondo blanco con rounded-2xl para todos
- [x] 16. Embajadores: foto se muestra (Image con unoptimized para PNGs)
- [x] 17. Embajadores: expertise como texto libre debajo del nombre (campo description)
- [x] 18. Hero: fondo sólido bg-primary (sin gradiente) para fusión perfecta con header
- [x] 19. Nav: añadido Actividades al dropdown de Actividad
- [x] 20. ImageUpload: guarda original, recortar de nuevo sin resubir, vista previa
- [x] 21. Tipografía: quitado uppercase forzado de todos los h1/h2/h3
- [x] 22. DB error: arreglado fallo en /eventos al fallar getMovimientos/getActividades

## Dudas resueltas
- Actividades: creada tabla, types, API, admin CRUD, página pública (/actividades/[slug])
- Hero: ya se muestra, es la sección "Aceleradora de Impacto Social"
- Estadísticas: sección "home-stats" en backoffice > Secciones (toggle visible/oculto)
- Crop imágenes: confirmado el approach (original + crop, re-crop sin resubir)
- Embajadores expertise: simplificado a texto libre (campo description)
