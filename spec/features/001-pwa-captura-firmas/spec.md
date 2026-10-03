# 001 · Captura de Firmas y PWA Base

**Estado:** Implementado ✅

---

## Qué hace

Permite a los técnicos de soporte TIC registrar una atención en sitio desde un navegador móvil o instalado como PWA. El técnico selecciona el usuario, el equipo y la categoría del problema, ingresa el diagnóstico y solicita al usuario firmar con el dedo en la pantalla del dispositivo. La firma se procesa, se sube como archivo PNG a Supabase Storage y se registra la atención en PostgreSQL para consultarse en Looker Studio.

---

## Por qué

Reemplaza procesos manuales en papel o plataformas no adaptadas a móviles (AppSheet/WhatsApp), proporcionando evidencia digital inmediata, auditable y centralizada sin costo recurrente de licencias.

---

## Criterios de Aceptación (Verificados)

- [x] **Captura Táctil de Firma:** El usuario puede dibujar su firma en un recuadro claro sin que la pantalla del celular se mueva o haga scroll.
- [x] **Recorte de Firma:** El gráfico de la firma elimina bordes sobrantes antes de convertirse a PNG de alto rendimiento.
- [x] **Integración Supabase Storage & DB:** La firma se sube al bucket `firmas` y la URL pública se guarda en el campo `url_firma` del registro en la tabla `tickets`.
- [x] **Fallback Offline & Demo:** Si Supabase no está configurado o el dispositivo no tiene internet, el registro se guarda localmente en `localStorage` sin fallar ni bloquear al usuario.
- [x] **PWA Manifest & Service Worker:** La aplicación incluye manifiesto web e instalación standalone en pantalla de inicio.
- [x] **Compatibilidad con Looker Studio:** Se incluye la estructura de tabla y la fórmula `IMAGE(url_firma)` para previsualizar las firmas en los reportes.

---

## Fuera de Alcance (Diferido a futuras features)

- Sincronización automática periódica en segundo plano de la cola offline (diferido a `002`).
- Login obligatorio de técnicos (diferido a `003`).
