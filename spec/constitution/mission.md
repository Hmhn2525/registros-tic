# Misión del Proyecto

La razón de ser del proyecto **PWA Registro de Soporte TIC** es garantizar la captura rápida, confiable y verificable de la evidencia de atenciones técnicas en sitio, eliminando el uso de papel o plataformas externas inflexibles.

---

## Qué construimos

Una Progressive Web App (PWA) ligera, moderna y responsiva orientada a celulares y tablets que permite a los técnicos de TIC registrar servicios en sitio, capturar la firma digital de conformidad del cliente y alimentar en tiempo real la base de datos central en **Supabase** y los tableros de auditoría en **Looker Studio**.

### Componentes Principales:
1. **PWA Móvil Táctil:** Interfaz en React + Vite + Tailwind CSS para técnicos en sitio con lienzo interactivo de firma digital.
2. **Backend Serverless (Supabase):** PostgreSQL relacional para almacenamiento de registros y Storage de archivos PNG de firmas con URLs públicas.
3. **Dashboard de Auditoría (Looker Studio):** Tableros ejecutivos alimentados por el conector de PostgreSQL renderizando imágenes directas de las firmas con la función `IMAGE()`.

---

## Para quién

- **Técnicos TIC en Sitio:** Necesitan una herramienta rápida en su celular que funcione sin demoras, incluso con mala señal de internet.
- **Usuarios / Clientes Internos:** Firman la conformidad del servicio recibido en la pantalla del dispositivo.
- **Coordinador y Gerencia de TIC:** Consultan reportes consolidados en Looker Studio con evidencia visual auditante.

---

## Principios Rectores

- **Velocidad y Simplicidad Móvil:** La app debe permitir completar un registro de soporte y firma en menos de 45 segundos.
- **Resiliencia Offline:** Si el sitio no tiene señal de internet, los datos y la firma no se deben perder; se almacenan localmente y se sincronizan al recuperar conexión.
- **Integridad de Datos:** La firma se procesa de forma transparente recortando áreas en blanco para minimizar el consumo de ancho de banda y almacenamiento.
- **Estética Premium:** La interfaz utiliza Glassmorphism, modo oscuro con alto contraste para legibilidad en campo y micro-interacciones pulidas.

---

## Qué NO es

- **NO es una aplicación AppSheet ni usa conectores de WhatsApp:** Se descartaron por limitaciones de personalización, costos y flexibilidad visual.
- **NO es un sistema ERP de inventario completo:** Administra la relación con activos TIC para el soporte, pero no reemplaza la contabilidad de activos.
- **NO requiere instalación desde App Stores:** Es una PWA que se añade a la pantalla de inicio directamente desde el navegador web mediante HTTPS.
