
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { STATIONS } from './constants';
import { Station, GuessResult, MatchType } from './types';
import { getStationForDate } from './utils/dailyStation';
import GameGrid from './components/GameGrid';
import HowToPlay from './components/HowToPlay';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';
import Navbar from './components/Navbar';
import LineIcon from './components/LineIcon';

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

  useEffect(() => {
    const { station, dayNumber: day } = getStationForDate(new Date());
    setTargetStation(station);
    setDayNumber(day);
    document.documentElement.classList.add('dark');
  }, []);

  const toggleLanguage = (lang: 'ca' | 'es') => {
    setLanguage(lang);
    localStorage.setItem('metrodle-lang', lang);
  };

  const suggestions = useMemo(() => {
    if (searchTerm.length < 1) return [];
    return STATIONS.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !guesses.find(g => g.station.id === s.id)
    ).slice(0, 5);
  }, [searchTerm, guesses]);

  const calculateResult = (guessed: Station): GuessResult => {
    const nameMatch = guessed.id === targetStation.id;
    
    // Línia
    const sharedLines = guessed.lines.filter(l => targetStation.lines.includes(l));
    let lineMatch = MatchType.WRONG;
    if (guessed.lines.length === targetStation.lines.length && sharedLines.length === guessed.lines.length) {
      lineMatch = MatchType.CORRECT;
    } else if (sharedLines.length > 0) {
      lineMatch = MatchType.PARTIAL;
    }

    // Posició (Extrem vs Central)
    let positionMatch = MatchType.WRONG;
    if (guessed.position === targetStation.position) {
      positionMatch = MatchType.CORRECT;
    } else {
      positionMatch = MatchType.PARTIAL;
    }

    // Tipus d'estació
    let typeMatch = guessed.type === targetStation.type ? MatchType.CORRECT : MatchType.WRONG;

    // Connexions
    const sharedConns = guessed.connections.filter(c => targetStation.connections.includes(c));
    let connectionsMatch = MatchType.WRONG;
    if (guessed.connections.length === targetStation.connections.length && sharedConns.length === guessed.connections.length) {
      connectionsMatch = MatchType.CORRECT;
    } else if (sharedConns.length > 0) {
      connectionsMatch = MatchType.PARTIAL;
    }

    // Distància: Càlcul basat en la distància mínima entre línies compartides
    let distanceMatch = 0;
    let distanceDirection: 'up' | 'down' | 'none' = 'none';

    if (sharedLines.length > 0) {
        const distances = sharedLines.map(line => {
            const orderGuessed = guessed.lineOrders[line];
            const orderTarget = targetStation.lineOrders[line];
            if (orderGuessed === undefined || orderTarget === undefined) {
                return { dist: Infinity, dir: 'none' as const };
            }
            return {
                dist: Math.abs(orderGuessed - orderTarget),
                dir: (orderGuessed < orderTarget ? 'up' : orderGuessed > orderTarget ? 'down' : 'none') as 'up' | 'down' | 'none'
            };
        });
        
        const minResult = distances.reduce((prev, curr) => (curr.dist < prev.dist ? curr : prev));
        distanceMatch = minResult.dist;
        distanceDirection = minResult.dir;
    } else {
        distanceMatch = 10;
        distanceDirection = 'none';
    }

    return {
      station: guessed,
      nameMatch,
      lineMatch,
      positionMatch,
      typeMatch,
      connectionsMatch,
      distanceMatch,
      distanceDirection
    };
  };

  const handleGuess = (station: Station) => {
    if (gameOver) return;
    const result = calculateResult(station);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setSearchTerm('');

    if (result.nameMatch) {
      setWon(true);
      setGameOver(true);
      setSolveTime(Math.floor((Date.now() - startTime) / 1000));
      setTimeout(() => setShowStats(true), 1500);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      setSolveTime(Math.floor((Date.now() - startTime) / 1000));
      setTimeout(() => setShowStats(true), 1500);
    }
  };

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
              <div className="relative">
                {suggestions.length > 0 && (
                  <div className="absolute bottom-full mb-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    {suggestions.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleGuess(s)}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="font-bold text-white">{s.name}</p>
                          <div className="flex gap-1.5 mt-1 items-center">
                            {s.lines.map(l => (
                              <LineIcon key={l} line={l} className="w-5 h-5 sm:w-6 sm:h-6" />
                            ))}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-zinc-400 group-hover:text-red-500">add_circle</span>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-900 border-2 border-transparent focus:border-red-500 outline-none transition-all text-white"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                  </div>
                </div>
              </div>
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
