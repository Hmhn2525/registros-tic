import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Usuario, CategoriaSoporte, ActivoTIC, Ticket, TicketFormInput } from '../types';

// Datos semilla de prueba si Supabase no está configurado aún en .env
const MOCK_USUARIOS: Usuario[] = [
  { id: 'a0000000-0000-0000-0000-000000000001', id_empleado: '4034', nombre: 'Juan Pérez', email: 'juan.perez@empresa.com', departamento: 'Contabilidad' },
  { id: 'a0000000-0000-0000-0000-000000000002', id_empleado: '354', nombre: 'Maria Rodríguez', email: 'maria.rodriguez@empresa.com', departamento: 'Recursos Humanos' },
  { id: 'a0000000-0000-0000-0000-000000000003', id_empleado: '155', nombre: 'Carlos Gómez', email: 'carlos.gomez@empresa.com', departamento: 'Operaciones' }
];

const MOCK_CATEGORIAS: CategoriaSoporte[] = [
  { id: 1, nombre: 'Hardware / Equipo', descripcion: 'Fallas físicas en laptop, monitor o periféricos' },
  { id: 2, nombre: 'Software / Aplicaciones', descripcion: 'Errores en SO, Office, ERP o licencias' },
  { id: 3, nombre: 'Redes y Conectividad', descripcion: 'Falla de Wi-Fi, cable de red, VPN' },
  { id: 4, nombre: 'Impresoras y Escáneres', descripcion: 'Atasco de papel, tóner, desconexión' },
  { id: 5, nombre: 'Mantenimiento Preventivo', descripcion: 'Limpieza y optimización' }
];

const MOCK_ACTIVOS: ActivoTIC[] = [
  { id: 'b0000000-0000-0000-0000-000000000001', codigo_inventario: 'TIC-LAP-042', nombre_equipo: 'Dell Latitude 3420', tipo: 'Laptop', usuario_id: 'a0000000-0000-0000-0000-000000000001' },
  { id: 'b0000000-0000-0000-0000-000000000002', codigo_inventario: 'TIC-PC-015', nombre_equipo: 'HP ProDesk 400', tipo: 'Desktop', usuario_id: 'a0000000-0000-0000-0000-000000000002' },
  { id: 'b0000000-0000-0000-0000-000000000003', codigo_inventario: 'TIC-IMP-008', nombre_equipo: 'Epson EcoTank L5290', tipo: 'Impresora', usuario_id: 'a0000000-0000-0000-0000-000000000003' }
];

const LOCAL_STORAGE_TICKETS_KEY = 'tic_tickets_offline_queue';

// Convierte Base64 dataURL a un objeto Blob (archivo comprimido)
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Obtener Usuarios
export async function getUsuarios(): Promise<Usuario[]> {
  if (!isSupabaseConfigured) return MOCK_USUARIOS;
  try {
    const { data, error } = await supabase.from('usuarios').select('*').order('nombre');
    if (error) throw error;
    return data || MOCK_USUARIOS;
  } catch (err) {
    console.warn('Error al cargar usuarios de Supabase, usando locales:', err);
    return MOCK_USUARIOS;
  }
}

// Obtener Categorías
export async function getCategorias(): Promise<CategoriaSoporte[]> {
  if (!isSupabaseConfigured) return MOCK_CATEGORIAS;
  try {
    const { data, error } = await supabase.from('categorias_soporte').select('*').order('nombre');
    if (error) throw error;
    return data || MOCK_CATEGORIAS;
  } catch (err) {
    console.warn('Error al cargar categorías de Supabase:', err);
    return MOCK_CATEGORIAS;
  }
}

// Obtener Activos TIC
export async function getActivosTIC(): Promise<ActivoTIC[]> {
  if (!isSupabaseConfigured) return MOCK_ACTIVOS;
  try {
    const { data, error } = await supabase.from('activos_tic').select('*').order('codigo_inventario');
    if (error) throw error;
    return data || MOCK_ACTIVOS;
  } catch (err) {
    console.warn('Error al cargar activos de Supabase:', err);
    return MOCK_ACTIVOS;
  }
}

// Guardar Ticket de Soporte con Firma
export async function createTicket(input: TicketFormInput): Promise<{ success: boolean; message: string; ticket?: Ticket }> {
  let publicSignatureUrl: string | null = null;

  if (input.signatureDataUrl) {
    try {
      const blob = dataURLtoBlob(input.signatureDataUrl);
      const filename = `firma_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

      if (isSupabaseConfigured) {
        const { error: uploadError } = await supabase.storage
          .from('firmas')
          .upload(filename, blob, { contentType: 'image/png', upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('firmas')
            .getPublicUrl(filename);
          
          publicSignatureUrl = publicUrlData.publicUrl;
        }
      } else {
        publicSignatureUrl = input.signatureDataUrl;
      }
    } catch (err) {
      console.error('Error al procesar la firma:', err);
    }
  }

  const estadoInicial: 'Pendiente' | 'En Proceso' | 'Atendido' | 'Cerrado' = publicSignatureUrl || input.notas_adicionales?.includes('PIN')
    ? 'Atendido' 
    : (input.notas_adicionales?.includes('Firma Remota') ? 'Pendiente' : 'Atendido');

  const newTicketData = {
    usuario_id: input.usuario_id,
    activo_id: input.activo_id || null,
    categoria_id: input.categoria_id,
    descripcion_falla: input.descripcion_falla,
    nombre_tecnico: input.nombre_tecnico,
    estado: estadoInicial,
    url_firma: publicSignatureUrl,
    notas_adicionales: input.notas_adicionales || null
  };

  if (isSupabaseConfigured && navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([newTicketData])
        .select('*, usuarios(nombre, departamento), activos_tic(codigo_inventario, nombre_equipo), categorias_soporte(nombre)')
        .single();

      if (error) throw error;
      return { success: true, message: 'Ticket registrado con éxito en Supabase.', ticket: data };
    } catch (err: any) {
      console.error('Error al insertar ticket en Supabase:', err);
      const localTicket = { id: `local-${Date.now()}`, fecha_registro: new Date().toISOString(), ...newTicketData };
      saveOfflineTicket(localTicket);
      return { success: true, message: 'Guardado localmente.', ticket: localTicket };
    }
  } else {
    const localTicket: Ticket = {
      id: `local-${Date.now()}`,
      fecha_registro: new Date().toISOString(),
      ...newTicketData
    };
    saveOfflineTicket(localTicket);
    return { success: true, message: 'Ticket registrado en modo Local.', ticket: localTicket };
  }
}

// Actualizar firma remota enviada por el cliente desde su celular
export async function updateRemoteSignature(ticketId: string, signatureDataUrl: string): Promise<boolean> {
  try {
    const blob = dataURLtoBlob(signatureDataUrl);
    const filename = `firma_remota_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

    let publicUrl = signatureDataUrl;

    if (isSupabaseConfigured) {
      const { error: uploadError } = await supabase.storage
        .from('firmas')
        .upload(filename, blob, { contentType: 'image/png', upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('firmas')
          .getPublicUrl(filename);
        publicUrl = publicUrlData.publicUrl;
      }

      // Validar si ticketId es un UUID válido de PostgreSQL
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(ticketId);

      let updatedRowsCount = 0;

      if (isUUID) {
        const { data: updatedData, error: updateError } = await supabase
          .from('tickets')
          .update({ url_firma: publicUrl, estado: 'Atendido' })
          .eq('id', ticketId)
          .select();

        if (!updateError && updatedData && updatedData.length > 0) {
          updatedRowsCount = updatedData.length;
        }
      }

      // FALLBACK: Si no era un UUID o no se actualizó nada, buscar el ticket más reciente en estado Pendiente
      if (updatedRowsCount === 0) {
        const { data: pendingTickets } = await supabase
          .from('tickets')
          .select('id')
          .eq('estado', 'Pendiente')
          .order('fecha_registro', { ascending: false })
          .limit(1);

        if (pendingTickets && pendingTickets.length > 0) {
          await supabase
            .from('tickets')
            .update({ url_firma: publicUrl, estado: 'Atendido' })
            .eq('id', pendingTickets[0].id);
        }
      }
    }

    // Actualizar también localmente en localStorage
    const offline = getOfflineTickets();
    const updated = offline.map(t => (t.id === ticketId || t.estado === 'Pendiente') ? { ...t, url_firma: publicUrl, estado: 'Atendido' as const } : t);
    localStorage.setItem(LOCAL_STORAGE_TICKETS_KEY, JSON.stringify(updated));

    return true;
  } catch (err) {
    console.error('Error al actualizar la firma remota:', err);
    return false;
  }
}

// Guardar ticket localmente
function saveOfflineTicket(ticket: any) {
  const existing = getOfflineTickets();
  existing.unshift(ticket);
  localStorage.setItem(LOCAL_STORAGE_TICKETS_KEY, JSON.stringify(existing));
}

// Obtener tickets locales acumulados
export function getOfflineTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Obtener lista reciente de tickets para la vista de auditoría
export async function getRecentTickets(): Promise<Ticket[]> {
  if (!isSupabaseConfigured) return getOfflineTickets();
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, usuarios(nombre, departamento), activos_tic(codigo_inventario, nombre_equipo), categorias_soporte(nombre)')
      .order('fecha_registro', { ascending: false })
      .limit(30);

    if (error) throw error;
    const offline = getOfflineTickets();
    return [...offline, ...(data || [])];
  } catch (err) {
    console.warn('Error al obtener tickets recientes:', err);
    return getOfflineTickets();
  }
}
