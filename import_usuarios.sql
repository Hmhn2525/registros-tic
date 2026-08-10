-- ========================================================
-- MIGRACIÓN CORREGIDA DE USUARIOS (SIN DUPLICADOS DE ID)
-- ========================================================

-- 1. ELIMINAR RESTRICCIÓN DE EMAIL ÚNICO (Si existía)
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;

-- 2. ASEGURAR COLUMNAS EN LA TABLA USUARIOS
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS id_empleado TEXT UNIQUE;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS ubicacion TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS estatus TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS puesto TEXT;

-- 3. INSERCIÓN / ACTUALIZACIÓN DE USUARIOS (ÚNICOS POR ID_EMPLEADO)
INSERT INTO public.usuarios (id_empleado, nombre, email, departamento, ubicacion, estatus, puesto)
VALUES
('4034', 'Ana Cristina Jimenez Garcia', 'rrhh.mil@agricolasp.com', 'Capital Humano', 'MILAGRO', '1', 'Generalista de Capital Humano'),
('354', 'Andrés Gonzalez Cansino', 'asistente.milagro@agricolasp.com', 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Asistente de producción piña'),
('155', 'Angel Alberto Gómez Nañes', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('338', 'Angel Gonzalez Ruiz', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('4061', 'Angel Rodriguez Román', 'desarrollo.organizacional@agricolasp.com', 'Capital Humano', 'SAN PABLO', '1', 'Coordinador de capital humano'),
('293', 'Antonio Lopez Rojas', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Supervisor de fruta y cosecha'),
('2159', 'Ariel Manuel Valencia Lezama', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Cabo'),
('5105', 'Bernabe Montiel Sanchez', 'logistica@agricolasp.com', 'Logística y transporte', 'MILAGRO', '1', 'Operador de unidad pesada (A)'),
('4414', 'Carlos Alberto Sarao Alejandro', 'almacen.milagro@agricolasp.com', 'Almacén', 'MILAGRO', '1', 'Supervisor de Almacén'),
('3857', 'Carlos Arturo Cordova Gonzalez', NULL, 'Mantenimiento a maquinaria y equipo', 'SAN PABLO', '1', 'Jefe de mantenimiento a maquinaria y equipo'),
('399', 'Carolina Madrigal Olarte', 'compras1@agricolasp.com', 'Compras', 'SAN PABLO', '1', 'Supervisor de compras'),
('182', 'Cesar Acuña Dominguez', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Cabo'),
('5941', 'Crisalida Hichel Madrigal Olarte', 'sup.fitosanitario.limon@agricolasp.com', 'Indirectos Limón', 'SAN PABLO', '1', 'Supervisor de manejo fitosanitario y nutrición'),
('60', 'Daniel Hernandez Jimenez', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Supervisor de maquinaria agrícola piña'),
('4783', 'Daniel Ramos Hernandez', 'compras@agricolasp.com', 'Compras', 'SAN PABLO', '1', 'Comprador'),
('132', 'Deiver Luna Lopez', 'logistica@agricolasp.com', 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de unidad pesada (A)'),
('3867', 'Digoberto Ruiz Hernandez', 'finanzas@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Gerente de administración y finanzas'),
('23', 'Dionicio Alvarez Lopez', NULL, 'Mantenimiento a maquinaria y equipo', 'SAN PABLO', '1', 'Soldador'),
('5961', 'Dora Carolina Mar Lopez', 'rrhh.limon@agricolasp.com', 'Capital Humano', 'SAN PABLO', '1', 'Generalista de Capital Humano'),
('6018', 'Eddy Garcia Vazquez', NULL, 'Logística y transporte', 'MILAGRO', '1', 'Operador de vehiculo'),
('5551', 'Edgar Ivan Ruiz Fajardo', NULL, 'Mantenimiento a maquinaria y equipo', 'SAN PABLO', '0', 'Controlista'),
('5942', 'Eduardo Cipriano Bautista', 'coord.limon@agricolasp.com', 'Indirectos Limón', 'SAN PABLO', '1', 'Supervisor de labores culturales'),
('456', 'Eliezer Cordova Diaz', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Supervisor de siembra y semilla'),
('4730', 'Elsy Karina Alpuche Pablo', 'enfermeria.milagro@agricolasp.com', 'SST', 'MILAGRO', '1', 'Enfermero'),
('429', 'Enrique Ordoñez Velázquez', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('5328', 'Erick Asunción Sanchez Mendez', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Almacenista'),
('1735', 'Erick Fabian Ramirez Jimenez', 'logistica@agricolasp.com', 'Logística y transporte', 'SAN PABLO', '1', 'Operador de vehiculo'),
('5329', 'Estefanía Irahi Juárez Sigero', 'enfermeria.sanpablo@agricolasp.com', 'SST', 'SAN PABLO', '1', 'Enfermero'),
('5866', 'Fermin Miranda Reyes', 'coord.limon@agricolasp.com', 'Indirectos Limón', 'SAN PABLO', '1', 'Jefe de finca Limón'),
('2182', 'Freddy Diaz Gomez', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Cabo'),
('173', 'Fredy Lopez Gonzalez', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Supervisor de maquinaria agrícola limón'),
('3177', 'Gabriel De La Cruz Cornelio', 'tesoreria@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Especialista Tesorero'),
('2189', 'Geyder Miguel Vazquez Ramirez', NULL, 'Mantenimiento a maquinaria y equipo', 'SAN PABLO', '0', 'Jefe de mantenimiento a maquinaria y equipo'),
('129', 'Guadalupe Gonzalez Oliva', 'logistica@agricolasp.com', 'Logística y transporte', 'MILAGRO', '1', 'Operador de unidad pesada (A)'),
('5387', 'Hector Manuel Hernandez Narvaez', 'analista.tic@agricolasp.com', 'Tecnologías de la Información', 'SAN PABLO', '1', 'Tecnico de TIC'),
('4138', 'Hilario Pérez Montiel', 'sistemas@agricolasp.com', 'Tecnologías de la Información', 'SAN PABLO', '1', 'Tecnico de TIC'),
('69', 'Hugo Alberto Rodriguez García', NULL, 'Logística y transporte', 'SAN PABLO', '1', 'Operador de unidad pesada (B)'),
('4144', 'Hugo De La Rosa Torres', NULL, 'Seguridad Patrimonial', 'SAN PABLO', '0', 'Vigilante (A)'),
('4859', 'Isrrael Alejandro Quiroga', 'logistica@agricolasp.com', 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de vehiculo'),
('5940', 'Jaime Lara Pardo', 'rrhh.encomendero@agricolasp.com', 'Capital Humano', 'ENCOMENDERO', '0', 'Generalista de Capital Humano'),
('71', 'Javier Montes Castellanos', 'logistica@agricolasp.com', 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de unidad pesada (A)'),
('6055', 'Jesús Alberto Montiel Ruiz', 'pendiente', 'Evaluación y mejora', 'SAN PABLO', '1', NULL),
('701', 'Jesús Hernandez Gomez', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('5056', 'Jesus Manuel Notario Herrera', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Almacenista'),
('2307', 'Jesus Martinez Jimenez', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Supervisor de preparación de terreno'),
('4106', 'Jesús Narciso Ruiz Luna', 'rrhh.limon@agricolasp.com', 'Capital Humano', 'SAN PABLO', '0', 'Generalista de Capital Humano'),
('4141', 'Jorge Luis Ramos Lara', 'nominas@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Supervisor de nomina'),
('5066', 'José Alberto Talledo Cruz', 'activosfijos@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Analista de activo fijo y almacén'),
('4415', 'Jose Antonio Murillo Izquierdo', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('63', 'José Del Carmen Martínez Pérez', NULL, 'Logística y transporte', NULL, '1', 'Operador de vehiculo'),
('328', 'Jose Dilmar Santiago Rodriguez', 'gerente.produccion@agricolasp.com', 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Gerente agrícola'),
('4047', 'Jose Emilio Martinez Arcos', NULL, 'Indirectos Limón', 'SAN PABLO', '0', 'Cabo'),
('5077', 'José Francisco Montiel Moreno', 'logistica@agricolasp.com', 'Logística y transporte', 'SAN PABLO', '1', 'Jefe de tráfico y monitoreo'),
('342', 'Jose Luis Morales Lopez', 'supervisor.encomendero@agricolasp.com', 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Supervisor de manejo fitosanitario y nutrición'),
('29', 'Jose Luis Rojas', 'logistica@agricolasp.com', 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de vehiculo'),
('2', 'Joselito Pimienta Garcia', NULL, 'Logística y transporte', 'SAN PABLO', '1', 'Operador de unidad pesada (A)'),
('5186', 'Juan Manrique Salazar Ramos', 'supervisor.sh@agricolasp.com', 'Medio ambiente', 'SAN PABLO', '1', 'Supervisor'),
('5679', 'Juan Pablo Gonzalez Velazquez', 'logistica@agricolasp.com', 'Logística y transporte', 'SAN PABLO', '1', 'Operador de unidad pesada (A)'),
('39', 'Juan Pablo Santa Cruz Vazquez', 'gerente.servicios@agricolasp.com', 'Gestión de infraestructura', 'SAN PABLO', '1', 'Gerente de servicios generales'),
('5999', 'Karen Elizabeth Gomez Morales', 'rrhh.encomendero@agricolasp.com', 'Capital Humano', 'ENCOMENDERO', '1', 'Generalista de Capital Humano'),
('128', 'Lorenzo Antonio Sanchez Gomez', NULL, 'Mantenimiento a maquinaria y equipo', 'SAN PABLO', '1', 'Mecánico (A)'),
('1720', 'Lorenzo Perez Estrada', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Cabo'),
('5268', 'Luis Felipe Mendez Sigero', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Jornalero Agricola'),
('4028', 'Luz Clarita Rodriguez Lopez', 'compras2@agricolasp.com', 'Compras', 'SAN PABLO', '1', 'Comprador'),
('3401', 'Malaquías Martínez Gómez', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Supervisor de Almacén'),
('379', 'Manuel Lopez Rojas', 'almacen.encomendero@agricolasp.com', 'Almacén', 'ENCOMENDERO', '1', 'Supervisor de almacén'),
('5553', 'Marcelino Teratol Diaz', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Cabo'),
('2213', 'Marco Antonio Marquez Garcia', NULL, 'Indirectos Limón', 'SAN PABLO', '0', 'Supervisor de manejo fitosanitario y nutrición'),
('5', 'Marcos Gonzalez Ruiz', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Jefe de finca piña'),
('4147', 'Maria Elizabeth Sanchez Lopez', 'rrhh.sanpablo@agricolasp.com', 'Capital Humano', 'SAN PABLO', '1', 'Analista de Capacitación y Adiestramiento'),
('908', 'Marlene Del Valle Villa', 'supervisor.ventas@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Analista de cuentas por cobrar'),
('4139', 'Miguel Angel Benitez Cruz', 'supervisor.fitosanitario@agricolasp.com', 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Supervisor de manejo fitosanitario y nutrición'),
('20', 'Miguel Angel Ruiz Manzanero', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Supervisor de labores culturales'),
('26', 'Moises Rueda Roman', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Supervisor de cosecha limón'),
('5147', 'Narciso Altunar Angles', 'logistica@agricolasp.com', 'Logística y transporte', 'SAN PABLO', '1', 'Operador de unidad pesada (A)'),
('59', 'Noe Ordoñez Velazquez', NULL, 'Seguridad Patrimonial', 'SAN PABLO', '1', 'Supervisor de seguridad patrimonial'),
('5032', 'Obed Herrera Reyes', 'coord.milagro@agricolasp.com', 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Jefe de finca piña'),
('4501', 'Omar Diaz Santana', 'supervisor.contabilidad@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Contador general'),
('65', 'Osiel De La Cruz Morales', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Supervisor de siembra y semilla'),
('6', 'Osiel Jimenez Leyva', 'asistente.encomendero@agricolasp.com', 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Asistente de producción piña'),
('269', 'Othoniel Sarabia Lopez', 'supervisor.br@agricolasp.com', 'Mantenimiento a infraestructura', 'SAN PABLO', '1', 'Supervisor de mantenimiento a infraestructura'),
('10', 'Pablo Gonzalez Ruiz', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Almacenista'),
('4125', 'Pablo Sanchez Ramirez', NULL, 'Seguridad Patrimonial', 'SAN PABLO', '0', 'Vigilante (A)'),
('641', 'Porfirio Zurian Hernandez', 'asistente.limon@agricolasp.com', 'Indirectos Limón', 'SAN PABLO', '1', 'Jornalero Agricola'),
('372', 'Ramon Gonzalez Guarda', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '1', 'Supervisor de fruta y cosecha'),
('31', 'Reinaldo Lopez Gonzalez', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '0', 'Supervisor de preparación de terreno'),
('535', 'Ricardo Romero Esteban', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Jornalero Agricola'),
('4185', 'Rigoberto Montiel Ramirez', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Almacenista'),
('5407', 'Roberto Garcia Santillán', 'auxiliar.compras@agricolasp.com', 'Compras', 'SAN PABLO', '1', 'Auxiliar de Compras'),
('5631', 'Rodrigo Ramirez Morales', 'logistica@agricolasp.com', 'Logística y transporte', 'MILAGRO', '0', 'Operador de unidad pesada (A)'),
('4383', 'Roger Hernández Hernández', 'rrhh.encomendero@agricolasp.com', 'Capital Humano', 'SAN PABLO', '1', 'Generalista de Capital Humano'),
('4786', 'Román Martinez Perez', NULL, 'Logística y transporte', 'ENCOMENDERO', '0', 'Operador de vehiculo'),
('589', 'Rosalino Pablo Alegria', NULL, 'Indirectos Limón', 'SAN PABLO', '1', 'Jornalero Agricola'),
('41', 'Rosario Gordillo Álvarez', NULL, 'Indirectos Piña Encomendero', 'ENCOMENDERO', '1', 'Supervisor de maquinaria agrícola piña'),
('268', 'Rosendo Ramon Cruz', 'bienes.raices@agricolasp.com', 'Mantenimiento a infraestructura', 'SAN PABLO', '1', 'Jefe de mantenimiento a infraestructura'),
('5254', 'San Martin Ayala Moreno', NULL, 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de unidad pesada (A)'),
('2153', 'Sara Ramirez Flores', NULL, 'Indirectos Piña Milagro', 'MILAGRO', '0', 'Cabo'),
('4151', 'Soledad Garcia Montejo', 'analista.nominas@agricolasp.com', 'Administración y Finanzas', 'SAN PABLO', '1', 'Analista de nominas'),
('907', 'Susana Graciela Infante Dzul', NULL, 'Evaluación y mejora', 'SAN PABLO', '0', 'Monitor de evaluación y mejora'),
('4979', 'Tomas Morales Rivera', 'logistica@agricolasp.com', 'Logística y transporte', 'MILAGRO', '0', 'Operador de unidad pesada (A)'),
('5076', 'Vanny Cristel Ramos Garcia', NULL, 'Capital Humano', 'SAN PABLO', '0', 'Reclutador'),
('1', 'Victor Vazquez Pichardo', NULL, 'Dirección General', 'SAN PABLO', '1', 'Director'),
('5403', 'Wendy Paola Perez Javier', 'enfermeria.encomendero@agricolasp.com', 'SST', 'ENCOMENDERO', '1', 'Enfermero'),
('43', 'Wilber Simon Mayor Alejandro', 'logistica@agricolasp.com', 'Logística y transporte', 'ENCOMENDERO', '1', 'Operador de unidad pesada (A)'),
('5960', 'William Garcia Luna', 'almacen.sanpablo@agricolasp.com', 'Almacén', 'SAN PABLO', '1', 'Almacenista'),
('4142', 'Williams Sanchez Morales', NULL, 'Administración y Finanzas', 'SAN PABLO', '0', 'Analista de cuentas por pagar'),
('125', 'Yeredy Notario Barahona', 'coord.inocuidad@agricolasp.com', 'Medio ambiente', 'SAN PABLO', '1', 'Coordinador de seguridad alimentaria')
ON CONFLICT (id_empleado) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  email = EXCLUDED.email,
  departamento = EXCLUDED.departamento,
  ubicacion = EXCLUDED.ubicacion,
  estatus = EXCLUDED.estatus,
  puesto = EXCLUDED.puesto;

-- 4. VINCULACIÓN AUTOMÁTICA DE TODOS LOS ACTIVOS TIC CON SUS USUARIOS
UPDATE public.activos_tic a
SET usuario_id = u.id
FROM public.usuarios u
WHERE a.id_responsable = u.id_empleado;

-- 5. CONSULTA DE VERIFICACIÓN (Muestra cuántos activos quedaron vinculados)
SELECT 
  COUNT(*) AS total_equipos,
  COUNT(usuario_id) AS equipos_vinculados_a_usuario,
  COUNT(*) - COUNT(usuario_id) AS equipos_sin_usuario_asignado
FROM public.activos_tic;