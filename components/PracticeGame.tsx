
import React, { useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import StatsModal from './StatsModal';
import { STATIONS } from '../constants';

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
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                    {t.practiceMode}
                </h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    {t.practiceDesc}
                </p>
                <div className="flex flex-col gap-4">
                    <div className="inline-block px-6 py-2 bg-zinc-800 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-700">
                        {t.comingSoon}
                    </div>
                </div>
            </div>

            {showStats && <StatsModal
                onClose={() => setShowStats(false)}
                guesses={[]}
                won={false}
                target={STATIONS[0]}
                solveTime={null}
                dayNumber={0}
                stats={stats}
                gameId="train"
                gameName={t.practiceMode}
            />}
        </div>
    );
};

export default PracticeGame;
