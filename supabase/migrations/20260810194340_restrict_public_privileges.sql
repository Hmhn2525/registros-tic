-- El frontend sólo necesita consultar catálogos y consultar/crear tickets.
-- TRUNCATE y DELETE se revocan explícitamente porque no están sujetos a las
-- mismas garantías de RLS que las operaciones ordinarias de filas.
revoke all on public.usuarios, public.categorias_soporte,
  public.activos_tic, public.tickets
from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.usuarios, public.categorias_soporte, public.activos_tic
  to anon, authenticated;
grant select (
  id, fecha_registro, usuario_id, activo_id, categoria_id,
  descripcion_falla, nombre_tecnico, estado, url_firma, notas_adicionales
) on public.tickets to anon, authenticated;
grant insert (
  usuario_id, activo_id, categoria_id, descripcion_falla,
  nombre_tecnico, estado, url_firma, notas_adicionales, firma_token_hash
) on public.tickets to anon, authenticated;
