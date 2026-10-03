-- DEMOSTRACIÓN: datos creados desde cero, exclusivamente sintéticos.
-- Ejecutar después de supabase_schema.sql en una base nueva y aislada.
-- No modifica esquema, permisos, registros existentes, firmas ni tokens.
BEGIN;

INSERT INTO public.categorias_soporte (nombre, descripcion) VALUES
('Hardware / Equipo', 'Categoría demo para equipo'),
('Software / Aplicaciones', 'Categoría demo para aplicaciones'),
('Redes y Conectividad', 'Categoría demo para conectividad'),
('Impresoras y Escáneres', 'Categoría demo para impresión'),
('Mantenimiento Preventivo', 'Categoría demo para mantenimiento')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.usuarios
    (id, id_empleado, nombre, email, departamento, ubicacion, estatus, puesto)
VALUES
('a0000000-0000-0000-0000-000000000001', 'EMP-DEMO-001', 'Usuario Demo 01', 'usuario01@example.invalid', 'Área Demo A', 'Zona Demo A', '1', 'Puesto Demo A'),
('a0000000-0000-0000-0000-000000000002', 'EMP-DEMO-002', 'Usuario Demo 02', 'usuario02@example.invalid', 'Área Demo B', 'Zona Demo B', '1', 'Puesto Demo B'),
('a0000000-0000-0000-0000-000000000003', 'EMP-DEMO-003', 'Usuario Demo 03', 'usuario03@example.invalid', 'Área Demo C', 'Zona Demo C', '1', 'Puesto Demo C')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activos_tic
    (id, codigo_inventario, id_responsable, estatus, tipo, nombre_equipo,
     usuario_id, marca, modelo, mac, serie, fecha_compra)
VALUES
('b0000000-0000-0000-0000-000000000001', 'DEMO-LAP-001', 'EMP-DEMO-001', 'Activo', 'Laptop', 'Laptop Demo 01', 'a0000000-0000-0000-0000-000000000001', NULL, NULL, NULL, NULL, NULL),
('b0000000-0000-0000-0000-000000000002', 'DEMO-PC-001', 'EMP-DEMO-002', 'Activo', 'Desktop', 'Equipo Demo 01', 'a0000000-0000-0000-0000-000000000002', NULL, NULL, NULL, NULL, NULL),
('b0000000-0000-0000-0000-000000000003', 'DEMO-IMP-001', 'EMP-DEMO-003', 'Activo', 'Impresora', 'Impresora Demo 01', 'a0000000-0000-0000-0000-000000000003', NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tickets
    (id, fecha_registro, usuario_id, activo_id, categoria_id,
     descripcion_falla, nombre_tecnico, estado, notas_adicionales,
     url_firma, firma_token_hash)
VALUES
('c0000000-0000-0000-0000-000000000001', '2026-01-01T10:00:00Z',
 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
 (SELECT id FROM public.categorias_soporte WHERE nombre = 'Hardware / Equipo'),
 'Ejemplo ficticio: revisión de un equipo de demostración.', 'Técnico Demo 01', 'Pendiente',
 'DEMO: estado ilustrativo; no se ha emitido enlace de firma.', NULL, NULL),
('c0000000-0000-0000-0000-000000000002', '2026-01-01T11:00:00Z',
 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002',
 (SELECT id FROM public.categorias_soporte WHERE nombre = 'Software / Aplicaciones'),
 'Ejemplo ficticio: configuración de una aplicación de demostración.', 'Técnico Demo 02', 'En Proceso',
 'DEMO: registro sintético sin personas ni evidencias reales.', NULL, NULL),
('c0000000-0000-0000-0000-000000000003', '2026-01-01T12:00:00Z',
 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
 (SELECT id FROM public.categorias_soporte WHERE nombre = 'Impresoras y Escáneres'),
 'Ejemplo ficticio: prueba de impresión en equipo de demostración.', 'Técnico Demo 01', 'Cerrado',
 'DEMO: cierre ilustrativo; no representa conformidad o firma de una persona.', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

COMMIT;
