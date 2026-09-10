# AutentiZity — Cambios de «QA Revisión 3»

## Alcance y criterio

- Documento: `QA Revisión 3.docx.pdf`, 9 páginas revisadas visualmente, además de extraer el texto. Se han consultado también las capturas del movimiento y el retrato circular de referencia.
- El documento lleva `01/09/2027` en la primera página y solicita **2026** para Referentes. Se conserva **2026** como indica el cambio; no se ha inferido otra convocatoria.
- Se mantiene la rama de trabajo `diseño`, las rutas públicas existentes y los datos/relaciones del administrador.
- Se distinguen cambios de código, datos que requieren migración y decisiones pendientes. No se ha creado un formulario que aparente enviar solicitudes sin un destino definido.

## Home / Aceleradora

- **H01 · Página 1 — Aplicado:** `«autenticidad»` pasa a `autenticidad` en el hero.
- **H02 · Página 1 — Aplicado:** el botón `Próximos eventos` pasa a `Movimientos Corporativos` y enlaza a `/actividad/movimientos`.
- **H03 · Páginas 1 y 9 — Parcial:** añadido botón píldora `Únete` debajo de los otros botones. Enlaza a `/unete`; el formulario general de adhesión sigue pendiente de definición.
- **H04 · Página 1 — Aplicado:** sustituidos los dos párrafos introductorios por el texto del PDF, con puntos finales y la misma tipografía, tamaño e interlineado.
- **H05 · Página 2 — Parcial:** actualizado el nombre a `Referentes de la autenticidad 2026` y `Diploma “Empresa AutentiZity”`, también en navegación. La coletilla del partner requiere confirmación: el PDF dice literalmente `Referentes de la Autenticidad – AutentiZity & Manpower de la Autenticidad`. No se ha publicado esa duplicación ni inventado su corrección. La colaboración con ManpowerGroup sigue figurando en la página de Referentes.
- **H06 · Página 2 — Aplicado:** renombrada la sobrelínea `Agenda` a `Movimientos Corporativos`. El PDF solo pide cambiar esa etiqueta: se conserva el bloque de próximos eventos y actividades y su enlace a la agenda, sin sustituir sus datos por otro contenido.

### Texto introductorio aplicado

> AutentiZity es el punto de encuentro entre los valores de la sociedad y la cultura de las empresas. Impulsamos una cultura empresarial basada en lo que nos une, aquello que nos identifica, nos hace únicos y nos posiciona en el mundo.

> Contribuimos a crear entornos laborales más humanos, en los que cada persona pueda mostrarse tal como es. En este camino nos acompañan empresas, instituciones asociaciones y profesionales.

## Ecosistema

- **E01 · Página 2 — Migración preparada, pendiente de activación en la base de datos:** nuevo texto de Empresas Impulsoras:

  > Empresas comprometidas con la construcción de culturas corporativas más auténticas, inclusivas y humanas. Organizaciones que entienden que el cambio real comienza dentro y que su impacto se proyecta mucho más allá del lugar de trabajo.

- **E02 · Página 3 — Migración preparada, pendiente de activación en la base de datos:** nuevo texto de Entidades Colaboradoras:

  > ONG y asociaciones con las que colaboramos y que aportan su conocimiento, experiencia y compromiso para promover el bienestar, la inclusión y la salud mental también en los lugares de trabajo.

- **E03 · Página 3 — Migración preparada, pendiente de activación en la base de datos:** nuevo texto de Instituciones:

  > Entidades con las que generamos alianzas y espacios de colaboración entre el ámbito público, empresarial y social. Porque cuando avanzamos juntos, el impacto se multiplica.

- **E04 · Páginas 3–4 — Aplicado en código:** retratos circulares con aro fino verde corporativo, conservando las imágenes originales y sus colores. Eliminada la capa oscura sobre la foto; las etiquetas pasan fuera del retrato. No se ha generado resolución inexistente ni sustituido fotografías por imágenes inventadas. Si algún original sigue viéndose poco definido, debe aportarse uno de mayor resolución.
- Confirmada la limitación de algunos originales en la web real: Tabita Luis y Pablo Cabrera tienen imágenes de **160 × 160 px**, Manuel R. Durán de **199 × 199 px** y Adrian Bono de **225 × 225 px**. El formato circular evita la ampliación rectangular anterior, pero para mayor nitidez —sobre todo en pantallas de alta densidad— se necesitan originales mayores. No se ha aplicado un reescalado artificial como si recuperase detalle.
- **E05 · Página 4 — Funcionalidad preparada; alta de sección pendiente de migración:** añadido soporte para `Consejo Consultivo de Impacto Social`, con retratos y gestión desde el CRUD de Ecosistema. No se han inventado miembros. Descripción preparada:

  > Representantes de instituciones públicas, universidades, empresas, asociaciones y entidades empresariales que aportan su conocimiento y experiencia para ayudarnos a definir nuestras prioridades y los movimientos corporativos con los que generar un impacto social positivo desde el ámbito empresarial.

- Se elimina el contenido ficticio que se mostraba cuando fallaba la base de datos o faltaban miembros. Se distinguen error de conexión, sección vacía y datos reales.
- Corregidos los enlaces de navegación a las anclas reales de Empresas y Entidades; añadido acceso al Consejo.
- La migración solo reemplaza textos antiguos conocidos. Respeta descripciones personalizadas o vacías y no altera relaciones ni añade miembros.

### Activación pendiente de Ecosistema

La configuración de producción protege `DATABASE_URL` como secreto y no existe conexión de desarrollo utilizable. El endpoint de administración exige una sesión autorizada; **no se ha eludido esa protección**.

Después de publicar este código, una persona con acceso debe:

1. Iniciar sesión en `https://autentizity.vercel.app/admin/login`.
2. Abrir, en ese mismo navegador, `https://autentizity.vercel.app/api/db/setup`.
3. Confirmar una respuesta `{"success":true}`. El endpoint invalida la caché de `/ecosistema` tras completar la migración para que no sea necesario esperar su intervalo de regeneración.
4. Revisar las tres descripciones y el Consejo en `/admin/ecosistema` y `/ecosistema`.
5. Añadir los miembros reales del Consejo y sus imágenes desde administración.

Hasta realizar esa activación, los textos persistidos y el nuevo apartado no deben considerarse publicados.

## Movimientos Corporativos

- **M01 · Página 5 — Parcial:** `Enviar email` pasa a `Únete` y enlaza a `/unete`. Falta el formulario general, igual que en Home.
- **M02 · Páginas 5–6 — Aplicado en código:** participantes separados por su sección real:
  - Empresas Impulsoras.
  - Entidades Colaboradoras.
  - Instituciones, Cámaras de Comercio y Asociaciones Corporativas.
  - Embajadores.
- Selectores separados también en el editor del movimiento, conservando las relaciones existentes. No se han creado tablas duplicadas ni reclasificado entidades arbitrariamente.
- Empresas y organizaciones usan logos sin recorte circular; los embajadores conservan retratos. Se excluyen del público las entidades y secciones inactivas.
- Se ha comprobado en la API pública que **IPSEN ya pertenece a Empresas Impulsoras** (`eco-empresas`). El problema de «De Philadelphia a Madrid» es de presentación, no necesita cambiar esa clasificación.

## Actividades y registro

- **A01 · Página 5 — Aplicado:** eliminado `Otras actividades del ecosistema` del listado y del bloque de Actividad; metadata ajustada sin esa expresión.
- **A02 · Página 5 — Aplicado:** botones de reserva/inscripción muestran `Regístrate`, independientemente de Eventbrite o de otro proveedor. Se conservan las URLs de registro originales. Los botones personalizados que no son de registro no se sustituyen indiscriminadamente.

## Referentes de la autenticidad 2026

- **R01 · Páginas 6–7 — Aplicado:** nombre nuevo en título, metadatos y referencias de la página. Se conserva `/ranking` y sus anclas para no romper enlaces.
- **R02 · Página 7 — Aplicado:** subtítulo `Líderes y voces que están redefiniendo la cultura empresarial en España`.
- **R03 · Páginas 7–8 — Aplicado:** `¿Qué es el Ranking?` pasa a `Top 100`; introducción sustituida por la del PDF y cuatro ámbitos en lista: Bienestar Integral, Salud Mental, Inclusión y Liderazgo Auténtico.
- **R04 · Páginas 8–9 — Aplicado:** paso 03 actualizado:

  > Se seleccionan los 100 líderes y voces que serán reconocidos por su impacto, coherencia y compromiso, impulsando acciones concretas de bienestar, salud mental, inclusión y liderazgo

- **R05 · Página 9 — Aplicado:** píldora `PARTICIPA` en el hero y en la llamada final, ambas a **https://tally.so/r/1Aa2gp**. Se ha abierto el destino y comprobado que corresponde a la convocatoria; no se ha enviado ninguna candidatura.

## Únete: decisión pendiente

- **U01 · Página 9 — Pendiente de definición con Miguel**, como indica expresamente el PDF.
- Se ha consultado `https://www.redi-lgbti.org/contacto` como referencia, no como destino para las solicitudes de AutentiZity.
- Hay que confirmar si se utilizará un formulario externo ya existente o uno propio, qué campos tendrá, quién recibirá/gestionará las solicitudes y los consentimientos necesarios.
- El Tally de Referentes es una candidatura específica: **no se ha reutilizado como formulario general de adhesión**.

## Ajustes adicionales detectados en QA visual

- Contención de la animación horizontal de los párrafos de Home para evitar desbordamiento en móvil.
- Dimensiones intrínsecas correctas de los logos de Referentes y altura responsive uniforme para evitar saltos/desbordamiento mientras cargan.

## Verificación

### Comprobaciones locales ejecutadas

- `npm test`: **46 tests superados en 7 archivos**, con ciclos de fallo previo y comprobación posterior para los cambios.
- `tsc --noEmit`: correcto.
- `npm run build`: correcto; generadas las **45 páginas** que informa Next.js. Aviso esperado: falta `DATABASE_URL` en local, por lo que no se afirma conexión local a datos reales.
- `git diff --check`: correcto.
- Revisión independiente de cumplimiento: **21 requisitos contrastados**, sin omisiones adicionales a las decisiones/activación pendientes que recoge este documento.
- Navegador local: Home y Referentes responden HTTP 200; a **390 px**, ancho del documento y del viewport coinciden, sin desbordamiento horizontal. Menú móvil abre, cierra y navega; los dos párrafos de Home tienen el mismo tamaño e interlineado.
- Enlaces externos consultados: formulario Tally correcto y página REDI usada solo como referencia. No se enviaron datos.
- Manifiesto de despliegue comprobado: sin `.env`, documentos internos del cliente, notas del agente, tests ni artefactos de TypeScript. Añadido `.vercelignore` para mantener esa exclusión.

### Límites de verificación

- Los tests de datos usan fixtures/stubs explícitos; **no representan una escritura real en producción**.
- `npm run lint` estaba sin configurar: abre el asistente interactivo de Next y termina con error. No se presenta como lint superado; se ejecutaron TypeScript y build como verificaciones alternativas.
- Vitest funciona y emite un aviso de deprecación de la API CJS de Vite; no es un fallo de las pruebas.
- Prueba real de alta/subida de miembros del Consejo y persistencia en BD pendiente de sesión autorizada. No se han inventado credenciales ni miembros.

### Publicación

Publicado y verificado en **https://autentizity.vercel.app/** el **10 de septiembre de 2026**, tras autorización expresa de Miguel para producción.

- Commit de código: `528fa7a26e615917a7f6d4c4a5e697ab25cc790a`, pusheado a `origin/diseño`. No se ha modificado `main`.
- Despliegue Vercel: `dpl_A9M6BjwojLKjTmRWGUAzqfgweoeD`, estado **READY**, destino **production** y alias `autentizity.vercel.app` asignado sin error, comprobados por API.
- URL inmutable: https://autentizity-h0n74jnco-miguel17693s-projects.vercel.app
- Reejecutados antes de publicar: **46/46 tests**, TypeScript, build y `git diff --cached --check`, correctos. El build remoto también ha terminado correctamente con el entorno de producción.
- **20 rutas públicas comprobadas por HTTP**, todas con respuesta 200 y sin mensajes de error de aplicación o de conexión: Home, Referentes, Ecosistema, Actividad, listados de actividades/movimientos, Únete y todos los movimientos, actividades y eventos publicados en la API consultada.
- Verificados en el HTML público los párrafos de Home, enlaces a Movimientos/Únete, nombre 2026, Top 100, los dos PARTICIPA al Tally, eliminación del subtítulo de actividades y categorías/IPSEN en De Philadelphia a Madrid.
- Los cuatro eventos publicados muestran `Regístrate` y conservan sus destinos. Las dos actividades conservan sus CTA personalizados y sus URLs.
- CSS, JavaScript, logo, icono, robots y sitemap comprobados con respuesta 200.
- Navegador de producción: Home y Referentes a **390 px**, sin desbordamiento; retratos circulares reales en Ecosistema; comprobadas también Actividad, listado de actividades, evento, actividad, Únete y movimiento representativos.
- **Migración NO ejecutada:** el diagnóstico protegido devuelve **401** en la sesión del navegador disponible. La API pública sigue mostrando las tres descripciones anteriores y no contiene aún el Consejo. Esto no invalida la publicación del código, pero **E01–E03 y el alta de sección de E05 siguen pendientes** de la activación autenticada descrita arriba.
- No se han enviado formularios, inventado miembros ni eludido la autenticación. Siguen pendientes las decisiones de formulario, frase del partner e imágenes.

## Dudas para cerrar con Miguel

1. **Formulario de adhesión:** URL existente o formulario propio; campos, destinatario y consentimientos.
2. **Reconocimiento / partner:** confirmar la frase final sin la duplicación `Manpower de la Autenticidad`.
3. **Consejo Consultivo:** aportar miembros, cargos/descripciones e imágenes reales.
4. **Activación de datos:** ejecutar la migración desde una sesión de administrador autorizada.
