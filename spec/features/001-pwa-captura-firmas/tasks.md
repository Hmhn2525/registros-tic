# 001 · Captura de Firmas y PWA Base — Tareas

Checklist de tareas de implementación y verificación de la Feature 001.

- [x] Crear el proyecto Vite + React + TypeScript en `c:/TIC/Registros_tic`.
- [x] Instalar dependencias `@supabase/supabase-js`, `react-signature-canvas`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite` y `vite-plugin-pwa`.
- [x] Crear el script SQL `supabase_schema.sql` con tablas relacionales, bucket `firmas`, políticas RLS y datos semilla.
- [x] Implementar el componente `SignatureCanvas.tsx` con soporte para trazo táctil y `touch-action: none`.
- [x] Desarrollar el formulario `TicketForm.tsx` con selectores de catálogos y validaciones.
- [x] Desarrollar el visor de evidencia `TicketHistory.tsx` con miniaturas e inspección en modal.
- [x] Implementar el cliente `lib/supabase.ts` y el servicio `ticketService.ts` con subida a Supabase Storage y fallback offline.
- [x] Configurar la PWA en `vite.config.ts` para permitir instalación en pantalla de inicio.
- [x] Elaborar la guía de integración a Looker Studio `LOOKER_STUDIO_GUIDE.md`.
- [x] Validar la compilación de producción con `npm run build` sin errores de TypeScript.
- [x] Iniciar el servidor local de desarrollo expuesto a la red.
- [x] Actualizar `constitution/roadmap.md` marcando la Feature 001 como completada.
