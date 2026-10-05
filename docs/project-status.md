# Estado del proyecto y registro histórico

## Estado vigente · 2026-10-05

**Demostración pública saneada; recorrido local verificado.** No se acredita operación con datos reales ni despliegue de la API.

- Repositorio: [Hmhn2525/registros-tic](https://github.com/Hmhn2525/registros-tic), público y recreado con identidad nueva `R_kgDOU8zjzQ`.
- Identidad anterior: `R_kgDOT0UgxQ`. La eliminación se confirmó mediante HTTP 404 con una sesión autenticada válida antes de crear el nuevo repositorio.
- Checkpoint de reposición: solo `main`, sin etiquetas, un único commit raíz `732724d7cf271779d94cbc7a755c0018426a0b8f`, publicado mediante push normal.
- PR #1: HTTP 404; lista de PR vacía; `refs/pull/1/head` y la rama anterior no aparecen en las referencias anunciadas.
- Los cuatro SHA anteriores comprobados devolvieron HTTP 422 «No commit found». Esto acredita las consultas realizadas en el nuevo repositorio, no la eliminación de copias externas o de todas las cachés de GitHub.
- Respaldo privado: 112 archivos comparados contra sus hashes registrados, cero diferencias; no se publicó ni modificó.
- Escaneo inicial: 45 archivos públicos, sin coincidencias de datos sensibles del proyecto. Un contacto de dependencia se clasificó como metadato de terceros.
- `npm ci`, `npm run lint`, `npm run build` y `git diff --check`: correctos. Build con variables públicas Supabase vacías.
- Recorrido de navegador aislado: catálogos demo, registro ficticio por modalidad PIN, consulta del historial y persistencia tras recarga; sin conexión a Supabase ni firma real.
- Se añaden README profesional, arquitectura, caso de estudio y capturas sintéticas mediante un commit posterior normal. El SHA inicial se conserva como raíz del historial nuevo.

### Diagnóstico de dependencias

`npm audit` del 5 de octubre de 2026 reportó dos dependencias transitivas con severidad alta: `brace-expansion` (versiones instaladas 2.1.4 y 5.0.9) y `fast-uri` (3.1.5). La cadena parte de `vite-plugin-pwa` y `workbox-build`; no son dependencias directas de la aplicación. npm informa corrección disponible; no se ejecutó `npm audit fix` ni se modificaron las resoluciones.

### Pendientes técnicos

Autenticación de técnicos, autorización restrictiva de Supabase, Storage privado, validación independiente del PIN, vencimiento y límites de enlaces remotos, validación de imágenes y concurrencia, sincronización y recuperación de cola offline, retención local e iconos PWA. La subida de firma puede fallar antes del guardado offline con Supabase configurado. API, integración de reporting e instalación móvil requieren pruebas propias.

Consultar [arquitectura](architecture.md) y [caso de estudio](case-study.md). Los registros que siguen son evidencia histórica: sus prohibiciones de publicación, HEAD y pendientes de filtrado describen etapas previas.

## Revisión local de privacidad · 2026-10-02

- Línea base: main, a9026bf3efe7b16bb83564ea4e90ae6c64dff161, estado limpio antes de modificar.
- Trabajo exclusivamente en una copia independiente; respaldo original intacto.
- Código demo con usuarios, identificadores y activos sintéticos.
- Seed en supabase/seed.sql; npm como gestor único.
- Documentación de reportes en reporting.md; comparaciones en duplicate-comparison.md.
- El historial Git aún contiene datos originales. Ningún commit, push o filtro histórico autorizado en esta etapa.
- Las afirmaciones y checks del registro de agosto siguiente son históricos, no validaciones actuales: PostgreSQL 15, dashboard activo, instalación móvil y tiempos de respuesta no están confirmados.
- Offline tiene cola local sin sincronización automática y puede fallar al subir una firma con Supabase configurado y sin conexión. Login, permisos restrictivos y bucket privado siguen pendientes.
- La guía anterior recomendaba firmas públicas; la guía actual recomienda reportes sin firmas personales y acceso de solo lectura. El código y esquema originales aún usan URLs públicas; no conectar datos reales.

## Registro histórico anonimizado · 2026-08-08

Los nombres de archivos importados y las cantidades se conservan como contexto histórico; esas importaciones y los CSV/XLSX mencionados no forman parte de la demostración saneada. Usar el esquema y la semilla sintética en un entorno aislado. Las instrucciones históricas de despliegue no autorizan publicar.

```text
================================================================
PROYECTO: PWA DE REGISTRO DE SOPORTE TIC Y CAPTURA DE FIRMAS
Ubicación: registros-tic/
Fecha de inicio: 07/08/2026
Última actualización: 08/08/2026
================================================================

================================================================
 RESUMEN GENERAL
================================================================
Se construyó una Progressive Web App (PWA) moderna para que los
técnicos de TIC puedan registrar atenciones de soporte en sitio,
capturar la firma digital de conformidad del usuario y alimentar
automáticamente la base de datos en Supabase y los tableros de
auditoría en Looker Studio.

Reemplaza el uso de papel, AppSheet y automatizaciones de WhatsApp
por una solución propia, rápida, offline-first e instalable en
la pantalla de inicio de cualquier celular Android o iOS.

================================================================
 STACK TECNOLÓGICO UTILIZADO
================================================================
Frontend:
  - React 19 + Vite 8 + TypeScript (verbatimModuleSyntax)
  - Tailwind CSS v4 (@tailwindcss/vite)
  - Diseño: Glassmorphism, modo oscuro (paleta Slate/Indigo/Emerald)
  - Iconografía: lucide-react
  - Firma táctil: react-signature-canvas
  - PWA: vite-plugin-pwa (Workbox Service Worker + Manifest)

Backend:
  - Supabase (PostgreSQL 15 + Storage de archivos PNG de firmas)
  - SDK oficial: @supabase/supabase-js
  - Bucket público: "firmas"

Dashboard externo:
  - Looker Studio con conector PostgreSQL nativo
  - Fórmula IMAGE(url_firma) para visualizar firmas en reportes

================================================================
 ARCHIVOS CLAVE DEL PROYECTO
================================================================
src/App.tsx                      → Contenedor principal, tabs y estado de red
src/components/Header.tsx        → Cabecera con badges de conexión y red
src/components/SignatureCanvas.tsx → Lienzo de firma táctil (PNG recortado)
src/components/TicketForm.tsx    → Formulario de registro de tickets
src/components/TicketHistory.tsx → Galería de evidencias con firmas
src/services/ticketService.ts   → Lógica: subida Storage + DB + cola offline
src/lib/supabase.ts              → Cliente Supabase con fallback a modo demo
src/types/index.ts               → Interfaces TypeScript del dominio
src/index.css                    → Estilos globales + Glassmorphism utilities

supabase_schema.sql              → Script SQL completo para configurar Supabase
import_inventario.sql            → SQL con los 341 equipos del inventario listos
Inventario.csv                   → Base de activos TIC original (341 equipos)
Inventario_Supabase.csv          → CSV adaptado con columnas de la BD para import
Usuarios.xlsx                    → Base de usuarios/empleados (PENDIENTE procesar)
docs/reporting.md           → Guía paso a paso para conectar Looker Studio
.env                             → Variables de entorno (URL y Key de Supabase)
.env.example                     → Plantilla de referencia para el .env

spec/README.md                   → Guía SDD para futuros agentes de IA
spec/constitution/mission.md     → Misión, alcance y principios del proyecto
spec/constitution/tech-stack.md  → Stack, archivos clave y límites duros
spec/constitution/roadmap.md     → Estado de features (hecho/siguiente/backlog)
spec/features/001-pwa-captura-firmas/spec.md   → Criterios de aceptación
spec/features/001-pwa-captura-firmas/plan.md   → Plan técnico de implementación
spec/features/001-pwa-captura-firmas/tasks.md  → Checklist de tareas completadas

================================================================
 ESTRUCTURA DE LA BASE DE DATOS EN SUPABASE
================================================================
Tabla: usuarios
  - id             UUID (PK, auto)
  - id_empleado    TEXT (número de nómina ej: EMP-DEMO-001, EMP-DEMO-002) — CLAVE DE ENLACE
  - nombre         TEXT
  - email          TEXT
  - departamento   TEXT
  - fecha_creacion TIMESTAMPTZ

Tabla: categorias_soporte
  - id             SERIAL (PK)
  - nombre         TEXT (único)
  - descripcion    TEXT

  Categorías cargadas:
    1. Hardware / Equipo
    2. Software / Aplicaciones
    3. Redes y Conectividad
    4. Impresoras y Escáneres
    5. Mantenimiento Preventivo

Tabla: activos_tic (341 equipos cargados)
  - id                UUID (PK, auto)
  - codigo_inventario TEXT (único, ej: DEMO-LAP-001)
  - id_responsable    TEXT (número de empleado del responsable)
  - estatus           TEXT (Activo, Baja, Resguardo, Prestado)
  - tipo              TEXT (Laptop, Desktop, Impresora, etc.)
  - marca             TEXT
  - modelo            TEXT
  - nombre_equipo     TEXT (marca + modelo combinados)
  - mac               TEXT
  - serie             TEXT
  - fecha_compra      TEXT
  - usuario_id        UUID → FK a usuarios.id (NULL hasta vincular)
  - fecha_registro    TIMESTAMPTZ

Tabla: tickets
  - id                UUID (PK, auto)
  - fecha_registro    TIMESTAMPTZ
  - usuario_id        UUID → FK a usuarios.id
  - activo_id         UUID → FK a activos_tic.id
  - categoria_id      INT → FK a categorias_soporte.id
  - descripcion_falla TEXT
  - nombre_tecnico    TEXT
  - estado            TEXT (Pendiente/En Proceso/Atendido/Cerrado)
  - url_firma         TEXT (URL pública del PNG en Supabase Storage)
  - notas_adicionales TEXT

Storage Bucket: "firmas" (público)
  - Almacena archivos PNG de cada firma de conformidad
  - URL pública directa consultable desde Looker Studio

================================================================
 POLÍTICAS DE SEGURIDAD RLS
================================================================
Todas las tablas tienen Row Level Security activo con políticas
que permiten lectura e inserción desde la clave anon/pública
(para que la PWA funcione sin login obligatorio en esta versión).

================================================================
 LO QUE ESTÁ HECHO ✅
================================================================
[x] Análisis de viabilidad del plan (calificación 9.5/10)
[x] Proyecto Vite + React + TypeScript inicializado
[x] Instalación de todas las dependencias necesarias
[x] Configuración de Tailwind CSS v4
[x] Configuración de PWA Manifest + Service Worker (vite-plugin-pwa)
[x] Archivo .env creado con plantilla de credenciales Supabase
[x] Componente SignatureCanvas.tsx con touch-action: none (sin scroll)
[x] Componente TicketForm.tsx con selectores de catálogos
[x] Componente TicketHistory.tsx con galería y modal de firma
[x] Componente Header.tsx con badges de estado de red y Supabase
[x] App.tsx con navegación por pestañas y detección online/offline
[x] Cliente Supabase con modo demo si no hay credenciales configuradas
[x] ticketService.ts con subida PNG a Storage y cola offline en localStorage
[x] Corrección de bug: getTrimmedCanvas() reemplazado por getCanvas()
[x] Script SQL supabase_schema.sql completo (tablas + RLS + bucket + seed)
[x] Análisis de Inventario.csv original (341 equipos, 9 columnas)
[x] Generación de Inventario_Supabase.csv con columnas adaptadas
[x] Generación de import_inventario.sql con los 341 equipos insertables
[x] Columna id_empleado añadida a la tabla usuarios (clave de enlace)
[x] Estructura SDD (Spec Driven Development) adaptada en carpeta spec/
[x] Guía docs/reporting.md con fórmula IMAGE(url_firma)
[x] Build de producción verificado: npm run build ✓ sin errores

================================================================
 LO QUE ESTÁ PENDIENTE ⏳
================================================================
[ ] INMEDIATO: Analizar Usuarios.xlsx para mapear sus columnas
    a la estructura de la tabla "usuarios" en Supabase y generar
    el CSV/SQL de importación correspondiente.

[ ] SUPABASE - Configurar proyecto real:
    - Crear el proyecto en supabase.com si aún no existe
    - Ejecutar supabase_schema.sql en el SQL Editor de Supabase
    - Ejecutar import_inventario.sql para cargar los 341 equipos
    - Importar la lista de usuarios desde Usuarios.xlsx

[ ] SUPABASE - Vincular equipos con usuarios:
    Después de cargar ambas tablas, ejecutar este SQL una vez:

    UPDATE public.activos_tic a
    SET usuario_id = u.id
    FROM public.usuarios u
    WHERE a.id_responsable = u.id_empleado;

    Esto llenará automáticamente el campo usuario_id (actualmente NULL)
    emparejando el número de empleado de cada equipo con su responsable.

[ ] CONFIGURAR .env con credenciales reales:
    - Ir a Supabase > Project Settings > API
    - Copiar Project URL y anon/public key
    - Pegarlas en el archivo .env del proyecto:
      VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
      VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICABLE_O_ANON

[ ] PRUEBA REAL EN CELULAR:
    - Con npm run dev --host la app está disponible en la red local
    - Abrir https://demo.example.invalid/ desde el celular
    - Probar el registro de ticket y la captura de firma táctil
    - Verificar que el badge cambie a "Supabase Conectado"

[ ] DESPLIEGUE EN VERCEL (para uso en producción):
    - Subir el proyecto a GitHub
    - Conectar el repositorio en vercel.com
    - Configurar las variables de entorno en Vercel
    - Obtener la URL HTTPS pública (ejemplo ficticio: app.example.invalid)
    - Desde el celular: Añadir a pantalla de inicio (modo standalone)

[ ] LOOKER STUDIO - Conectar y crear dashboard:
    - Seguir la guía docs/reporting.md
    - Crear la vista SQL en Supabase: vista_tickets_looker
    - Agregar campo calculado IMAGE(url_firma) en Looker Studio
    - Construir tabla de auditoría con fecha, usuario, equipo y firma

[ ] FEATURES FUTURAS (Backlog):
    002 - Sincronización automática de cola offline al recuperar señal
    003 - Autenticación de técnicos con Supabase Auth (login)
    004 - Captura de GPS al momento de firmar el ticket
    005 - Generación de comprobante PDF con firma incrustada

================================================================
 COMANDOS DE DESARROLLO
================================================================
npm run dev -- --host   → Servidor local expuesto a red (celular)
npm run build           → Compilar para producción (verificado ✓)
npm run preview         → Ver el build de producción localmente

Servidor activo en:
  Local:   http://localhost:5173/
  Origen demo ilustrativo: https://demo.example.invalid/

================================================================
 REGLAS PARA FUTUROS AGENTES DE IA
================================================================
Antes de modificar cualquier archivo del proyecto, leer:
  1. spec/constitution/mission.md    → qué es y qué NO es el proyecto
  2. spec/constitution/tech-stack.md → stack y límites prohibidos
  3. spec/constitution/roadmap.md    → qué hay hecho y qué sigue

Para añadir una nueva funcionalidad:
  1. Crear carpeta spec/features/00N-nombre-feature/
  2. Escribir spec.md con criterios de aceptación medibles
  3. Escribir plan.md con enfoque técnico y archivos afectados
  4. Ejecutar y marcar tasks.md
  5. Actualizar roadmap.md moviendo la feature a "Hecho"

LÍMITES DUROS (nunca hacer):
  - NO subir el archivo .env con credenciales reales a Git/GitHub
  - NO remover el fallback offline de localStorage
  - NO quitar touch-action: none del canvas de firma
  - NO usar librerías de UI pesadas (Material UI, Ant Design, etc.)

================================================================

```
