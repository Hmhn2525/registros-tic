import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TicketForm } from './components/TicketForm';
import { TicketHistory } from './components/TicketHistory';
import { RemoteSignatureView } from './components/RemoteSignatureView';
import { getOfflineTickets } from './services/ticketService';
import { Layers, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'nuevo' | 'historial'>('nuevo');
  const [ticketCount, setTicketCount] = useState<number>(0);

  // Detectar si el enlace fue abierto por un cliente remoto para firmar
  const urlParams = new URLSearchParams(window.location.search);
  const ticketParam = urlParams.get('firmar_ticket');
  const usuarioNombreParam = urlParams.get('usuario') || '';

  useEffect(() => {
    setTicketCount(getOfflineTickets().length);
  }, []);

  const handleTicketCreated = () => {
    setTicketCount(prev => prev + 1);
  };

  // Si tiene el parámetro firmar_ticket, mostrar la vista dedicada de cliente remoto
  if (ticketParam) {
    return (
      <RemoteSignatureView
        ticketParam={ticketParam}
        usuarioNombre={usuarioNombreParam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Cabecera Limpia */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ticketCount={ticketCount}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner Informativo Limpio */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1 z-10">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2 font-heading">
              <Layers className="w-5 h-5 text-indigo-400" />
              Evidencia Digital de Soporte TIC
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Registro de atenciones en sitio y firma de conformidad de recepción de equipos.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-indigo-500/15 px-3.5 py-2 rounded-2xl border border-indigo-500/30 shrink-0 z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Firma Digital Garantizada</span>
          </div>
        </div>

        {/* Carga de Formulario o Historial */}
        {activeTab === 'nuevo' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TicketForm onSuccess={handleTicketCreated} />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TicketHistory />
          </div>
        )}

      </main>

      {/* Footer Limpio */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 py-5 px-4 text-center text-xs text-slate-500 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Sistema de Soporte TIC &copy; {new Date().getFullYear()}</span>
          <span className="text-slate-400 font-medium">
            Departamento de Tecnologías de la Información
          </span>
        </div>
      </footer>

    </div>
  );
}

export default App;
