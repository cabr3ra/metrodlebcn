import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { STATIONS } from './constants';
import { Station, GuessResult, MatchType } from './types';

import GameGrid from './components/GameGrid';
import HowToPlay from './components/HowToPlay';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';
import Navbar from './components/Navbar';
import LineIcon from './components/LineIcon';
import { useAuth } from './context/AuthContext';
import { useDailyStation } from './hooks/useDailyStation';
import { useGameState } from './hooks/useGameState';
import { useUserStats } from './hooks/useUserStats';
import { useStations } from './hooks/useStations';
import { calculateResult } from './utils/gameLogic';
import SearchSuggestions from './components/SearchSuggestions';

const translations = {
  ca: {
    title: "Metrodle BCN",
    searchPlaceholder: "Cerca una estació...",
    won: "🎉 Molt bé!",
    lost: "😢 Oh no!",
    theStationWas: "L'estació era",
    viewStats: "Veure estadístiques",
    howToPlay: "Com jugar?",
    attributes: "Atributs a comparar",
    name: "Nom",
    line: "Línia",
    position: "Posició",
    type: "Tipus",
    connections: "Connexions",
    distance: "Distància",
    correct: "Correcte",
    partial: "Parcial",
    none: "Cap",
    congrats: "Enhorabona!",
    almost: "Gairebé!",
    secretStation: "L'estació secreta era:",
    viewOnMap: "Veure al mapa",
    games: "Partides",
    winPct: "% Wins",
    streak: "Ratxa",
    maxStreak: "Màxima",
    nextMetrodle: "Següent Metrodle",
    share: "Compartir",
    copied: "Resultats copiats al porta-retalls!",
    settings: "Ajustos",
    language: "Idioma",
    done: "Entès!",
    close: "Tancar",
    station: "Estació",
    posShort: "Posició",
    typeShort: "Tipus",
    connShort: "Connex.",
    distShort: "Dist.",
    time: "Temps",
    day: "Dia"
  },
  es: {
    title: "Metrodle BCN",
    searchPlaceholder: "Busca una estación...",
    won: "🎉 ¡Muy bien!",
    lost: "😢 ¡Oh no!",
    theStationWas: "La estación era",
    viewStats: "Ver estadísticas",
    howToPlay: "¿Cómo jugar?",
    attributes: "Atributos a comparar",
    name: "Nombre",
    line: "Línea",
    position: "Posición",
    type: "Tipo",
    connections: "Conexiones",
    distance: "Distancia",
    correct: "Correcto",
    partial: "Parcial",
    none: "Ninguno",
    congrats: "¡Enhorabuena!",
    almost: "¡Casi!",
    secretStation: "La estación secreta era:",
    viewOnMap: "Ver en el mapa",
    games: "Partidas",
    winPct: "% Victorias",
    streak: "Racha",
    maxStreak: "Máxima",
    nextMetrodle: "Siguiente Metrodle",
    share: "Compartir",
    copied: "¡Resultados copiados al portapapeles!",
    settings: "Ajustes",
    language: "Idioma",
    done: "¡Entendido!",
    close: "Cerrar",
    station: "Estación",
    posShort: "Posición",
    typeShort: "Tipo",
    connShort: "Conex.",
    distShort: "Dist.",
    time: "Tiempo",
    day: "Día"
  }
};

const App: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { station: dailyStation, dayNumber: fetchedDayNumber, loading: stationLoading } = useDailyStation();

  // Use a date string for today to namespace the game session
  const today = new Date().toISOString().split('T')[0];

  const {
    guesses: remoteGuesses,
    persistGuess,
    isCompleted
  } = useGameState(today, dailyStation);

  const { stats, updateStats } = useUserStats();
  const { stations: allStations } = useStations();

  const [targetStation, setTargetStation] = useState<Station>(STATIONS[0]);
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [solveTime, setSolveTime] = useState<number | null>(null);

  const [language, setLanguage] = useState<'ca' | 'es'>(
    (localStorage.getItem('metrodle-lang') as 'ca' | 'es') || 'ca'
  );

  const t = translations[language];

  // Sync Daily Station
  useEffect(() => {
    if (dailyStation) {
      setTargetStation(dailyStation);
      setDayNumber(fetchedDayNumber);
    }
  }, [dailyStation, fetchedDayNumber]);

  // Sync Game State
  useEffect(() => {
    // Only sync if we have remote guesses and local guesses are empty (initial load)
    // OR if we want to enforce remote state always.
    // For now, let's sync if remote has data.
    if (remoteGuesses.length > 0) {
      // If we already have local guesses that match remote, do nothing (avoid loop if setGuesses triggers something, but it shouldn't)
      // Actually, standard pattern:
      setGuesses(remoteGuesses);

      const lastGuess = remoteGuesses[remoteGuesses.length - 1];
      if (lastGuess.nameMatch) {
        setWon(true);
        setGameOver(true);
      } else if (remoteGuesses.length >= 6) {
        setGameOver(true);
      }
    } else if (isCompleted) {
      // If completed but no guesses (e.g. maybe weird state? or just sync flag)
    }
  }, [remoteGuesses, isCompleted]);

  // Initial Dark Mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleLanguage = (lang: 'ca' | 'es') => {
    setLanguage(lang);
    localStorage.setItem('metrodle-lang', lang);
  };

  // Use allStations from DB instead of STATIONS constant
  const suggestions = useMemo(() => {
    if (searchTerm.length < 1) return [];
    return allStations.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !guesses.find(g => g.station.id === s.id)
    ).slice(0, 5);
  }, [searchTerm, guesses, allStations]);

  const handleGuess = (station: Station) => {
    if (gameOver) return;

    // Calculate result
    const result = calculateResult(station, targetStation);
    const newGuesses = [...guesses, result];

    // Update local state
    setGuesses(newGuesses);
    setSearchTerm('');

    const isWin = result.nameMatch;
    const isLoss = newGuesses.length >= 6 && !isWin;
    const isFinished = isWin || isLoss;

    // Persist to Supabase
    const guessIds = newGuesses.map(g => g.station.id);
    persistGuess(guessIds, isWin);

    if (isFinished) {
      setGameOver(true);
      if (isWin) setWon(true);

      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      setSolveTime(timeSpent);

      // Update User Stats
      updateStats(isWin, newGuesses.length);

      setTimeout(() => setShowStats(true), 1500);
    }
  };

  if (authLoading || stationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold animate-pulse">Carregant...</p>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-zinc-950 transition-colors">
        <Navbar
          onOpenHowTo={() => setShowHowTo(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenSettings={() => setShowSettings(true)}
          isGameOver={gameOver}
        />

        <main className="flex-1 flex flex-col items-center p-4 max-w-4xl mx-auto w-full">
          <div className="mb-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
            {t.day} #{dayNumber}
          </div>

          <GameGrid guesses={guesses} maxAttempts={6} t={t} />

          {!gameOver && (
            <div className="w-full mt-auto py-6 sticky bottom-0 bg-zinc-950/80 backdrop-blur-sm">
              <SearchSuggestions
                suggestions={suggestions}
                onSelect={handleGuess}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                t={t}
                show={suggestions.length > 0}
              />
            </div>
          )}

          {gameOver && (
            <div className="mt-8 p-6 bg-zinc-900 rounded-2xl text-center w-full border border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-2xl font-bold mb-2">
                {won ? t.won : t.lost}
              </h2>
              <p className="text-zinc-500">{t.theStationWas} <span className="font-bold text-red-500">{targetStation.name}</span></p>
              <button
                onClick={() => setShowStats(true)}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-red-500/10"
              >
                {t.viewStats}
              </button>
            </div>
          )}
        </main>

        {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} t={t} />}
        {showStats && <StatsModal
          onClose={() => setShowStats(false)}
          guesses={guesses}
          won={won}
          target={targetStation}
          t={t}
          solveTime={solveTime}
          dayNumber={dayNumber}
          stats={stats}
        />}
        {showSettings && <SettingsModal
          onClose={() => setShowSettings(false)}
          language={language}
          setLanguage={toggleLanguage}
          t={t}
        />}
      </div>
    </Router>
  );
};

export default App;
