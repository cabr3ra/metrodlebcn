
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Station } from '../types';
import { STATIONS, LINE_STYLES } from '../constants';
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
    const { stations: allStations } = useStations();
    const { stats, updateStats } = useUserStats('ruta');

    const today = new Date().toISOString().split('T')[0];
    const {
        loading: stateLoading,
        correctStationIds,
        setCorrectStationIds,
        persistProgress,
        isCompleted,
        errors,
        setErrors,
        startTime: sessionStartTime
    } = useRutaState(today, dailyRoute?.origin || null, dailyRoute?.destination || null);

    const [searchTerm, setSearchTerm] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<number | null>(null);
    const [solveTime, setSolveTime] = useState<number | null>(null);
    const [lastError, setLastError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Calculate the target path
    const targetPath = useMemo(() => {
        if (!dailyRoute) return [];
        return findShortestPath(dailyRoute.origin.id, dailyRoute.destination.id) || [];
    }, [dailyRoute]);

    // Derived state: objects for correct stations
    const correctStations = useMemo(() => {
        return correctStationIds.map(id => allStations.find(s => s.id === id)).filter(Boolean) as Station[];
    }, [correctStationIds, allStations]);

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

        const nextStationIndex = correctStationIds.length;
        const expectedStation = targetPath[nextStationIndex];

        if (station.id === expectedStation?.id) {
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
            const nextErrors = errors + 1;
            setErrors(nextErrors);
            setLastError(station.name);
            setSearchTerm('');

            // Persist the error immediately so it's not lost if the user refreshes
            persistProgress(correctStationIds, false, nextErrors);
        }
    };

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
            <div className="mb-4 flex items-center justify-center gap-4 text-zinc-500 font-bold text-xs uppercase tracking-widest text-center">
                <span>{t.day} #{dailyRoute.dayNumber}</span>
                <span>•</span>
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
                {correctStations.map((s, idx) => {
                    const isLastStation = idx === correctStations.length - 1;
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
                                        className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all duration-700 ${isLastStation ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-white border-white ' + (idx > 0 ? 'animate-station-arrival' : '') : 'bg-zinc-900'
                                            }`}
                                        style={{
                                            borderColor: idx === 0 ? '#fff' : (finalLines.length > 0 ? LINE_STYLES[finalLines[0]]?.primary : '#555')
                                        }}
                                    />
                                </div>
                                <div className="flex-1 flex items-center h-full">
                                    <span className={`text-lg transition-all duration-500 block leading-none ${isLastStation
                                        ? 'text-white font-black translate-x-1'
                                        : 'text-zinc-500 font-bold'
                                        }`}>
                                        {s.name}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Line Container - Z-index 10 to be behind dots */}
                            <div className="flex w-full relative z-10">
                                <div className="w-4 flex justify-center items-center relative mr-4">
                                    {/* Dashed Guide Line (Background) - Shown for current AND previous segment for fluidity */}
                                    {(isLastStation || idx === correctStations.length - 2) && !gameOver && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-start mt-[-8px]">
                                            {finalLines.map(lineId => (
                                                <div
                                                    key={`guide-${lineId}`}
                                                    className="w-1 h-16 opacity-10 dashed-line-vertical"
                                                    style={{ color: LINE_STYLES[lineId]?.primary }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Solid Animated Path (Foreground) */}
                                    {idx < correctStations.length - 1 && (
                                        <div className="h-12 flex gap-[2px] mt-[-8px] mb-[8px] relative z-10">
                                            {finalLines.map(lineId => (
                                                <div
                                                    key={`${s.id}-${lineId}`}
                                                    className={`w-1.5 h-[calc(100%+16px)] origin-top ${idx === correctStations.length - 2 ? 'animate-grow-y' : ''}`}
                                                    style={{
                                                        backgroundColor: LINE_STYLES[lineId]?.primary,
                                                        boxShadow: `0 0 10px ${LINE_STYLES[lineId]?.primary}44`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Label for next stop hint */}
                                {isLastStation && !gameOver && (
                                    <div className="flex-1 flex items-center h-16 relative z-10">
                                        <span className="text-zinc-700 italic text-sm font-medium animate-pulse">
                                            {t.nextStop || 'Siguiente parada...'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Destination Placeholder (if not reached) */}
                {!gameOver && (
                    <div className="flex flex-col items-center w-full opacity-50 mt-4">
                        <div className="flex items-center w-full gap-4">
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                            <div className="flex-1 py-2">
                                <span className="text-lg font-bold text-zinc-700">
                                    {dailyRoute.destination.name}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

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
                <div className="mb-4 text-red-500 text-sm font-medium animate-bounce">
                    ❌ {lastError} {t.isNotNext || 'is not the next station'}
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
                stats={stats}
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
