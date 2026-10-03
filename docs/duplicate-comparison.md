# Comparación y consolidación de copias raíz

Comparación realizada contra `main`, commit `a9026bf`, antes de retirar archivos de la copia independiente. Los originales permanecen en el respaldo privado y en el historial sin reescribir.

| Copia raíz | Implementación activa | Diferencias y decisión |
|---|---|---|
| `TicketForm.tsx` | `src/components/TicketForm.tsx` | La raíz construía un enlace con ID de ticket y nombre de usuario, sin hash de token ni confirmación de sincronización. El componente activo ya incorpora copiar/compartir y un token aleatorio con hash. Se conserva el flujo activo; no se migra el nombre en URL ni enlaces de tickets locales. Se elimina el destino LAN fijo y se asegura que una firma presencial previa no se envíe por error al cambiar a modalidad remota. |
| `TicketHistory.tsx` | `src/components/TicketHistory.tsx` | Solo la raíz incluía refresco cada cuatro segundos, badge de pendiente, mensaje de espera y notas adicionales. Se migran explícitamente al componente activo: polling solo en pestaña visible, sin peticiones simultáneas, con limpieza del intervalo; notas con códigos PIN ocultos. El resto de la galería y modal ya existe. |
| `RemoteSignatureView.tsx` | `src/components/RemoteSignatureView.tsx` | La raíz utilizaba ID y nombre del solicitante y actualizaba mediante el servicio del navegador. La versión activa envía el token a la API. Se conserva el saludo genérico y la API; no se migra el nombre desde parámetros URL ni la escritura pública desde cliente. |
| `ticketService.ts` | `src/services/ticketService.ts` | La raíz usaba upsert de firmas, consultas `*` y actualización remota desde el navegador. Con un ID inválido podía elegir el último pendiente o modificar varios pendientes locales. El servicio activo limita columnas, transmite hash y distingue guardado local de sincronización confirmada. Se conserva el activo; no se migra la actualización insegura ni el upsert. |

Los imports relativos de las copias raíz tampoco corresponden a su ubicación. Ninguna copia raíz es importada por el grafo activo `src/main.tsx` → `src/App.tsx` → componentes/servicios.

## Otras retiradas

- `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg` y `src/assets/vite.svg`: sin referencias en el código o configuración; recursos de la plantilla.
- `pnpm-lock.yaml`: se adopta npm, conservando `package-lock.json` sin actualizar sus resoluciones.
- `import_usuarios.sql`, `import_inventario.sql` y el `dist/` antiguo: no intervienen en `tsc` ni Vite; se retiran solo de la copia de trabajo después de comprobar la semilla sintética. El build regenera `dist/`; para mantener visibles las retiradas de los artefactos antes versionados, el resultado nuevo se conserva en `.audit/build-output/`. Añadir `dist/` al ignore por sí solo no deja de seguir archivos ya versionados.

El estado del índice y HEAD no se modifica en esta etapa: las retiradas son cambios locales pendientes de commit. Ninguna de ellas borra el historial Git.
