-- ========================================================
-- SCRIPT SQL COMPLETO Y VERSIONADO PARA SUPABASE
-- Proyecto: PWA de Evidencia y Registro de Soporte TIC
-- Repositorio: Hmhn2525/registros-tic
-- ========================================================

-- 1. CREACIÓN DE TABLAS
-- --------------------------------------------------------

-- Tabla de Usuarios del sistema (empleados/solicitantes)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empleado TEXT UNIQUE, -- Número de empleado / nómina (ej: 5329, 4061, 399)
    nombre TEXT NOT NULL,
    email TEXT,
    departamento TEXT NOT NULL,
    ubicacion TEXT,
    estatus TEXT DEFAULT '1',
    puesto TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Categorías de Soporte TIC
CREATE TABLE IF NOT EXISTS public.categorias_soporte (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla de Activos TIC (Laptops, Desktops, Impresoras, etc.)
CREATE TABLE IF NOT EXISTS public.activos_tic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_inventario TEXT NOT NULL UNIQUE,
    id_responsable TEXT, -- Guarda el id_empleado temporalmente antes de vincular
    estatus TEXT DEFAULT 'Activo',
    tipo TEXT NOT NULL,
    marca TEXT,
    modelo TEXT,
    nombre_equipo TEXT NOT NULL,
    mac TEXT,
    serie TEXT,
    fecha_compra TEXT,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla Principal de Tickets / Evidencia de Soporte
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_registro TIMESTAMPTZ DEFAULT NOW(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    activo_id UUID REFERENCES public.activos_tic(id) ON DELETE SET NULL,
    categoria_id INT REFERENCES public.categorias_soporte(id) ON DELETE RESTRICT,
    descripcion_falla TEXT NOT NULL,
    nombre_tecnico TEXT NOT NULL,
    estado TEXT DEFAULT 'Atendido' CHECK (estado IN ('Pendiente', 'En Proceso', 'Atendido', 'Cerrado')),
    url_firma TEXT, -- URL pública de la imagen alojada en Supabase Storage
    notas_adicionales TEXT
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS) & POLÍTICAS COMPLETAS
-- --------------------------------------------------------
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_soporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activos_tic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE LECTURA (SELECT)
CREATE POLICY "Permitir lectura publica usuarios" ON public.usuarios FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica categorias" ON public.categorias_soporte FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica activos" ON public.activos_tic FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica tickets" ON public.tickets FOR SELECT USING (true);

-- POLÍTICAS DE INSERCIÓN (INSERT)
CREATE POLICY "Permitir insercion publica tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insercion publica usuarios" ON public.usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insercion publica activos" ON public.activos_tic FOR INSERT WITH CHECK (true);

-- POLÍTICAS DE ACTUALIZACIÓN (UPDATE) - CRÍTICAS PARA FIRMA REMOTA
CREATE POLICY "Permitir actualizacion publica tickets" ON public.tickets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Permitir actualizacion publica usuarios" ON public.usuarios FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Permitir actualizacion publica activos" ON public.activos_tic FOR UPDATE USING (true) WITH CHECK (true);

-- 3. CREACIÓN Y CONFIGURACIÓN DEL BUCKET DE STORAGE "firmas"
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('firmas', 'firmas', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage RLS para el Bucket "firmas"
CREATE POLICY "Lectura publica de firmas"
ON storage.objects FOR SELECT
USING (bucket_id = 'firmas');

CREATE POLICY "Subida publica de firmas"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'firmas');

CREATE POLICY "Actualizacion publica de firmas"
ON storage.objects FOR UPDATE
USING (bucket_id = 'firmas');

-- 4. DATOS SEMILLA (CATEGORÍAS DE SOPORTE)
-- --------------------------------------------------------
INSERT INTO public.categorias_soporte (nombre, descripcion) VALUES
('Hardware / Equipo', 'Fallas físicas en laptop, monitor, teclado, mouse o perifericos'),
('Software / Aplicaciones', 'Errores en SO, Office, ERP, Antivirus o licencias'),
('Redes y Conectividad', 'Falla de Wi-Fi, cable de red, VPN o acceso a servidores'),
('Impresoras y Escáneres', 'Atasco de papel, tóner, desconexión de red'),
('Mantenimiento Preventivo', 'Limpieza, actualización de software, optimización')
ON CONFLICT (nombre) DO NOTHING;
