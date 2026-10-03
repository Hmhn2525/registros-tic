# Plan de implementación

1. Clonar el bundle con objetos independientes y confirmar rama, HEAD y limpieza.
2. Sustituir constantes demo en TicketForm y ticketService; rechazar placeholders como configuración real.
3. Crear seed.sql con claves estables, relaciones y ON CONFLICT DO NOTHING; verificar reejecución en PostgreSQL aislado.
4. Convertir el estado histórico y revisar reportes sin incluir datos privados.
5. Comparar duplicados; migrar mejoras del historial, retirar copias y recursos no utilizados.
6. Verificar npm, escaneo de datos, integridad del respaldo y diferencias pendientes.

No se cambian políticas RLS, bucket público, login, API de firma ni motor offline. Esos límites se registran para una etapa posterior.
