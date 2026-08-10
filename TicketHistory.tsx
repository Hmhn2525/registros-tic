import React, { useState, useEffect } from 'react';
import type { Ticket } from '../types';
import { getRecentTickets } from '../services/ticketService';
import { Clock, Laptop, CheckCircle, ExternalLink, RefreshCw, Image as ImageIcon, AlertCircle, X } from 'lucide-react';

export const TicketHistory: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);

  const loadTickets = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getRecentTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Carga inicial + Auto-Refresco cada 4 segundos para detectar firmas remotas en tiempo real
  useEffect(() => {
    loadTickets(true);
    const interval = setInterval(() => {
      loadTickets(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white font-heading flex items-center gap-2">
            Historial de Evidencias TIC
          </h2>
          <p className="text-xs text-slate-400">Atenciones registradas y firmas de conformidad (Auto-actualizable)</p>
        </div>

        <button
          onClick={() => loadTickets(true)}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-base font-bold text-slate-300">No hay tickets registrados aún</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Los registros guardados desde el formulario aparecerán aquí con su firma correspondiente en tiempo real.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map(t => {
            const isPendiente = t.estado === 'Pendiente';
            return (
              <div
                key={t.id}
                className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 hover:border-indigo-500/40 transition-all duration-200 shadow-xl"
              >
                {/* Encabezado del ticket */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {t.usuarios?.nombre || 'Usuario Registrado'}
                      </span>
                      {t.usuarios?.departamento && (
                        <span className="text-[11px] bg-slate-800/90 text-indigo-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                          {t.usuarios.departamento}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(t.fecha_registro).toLocaleString('es-MX', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                      <span>Técnico: <strong className="text-slate-200">{t.nombre_tecnico}</strong></span>
                    </div>
                  </div>

                  {/* Badge de Estado Dinámico (Amber para Pendiente, Emerald para Atendido) */}
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold border shrink-0 ${
                    isPendiente
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {isPendiente ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Pendiente de Firma
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        {t.estado}
                      </>
                    )}
                  </span>
                </div>

                {/* Cuerpo del ticket */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  <div className="md:col-span-2 space-y-2">
                    {t.activos_tic && (
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 w-fit">
                        <Laptop className="w-4 h-4 text-indigo-400 shrink-0" />
                        [{t.activos_tic.codigo_inventario}] {t.activos_tic.nombre_equipo}
                      </div>
                    )}

                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 font-normal">
                      {t.descripcion_falla}
                    </p>

                    {t.notas_adicionales && (
                      <p className="text-[11px] text-slate-400 italic">
                        {t.notas_adicionales}
                      </p>
                    )}
                  </div>

                  {/* Firma renderizada / Evidencia */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2 text-center">
                    <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Firma de Evidencia
                    </span>
                    
                    {t.url_firma ? (
                      <div 
                        className="relative group cursor-pointer w-full flex items-center justify-center" 
                        onClick={() => setSelectedSignature(t.url_firma)}
                      >
                        <img
                          src={t.url_firma}
                          alt="Firma"
                          className="h-20 max-w-full object-contain rounded-xl bg-slate-900 p-1.5 border border-slate-700/60 shadow-inner group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-xs text-white font-bold backdrop-blur-xs">
                          Ver Completa 🔍
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-300/80 italic py-4 flex flex-col items-center gap-1">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Esperando firma remota...
                      </span>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Firma Grande */}
      {selectedSignature && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 space-y-4 border border-indigo-500/30 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <ImageIcon className="w-5 h-5 text-indigo-400" /> Evidencia de Firma Digital
              </h3>
              <button
                onClick={() => setSelectedSignature(null)}
                className="text-slate-400 hover:text-white p-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-center shadow-inner">
              <img src={selectedSignature} alt="Firma completa" className="max-h-72 object-contain" />
            </div>

            <div className="flex justify-end pt-1">
              <a
                href={selectedSignature}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-300 hover:text-white font-semibold flex items-center gap-1.5 bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30 transition-colors"
              >
                Abrir imagen pública <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
