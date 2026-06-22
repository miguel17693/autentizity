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
- [x] 10. Diseño: bordes redondeados globales (!important en base layer)
- [x] 11. Diseño: nuevos colores —rose (#E8788A) y —gold (#E8C547)
- [x] 12. Header: fondo sólido bg-primary, sin borde inferior, mismo color que hero
- [x] 13. Header: logo más pequeño (max-h-10/12/14) + header menos alto (h-16/18/20)
- [x] 14. Logos: fondo blanco con rounded-2xl para todos
- [x] 15. Embajadores: foto se muestra (Image con unoptimized para PNGs)
- [x] 16. Embajadores: expertise como texto libre debajo del nombre (campo description)
- [x] 17. Hero: fondo sólido bg-primary (sin gradiente) para fusión perfecta con header
- [x] 18. Nav: añadido Actividades al dropdown de Actividad
- [x] 19. ImageUpload: guarda original, recortar de nuevo sin resubir, vista previa

## Dudas resueltas
- Actividades: creada tabla, types, API, admin CRUD, página pública (/actividades/[slug])
- Hero: ya se muestra, es la sección "Aceleradora de Impacto Social"
- Estadísticas: sección "home-stats" en backoffice > Secciones (toggle visible/oculto)
