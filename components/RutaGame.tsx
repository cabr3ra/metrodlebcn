
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Station } from '../types';
import SearchSuggestions from './SearchSuggestions';
import StatsModal from './StatsModal';
import { useDailyRoute } from '../hooks/useDailyRoute';
import { useRutaState } from '../hooks/useRutaState';
import { useStations } from '../hooks/useStations';
import { useUserStats } from '../hooks/useUserStats';
import { findShortestPath } from '../utils/pathfinding';
import { useLanguage } from '../context/LanguageContext';

interface RutaGameProps {
    showStats: boolean;
    setShowStats: (show: boolean) => void;
    onGameOver: (over: boolean) => void;
}

const RutaGame: React.FC<RutaGameProps> = ({ showStats, setShowStats, onGameOver }) => {
    const { t } = useLanguage();
    const { route: dailyRoute, loading: routeLoading } = useDailyRoute();
    const { stations: allStations, lineStyles } = useStations();
    const { stats, updateStats } = useUserStats('ruta');

    const today = new Date().toISOString().split('T')[0];
    const {
        loading: stateLoading,
        correctStationIds,
        setCorrectStationIds,
        persistProgress,
        persistShare,
        isCompleted,
        errors,
        setErrors,
        startTime: sessionStartTime
    } = useRutaState(today, dailyRoute?.origin || null, dailyRoute?.destination || null, allStations);

    const [searchTerm, setSearchTerm] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [solveTime, setSolveTime] = useState<number | null>(null);
    const [lastError, setLastError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Calculate the target path
    const targetPath = useMemo(() => {
        if (!dailyRoute || allStations.length === 0) return [];
        return findShortestPath(dailyRoute.origin.id, dailyRoute.destination.id, allStations) || [];
    }, [dailyRoute, allStations]);

    // Derived state: objects for correct stations (not used as primary loop anymore, but kept for types if needed)
    // We will now map over targetPath instead

    useEffect(() => {
        if (isCompleted) {
            setWon(true);
            setGameOver(true);
            onGameOver(true);
            if (sessionStartTime) setGameStartTime(sessionStartTime);
        }
    }, [isCompleted, onGameOver, sessionStartTime]);

    // Auto scroll to bottom when a new station is added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [correctStationIds]);

    const suggestions = useMemo(() => {
        if (searchTerm.length < 1) return [];
        return allStations.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !correctStationIds.includes(s.id)
        ).slice(0, 5);
    }, [searchTerm, correctStationIds, allStations]);

    const handleGuess = (station: Station) => {
        if (gameOver) return;

        let start = gameStartTime;
        if (!start) {
            start = Date.now();
            setGameStartTime(start);
        }

        const isPartOfPath = targetPath.some(s => s.id === station.id);

        if (isPartOfPath) {
            if (!correctStationIds.includes(station.id)) {
                const newIds = [...correctStationIds, station.id];
                setCorrectStationIds(newIds);
                setSearchTerm('');
                setLastError(null);

                const isWin = newIds.length === targetPath.length;
                persistProgress(newIds, isWin);

                if (isWin) {
                    setWon(true);
                    setGameOver(true);
                    onGameOver(true);
                    const timeSpent = Math.floor((Date.now() - start!) / 1000);
                    setSolveTime(timeSpent);
                    updateStats(true, errors);
                    setTimeout(() => setShowStats(true), 1500);
                }
            } else {
                // Already guessed, just clear
                setSearchTerm('');
            }
        } else {
            const nextErrors = errors + 1;
            setErrors(nextErrors);
            setLastError(station.name);
            setSearchTerm('');

            // Persist the error station ID for analytics (Heatmap)
            persistProgress(correctStationIds, false, station.id);
        }
    };


    // Format date for display
    const formattedDate = useMemo(() => {
        if (!dailyRoute?.date) return '';
        const d = new Date(dailyRoute.date);
        return d.toLocaleDateString(t.id === 'es' ? 'es-ES' : 'ca-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, [dailyRoute?.date, t.id]);

    if (routeLoading || stateLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!dailyRoute) return <div>Error loading route</div>;

    return (
        <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto h-[calc(100vh-180px)]">
            <div className="ticket-date ruta">
                {formattedDate}
                {gameOver && (
                    <div className={`ticket-stamp ${won ? 'validated' : 'expired'}`}>
                        {won ? 'VALIDADO' : 'EXPIRADO'}
                    </div>
                )}
            </div>

            <div className="mb-4 flex items-center justify-center gap-4 text-zinc-500 font-bold text-[10px] uppercase tracking-widest text-center">
                <span>{targetPath.length - 1} {t.stops || 'STOPS'}</span>
                {errors > 0 && (
                    <>
                        <span>•</span>
                        <span className="text-red-500">{errors} {errors === 1 ? 'ERROR' : 'ERRORES'}</span>
                    </>
                )}
            </div>

            {/* Route Map (Vertical Line) */}
            <div
                ref={scrollRef}
                className="flex-1 w-full overflow-y-auto px-4 py-8 mb-4 custom-scrollbar flex flex-col items-center"
            >
                {targetPath.map((s, idx) => {
                    const isGuessed = correctStationIds.includes(s.id);
                    const isLastInPath = idx === targetPath.length - 1;
                    const nextStationInPath = targetPath[idx + 1];
                    const segmentLines = nextStationInPath ? (
                        s.lines.filter(line =>
                            nextStationInPath.lines.includes(line) &&
                            Math.abs((s.lineOrders[line] || 0) - (nextStationInPath.lineOrders[line] || 0)) === 1
                        )
                    ) : [];

                    const displayLines = segmentLines.length > 0 ? segmentLines : (nextStationInPath ? s.lines.filter(l => nextStationInPath.lines.includes(l)) : []);
                    const finalLines = displayLines.length > 0 ? displayLines : (nextStationInPath ? [s.lines[0]] : []);

                    return (
                        <div key={s.id} className="flex flex-col w-full relative">
                            {/* Station Dot and Label */}
                            <div className="flex items-center w-full h-4 relative z-20">
                                <div className="w-4 flex flex-col items-center mr-4">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-700 ${isGuessed ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-white border-white' : 'bg-zinc-900 border-zinc-700'
                                            }`}
                                        style={{
                                            borderColor: isGuessed ? (idx === 0 || isLastInPath ? '#fff' : (finalLines.length > 0 ? (lineStyles[finalLines[0]]?.primary || '#555') : '#555')) : '#27272a'
                                        }}
                                    />
                                </div>
                                <div className="flex-1 flex items-center h-full">
                                    <span className={`text-lg transition-all duration-500 block leading-none ${isGuessed
                                        ? 'text-white font-black translate-x-1'
                                        : 'text-zinc-700 font-bold opacity-30 select-none'
                                        }`}>
                                        {isGuessed || gameOver ? s.name : '••••••••'}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Line Container - Z-index 10 to be behind dots */}
                            {!isLastInPath && (
                                <div className="flex w-full relative z-10">
                                    <div className="w-4 flex justify-center items-center relative mr-4">
                                        {/* Connector Line */}
                                        <div className="h-12 flex gap-[2px] mt-[-8px] mb-[8px] relative z-10">
                                            {finalLines.map(lineId => (
                                                <div
                                                    key={`${s.id}-${lineId}`}
                                                    className="w-1.5 h-[calc(100%+16px)]"
                                                    style={{
                                                        backgroundColor: lineStyles[lineId]?.primary || '#27272a',
                                                        opacity: isGuessed && correctStationIds.includes(nextStationInPath?.id) ? 1 : 0.1,
                                                        boxShadow: isGuessed && correctStationIds.includes(nextStationInPath?.id) ? `0 0 10px ${lineStyles[lineId]?.primary}44` : 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 h-12"></div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {gameOver && (
                    <div className="p-6 bg-zinc-900 rounded-2xl text-center w-full max-w-sm border border-zinc-800 animate-in fade-in zoom-in-95 duration-500 mt-10">
                        <h2 className="text-2xl font-bold mb-2">
                            {won ? t.pathCompleted || 'Ruta completada!' : t.lost}
                        </h2>
                        <p className="text-zinc-500">
                            {t.errors || 'Errors'}: <span className="font-bold text-red-500">{errors}</span>
                        </p>
                        <button
                            onClick={() => setShowStats(true)}
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-red-500/10"
                        >
                            {t.viewStats}
                        </button>
                    </div>
                )}
            </div>

            {lastError && !gameOver && (
                <div className="mb-4 text-red-500 text-sm font-medium animate-bounce border-2 border-red-500/20 px-4 py-2 rounded-xl bg-red-500/5">
                    ❌ <span className="font-bold">{lastError}</span> {t.none || 'is not in the route'}
                </div>
            )}

            {!gameOver && (
                <div className="w-full mt-auto py-6 sticky bottom-0">
                    <SearchSuggestions
                        suggestions={suggestions}
                        onSelect={handleGuess}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        show={suggestions.length > 0}
                    />
                </div>
            )}



            {showStats && <StatsModal
                onClose={() => setShowStats(false)}
                guesses={[]} // Grid format not applicable here
                won={won}
                target={dailyRoute.destination}
                origin={dailyRoute.origin}
                errorCount={errors}
                currentAttempts={(correctStationIds.length - 1) + errors}
                solveTime={solveTime}
                dayNumber={dailyRoute.dayNumber}
                date={dailyRoute.date}
                stats={stats}
                onShare={persistShare}
                gameType="ruta"
            />}

            <style>{`
                @keyframes growY {
                    from { transform: scaleY(0); opacity: 0; }
                    to { transform: scaleY(1); opacity: 1; }
                }
                .animate-grow-y {
                    animation: growY 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes stationArrival {
                    0% { transform: scale(1); }
                    60% { transform: scale(1.4); }
                    100% { transform: scale(1.25); }
                }
                .animate-station-arrival {
                    animation: stationArrival 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    animation-delay: 0.8s;
                }
                .dashed-line-vertical {
                    background-image: linear-gradient(to bottom, currentColor 40%, transparent 40%);
                    background-position: top;
                    background-size: 100% 12px;
                    background-repeat: repeat-y;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default RutaGame;
