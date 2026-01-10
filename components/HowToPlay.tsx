
import React from 'react';
import TransportIcon from './TransportIcon';

interface HowToPlayProps {
  onClose: () => void;
  t: any;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onClose, t }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{t.howToPlay}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Cada intent compara els següents atributs entre l'estació introduïda i l'estació secreta del dia.
            </p>
            
            <h3 className="font-bold uppercase text-xs text-zinc-400 pt-2">{t.attributes}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">label</span>
                <div>
                  <strong className="block">{t.name}:</strong> 
                  S'il·lumina en verd si el nom és el correcte, encara que altres atributs no coincideixin.
                </div>
              </li>
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">route</span>
                <div>
                  <strong className="block">{t.line}:</strong> 
                  Línies de metro que passen per l'estació. Verd si coincideixen totes, groc si en comparteixen alguna.
                </div>
              </li>
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">explore</span>
                <div>
                  <strong className="block">{t.position}:</strong> 
                  Compara si l'estació està en un extrem o a la zona central de la línia.
                </div>
              </li>
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">architecture</span>
                <div>
                  <strong className="block">{t.type}:</strong> 
                  L'estructura de l'estació: Subterrània, Superfície o Elevada.
                </div>
              </li>
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">hub</span>
                <div className="flex flex-col">
                  <strong>{t.connections}:</strong> 
                  <span>Connexions fora del metro (FGC, Rodalies, Tram, Bus, etc.):</span>
                  <div className="flex gap-2 mt-2 items-center">
                    <TransportIcon type="FGC" className="w-5 h-5" />
                    <TransportIcon type="Rodalies" className="w-5 h-5" />
                    <TransportIcon type="Tram" className="w-5 h-5" />
                    <TransportIcon type="Bus" className="w-5 h-5" />
                  </div>
                </div>
              </li>
              <li className="flex gap-3 text-sm items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">straighten</span>
                <div>
                  <strong className="block">{t.distance}:</strong> 
                  Distància en nombre de parades respecte a l'estació secreta seguint la línia més curta.
                </div>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-full h-8 bg-emerald-500 rounded-lg"></div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{t.correct}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-full h-8 bg-amber-400 rounded-lg"></div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{t.partial}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-full h-8 bg-zinc-800 rounded-lg border border-zinc-700"></div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{t.none}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
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

export default HowToPlay;
