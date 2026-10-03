# Reportes de Registros TIC

Esta guía sustituye a `LOOKER_STUDIO_GUIDE.md`. Se conserva la idea técnica de conectar PostgreSQL con Looker Studio; no acredita que exista un dashboard desplegado.

## Entorno de demostración

Usar una base nueva y aislada, con `supabase_schema.sql` y `supabase/seed.sql`. Todos los ejemplos, capturas y exportaciones deben utilizar datos ficticios. No conectar esta demostración a una base empresarial.

El esquema actual tiene acceso anónimo amplio y un bucket público para firmas. El saneamiento de archivos no corrige esos permisos. Su endurecimiento está pendiente.

## Acceso de solo lectura

No conectar Looker Studio como `postgres`, propietario de la base, administrador ni mediante una clave `service_role` o secreta de Supabase. Solicitar un rol específico de reportes, sin privilegios administrativos ni permisos de escritura.

El administrador del entorno aislado debe conceder únicamente `CONNECT`, `USAGE` sobre el esquema de reportes y `SELECT` sobre las vistas autorizadas. La contraseña se configura en el conector; nunca se escribe en el repositorio. Usar TLS y comprobar las opciones de conexión vigentes en Supabase y Looker Studio.

No otorgar acceso al rol de reportes a la tabla de usuarios, notas libres, firmas, tokens o inventario completo. La vista debe pertenecer a un rol con permisos mínimos. Las vistas pueden ejecutar con permisos de su propietario: revisar su seguridad y acceso antes de exponerlas. En PostgreSQL 15+ puede emplearse `security_invoker`, teniendo en cuenta que requiere permisos y políticas apropiados sobre las tablas subyacentes.

## Datos para el dashboard

Proponer un esquema de reportes fuera de los esquemas expuestos por la Data API. Una vista revisada puede ofrecer fecha, categoría y estado para conteos agregados. Excluir nombre de usuario, correo, identificador laboral, descripción libre, notas, técnico nominal, serie, MAC, `url_firma` y `firma_token_hash`.

No crear vistas ni conceder permisos en el servidor real durante esta etapa. La implementación de la vista y sus pruebas corresponde al endurecimiento de seguridad.

## Firmas y evidencias

No usar `IMAGE(url_firma)` ni URLs públicas de firmas personales en reportes. El dashboard público debe mostrar únicamente indicadores sintéticos; no necesita imágenes de firmas.

Si una operación interna necesita consultar evidencias, implementar una vista de la aplicación con autorización y almacenamiento privado. Las URLs temporales firmadas también permiten acceso a quien las tenga durante su vigencia; no deben insertarse en reportes compartidos ni tratarse como una solución completa de privacidad.

El frontend y la API actuales todavía generan URLs públicas. Esta guía cambia la recomendación documental; la migración de Storage y autorización sigue pendiente.

## Validación antes de compartir

- Verificar que el rol no puede insertar, actualizar, eliminar ni consultar datos excluidos.
- Revisar permisos de la fuente de datos y del reporte, incluidos exportación y enlaces compartidos.
- Confirmar ausencia de firmas, URLs empresariales, datos personales y secretos en capturas o archivos exportados.
- Registrar qué se probó y en qué entorno, sin almacenar credenciales.

Referencias: [Roles de PostgreSQL](https://supabase.com/docs/guides/database/postgres/roles), [seguridad de vistas](https://supabase.com/docs/guides/database/postgres/row-level-security), [buckets privados y públicos](https://supabase.com/docs/guides/storage/buckets/fundamentals).
