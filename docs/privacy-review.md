# Revisión final de privacidad y consistencia

## Actualización de publicación · 2026-10-05

El informe del 3 de octubre que sigue se conserva como registro histórico. Sus referencias a HEAD antiguo, índice, rutas pendientes y prohibiciones de publicación no describen el repositorio actual.

La versión pública se creó desde una copia independiente con un único commit raíz saneado `732724d7cf271779d94cbc7a755c0018426a0b8f`. El repositorio anterior se eliminó y se recreó con identidad diferente; se publicó únicamente `main` mediante push normal. No se reutilizó el historial antiguo ni se publicaron materiales de auditoría o respaldo. Consultar [estado vigente](project-status.md).

El respaldo privado se verificó nuevamente: 112 archivos, cero diferencias SHA-256. El escaneo de los 45 archivos del commit inicial no encontró datos sensibles propios. Las dos capturas añadidas posteriormente muestran catálogos y una atención ficticios, sin firma personal, credenciales ni PIN visible. El historial local utiliza un navegador aislado sin Supabase configurado.

El nuevo remoto no anuncia ramas antiguas ni referencias de PR; PR #1 no existe y las consultas de cuatro commits previos no encuentran esos objetos. La verificación no demuestra que desaparecieran copias de terceros o todas las cachés externas.

Los riesgos funcionales de permisos, firmas, PIN, tokens y cola offline permanecen. Publicar código saneado no acredita seguridad para operar con datos reales.

## Informe histórico · 2026-10-03

Fecha: 2026-10-03. Alcance: copia independiente local de Registros TIC. Rama `main`; HEAD `a9026bf3efe7b16bb83564ea4e90ae6c64dff161`. No se realizaron commits, cambios del índice, push ni reescritura histórica. El respaldo privado se comprobó mediante lectura de su manifiesto: 112 archivos, cero diferencias de tamaño o SHA-256.

Este informe describe el estado previo al checkpoint local. Durante su preparación posterior se sustituyó el alias ilustrativo no confirmado por `app.example.invalid`; las referencias a HEAD, índice y archivos sin seguimiento de este informe son la fotografía de la revisión previa, no el estado después del commit.

## Dictamen

**Lista con observaciones para preparar la reescritura histórica.** El contenido actual del proyecto permite preparar el saneamiento; no está autorizado ejecutar el filtro ni publicar. HEAD y el índice siguen conservando los originales: la eliminación del árbol de trabajo no modifica un commit. Antes de ejecutar una reescritura debe preservarse el estado local saneado, incluidos los archivos nuevos, en otra copia independiente verificable. Una clonación ordinaria ahora copiaría el HEAD antiguo, no estos cambios sin commit.

## Alcance y método

- Recorrido de todos los archivos actuales fuera de `.git`, incluidos ignorados, archivos sin seguimiento, código, SQL, documentación, configuración, `.env.example`, dependencias y ambos builds locales conservados en `.audit/`.
- Comparación contra identificadores extraídos en memoria de las importaciones históricas y los nombres de técnicos anteriores. No se guardaron los valores originales en un archivo de reemplazos.
- Búsqueda de correos, IP privadas, MAC, rutas locales, claves reconocibles, JWT, URLs privadas y referencias a imágenes de firmas; revisión manual de configuración y lógica de firmas.
- Inspección de las ocho revisiones alcanzables por todas las referencias actuales y sus 71 blobs únicos. El único recurso binario propio histórico es una imagen de plantilla, previamente revisada; los binarios instalados de dependencias no son datos del proyecto publicable.
- `git fsck --full --no-reflogs` sin errores ni objetos adicionales notificados. El reflog actual solo apunta al HEAD conocido. Se incluyen `main` y `origin/agent/fix-remote-signature`; no hay tags actuales.
- Evidencia local ignorada en `.audit/privacy-results.json`, `.audit/scan-console.txt` y `.audit/privacy-scan.cjs`. El informe contiene rutas, categorías, conteos y huellas abreviadas; no secretos ni una lista de personas.

Un escaneo estático no demuestra que nunca haya existido otro dato fuera de las referencias locales, ni audita la base remota, Storage, navegador, logs de alojamiento o copias de GitHub. La revisión de dependencias distingue contenido de terceros de datos empresariales: ejemplos, correos de autores y direcciones locales de esas bibliotecas no se tratan como datos de Registros TIC.

## A. Privacidad restante

No se detectaron datos identificables de las importaciones originales, IP internas fijas, MAC o series reales, claves secretas, tokens reutilizables ni firmas reales incorporadas en los archivos actuales propios del proyecto. La semilla y las constantes activas utilizan datos sintéticos. `.env.example` contiene solo placeholders; no se encontró un `.env` con credenciales en esta copia.

| Archivo / ámbito | Hallazgo | Severidad | Corregido | Acción pendiente |
|---|---|---|---|---|
| Historial: `import_usuarios.sql` | 107 registros personales, identificadores y correos empresariales | Alta | Solo retirado del árbol actual | Eliminar la ruta de todas las referencias históricas publicables |
| Historial: `import_inventario.sql` | 341 activos con responsables, nombres de equipos, MAC, series y referencias de red | Alta | Solo retirado del árbol actual | Eliminar la ruta de todo el historial publicable |
| Historial: `dist/assets/index-DkWTjn0N.js` | JWT público/anon de Supabase, host del proyecto, nombres e IP fija incorporados en el bundle | Alta por la exposición conjunta | Solo retirado del árbol actual | Eliminar `dist/` completo del historial; revisar la configuración del proyecto Supabase expuesto. Una anon key no equivale a una service-role key |
| Historial: `ESTADO_PROYECTO.txt`, `TicketForm.tsx`, `ticketService.ts` | Referencias internas, datos nominales y ejemplos identificables | Alta / media según dato | Sustituidos o retirados del árbol actual | Eliminar esas rutas antiguas; conservar los documentos y código saneados actuales |
| Historial: `src/components/TicketForm.tsx` | Técnicos nominales e IP LAN | Media | Sí, en el árbol actual | Sustituir los valores en todas las versiones históricas conservadas |
| Historial: `src/services/ticketService.ts`, `supabase_schema.sql` | Identidades y ejemplos laborales anteriores | Media | Sí, en el árbol actual | Sustitución histórica de constantes y ejemplos, sin alterar SQL funcional |
| Historial: cuatro documentos de `spec/` | Enlaces absolutos con rutas locales | Media | Sí, en el árbol actual | Cambiar sus versiones históricas a enlaces relativos |
| Metadatos Git | Dos correos distintos no pertenecientes al dominio noreply de GitHub | Media | No | Sustituir autor/committer mediante callback o mailmap al reescribir, conservando atribución; los reemplazos de blobs no cambian estos campos |
| `docs/project-status.md` | Dirección localhost como ejemplo histórico; alias ilustrativo de despliegue cuya titularidad no se acreditaba | Baja | Alias corregido al preparar el checkpoint | Se usa `app.example.invalid`; localhost es un ejemplo local y no requiere eliminarse |
| `package-lock.json` | Correo de contacto comercial en un aviso de deprecación de una dependencia | Informativa | No corresponde | Conservar metadatos del paquete; no sustituirlo como si fuera un empleado |
| `.audit/build-output/`, `.audit/build-final-20261003/` | Referencia localhost de una biblioteca incluida en el bundle | Informativa | No corresponde | Mantener los builds ignorados; no es una IP interna ni una conexión empresarial configurada |

No se observaron imágenes de firmas reales ni URLs a objetos reales de Storage en los blobs revisados. Las referencias programáticas a `firmas` y `url_firma` son funcionalidad, no evidencias personales incrustadas. No se verificó el contenido del bucket remoto.

## B. Pendientes funcionales y documentales

| Archivo / ámbito | Pendiente | Severidad / efecto |
|---|---|---|
| `supabase_schema.sql`, `supabase/migrations/` | Lecturas anónimas de usuarios, activos y tickets; inserción pública de tickets. No existe autenticación implementada | Alta con datos reales; endurecer autorización y probar roles |
| `supabase_schema.sql`, `src/services/ticketService.ts`, `api/remote-signature.ts` | Bucket público, subidas públicas y `getPublicUrl` | Alta con firmas reales; migrar a acceso autorizado y Storage privado |
| `src/components/TicketForm.tsx`, `src/services/ticketService.ts` | PIN sin verificación independiente, guardado en notas; el ocultamiento del historial es solo visual. El estado del ticket se infiere de texto libre | Alta / media; validar en servidor y separar modalidad/estado de las notas |
| `api/remote-signature.ts` | Token sin vencimiento ni límite de intentos; patrón PNG y tamaño no validan el contenido binario. Posible carrera con uploads concurrentes | Media / alta; vencimiento, límites, validación de imagen y prueba concurrente |
| `src/services/ticketService.ts` | Cola local sin sincronización automática; subida de firma antes de comprobar conexión; almacenamiento personal en localStorage sin política de retención | Media / alta; preservar la cola, implementar recuperación segura y retención |
| API y Supabase | API revisada y lint correcto, pero sin prueba completa de despliegue, autorización o firma remota. Vite no ejecuta esta API | Pendiente de integración; build no acredita operación real |
| `vite.config.ts`, `public/` | Iconos PWA y recursos declarados ausentes | Media para instalación; completar iconos y probar instalación móvil |
| `spec/constitution/mission.md`, `tech-stack.md`, feature 001 y `docs/project-status.md` | Persisten afirmaciones históricas de sincronización/reportes, `getTrimmedCanvas` y recomendaciones antiguas de firmas públicas. El código usa `getCanvas`; la guía actual las desaconseja | Media documental; marcar explícitamente versiones históricas y corregir convenciones actuales |
| `spec/features/006-local-privacy/tasks.md` | Casillas pendientes aunque varias verificaciones ya se ejecutaron | Baja; reconciliar con esta evidencia sin acreditar integración remota |
| `README.md`, pruebas | README aún contiene plantilla Vite; pruebas específicas locales en `.audit/` sin suite versionada | Mejora profesional pendiente; conservar pruebas útiles en una etapa autorizada |
| Dependencias | La instalación anterior reportó dos vulnerabilidades altas; esta revisión no actualizó resoluciones ni repitió la auditoría del registro npm | Revisar antes de publicar/desplegar; no ejecutar actualizaciones automáticas sin análisis |

## C. Archivos nuevos y política de seguimiento

Versionar posteriormente, tras revisión, los siguientes archivos propios:

```text
docs/duplicate-comparison.md
docs/project-status.md
docs/reporting.md
docs/privacy-review.md
spec/features/006-local-privacy/plan.md
spec/features/006-local-privacy/spec.md
spec/features/006-local-privacy/tasks.md
supabase/seed.sql
```

Mantener ignorados `node_modules/`, `.audit/` completo, builds, logs y archivos temporales de TypeScript. El paquete PGlite aislado de `.audit/seed-check` no debe incorporarse como dependencia del proyecto. No se identificó ningún archivo nuevo propio que deba eliminarse ahora; esta revisión no los eliminó.

## D. Verificaciones

- `npm run lint`: salida 0.
- `npm run build`: salida 0, TypeScript y Vite correctos, 1.863 módulos y generación del service worker. El primer intento falló por `spawn EPERM` del sandbox; el reintento autorizado pasó sin cambiar código ni dependencias.
- Build con variables públicas de Supabase vacías, sin credenciales incorporadas; conservado en `.audit/build-final-20261003/`. El build anterior permanece en `.audit/build-output/`.
- Pruebas locales específicas repetidas: mocks y relaciones, almacenamiento local, origen/configuración de enlaces, pendientes, PIN oculto y polling sin solapamiento: correctas.
- Enlaces Markdown relativos de `docs/` y `spec/`: ninguno roto. `package.json` y `package-lock.json` permanecen sin cambios.
- Semilla previamente ejecutada dos veces en PostgreSQL aislado mediante PGlite: tres usuarios, tres activos, tres tickets, cinco categorías; sin firmas/tokens, relaciones correctas y sin sobrescribir registros. No equivale a probar permisos de un servicio Supabase real.

## E. Estado Git y verificaciones de existencia

Rama `main`, HEAD inicial intacto, ocho commits alcanzables. Índice sin cambios preparados. Push URL deshabilitada. Estado esperado: 12 archivos modificados, 22 retirados del árbol de trabajo y ocho nuevos sin seguimiento, contando este informe.

Los dos imports, los nueve archivos históricos de `dist/` y las cuatro copias raíz **siguen versionados en HEAD y en el índice**. Están ausentes del árbol de trabajo y aparecen como `deleted` sin preparar. Esto incumple literalmente la comprobación «ya no están en HEAD», pero responde a la prohibición de hacer commits; no se corrigió mediante staging o reescritura.

Existen `supabase/seed.sql`, `docs/project-status.md`, `docs/reporting.md` y `docs/duplicate-comparison.md`. `.gitignore` incluye todas las exclusiones solicitadas, mantiene `.env.example` publicable e ignora herramientas/resultados de auditoría. El ignore no deja de seguir archivos ya presentes en HEAD.

`git status`, `git diff --stat` y `git diff --check` ejecutados. Check final: salida 0. Stat de archivos ya seguidos: **34 archivos, 101 inserciones y 7.135 eliminaciones**, sin contar los nuevos ni interpretar retiradas de locks como código funcional perdido. Las advertencias LF/CRLF son de configuración de Git. El build recreó temporalmente archivos seguidos de `dist/`; fueron trasladados a `.audit/` antes de comprobar el estado final.

## F. Rutas definitivas para eliminar del historial por privacidad

```text
import_usuarios.sql
import_inventario.sql
dist/
ESTADO_PROYECTO.txt
TicketForm.tsx
ticketService.ts
```

Los dos imports, el documento de estado y los nueve artefactos originales de `dist/` aparecen en los ocho commits examinados. Las copias raíz de formulario y servicio aparecen en siete. Eliminar el prefijo `dist/` cubre todos los nombres de bundles, no solo el hash actual.

Estas rutas requieren el futuro filtrado por paths. `LOOKER_STUDIO_GUIDE.md`, `TicketHistory.tsx`, `RemoteSignatureView.tsx`, `pnpm-lock.yaml` y los recursos de plantilla no contienen datos privados confirmados: sus retiradas actuales son reorganización, no una obligación de borrarlos del historial. Puede conservarse su historia técnica, con el registro de riesgos de la guía antigua.

No eliminar por paths `src/`, `supabase_schema.sql`, las migraciones o `spec/`: contienen código e historia útiles que deben conservarse.

## G. Sustituciones históricas definitivas en contenido conservado

| Ruta / campo | Sustitución propuesta |
|---|---|
| `src/components/TicketForm.tsx`: `TECNICOS_PREDEFINIDOS` | Los dos literales nominales anteriores por `Técnico Demo 01` y `Técnico Demo 02` |
| `src/components/TicketForm.tsx`: IP/origen LAN | Retirar el literal privado y conservar la lógica segura de configuración/origen; un reemplazo textual debe mantener código válido y no simular que la lógica antigua era correcta |
| `src/services/ticketService.ts`: `MOCK_USUARIOS` | Tres nombres, tres IDs laborales y tres correos anteriores por los tres usuarios demo actuales, `EMP-DEMO-001` a `003` y correos `example.invalid`; alinear IDs y relaciones del mock |
| `src/services/ticketService.ts`: `MOCK_ACTIVOS` | Tres códigos y nombres de equipos anteriores por `DEMO-LAP-001`, `DEMO-PC-001`, `DEMO-IMP-001` y nombres demo; mantener relaciones consistentes |
| `supabase_schema.sql`: comentario de `id_empleado` | Sustituir los tres ejemplos numéricos históricos por `EMP-DEMO-001` u otros ejemplos inequívocamente ficticios |
| `spec/README.md` | Un enlace absoluto histórico por su enlace relativo |
| `spec/constitution/tech-stack.md` | Ocho enlaces absolutos históricos por enlaces relativos |
| `spec/features/001-pwa-captura-firmas/plan.md` | Seis enlaces absolutos históricos por enlaces relativos |
| `spec/features/001-pwa-captura-firmas/tasks.md` | Un enlace absoluto histórico por enlace relativo |
| Metadatos autor/committer | Dos correos no noreply: usar identidades de publicación apropiadas, verificadas; conservar nombre profesional público y atribuciones de terceros cuando corresponda |

Las dos identidades de correo no noreply se identifican en la evidencia privada mediante huellas abreviadas `fa1a4aa99e41` y `3c205d8fc749`; el tercer correo es noreply de GitHub. No se imprimen las direcciones originales. Los enlaces absolutos tienen huellas individuales en `.audit/privacy-results.json`.

Los nombres, correos empresariales, identificadores, MAC, series y hosts exclusivos de los imports eliminados no necesitan inventar equivalentes registro a registro. Se eliminarán con esas rutas y se usarán las entidades sintéticas creadas desde cero. El JWT anon y el host real encontrados solo en el bundle antiguo desaparecerán con `dist/`; no se detectó una service-role key incrustada.

El archivo operativo de reemplazos con valores literales originales todavía no se creó y debe mantenerse privado cuando se prepare. No aplicar sustituciones globales de números cortos: producirían falsos positivos en SVG, fechas, versiones y código. Usar rutas, campos y blobs específicos, incluyendo metadatos por separado.

## H. Condiciones para la siguiente etapa

Se puede preparar el plan y la copia destinada a la reescritura con las rutas y campos anteriores. Antes de ejecutarla: conservar este árbol saneado sin depender de un clone del HEAD, preparar reemplazos privados exactos, definir las referencias a sanear, mantener una copia de recuperación y acordar el tratamiento de correos de atribución. Después del filtro será obligatorio revisar todas las referencias resultantes y repetir el escaneo y la compilación.

Esta revisión no ejecuta ni autoriza la reescritura, no elimina información del respaldo y no modifica servicios remotos. Los pendientes funcionales impiden usar datos reales o declarar esta copia lista para producción; no impiden preparar el saneamiento histórico de forma local.
