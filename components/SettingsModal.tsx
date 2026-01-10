
import React from 'react';

interface SettingsModalProps {
  onClose: () => void;
  language: 'ca' | 'es';
  setLanguage: (lang: 'ca' | 'es') => void;
  t: any;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, language, setLanguage, t }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-zinc-800">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Idioma */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.language}</label>
            <div className="flex bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('ca')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${language === 'ca' ? 'bg-zinc-700 shadow-sm text-red-500' : 'text-zinc-500'}`}
              >
                Català
              </button>
              <button 
                onClick={() => setLanguage('es')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${language === 'es' ? 'bg-zinc-700 shadow-sm text-red-500' : 'text-zinc-500'}`}
              >
                Español
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          <button 
            onClick={onClose}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
