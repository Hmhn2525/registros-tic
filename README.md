# Registros TIC

Demostración saneada de una aplicación web para registrar atenciones de soporte técnico, relacionarlas con usuarios y activos, y consultar sus evidencias.

**Estado:** demostración local con datos ficticios. La compilación y el recorrido local están verificados; la integración remota y la seguridad para operar con datos reales siguen pendientes.

## Problema y solución

El seguimiento de soporte requiere reunir la incidencia, el equipo, la persona solicitante, la atención y la conformidad del servicio. Registros TIC reúne ese recorrido en una interfaz orientada a dispositivos móviles, con catálogos relacionados, captura de firma y consulta del historial.

El proyecto forma parte del portafolio de **Héctor Manuel Hernández Narváez**, con enfoque en digitalización de procesos, trazabilidad y organización de información para análisis. El [caso de estudio](docs/case-study.md) presenta las decisiones y la evidencia disponible, sin atribuir mejoras cuantitativas no medidas.

## Funciones disponibles

- Selección y búsqueda de usuarios demo por nombre, identificador y departamento.
- Selección de activos relacionados, categoría de soporte y técnico demo.
- Registro local de tickets y consulta de evidencias persistentes en el navegador.
- Lienzo de firma presencial y modalidades de enlace remoto o PIN.
- Código de conexión con PostgreSQL y Storage mediante Supabase.
- Configuración de PWA y función de servidor para recepción de firma remota.

La presencia de código de integración no acredita un despliegue operativo. El PIN no tiene verificación independiente y el enlace remoto requiere infraestructura de servidor. La actualización del historial cada cuatro segundos no sincroniza la cola local.

## Arquitectura y tecnologías

React y TypeScript construyen la interfaz; Vite compila la aplicación y Tailwind CSS define sus estilos. El servicio de tickets usa `localStorage` en modo demo y el SDK de Supabase para acceso remoto. PostgreSQL modela usuarios, activos, categorías y tickets; Storage conserva imágenes en el esquema actual. Workbox y `vite-plugin-pwa` generan los recursos PWA.

Consultar el [diagrama y flujo de datos](docs/architecture.md). La [guía de reporting](docs/reporting.md) describe una posible integración con Looker Studio; no se verificó un tablero activo.

## Capturas de la demostración

Formulario con catálogos sintéticos y descripción ficticia:

![Formulario de Registros TIC con usuarios y activos demo](docs/images/formulario-demo.jpg)

Historial de un ticket local, sin firma real y con PIN oculto visualmente:

![Historial de un ticket ficticio guardado localmente](docs/images/historial-demo.jpg)

Las etiquetas de la interfaz «Firma Digital Garantizada» y «Verificado por PIN» describen el texto actual del prototipo; no acreditan identidad, validez jurídica ni controles de seguridad implementados.

## Ejecutar una demostración local

Requisitos: Git, npm y Node.js 22.12 o una versión posterior compatible con Vite 8.

```sh
git clone https://github.com/Hmhn2525/registros-tic.git
cd registros-tic
npm ci
npm run dev -- --host 127.0.0.1
```

Para este recorrido, no crear `.env` ni configurar variables reales de Supabase. Asegurarse de que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` tampoco estén definidas en el entorno. Abrir la dirección local que indique Vite en un perfil de navegador nuevo o aislado: una cola antigua puede contener registros ajenos a la demo.

Seleccionar un usuario y activo demo, describir una atención ficticia y registrar un ejemplo. La modalidad presencial requiere un trazo ficticio; el PIN solo permite demostrar el guardado local y no debe usarse como autenticación. Consultar Evidencias y recargar para observar la persistencia. No introducir información personal ni firmas reales.

```sh
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

`vite dev` y `vite preview` sirven el frontend; no ejecutan `api/remote-signature.ts`.

### Base de datos de demostración opcional

Usar exclusivamente una base nueva y aislada: aplicar `supabase_schema.sql` y después `supabase/seed.sql`. La semilla contiene tres usuarios, tres activos y tres tickets sintéticos, sin firmas ni tokens reales. Las migraciones son incrementales y no sustituyen al esquema inicial. La semilla SQL no se carga automáticamente en el modo local del navegador.

`.env.example` documenta variables de ejemplo. Las variables `VITE_*` son públicas y se incorporan al frontend. `SUPABASE_SECRET_KEY` es exclusiva del servidor; nunca debe añadirse al frontend. El esquema actual tiene permisos anónimos y firmas públicas: requiere cambios antes de admitir datos reales.

## Evidencia, privacidad y pendientes

El [estado del proyecto](docs/project-status.md) registra qué se comprobó. La [revisión de privacidad](docs/privacy-review.md) distingue la preparación histórica de la versión pública actual.

Pendientes: corregir las dos vulnerabilidades altas de dependencias transitivas detectadas el 5 de octubre de 2026; implementar autenticación y autorización restrictiva; privatizar firmas; validar PIN y enlaces en servidor; añadir vencimiento y límites; asegurar recuperación y sincronización offline; completar recursos PWA y verificar instalación móvil.

No se midieron reducciones de tiempos, ahorro ni impacto operativo. El resultado verificable es una demostración reproducible con datos sintéticos y documentación de sus límites.

## Licencia

La licencia está pendiente de decisión. No se incluye un archivo `LICENSE` ni se atribuyen permisos de distribución adicionales.
