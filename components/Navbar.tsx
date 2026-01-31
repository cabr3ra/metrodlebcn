
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenHowTo: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  isGameOver: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenHowTo, onOpenStats, onOpenSettings, isGameOver }) => {
  const navigate = useNavigate();
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="logo-container">
          <div className="metro-icon">
            <div className="metro-window"></div>
            <div className="metro-stripe"></div>
            <div className="metro-lights">
              <div className="light-dot"></div>
              <div className="light-dot"></div>
            </div>
          </div>

          <h1 className="brand-text">
            <span className="text-zinc-900 dark:text-white text-metro">Metrodle</span>
            <span className="text-bcn">BCN</span>
          </h1>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={onOpenHowTo}
            className="w-11 h-11 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group flex items-center justify-center"
            title="Com jugar"
          >
            <span className="material-symbols-outlined text-[24px] text-zinc-600 dark:text-zinc-400 group-hover:text-red-500 transition-colors">help</span>
          </button>
          <button
            onClick={() => isGameOver && onOpenStats()}
            className={`w-11 h-11 rounded-xl transition-all flex items-center justify-center ${isGameOver ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white group' : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-50'}`}
          >
            <span className={`material-symbols-outlined text-[24px] ${isGameOver ? 'group-hover:text-red-500 transition-colors' : ''}`}>
              {isGameOver ? 'bar_chart' : 'leaderboard'}
            </span>
          </button>
          <button
            onClick={() => navigate('/train')}
            className="w-11 h-11 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group flex items-center justify-center"
            title="Mode Pràctica"
          >
            <span className="material-symbols-outlined text-[24px] text-zinc-600 dark:text-zinc-400 group-hover:text-red-500 transition-colors">fitness_center</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group flex items-center justify-center"
            title="Ajustos"
          >
            <span className="material-symbols-outlined text-[24px] text-zinc-600 dark:text-zinc-400 group-hover:text-red-500 transition-colors">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
