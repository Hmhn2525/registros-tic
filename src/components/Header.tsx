import React from 'react';
import { ShieldCheck, PlusCircle, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'nuevo' | 'historial';
  setActiveTab: (tab: 'nuevo' | 'historial') => void;
  ticketCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, ticketCount }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 py-3.5 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Marca y Título Limpio */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/25 border border-indigo-400/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight font-heading">
                Soporte TIC
              </h1>
              <p className="text-xs text-slate-400 font-normal">Evidencias y firma digital en sitio</p>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas limpia */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveTab('nuevo')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'nuevo'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Nuevo Ticket
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'historial'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              Evidencias
              {ticketCount > 0 && (
                <span className="bg-indigo-500/30 text-indigo-200 px-2 py-0.5 text-[10px] rounded-full border border-indigo-400/30 ml-0.5">
                  {ticketCount}
                </span>
              )}
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
};
