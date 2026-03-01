
import React, { useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import StatsModal from './StatsModal';

import { useLanguage } from '../context/LanguageContext';

interface PracticeGameProps {
    showStats: boolean;
    setShowStats: (show: boolean) => void;
}

const PracticeGame: React.FC<PracticeGameProps> = ({ showStats, setShowStats }) => {
    const { t } = useLanguage();
    const { stats } = useUserStats('train');

    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full p-4 text-center">
            <div className="mb-8 p-12 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-sm max-w-lg animate-in fade-in zoom-in duration-500">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-6 animate-pulse">fitness_center</span>
                <h2 className="text-3xl font-black uppercase tracking-wider mb-4 text-white">
                    {t.practiceMode}
                </h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    {t.practiceDesc}
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.href = '#/'}
                        className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                    >
                        {t.backTo} METRODLE
                    </button>
                </div>
            </div>

            {showStats && <StatsModal
                onClose={() => setShowStats(false)}
                guesses={[]}
                won={false}
                target={null as any}
                solveTime={null}
                dayNumber={0}
                stats={stats}
                gameType="metrodle"
            />}
        </div>
    );
};

export default PracticeGame;
