
import React, { useState, useEffect, useMemo } from 'react';
import { Station, GuessResult } from '../types';
import GameGrid from './GameGrid';
import SearchSuggestions from './SearchSuggestions';
import StatsModal from './StatsModal';
import { useDailyStation } from '../hooks/useDailyStation';
import { useGameState } from '../hooks/useGameState';
import { useUserStats } from '../hooks/useUserStats';
import { useStations } from '../hooks/useStations';
import { calculateResult } from '../utils/gameLogic';

import { useLanguage } from '../context/LanguageContext';

interface MetrodleGameProps {
    showStats: boolean;
    setShowStats: (show: boolean) => void;
    onGameOver: (over: boolean) => void;
}

const MetrodleGame: React.FC<MetrodleGameProps> = ({ showStats, setShowStats, onGameOver }) => {
    const { t } = useLanguage();

    const { station: dailyStation, dayNumber: fetchedDayNumber, date: dailyDate, loading: stationLoading } = useDailyStation();
    const today = new Date().toISOString().split('T')[0];
    const { stations: allStations } = useStations();

    // Format date for display
    const formattedDate = useMemo(() => {
        if (!dailyDate) return '';
        const d = new Date(dailyDate);
        return d.toLocaleDateString(t.id === 'es' ? 'es-ES' : 'ca-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, [dailyDate, t.id]);

    const {
        guesses: remoteGuesses,
        persistGuess,
        persistShare,
        isCompleted,
        startTime: sessionStartTime,
        solveTime: remoteSolveTime
    } = useGameState(today, dailyStation, allStations, 'metrodle');

    const { stats, updateStats } = useUserStats('metrodle');

    const [targetStation, setTargetStation] = useState<Station | null>(null);
    const [dayNumber, setDayNumber] = useState<number>(0);
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [solveTime, setSolveTime] = useState<number | null>(null);

    // Sync Daily Station
    useEffect(() => {
        if (dailyStation) {
            setTargetStation(dailyStation);
            setDayNumber(fetchedDayNumber);
        }
    }, [dailyStation, fetchedDayNumber]);

    // Sync Game State
    useEffect(() => {
        if (remoteGuesses.length > 0) {
            setGuesses(remoteGuesses);
            const lastGuess = remoteGuesses[remoteGuesses.length - 1];
            if (lastGuess.nameMatch) {
                setWon(true);
                setGameOver(true);
                onGameOver(true);
            } else if (remoteGuesses.length >= 7) {
                setGameOver(true);
                onGameOver(true);
            }
            if (sessionStartTime) setGameStartTime(sessionStartTime);
            if (remoteSolveTime) setSolveTime(remoteSolveTime);
        }
    }, [remoteGuesses, isCompleted, onGameOver, remoteSolveTime, sessionStartTime]);

    const suggestions = useMemo(() => {
        if (searchTerm.length < 1) return [];
        return allStations.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !guesses.find(g => g.station.id === s.id)
        ).slice(0, 5);
    }, [searchTerm, guesses, allStations]);

    const handleGuess = (station: Station) => {
        if (gameOver || !targetStation) return;

        let start = gameStartTime;
        if (!start) {
            start = Date.now();
            setGameStartTime(start);
        }

        const result = calculateResult(station, targetStation, allStations);
        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);
        setSearchTerm('');

        const isWin = result.nameMatch;
        const isLoss = newGuesses.length >= 7 && !isWin;
        const isFinished = isWin || isLoss;

        const guessIds = newGuesses.map(g => g.station.id);
        const timeSpent = Math.floor((Date.now() - start!) / 1000);
        persistGuess(guessIds, isWin, timeSpent);

        if (isFinished) {
            setGameOver(true);
            onGameOver(true);
            if (isWin) setWon(true);
            setSolveTime(timeSpent);
            updateStats(isWin, newGuesses.length);
            setTimeout(() => setShowStats(true), 1500);
        }
    };

    if (stationLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (

        <div className="flex-1 flex flex-col items-center w-full">
            <div className="ticket-date">
                {formattedDate}
                {gameOver && (
                    <div className={`ticket-stamp ${won ? 'validated' : 'expired'}`}>
                        {won ? 'VALIDADO' : 'EXPIRADO'}
                    </div>
                )}
            </div>

            <GameGrid guesses={guesses} maxAttempts={7} />

            {!gameOver && (
                <div className="w-full mt-auto py-6 sticky bottom-0 bg-zinc-950/30 backdrop-blur-md border-t border-white/5">
                    <SearchSuggestions
                        suggestions={suggestions}
                        onSelect={handleGuess}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        show={suggestions.length > 0}
                    />
                </div>
            )}

            {gameOver && (
                <div className="mt-4 sm:mt-10 p-3 sm:p-6 bg-zinc-900 rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md border border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-4 w-full justify-between sm:justify-center">
                        <div className="text-left sm:text-center shrink-0">
                            <h2 className="text-base sm:text-2xl font-bold">
                                {won ? t.won : t.lost}
                            </h2>
                            <p className="text-zinc-500 text-[10px] sm:text-sm">
                                {t.theStationWas} <span className="font-bold text-red-500">{targetStation?.name}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setShowStats(true)}
                            className="px-4 py-2 sm:mt-2 sm:px-6 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs sm:text-base font-bold transition-transform active:scale-95 shadow-lg shadow-red-500/10 shrink-0"
                        >
                            {t.viewStats}
                        </button>
                    </div>
                </div>
            )}



            {showStats && <StatsModal
                onClose={() => setShowStats(false)}
                guesses={guesses}
                won={won}
                target={targetStation || ({} as Station)}
                solveTime={solveTime}
                dayNumber={dayNumber}
                date={dailyDate}
                currentAttempts={guesses.length}
                stats={stats}
                onShare={persistShare}
            />}
        </div>
    );
};

export default MetrodleGame;
