import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Eraser, CheckCircle2, PenTool, Maximize2, X, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSaveSignature: (dataUrl: string | null) => void;
  signatureDataUrl: string | null;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSaveSignature, signatureDataUrl }) => {
  const sigPadRef = useRef<SignaturePad | null>(null);
  const modalSigPadRef = useRef<SignaturePad | null>(null);

  const [hasSigned, setHasSigned] = useState<boolean>(Boolean(signatureDataUrl));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setHasSigned(Boolean(signatureDataUrl));
  }, [signatureDataUrl]);

  // Manejo de firma en vista normal
  const handleClear = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
    if (modalSigPadRef.current) {
      modalSigPadRef.current.clear();
    }
    setHasSigned(false);
    onSaveSignature(null);
  };

  const handleEnd = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setHasSigned(true);
      const canvas = sigPadRef.current.getCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
    }
  };

  // Manejo de firma en modal expandido
  const handleModalEnd = () => {
    if (modalSigPadRef.current && !modalSigPadRef.current.isEmpty()) {
      setHasSigned(true);
      const canvas = modalSigPadRef.current.getCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
    }
  };

  const handleConfirmModal = () => {
    if (modalSigPadRef.current && !modalSigPadRef.current.isEmpty()) {
      handleModalEnd();
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-400" />
          Firma de Conformidad del Usuario <span className="text-rose-400 font-bold">*</span>
        </label>
        
        <div className="flex items-center gap-2">
          {hasSigned && (
            <span className="text-xs text-emerald-300 flex items-center gap-1.5 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Firma Capturada
            </span>
          )}
          
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1 rounded-xl border border-indigo-400/30 flex items-center gap-1.5 transition-all cursor-pointer font-medium"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            Expandir Pantalla
          </button>
        </div>
      </div>

      {/* Recuadro de Canvas táctil estándar */}
      <div className="relative rounded-2xl border-2 border-indigo-500/30 bg-slate-950/90 overflow-hidden shadow-inner signature-canvas-container hover:border-indigo-500/60 transition-all">
        {signatureDataUrl && !isModalOpen ? (
          <div className="relative group w-full h-48 flex items-center justify-center bg-slate-950 p-2">
            <img src={signatureDataUrl} alt="Firma capturada" className="max-h-full object-contain" />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 bg-rose-600/80 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Eraser className="w-3.5 h-3.5" /> Volver a Firmar
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600/80 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Expandir
              </button>
            </div>
          </div>
        ) : (
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{
              className: 'w-full h-48 cursor-crosshair rounded-2xl',
              style: { width: '100%', height: '192px', touchAction: 'none' }
            }}
            penColor="#ffffff"
            backgroundColor="rgba(2, 6, 23, 0.95)"
            onEnd={handleEnd}
          />
        )}

        {!hasSigned && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs font-medium space-y-1">
            <PenTool className="w-6 h-6 text-slate-600 mb-1" />
            <span className="text-slate-400 font-semibold">Traza la firma digital aquí</span>
            <span className="text-[10px] text-slate-500">O presiona "Expandir Pantalla" para firmar en grande</span>
          </div>
        )}
      </div>

      {/* Botones de control */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/80 font-medium cursor-pointer shadow-sm"
        >
          <Eraser className="w-3.5 h-3.5 text-rose-400" />
          Limpiar Lienzo
        </button>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 text-xs font-medium cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
          Modo Cómodo (Pantalla Completa)
        </button>
      </div>

      {/* MODAL EXPANDIDO DE FIRMA A PANTALLA COMPLETA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Header del Modal */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-heading">
                <PenTool className="w-5 h-5 text-indigo-400" />
                Lienzo de Firma en Pantalla Completa
              </h3>
              <p className="text-xs text-slate-400">Traza la firma cómodamente en este espacio ampliado</p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Firma Gigante */}
          <div className="flex-1 my-4 relative rounded-3xl border-2 border-indigo-500/40 bg-slate-950 overflow-hidden shadow-2xl signature-canvas-container flex items-center justify-center">
            <SignaturePad
              ref={modalSigPadRef}
              canvasProps={{
                className: 'w-full h-full cursor-crosshair rounded-3xl',
                style: { width: '100%', height: '100%', touchAction: 'none' }
              }}
              penColor="#ffffff"
              backgroundColor="rgba(2, 6, 23, 0.98)"
              onEnd={handleModalEnd}
            />

            {!hasSigned && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-600 text-sm font-medium space-y-2">
                <PenTool className="w-10 h-10 text-indigo-500/40 mb-1" />
                <span className="text-slate-300 font-bold text-base">Firme aquí con el dedo o stylus</span>
                <span className="text-xs text-slate-500">Espacio amplio optimizado para tablets y smartphones</span>
              </div>
            )}
          </div>

          {/* Footer del Modal con Controles */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (modalSigPadRef.current) modalSigPadRef.current.clear();
                setHasSigned(false);
                onSaveSignature(null);
              }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Eraser className="w-4 h-4 text-rose-400" />
              Limpiar Firma
            </button>

            <button
              type="button"
              onClick={handleConfirmModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Confirmar y Aceptar Firma
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
