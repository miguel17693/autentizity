# Hechos - 3ª Revisión

## Completado
- [x] 1. Database schema: movimientos, actividades, junction tables (movimiento_embajadores, movimiento_actividades), nuevos campos (movimiento_id, tags)
- [x] 2. TypeScript types: Movement, Activity, campos nuevos en News/Event/EcosistemaEntity
- [x] 3. Data store: CRUD completo para movimientos y actividades + queries de relaciones
- [x] 4. API routes: /api/movimientos CRUD, actualizados eventos/noticias con movimiento_id
- [x] 5. Admin: página CRUD de Movimientos + sidebar link
- [x] 6. Public: página de detalle de Movimiento (/movimientos/[slug]) con embajadores, actividades, noticias, eventos relacionados, email a comunidad@autentizity.org
- [x] 7. Noticias: dropdown de Movimiento en el editor del backoffice
- [x] 8. Eventos: dropdown de Movimiento en el editor del backoffice
- [x] 9. Eventos: fecha fin = fecha inicio + 2h (auto-fill al crear)
- [x] 10. Diseño: bordes redondeados globales (CSS variables + base layer para inputs, textareas, selects, botones)
- [x] 11. Header: fondo verde (#013F3F) al inicio, blanco al hacer scroll, logo y texto se adaptan
- [x] 12. Logos: quitado fondo blanco de los logos (bg-white eliminado)
- [x] 13. Empresas: ya se mostraban todas de BBDD (era dinámico, sin límite)
- [x] 14. Embajadores: foto de perfil se muestra cuando hay logo_url (AvatarPlaceholder)
- [x] 15. Embajadores: campo tags/expertise en el editor de entidades del ecosistema
- [x] 16. ImageUpload: se guarda imagen original + recorte, se puede recortar de nuevo sin resubir, vista previa
- [x] 17. Dashboard admin: añadida card de Movimientos
- [x] 18. Movimientos en listado: se cargan desde BBDD (ya no hardcodeados), clickeables a /movimientos/[slug]
- [x] 19. Noticias detalle: muestra a qué movimiento pertenece
- [x] 20. Eventos detalle: muestra a qué movimiento pertenece

## Pendiente de clarificar (ver dudas.md)
- Actividades: ¿entidad propia con página de detalle y CRUD? Ya está la tabla y types creados, falta el admin CRUD y la página pública.
- Hero y Estadísticas: explicados (son secciones toggleables en backoffice > Secciones)
