import React, { useState, useEffect, useMemo } from 'react';
import type { Usuario, CategoriaSoporte, ActivoTIC, TicketFormInput } from '../types';
import { getUsuarios, getCategorias, getActivosTIC, createTicket } from '../services/ticketService';
import { SignatureCanvas } from './SignatureCanvas';
import { 
  User, Laptop, Wrench, FileText, UserCheck, Send, Loader2, AlertCircle, 
  CheckCircle2, Filter, Search, Building2, Smartphone, Share2, KeyRound, Copy, Check, ExternalLink
} from 'lucide-react';

interface TicketFormProps {
  onSuccess: () => void;
}

const TECNICOS_PREDEFINIDOS = [
  'Hector Manuel Hernández Narváez',
  'Hilario Pérez Montiel'
];

export const TicketForm: React.FC<TicketFormProps> = ({ onSuccess }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<CategoriaSoporte[]>([]);
  const [activos, setActivos] = useState<ActivoTIC[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [activoId, setActivoId] = useState<string>('');
  const [especificarOtroActivo, setEspecificarOtroActivo] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [descripcionFalla, setDescripcionFalla] = useState<string>('');
  const [nombreTecnico, setNombreTecnico] = useState<string>(TECNICOS_PREDEFINIDOS[0]);
  const [notasAdicionales, setNotasAdicionales] = useState<string>('');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Filtros de usuario
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>('');
  const [busquedaUsuario, setBusquedaUsuario] = useState<string>('');

  // Estado para mostrar todos los activos o solo los vinculados al usuario
  const [mostrarTodosLosActivos, setMostrarTodosLosActivos] = useState<boolean>(false);

  // Modalidad de Firma (Presencial vs Remota)
  const [modalidadFirma, setModalidadFirma] = useState<'presencial' | 'remota_link' | 'remota_pin'>('presencial');
  const [pinVerificacion, setPinVerificacion] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    async function loadFormData() {
      setLoading(true);
      try {
        const [usersData, catsData, assetsData] = await Promise.all([
          getUsuarios(),
          getCategorias(),
          getActivosTIC()
        ]);
        setUsuarios(usersData);
        setCategorias(catsData);
        setActivos(assetsData);

        if (usersData.length > 0) {
          const firstUser = usersData[0];
          setUsuarioId(firstUser.id);
          const userAsset = assetsData.find(a => a.usuario_id === firstUser.id);
          if (userAsset) {
            setActivoId(userAsset.id);
          }
        }
        if (catsData.length > 0) setCategoriaId(catsData[0].id);
      } catch (err) {
        console.error('Error al cargar datos del formulario:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFormData();
  }, []);

  // Obtener lista única de departamentos
  const departamentosUnicos = useMemo(() => {
    const depts = usuarios.map(u => u.departamento).filter(Boolean);
    return Array.from(new Set(depts)).sort();
  }, [usuarios]);

  // Filtrar usuarios por departamento y término de búsqueda
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const matchDept = !departamentoFiltro || u.departamento === departamentoFiltro;
      const term = busquedaUsuario.toLowerCase().trim();
      const matchSearch = !term || 
        u.nombre.toLowerCase().includes(term) || 
        (u.id_empleado && u.id_empleado.toLowerCase().includes(term)) ||
        (u.departamento && u.departamento.toLowerCase().includes(term));
      return matchDept && matchSearch;
    });
  }, [usuarios, departamentoFiltro, busquedaUsuario]);

  // AUTO-SINCRONIZACIÓN: Al escribir en el buscador o filtrar por departamento, seleccionar automáticamente el primer usuario resultante
  useEffect(() => {
    if (usuariosFiltrados.length > 0) {
      const isCurrentInFiltered = usuariosFiltrados.some(u => u.id === usuarioId);
      if (!isCurrentInFiltered) {
        const firstUser = usuariosFiltrados[0];
        setUsuarioId(firstUser.id);
        const userAssets = activos.filter(a => a.usuario_id === firstUser.id);
        setActivoId(userAssets.length > 0 ? userAssets[0].id : '');
      }
    }
  }, [usuariosFiltrados, usuarioId, activos]);

  // Al cambiar manualmente el usuario, filtrar sus activos vinculados
  const handleUsuarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUid = e.target.value;
    setUsuarioId(selectedUid);
    
    const userAssets = activos.filter(a => a.usuario_id === selectedUid);
    if (userAssets.length > 0) {
      setActivoId(userAssets[0].id);
    } else {
      setActivoId('');
    }
  };

  // Filtrado de activos
  const activosFiltrados = usuarioId && !mostrarTodosLosActivos
    ? activos.filter(a => a.usuario_id === usuarioId)
    : activos;

  // Resolución de Dominio Base Inteligente (Sustituye localhost por IP LAN o Dominio Vercel)
  const getBaseAppUrl = () => {
    if (import.meta.env.VITE_PUBLIC_APP_URL) {
      return import.meta.env.VITE_PUBLIC_APP_URL;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://192.168.2.97:${window.location.port || '5173'}`;
    }
    return window.location.origin;
  };

  const usuarioSeleccionadoObj = usuarios.find(u => u.id === usuarioId);
  const baseUrl = getBaseAppUrl();
  const remoteLink = `${baseUrl}/?firmar_ticket=${Date.now()}&usuario=${encodeURIComponent(usuarioSeleccionadoObj?.nombre || '')}`;

  // Copiado resistente a entornos no seguros (HTTP / IP Local)
  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(remoteLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = remoteLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Error al copiar enlace:', err);
    }
  };

  const handleShareWhatsApp = () => {
    const mensaje = `Hola ${usuarioSeleccionadoObj?.nombre || ''}, te compartimos el enlace para confirmar y firmar la atención de soporte TIC recibida:\n\n${remoteLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!usuarioId || !categoriaId || !descripcionFalla.trim()) {
      setFeedback({ type: 'error', message: 'Por favor completa los campos obligatorios marcados con (*).' });
      return;
    }

    if (activoId === 'OTRO' && !especificarOtroActivo.trim()) {
      setFeedback({ type: 'error', message: 'Por favor especifica los detalles del equipo / dispositivo en la casilla de Otro.' });
      return;
    }

    let finalSignatureUrl = signatureDataUrl;

    if (modalidadFirma === 'presencial' && !signatureDataUrl) {
      setFeedback({ type: 'error', message: 'Requerida: La firma digital de conformidad es obligatoria en atención presencial.' });
      return;
    }

    if (modalidadFirma === 'remota_pin' && (!pinVerificacion || pinVerificacion.trim().length < 4)) {
      setFeedback({ type: 'error', message: 'Ingresa un código PIN de verificación de al menos 4 dígitos suministrado por el usuario remoto.' });
      return;
    }

    setSubmitting(true);

    const detalleActivo = activoId === 'OTRO' 
      ? `[Equipo no registrado: ${especificarOtroActivo.trim()}]` 
      : '';

    const notasCompletas = [
      detalleActivo,
      modalidadFirma === 'remota_link' ? '[Firma Remota: Enlace enviado por WhatsApp]' : '',
      modalidadFirma === 'remota_pin' ? `[Firma Remota: Verificado por PIN ${pinVerificacion.trim()}]` : '',
      notasAdicionales.trim()
    ].filter(Boolean).join(' | ');

    const inputData: TicketFormInput = {
      usuario_id: usuarioId,
      activo_id: activoId === 'OTRO' ? '' : activoId,
      categoria_id: Number(categoriaId),
      descripcion_falla: descripcionFalla.trim(),
      nombre_tecnico: nombreTecnico,
      notas_adicionales: notasCompletas,
      signatureDataUrl: finalSignatureUrl || undefined
    };

    const res = await createTicket(inputData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ 
        type: 'success', 
        message: modalidadFirma === 'remota_link'
          ? 'Ticket guardado en estado Pendiente. Se compartió el enlace de firma por WhatsApp al usuario.'
          : 'Atención y evidencia guardada correctamente.'
      });
      setDescripcionFalla('');
      setNotasAdicionales('');
      setEspecificarOtroActivo('');
      setSignatureDataUrl(null);
      setPinVerificacion('');
      onSuccess();
    } else {
      setFeedback({ type: 'error', message: res.message || 'Ocurrió un error al guardar el registro.' });
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-300">Cargando catálogo de usuarios e inventario...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold border flex items-center gap-3 shadow-lg ${
          feedback.type === 'success'
            ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
            : 'bg-rose-500/15 text-rose-200 border-rose-500/40'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm">{feedback.message}</span>
        </div>
      )}

      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h2 className="text-base font-extrabold text-white tracking-wide font-heading uppercase flex items-center gap-2">
            Detalles de la Atención en Sitio
          </h2>
          <span className="text-xs text-slate-400 font-normal">Campos obligatorios (*)</span>
        </div>

        {/* CONTROLES DE BÚSQUEDA Y FILTRO DE USUARIO */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-4">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            Filtros para Selección de Usuario
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Filtro por departamento */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Filtrar por Departamento
              </label>
              <select
                value={departamentoFiltro}
                onChange={e => setDepartamentoFiltro(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium"
              >
                <option value="" className="bg-slate-900 text-slate-300">-- Todos los departamentos ({departamentosUnicos.length}) --</option>
                {departamentosUnicos.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda rápida por nombre/nómina */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                Buscar por Nombre o N° Empleado
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={busquedaUsuario}
                  onChange={e => setBusquedaUsuario(e.target.value)}
                  placeholder="Escribe para buscar rápido..."
                  className="w-full glass-input rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Fila 1: Usuario Solicitante & Activo TIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Selector de Usuario */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Usuario / Solicitante ({usuariosFiltrados.length}) <span className="text-rose-400">*</span>
            </label>
            <select
              value={usuarioId}
              onChange={handleUsuarioChange}
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer font-medium"
              required
            >
              {usuariosFiltrados.length === 0 ? (
                <option value="" className="bg-slate-900 text-amber-300">Sin coincidencias de búsqueda</option>
              ) : (
                usuariosFiltrados.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                    {u.nombre} {u.departamento ? `(${u.departamento})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Activo TIC (Con opción OTRO) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                Equipo / Activo TIC
              </label>

              <button
                type="button"
                onClick={() => setMostrarTodosLosActivos(!mostrarTodosLosActivos)}
                className="text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Filter className="w-3 h-3 text-indigo-400" />
                {mostrarTodosLosActivos ? 'Ver solo de usuario' : 'Ver todo el inventario'}
              </button>
            </div>

            <select
              value={activoId}
              onChange={e => setActivoId(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="" className="bg-slate-900 text-slate-400">
                {activosFiltrados.length === 0 ? '-- Sin equipos asignados a este usuario --' : '-- Seleccionar activo --'}
              </option>

              {activosFiltrados.map(a => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                  [{a.codigo_inventario}] {a.nombre_equipo} ({a.tipo})
                </option>
              ))}

              <option value="OTRO" className="bg-slate-900 text-indigo-300 font-bold">
                ➕ OTRO (Especificar equipo/impresora no listado...)
              </option>
            </select>

            {/* Campo adicional al seleccionar OTRO */}
            {activoId === 'OTRO' && (
              <div className="pt-2 animate-in fade-in duration-150 space-y-1">
                <label className="text-[11px] font-semibold text-indigo-300">
                  Especificar Equipo / Dispositivo (ej: Impresora en Almacén, Switch, etc.) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={especificarOtroActivo}
                  onChange={e => setEspecificarOtroActivo(e.target.value)}
                  placeholder="Ej: Impresora HP EcoTank en recepción, Monitor extra, etc."
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
                  required
                />
              </div>
            )}
            
            {activosFiltrados.length === 0 && !mostrarTodosLosActivos && activoId !== 'OTRO' && (
              <p className="text-[11px] text-slate-400 italic">
                No hay equipos vinculados directamente a este usuario.{' '}
                <button
                  type="button"
                  onClick={() => setMostrarTodosLosActivos(true)}
                  className="text-indigo-400 underline font-medium cursor-pointer"
                >
                  Ver todo el inventario.
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Fila 2: Categoría y Técnico Predefinido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Categoría */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              Categoría de Soporte <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(Number(e.target.value))}
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer font-medium"
              required
            >
              {categorias.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre Técnico Predefinido (Dropdown de 2 opciones) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Técnico Atendiente <span className="text-rose-400">*</span>
            </label>
            <select
              value={nombreTecnico}
              onChange={e => setNombreTecnico(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer font-medium"
              required
            >
              {TECNICOS_PREDEFINIDOS.map(tec => (
                <option key={tec} value={tec} className="bg-slate-900 text-white">
                  {tec}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Descripción de la falla / Trabajo realizado */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Descripción del Problema y Solución Aplicada <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={descripcionFalla}
            onChange={e => setDescripcionFalla(e.target.value)}
            rows={3}
            placeholder="Detalla el diagnóstico, piezas reemplazadas o trabajo de configuración realizado..."
            className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none leading-relaxed"
            required
          />
        </div>

        {/* MODALIDAD DE FIRMA: EN SITIO VS FIRMA REMOTA A DISTANCIA */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              Modalidad de Firma de Conformidad
            </label>

            {/* Selector de Modalidad */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setModalidadFirma('presencial')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  modalidadFirma === 'presencial'
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📱 En Sitio (Dispositivo Técnico)
              </button>
              <button
                type="button"
                onClick={() => setModalidadFirma('remota_link')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  modalidadFirma === 'remota_link'
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔗 Remota por WhatsApp / Enlace
              </button>
              <button
                type="button"
                onClick={() => setModalidadFirma('remota_pin')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  modalidadFirma === 'remota_pin'
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔑 PIN Telefónico
              </button>
            </div>
          </div>

          {/* Opciones según modalidad */}
          {modalidadFirma === 'presencial' && (
            <SignatureCanvas
              onSaveSignature={setSignatureDataUrl}
              signatureDataUrl={signatureDataUrl}
            />
          )}

          {modalidadFirma === 'remota_link' && (
            <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5 text-xs text-indigo-200">
                <Share2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-sm block">Firma Remota por Enlace Directo</span>
                  1. Guarda el registro para que quede creado en estado <strong>Pendiente de Firma</strong>.<br/>
                  2. Envía el enlace al usuario para que firme desde su smartphone a kilómetros de distancia.
                </div>
              </div>

              {/* Muestra el Enlace Generado */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 break-all flex items-center justify-between gap-2">
                <span className="truncate">{remoteLink}</span>
                <a href={remoteLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Enviar Enlace por WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}
                </button>
              </div>
            </div>
          )}

          {modalidadFirma === 'remota_pin' && (
            <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5 text-xs text-indigo-200">
                <KeyRound className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-sm block">Confirmación por Código PIN de Verificación</span>
                  Para usuarios lejanos, el usuario te proporciona un código telefónico de confirmación verbal.
                </div>
              </div>

              <div className="space-y-1 max-w-xs">
                <label className="text-[11px] font-semibold text-slate-300">
                  Código PIN de Verificación <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={pinVerificacion}
                  onChange={e => setPinVerificacion(e.target.value)}
                  placeholder="Ej: 8492"
                  maxLength={6}
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm text-white font-mono tracking-widest focus:outline-none"
                  required
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 cursor-pointer border border-indigo-400/30 hover:scale-[1.01] active:scale-[0.99]"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Guardando Registro...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Guardar Ticket y Registrar Evidencia
          </>
        )}
      </button>

    </form>
  );
};
