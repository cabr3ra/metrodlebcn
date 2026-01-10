
import React from 'react';

interface NavbarProps {
  onOpenHowTo: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  isGameOver: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenHowTo, onOpenStats, onOpenSettings, isGameOver }) => {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
            <span className="material-symbols-outlined text-[28px]">subway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">
            Metrodle <span className="text-red-600">BCN</span>
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onOpenHowTo} 
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
            title="Com jugar"
          >
            <span className="material-symbols-outlined text-[26px] text-zinc-600 dark:text-zinc-400 group-hover:text-red-500 transition-colors">help</span>
          </button>
          <button 
            onClick={() => isGameOver && onOpenStats()} 
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isGameOver ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white group' : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-50'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isGameOver ? 'group-hover:text-red-500 transition-colors' : ''}`}>
              {isGameOver ? 'bar_chart' : 'lock'}
            </span>
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
            title="Ajustos"
          >
            <span className="material-symbols-outlined text-[26px] text-zinc-600 dark:text-zinc-400 group-hover:text-red-500 transition-colors">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
