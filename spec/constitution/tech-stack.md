# Tech Stack y Convenciones Técnicas

Este documento define la arquitectura técnica, estándares de código y límites duros que cualquier Agente de IA o desarrollador debe respetar al colaborar en este repositorio.

---

## Tecnologías Principales

- **Lenguaje:** TypeScript estricto (`verbatimModuleSyntax` activo).
- **Frontend Framework:** React 19 + Vite 8.
- **Estilos:** Tailwind CSS v4 (Glassmorphic dark theme, paleta Slate/Indigo/Emerald).
- **Backend & Storage:** Supabase (PostgreSQL 15+ & Supabase Storage Bucket `firmas`).
- **Captura de Firma:** `react-signature-canvas` con método `.getTrimmedCanvas()`.
- **PWA Capabilities:** `vite-plugin-pwa` (Workbox Service Worker + Manifest v2).
- **Iconografía:** `lucide-react`.
- **Dashboard Externo:** Google Looker Studio (Conector PostgreSQL + Función `IMAGE()`).

---

## Módulos y Archivos Clave

- [`src/App.tsx`](file:///c:/TIC/Registros_tic/src/App.tsx) — Contenedor principal, navegación entre pestañas y detección de estado de red (`online`/`offline`).
- [`src/components/SignatureCanvas.tsx`](file:///c:/TIC/Registros_tic/src/components/SignatureCanvas.tsx) — Lienzo interactivo de firma digital con la regla CSS `touch-action: none;` para dispositivos móviles.
- [`src/components/TicketForm.tsx`](file:///c:/TIC/Registros_tic/src/components/TicketForm.tsx) — Formulario de captura de tickets con selectores de catálogos y validaciones.
- [`src/components/TicketHistory.tsx`](file:///c:/TIC/Registros_tic/src/components/TicketHistory.tsx) — Galería de auditoría de tickets con vista previa de imagen de firma y modal emergente.
- [`src/services/ticketService.ts`](file:///c:/TIC/Registros_tic/src/services/ticketService.ts) — Servicio de subida de imágenes a Supabase Storage, inserción relacional y cola de respaldo en `localStorage`.
- [`src/lib/supabase.ts`](file:///c:/TIC/Registros_tic/src/lib/supabase.ts) — Inicialización del SDK de Supabase con fallback a modo demo si las llaves no existen.
- [`supabase_schema.sql`](file:///c:/TIC/Registros_tic/supabase_schema.sql) — Script ejecutable en Supabase SQL Editor para crear tablas, FKs, buckets y RLS.
- [`LOOKER_STUDIO_GUIDE.md`](file:///c:/TIC/Registros_tic/LOOKER_STUDIO_GUIDE.md) — Manual de conexión PostgreSQL y renderizado de imágenes para Looker Studio.

---

## Comandos Oficiales

- `npm run dev -- --host` — Arranca el servidor local de desarrollo expuesto a la red local (para pruebas en smartphone).
- `npm run build` — Compila TypeScript (`tsc -b`) y genera el bundle de producción en `dist/` incluyendo el Service Worker PWA.
- `npm run preview` — Previsualiza el build de producción localmente.

---

## Convenciones de Código

1. **Importación de Tipos:** Usar siempre la sintaxis de tipos explícita: `import type { Ticket } from '../types';`.
2. **Nombres de Archivos:** Componentes React en `PascalCase.tsx`, servicios y utilidades en `camelCase.ts`.
3. **Manejo de Firma:** Toda firma capturada debe convertirse a `Blob` PNG transparente antes de enviarse a Supabase Storage.
4. **Resiliencia Offline:** Cualquier llamada a la base de datos debe contemplar captura de errores (`try/catch`) y guardar en `localStorage` si no hay conectividad.

---

## Límites Duros (Lo que NUNCA se debe hacer)

- ❌ **NO subir llaves de API o secretos:** El archivo `.env` está excluido en `.gitignore`. Nunca colocar credenciales reales de Supabase en código fuente público.
- ❌ **NO eliminar el fallback offline:** El sistema debe seguir operando y capturando firmas aunque el usuario esté sin internet o Supabase no esté configurado.
- ❌ **NO remover la regla `touch-action: none;` del canvas:** Sin esta regla, el navegador móvil moverá la página verticalmente al intentar trazar la firma.
- ❌ **NO introducir librerías de UI pesadas (ej. Material UI / Ant Design):** El proyecto utiliza Vanilla CSS + Tailwind v4 para mantener el bundle ligero y el rendimiento alto.
