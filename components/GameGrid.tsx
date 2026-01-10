
import React from 'react';
import { GuessResult } from '../types';
import AttemptRow from './AttemptRow';

interface GameGridProps {
  guesses: GuessResult[];
  maxAttempts: number;
  t: any;
}

const GameGrid: React.FC<GameGridProps> = ({ guesses, maxAttempts, t }) => {
  const empties = Array.from({ length: Math.max(0, maxAttempts - guesses.length) });

  // Estil de graella personalitzat segons la proporció: 3.5fr (Nom), 1.875fr x 4 (Atributs), 1fr (Distància)
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '3.5fr 1.875fr 1.875fr 1.875fr 1.875fr 1fr',
    gap: '0.5rem'
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-4">
      {/* Legend for desktop */}
      <div 
        style={gridStyle}
        className="hidden md:grid text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1 px-1"
      >
        <div className="text-left pl-4">{t.station}</div>
        <div className="text-center">{t.line}</div>
        <div className="text-center">{t.posShort}</div>
        <div className="text-center">{t.typeShort}</div>
        <div className="text-center">{t.connShort}</div>
        <div className="text-center">{t.distShort}</div>
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
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
          <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700"></div>
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
