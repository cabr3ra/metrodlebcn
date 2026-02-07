
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GuessResult, Station, MatchType } from '../types';
import { UserStats } from '../hooks/useUserStats';

import { useLanguage } from '../context/LanguageContext';

interface StatsModalProps {
  guesses: GuessResult[];
  won: boolean;
  target: Station;
  onClose: () => void;
  solveTime: number | null;
  dayNumber: number;
  stats: UserStats | null;
  gameType?: 'metrodle' | 'ruta'; // Changed from gameId
  origin?: Station;
  errorCount?: number;
  currentAttempts?: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ guesses, won, target, onClose, solveTime, dayNumber, stats, gameType = 'metrodle', origin, errorCount = 0, currentAttempts }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getShareText = () => {
    // ... same logic
    const timeStr = solveTime ? `⏱️ ${formatTime(solveTime)}` : '';

    if (gameType === 'ruta') {
      const attempts = currentAttempts || 0;
      return `Ruta BCN #${dayNumber} 🚇\n${won ? 'Completado' : 'X'} - ${attempts} ${t.attempts.toLowerCase()}\n${timeStr}\n\n📲 metrodlebcn.app\n#RutaBCN #Barcelona #Metro`;
    }

    const attempts = won ? guesses.length : 'X';
    const grid = guesses.map(g => {
      let row = '';
      row += g.nameMatch ? '🟩' : '⬛';
      row += g.lineMatch === MatchType.CORRECT ? '🟩' : g.lineMatch === MatchType.PARTIAL ? '🟨' : '⬜';
      row += g.positionMatch === MatchType.CORRECT ? '🟩' : g.positionMatch === MatchType.PARTIAL ? '🟨' : '⬜';
      row += g.typeMatch === MatchType.CORRECT ? '🟩' : '⬜';
      row += g.connectionsMatch === MatchType.CORRECT ? '🟩' : g.connectionsMatch === MatchType.PARTIAL ? '🟨' : '⬜';
      row += g.distanceMatch === 0 ? '🟩' : (g.distanceDirection === 'up' ? '🔼' : g.distanceDirection === 'down' ? '🔽' : '⬜');
      return row;
    }).join('\n');

    return `Metrodle BCN #${dayNumber} 🚇\n${attempts}/6 ${timeStr}\n\n${grid}\n\n📲 metrodlebcn.app\n#MetrodleBCN #Barcelona #Metro`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    alert(t.copied);
  };

  // ... shareOnX and openInMaps kept same

  const shareOnX = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const openInMaps = () => {
    if (gameType === 'ruta' && origin) {
      const originQuery = encodeURIComponent(`Metro ${origin.name} Barcelona`);
      const destQuery = encodeURIComponent(`Metro ${target.name} Barcelona`);
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}&travelmode=transit`, '_blank');
    } else {
      const query = encodeURIComponent(`Metro ${target.name} Barcelona`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const winPct = stats?.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-zinc-800">
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{t.statsLabel} • {gameType === 'metrodle' ? 'METRODLE' : 'RUTA BCN'}</span>
        </div>
        <div className="p-8 text-center border-b border-zinc-800 bg-zinc-900/50">
          <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${won ? 'text-emerald-500' : 'text-zinc-500'}`}>
            {won ? t.congrats : t.almost}
          </h2>
          {gameType !== 'ruta' && (
            <>
              <p className="text-zinc-500 mb-4">{t.secretStation}</p>
              <button
                onClick={openInMaps}
                className="group relative inline-flex flex-col items-center gap-1 p-4 bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-red-500 transition-all active:scale-95"
              >
                <span className="text-2xl font-black text-red-600 group-hover:underline">{target.name}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-xs">map</span>
                  {t.viewOnMap}
                </div>
              </button>
            </>
          )}
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center">
              <p className="text-3xl font-black text-red-500">{currentAttempts || (guesses.length > 0 ? guesses.length : 0)}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.attempts}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{stats?.played || 0}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.games}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{winPct}%</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.winPct}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{stats?.streak || 0}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.streak}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{stats?.bestStreak || 0}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.maxStreak}</p>
            </div>
          </div>


          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              {/* Parte Izquierda: Compartir (2 botones pequeños iguales) */}
              <div className="flex-1 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  title={t.share}
                  className="flex-1 h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-zinc-700"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
                <button
                  onClick={shareOnX}
                  title="Twitter / X"
                  className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
              </div>

              {/* Parte Derecha: Siguiente Juego */}
              {gameType !== 'ruta' && (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/ruta');
                  }}
                  className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/40 group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">route</span>
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-[10px] uppercase tracking-tighter opacity-80">{t.nextGame}</span>
                    <span className="text-xs font-black italic uppercase">RUTA BCN</span>
                  </div>
                </button>
              )}
              {gameType === 'ruta' && (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/');
                  }}
                  className="flex-1 h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-zinc-700 group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">train</span>
                  <div className="flex flex-col items-start leading-none text-left">
                    <span className="text-[10px] uppercase tracking-tighter opacity-80">{t.backTo}</span>
                    <span className="text-xs font-black italic uppercase">METRODLE</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full p-4 text-xs font-bold text-zinc-500 hover:text-white transition-colors border-t border-zinc-800"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

export default StatsModal;
