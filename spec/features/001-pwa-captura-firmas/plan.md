# 001 · Captura de Firmas y PWA Base — Plan Técnico

---

## Enfoque

Se construyó una Single Page Application (SPA) con arquitectura **PWA Offline-First** usando React 19 + Vite 8 + Tailwind CSS v4. La capa de persistencia se delega a **Supabase** mediante el SDK `@supabase/supabase-js`, aislando la lógica de datos en `ticketService.ts` con manejo de fallback local.

---

## Implementación Realizada

1. **Backend SQL & Storage:**
   - [`supabase_schema.sql`](file:///c:/TIC/Registros_tic/supabase_schema.sql): Creación de esquema con llaves foráneas en PostgreSQL, Bucket público `firmas` en Supabase Storage y políticas RLS.

2. **Captura Táctil de Firma:**
   - [`src/components/SignatureCanvas.tsx`](file:///c:/TIC/Registros_tic/src/components/SignatureCanvas.tsx): Integración de `react-signature-canvas` con prop `touchAction: 'none'` y método `.getTrimmedCanvas().toDataURL('image/png')`.

3. **Formulario e Historial:**
   - [`src/components/TicketForm.tsx`](file:///c:/TIC/Registros_tic/src/components/TicketForm.tsx): Formulario táctil con validaciones y deshabilitación durante el envío.
   - [`src/components/TicketHistory.tsx`](file:///c:/TIC/Registros_tic/src/components/TicketHistory.tsx): Vista de auditoría con miniaturas de firmas y modal de expansión.

4. **Service Worker & PWA:**
   - [`vite.config.ts`](file:///c:/TIC/Registros_tic/vite.config.ts): Configuración del plugin `vite-plugin-pwa` para caching offline y manifiesto web.

5. **Guía de Looker Studio:**
   - [`LOOKER_STUDIO_GUIDE.md`](file:///c:/TIC/Registros_tic/LOOKER_STUDIO_GUIDE.md): Instrucciones para conectar PostgreSQL y aplicar la fórmula de imagen.

---

## Decisiones Técnicas

- **Firma recortada (`getTrimmedCanvas`):** Se prefirió recortar los espacios transparentes vacíos para reducir el peso de los archivos PNG a menos de 50KB por firma.
- **Tailwind CSS v4 en lugar de UI Frameworks pesados:** Garantiza máxima velocidad en celulares antiguos y tiempo de carga menor a 1 segundo.
- **Fallback a `localStorage`:** Asegura que si Supabase no está configurado o falla la red, el usuario no pierda el registro y pueda trabajar en modo demo/offline.

---

## Riesgos y Mitigación

- **Incompatibilidad de touch scroll en móviles:** Mitigado agregando `.signature-canvas-container canvas { touch-action: none !important; }`.
- **Bloqueo por falta de credenciales Supabase:** Mitigado con la constante `isSupabaseConfigured` en `lib/supabase.ts`.
