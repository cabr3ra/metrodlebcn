
import React from 'react';
import { GuessResult, Station, MatchType } from '../types';

interface StatsModalProps {
  guesses: GuessResult[];
  won: boolean;
  target: Station;
  onClose: () => void;
  t: any;
  solveTime: number | null;
  dayNumber: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ guesses, won, target, onClose, t, solveTime, dayNumber }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getShareText = () => {
    const attempts = won ? guesses.length : 'X';
    const timeStr = solveTime ? `⏱️ ${formatTime(solveTime)}` : '';
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

  const shareOnX = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const openInMaps = () => {
    const query = encodeURIComponent(`Metro ${target.name} Barcelona`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-zinc-800">
        <div className="p-8 text-center border-b border-zinc-800 bg-zinc-900/50">
          <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${won ? 'text-emerald-500' : 'text-zinc-500'}`}>
            {won ? t.congrats : t.almost}
          </h2>
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
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{won ? 1 : 0}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.games}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{won ? '100%' : '0%'}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.winPct}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{solveTime ? formatTime(solveTime) : '--:--'}</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.time}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">{won ? guesses.length : 'X'}/6</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{t.distShort}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800">
             <div className="flex items-center gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-zinc-700"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                  {t.share}
                </button>
                <button 
                  onClick={shareOnX}
                  title="Twitter / X"
                  className="w-14 h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
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
