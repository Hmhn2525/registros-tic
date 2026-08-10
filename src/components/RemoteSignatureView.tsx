import React, { useState } from 'react';
import { SignatureCanvas } from './SignatureCanvas';
import { ShieldCheck, CheckCircle2, Send, Loader2, AlertCircle } from 'lucide-react';
import { submitRemoteSignature } from '../services/remoteSignatureService';

interface RemoteSignatureViewProps {
  signatureToken: string;
}

export const RemoteSignatureView: React.FC<RemoteSignatureViewProps> = ({ signatureToken }) => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signatureDataUrl) {
      setErrorMessage('Por favor traza tu firma de conformidad antes de enviar.');
      return;
    }

    setSubmitting(true);

    try {
      await submitRemoteSignature(signatureToken, signatureDataUrl);
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Error al enviar firma remota:', err);
      setErrorMessage(err instanceof Error
        ? err.message
        : 'Ocurrió un error al enviar la firma. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-emerald-500/30 shadow-2xl animate-in zoom-in duration-200">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-heading">
            ¡Firma Registrada con Éxito!
          </h2>
          <p className="text-sm text-slate-300">
            Tu firma de conformidad ha sido recibida y vinculada al reporte de soporte TIC.
          </p>
          <div className="pt-2 text-xs text-slate-500 border-t border-slate-800">
            Puedes cerrar esta pestaña en tu navegador.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Header Remoto */}
      <header className="glass-panel rounded-2xl p-4 max-w-lg w-full mx-auto flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-heading">Conformidad de Soporte TIC</h1>
            <p className="text-[11px] text-slate-400">Confirmación de atención remota</p>
          </div>
        </div>
      </header>

      {/* Formulario de Firma Remota */}
      <main className="max-w-lg w-full mx-auto my-6 space-y-5">
        <div className="glass-panel rounded-3xl p-6 space-y-5 shadow-2xl border border-indigo-500/20">
          
          <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 text-xs space-y-1">
            <span className="text-indigo-300 font-bold uppercase tracking-wider text-[10px] block">Usuario Solicitante</span>
            <span className="text-base font-extrabold text-white block">Estimado usuario</span>
            <p className="text-slate-300 text-[11px] pt-1">
              Por favor traza tu firma digital en la casilla inferior para confirmar la recepción conforme del servicio de soporte TIC.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <SignatureCanvas
              onSaveSignature={setSignatureDataUrl}
              signatureDataUrl={signatureDataUrl}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-emerald-400/30 active:scale-98"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando Firma...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Firma de Conformidad
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer Remoto */}
      <footer className="text-center text-[11px] text-slate-500 py-2 max-w-lg mx-auto">
        Sistema de Registro de Soporte TIC &copy; {new Date().getFullYear()}
      </footer>

    </div>
  );
};
