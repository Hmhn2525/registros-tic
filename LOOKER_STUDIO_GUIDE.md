# Guía de Conexión: Supabase PostgreSQL a Looker Studio

Esta guía detalla cómo conectar tu base de datos de **Supabase** a **Looker Studio** para crear reportes interactivos y visualizar la evidencia de firma digital en tus tableros.

---

## 1. Obtener Credenciales de Conexión en Supabase

1. Inicia sesión en tu panel de [Supabase](https://supabase.com/).
2. Selecciona tu proyecto y ve a **Project Settings** (el ícono de engranaje ⚙️) > **Database**.
3. Busca la sección **Connection parameters**:
   * **Host:** `db.<tu-project-ref>.supabase.co` (o la dirección de tu Transaction Pooler `aws-0-region.pooler.supabase.com`)
   * **Port:** `5432` (conexión directa) o `6543` (connection pooler)
   * **Database name:** `postgres`
   * **User:** `postgres`
   * **Password:** La contraseña creada al inicializar el proyecto en Supabase.

---

## 2. Configurar la Fuente de Datos en Looker Studio

1. Entra a [Looker Studio](https://lookerstudio.google.com/).
2. Haz clic en **Crear** > **Fuente de datos**.
3. Busca y selecciona el conector **PostgreSQL**.
4. Ingresa los datos obtenidos en la sección 1:
   * Nombre del Host / IP
   * Puerto (`5432` o `6543`)
   * Base de datos (`postgres`)
   * Usuario y Contraseña
5. Marca la casilla **Habilitar SSL** (Supabase requiere conexión SSL segura).
6. Haz clic en **Autenticar**.
7. Selecciona la tabla `public.tickets` (o escribe una consulta SQL personalizada).

---

## 3. Configurar el Campo de Imagen para la Firma Digital

Para que Looker Studio muestre la firma como una **imagen gráfica** y no solo como un enlace URL:

1. En la lista de campos de tu fuente de datos en Looker Studio, ubica el campo `url_firma`.
2. Opciones de tipo de campo:
   * **Opción A (Cambio de Tipo):** Haz clic en el tipo de campo al lado de `url_firma` y cambia de `Texto` o `URL` a **URL de imagen**.
   * **Opción B (Campo Calculado):** Crea un nuevo campo calculado con la siguiente fórmula:
     ```sql
     IMAGE(url_firma, "Firma de Conformidad")
     ```
3. Agrega una tabla a tu reporte y arrastra los siguientes campos:
   * `fecha_registro`
   * `usuario_id` (o nombre unido)
   * `nombre_tecnico`
   * `descripcion_falla`
   * `Firma de Conformidad` (el campo tipo imagen)

---

## 4. Consulta SQL Optimizada para Vistas en Looker Studio (Opcional)

Si deseas crear una vista combinada en Supabase antes de conectar a Looker Studio, puedes ejecutar este script en el **SQL Editor** de Supabase:

```sql
CREATE OR REPLACE VIEW public.vista_tickets_looker AS
SELECT 
    t.id AS ticket_id,
    t.fecha_registro,
    u.nombre AS nombre_usuario,
    u.departamento,
    a.codigo_inventario,
    a.nombre_equipo,
    c.nombre AS categoria,
    t.descripcion_falla,
    t.nombre_tecnico,
    t.estado,
    t.url_firma
FROM public.tickets t
LEFT JOIN public.usuarios u ON t.usuario_id = u.id
LEFT JOIN public.activos_tic a ON t.activo_id = a.id
LEFT JOIN public.categorias_soporte c ON t.categoria_id = c.id;
```

Luego, en Looker Studio seleccionas la vista `vista_tickets_looker` como fuente de datos.
