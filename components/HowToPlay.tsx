
import React from 'react';
import TransportIcon from './TransportIcon';

import { useLanguage } from '../context/LanguageContext';

interface HowToPlayProps {
  onClose: () => void;
  gameType?: 'metrodle' | 'ruta';
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onClose, gameType = 'metrodle' }) => {
  const { t } = useLanguage();

  const isRuta = gameType === 'ruta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950/50">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {isRuta ? t.howToPlayRutaTitle : t.howToPlay}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {!isRuta ? (
            // Lógica Metrodle
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t.howToDesc}
              </p>

              <h3 className="font-bold uppercase text-[10px] text-zinc-500 tracking-[0.2em] mb-4">{t.attributes}</h3>
              <ul className="space-y-5">
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">label</span>
                  </div>
                  <div>
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.name}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.nameDesc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">route</span>
                  </div>
                  <div>
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.line}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.lineDesc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">explore</span>
                  </div>
                  <div>
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.position}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.posDesc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">architecture</span>
                  </div>
                  <div>
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.type}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.typeDesc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">hub</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.connections}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.connDesc}
                    </p>
                    <div className="flex gap-2 mt-3 items-center">
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <TransportIcon type="FGC" className="w-4 h-4" />
                      </div>
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <TransportIcon type="Rodalies" className="w-4 h-4" />
                      </div>
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <TransportIcon type="Tram" className="w-4 h-4" />
                      </div>
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <TransportIcon type="Bus" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4 text-sm items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-red-500">straighten</span>
                  </div>
                  <div>
                    <strong className="block text-zinc-900 dark:text-white mb-0.5">{t.distance}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
                      {t.distDesc}
                    </p>
                  </div>
                </li>
              </ul>

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
          ) : (
            // Lógica Ruta
            <div className="space-y-6 py-2">
              <ul className="space-y-8">
                <li className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-500/20">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-2xl">location_on</span>
                  </div>
                  <div className="flex-1">
                    <strong className="block text-zinc-900 dark:text-white text-base mb-1 italic uppercase font-black">{t.rutaStep1Title}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                      {t.rutaStep1Desc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-500/20">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-2xl">alt_route</span>
                  </div>
                  <div className="flex-1">
                    <strong className="block text-zinc-900 dark:text-white text-base mb-1 italic uppercase font-black">{t.rutaStep2Title}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                      {t.rutaStep2Desc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-500/20">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-2xl">ads_click</span>
                  </div>
                  <div className="flex-1">
                    <strong className="block text-zinc-900 dark:text-white text-base mb-1 italic uppercase font-black">{t.rutaStep3Title}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                      {t.rutaStep3Desc}
                    </p>
                  </div>
                </li>
                <li className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-500/20">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-2xl">warning</span>
                  </div>
                  <div className="flex-1">
                    <strong className="block text-zinc-900 dark:text-white text-base mb-1 italic uppercase font-black">{t.rutaStep4Title}</strong>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                      {t.rutaStep4Desc}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                <div className="w-2 h-12 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
                <p className="text-xs text-zinc-500 italic font-medium">
                  {t.routeDesc}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
