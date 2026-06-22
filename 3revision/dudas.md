# Dudas - 3ª Revisión

## 1. Actividades como entidad separada
Dices: "En actividad queremos eventos, movimientos y actividades" y luego "una actividad puede tener varios movimientos".
- ¿"Actividades" es una nueva entidad con su propia tabla, CRUD, y página de detalle?
- ¿Qué campos tiene una Actividad? ¿Es similar a Movimiento pero con fecha? ¿O es algo más simple?
- ¿La página de "Actividad" (actualmente /eventos) tendrá 3 secciones: Eventos, Movimientos (enlaces a sus páginas), y Actividades?

## 2. Foto de embajadores
Dices que "no se está viendo la foto de la persona". Actualmente cuando una entidad de la sección "embajadores" tiene `logo_url`, ¿debería mostrar esa imagen como foto de perfil (redonda) en vez del placeholder de avatar? ¿O hay otro campo para la foto? Actualmente solo hay `logo_url`.

## 3. Hero y Estadísticas en backoffice
- Hero: es la sección principal de la home. En backoffice > Secciones aparece como "home-hero". Sirve para ocultar/mostrar esa sección. ¿Necesitas poder editar su contenido?
- Estadísticas: es la sección "home-stats" con los números (40+ Embajadores, 12 Líneas, 10+ Empresas, 2026). También se puede ocultar/mostrar. ¿Necesitas poder editar esos números?

## 4. Crop de imágenes - aclaración
Para lo del crop: entiendo que quieres:
1. Al subir una imagen, se guarda la original
2. El usuario hace crop y se guarda la versión cropeada
3. El usuario puede volver a cropear desde la original sin tener que resubir
¿Confirmas? ¿La vista previa del crop debería ser un modal que muestre el contexto donde se verá (ej. card de evento)?

## 5. Embajadores con expertise/tags
Dices "molaría meterle también experties, etiquetas a parte de nombre y foto". ¿Las tags/expertise se añaden desde el admin de ecosistema al editar una entidad de la sección "embajadores"? ¿O prefieres un CRUD aparte específico para embajadores?
