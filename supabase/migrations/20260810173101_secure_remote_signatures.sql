-- Sólo se guarda SHA-256 del token. El secreto permanece en el enlace remoto.
alter table public.tickets add column if not exists firma_token_hash text;
create unique index if not exists tickets_firma_token_hash_key
  on public.tickets (firma_token_hash);

-- Retira permisos públicos de actualización de versiones anteriores. La firma
-- remota se procesa únicamente con la clave privada en la función de Vercel.
drop policy if exists "Permitir actualizacion publica tickets" on public.tickets;
drop policy if exists "Permitir actualizacion publica usuarios" on public.usuarios;
drop policy if exists "Permitir actualizacion publica activos" on public.activos_tic;
drop policy if exists "Actualizacion publica de firmas" on storage.objects;

revoke update on public.tickets, public.usuarios, public.activos_tic
  from anon, authenticated;
