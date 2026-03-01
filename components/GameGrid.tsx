
import React from 'react';
import { GuessResult } from '../types';
import AttemptRow from './AttemptRow';

import { useLanguage } from '../context/LanguageContext';

interface GameGridProps {
  guesses: GuessResult[];
  maxAttempts: number;
}

const GameGrid: React.FC<GameGridProps> = ({ guesses, maxAttempts }) => {
  const { t } = useLanguage();
  const empties = Array.from({ length: Math.max(0, maxAttempts - guesses.length) });

  // Estil de graella per a attributes de l'estació
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(60px, 3.5fr) 1.8fr 1.6fr 1.6fr 1.6fr 1.2fr',
    gap: '0.25rem'
  };

  // En escriptori el gap és més gran
  const containerClass = "w-full flex flex-col gap-2 md:gap-3 pt-4 px-0.5 sm:px-0";
  return (
    <div className={containerClass}>
      {/* Legend for desktop */}
      <div
        style={gridStyle}
        className="hidden md:grid text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 px-1"
      >
        <div className="text-left pl-4">{t.station}</div>
        <div className="text-center">{t.line}</div>
        <div className="text-center">{t.position}</div>
        <div className="text-center">{t.type}</div>
        <div className="text-center">{t.connections}</div>
        <div className="text-center">{t.distance}</div>
      </div>

      {guesses.map((g, i) => (
        <AttemptRow key={i} result={g} />
      ))}

      {empties.map((_, i) => (
        <div
          key={`empty-${i}`}
          style={gridStyle}
          className="opacity-20"
        >
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-10 sm:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
