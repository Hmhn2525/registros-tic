# Roadmap del Proyecto Registros TIC

Visión general del avance, funcionalidades completadas y backlog prioritario de desarrollo.

---

## Hecho ✅

1. **001 · Captura de Firmas y PWA Base** — Desarrollo de la PWA responsiva en React + Vite + Tailwind CSS con lienzo de firma táctil (`react-signature-canvas`), guardado de imágenes en Supabase Storage, esquema PostgreSQL y guía de integración con Looker Studio.

---

## Siguiente 🔜

2. **002 · Sincronización Automática de Cola Offline** — Implementación de un motor de fondo que detecta el restablecimiento de la conexión a internet (`window.addEventListener('online')`) y envía automáticamente los tickets y firmas acumulados en `localStorage` hacia Supabase.

---

## Backlog / Ideas 💡

- **003 · Autenticación de Técnicos en Supabase** — Agregar inicio de sesión mediante Supabase Auth (Email/Password o Magic Link) para que solo técnicos autorizados puedan registrar tickets y auditar servicios.
- **004 · Geolocalización GPS en Evidencias** — Captura opcional de coordenadas de ubicación (`navigator.geolocation`) al firmar el ticket para validar la presencia física del técnico en el sitio del cliente.
- **005 · Exportación a Comprobante PDF** — Generar un recibo digital en formato PDF con el resumen de la falla, datos del equipo y la firma de conformidad incrustada para enviarlo opcionalmente por correo al usuario atendido.
