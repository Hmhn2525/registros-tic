export interface Usuario {
  id: string;
  id_empleado?: string | null;
  nombre: string;
  email: string | null;
  departamento: string;
  fecha_creacion?: string;
}

export interface CategoriaSoporte {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface ActivoTIC {
  id: string;
  codigo_inventario: string;
  nombre_equipo: string;
  tipo: string;
  marca?: string | null;
  modelo?: string | null;
  mac?: string | null;
  serie?: string | null;
  estatus?: string | null;
  id_responsable?: string | null;
  fecha_compra?: string | null;
  usuario_id: string | null;
}

export interface Ticket {
  id: string;
  fecha_registro: string;
  usuario_id: string;
  activo_id: string | null;
  categoria_id: number;
  descripcion_falla: string;
  nombre_tecnico: string;
  estado: 'Pendiente' | 'En Proceso' | 'Atendido' | 'Cerrado';
  url_firma: string | null;
  notas_adicionales?: string | null;
  // Campos unidos en la consulta
  usuarios?: { nombre: string; departamento: string; id_empleado?: string };
  activos_tic?: { codigo_inventario: string; nombre_equipo: string; tipo?: string; serie?: string };
  categorias_soporte?: { nombre: string };
}

export interface TicketFormInput {
  usuario_id: string;
  activo_id: string;
  categoria_id: number;
  descripcion_falla: string;
  nombre_tecnico: string;
  notas_adicionales?: string;
  signatureDataUrl?: string;
}
