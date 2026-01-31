
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HowToPlay from './components/HowToPlay';
import SettingsModal from './components/SettingsModal';
import MetrodleGame from './components/MetrodleGame';
import RutaGame from './components/RutaGame';
import PracticeGame from './components/PracticeGame';

const translations = {
  ca: {
    title: "Metrodle BCN",
    day: "Dia",
    won: "🎉 Molt bé!",
    lost: "😢 Oh no!",
    theStationWas: "L'estació era",
    viewStats: "Veure estadístiques",
    howToPlay: "Com jugar?",
    congrats: "Enhorabona!",
    almost: "Gairebé!",
    secretStation: "L'estació secreta era:",
    viewOnMap: "Veure al mapa",
    games: "Partides",
    winPct: "% Wins",
    streak: "Ratxa",
    maxStreak: "Màxima",
    share: "Compartir",
    copied: "Resultats copiats al porta-retalls!",
    settings: "Ajustos",
    language: "Idioma",
    done: "D'acord!",
    close: "Tancar"
  },
  es: {
    title: "Metrodle BCN",
    day: "Día",
    won: "🎉 ¡Muy bien!",
    lost: "😢 ¡Oh no!",
    theStationWas: "La estación era",
    viewStats: "Ver estadísticas",
    howToPlay: "¿Cómo jugar?",
    congrats: "¡Enhorabuena!",
    almost: "¡Casi!",
    secretStation: "La estación secreta era:",
    viewOnMap: "Ver en el mapa",
    games: "Partidas",
    winPct: "% Victorias",
    streak: "Racha",
    maxStreak: "Máxima",
    share: "Compartir",
    copied: "¡Resultados copiados al portapapeles!",
    settings: "Ajustes",
    language: "Idioma",
    done: "¡Entendido!",
    close: "Cerrar"
  }
};

const AppContent: React.FC<{
  authLoading: boolean;
  showHowTo: boolean;
  setShowHowTo: (s: boolean) => void;
  showStats: boolean;
  setShowStats: (s: boolean) => void;
  showSettings: boolean;
  setShowSettings: (s: boolean) => void;
  language: 'ca' | 'es';
  toggleLanguage: (l: 'ca' | 'es') => void;
  isGameOverLocal: boolean;
  setIsGameOverLocal: (o: boolean) => void;
  t: any;
}> = ({ authLoading, showHowTo, setShowHowTo, showStats, setShowStats, showSettings, setShowSettings, language, toggleLanguage, isGameOverLocal, setIsGameOverLocal, t }) => {
  const location = useLocation();
  const isStatsEnabled = isGameOverLocal || location.pathname === '/train' || location.pathname === '/ruta';

  if (authLoading) {
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
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar
        onOpenHowTo={() => setShowHowTo(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
        isGameOver={isStatsEnabled}
      />

      <main className="flex-1 flex flex-col items-center p-4 max-w-4xl mx-auto w-full">
        <Routes>
          <Route path="/" element={
            <MetrodleGame
              t={t}
              showStats={showStats}
              setShowStats={setShowStats}
              onGameOver={setIsGameOverLocal}
            />
          } />
          <Route path="/ruta" element={
            <RutaGame
              t={t}
              showStats={showStats}
              setShowStats={setShowStats}
            />
          } />
          <Route path="/train" element={
            <PracticeGame
              t={t}
              showStats={showStats}
              setShowStats={setShowStats}
            />
          } />
        </Routes>
      </main>

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} t={t} />}
      {showSettings && <SettingsModal
        onClose={() => setShowSettings(false)}
        language={language}
        setLanguage={toggleLanguage}
        t={t}
      />}
    </div>
  );
};

const App: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isGameOverLocal, setIsGameOverLocal] = useState(false);

  const [language, setLanguage] = useState<'ca' | 'es'>(
    (localStorage.getItem('metrodle-lang') as 'ca' | 'es') || 'ca'
  );

  const t = translations[language];

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleLanguage = (lang: 'ca' | 'es') => {
    setLanguage(lang);
    localStorage.setItem('metrodle-lang', lang);
  };

  return (
    <Router>
      <AppContent
        authLoading={authLoading}
        showHowTo={showHowTo}
        setShowHowTo={setShowHowTo}
        showStats={showStats}
        setShowStats={setShowStats}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        language={language}
        toggleLanguage={toggleLanguage}
        isGameOverLocal={isGameOverLocal}
        setIsGameOverLocal={setIsGameOverLocal}
        t={t}
      />
    </Router>
  );
};

export default App;
