
import React from 'react';
import { GuessResult, MatchType } from '../types';
import TransportIcon from './TransportIcon';
import LineIcon from './LineIcon';

import { useLanguage } from '../context/LanguageContext';

interface AttemptRowProps {
  result: GuessResult;
}

const AttemptRow: React.FC<AttemptRowProps> = ({ result }) => {
  const { translateValue } = useLanguage();
  const getBgClass = (type: MatchType) => {
    switch (type) {
      case MatchType.CORRECT: return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
      case MatchType.PARTIAL: return 'bg-amber-400 text-zinc-900 shadow-lg shadow-amber-500/20';
      default: return 'bg-zinc-800 text-zinc-500 border border-zinc-700/50';
    }
  };

  const getAnimDelay = (index: number) => ({
    animationDelay: `${index * 500}ms`,
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '3.5fr 1.875fr 1.875fr 1.875fr 1.875fr 1fr',
    gap: '0.5rem'
  };

  return (
    <div style={gridStyle} className="w-full">
      {/* Station Name */}
      <div
        style={getAnimDelay(0)}
        className={`h-14 px-4 flex items-center rounded-xl font-bold truncate reveal-cell ${result.nameMatch ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'}`}
      >
        <span className="truncate text-sm sm:text-base">{result.station.name}</span>
      </div>

      {/* Line - Ajustado para soportar hasta 4 líneas */}
      <div
        style={getAnimDelay(1)}
        className={`h-14 flex flex-col items-center justify-center rounded-xl reveal-cell ${getBgClass(result.lineMatch)}`}
      >
        <div className="flex flex-wrap gap-0.5 justify-center px-0.5 max-w-full">
          {result.station.lines.map(l => (
            <LineIcon key={l} line={l} className="w-5 h-5 sm:w-6 sm:h-6" />
          ))}
        </div>
      </div>

      {/* Position */}
      <div
        style={getAnimDelay(2)}
        className={`h-14 flex flex-col items-center justify-center rounded-xl reveal-cell text-center ${getBgClass(result.positionMatch)}`}
      >
        <span className="text-[9px] sm:text-[10px] font-black uppercase leading-tight px-1">{translateValue(result.displayedPosition)}</span>
      </div>

      {/* Type */}
      <div
        style={getAnimDelay(3)}
        className={`h-14 flex flex-col items-center justify-center rounded-xl reveal-cell text-center ${getBgClass(result.typeMatch)}`}
      >
        <span className="text-[9px] sm:text-[10px] font-black uppercase leading-tight px-1">{translateValue(result.station.type)}</span>
      </div>

      {/* Connections */}
      <div
        style={getAnimDelay(4)}
        className={`h-14 flex flex-col items-center justify-center rounded-xl reveal-cell ${getBgClass(result.connectionsMatch)}`}
      >
        <div className="flex flex-wrap gap-1 justify-center">
          {result.station.connections.length > 0 ? (
            result.station.connections.map(c => (
              <TransportIcon key={c} type={c} className="w-4 h-4 sm:w-5 sm:h-5 shadow-sm" />
            ))
          ) : (
            <span className="material-symbols-outlined opacity-30 text-[10px]">block</span>
          )}
        </div>
      </div>

      {/* Distance */}
      <div
        style={getAnimDelay(5)}
        className={`h-14 flex flex-col items-center justify-center rounded-xl reveal-cell ${result.distanceMatch === 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'}`}
      >
        <div className="flex items-center gap-0.5">
          <span className="text-sm font-bold">{result.distanceMatch}</span>
          {result.distanceDirection !== 'none' && (
            <span className="material-symbols-outlined text-[12px]">
              {result.distanceDirection === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptRow;
