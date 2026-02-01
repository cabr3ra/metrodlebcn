
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import HowToPlay from './components/HowToPlay';
import SettingsModal from './components/SettingsModal';
import MetrodleGame from './components/MetrodleGame';
import RutaGame from './components/RutaGame';
import PracticeGame from './components/PracticeGame';

const AppContent: React.FC<{
  authLoading: boolean;
  showHowTo: boolean;
  setShowHowTo: (s: boolean) => void;
  showStats: boolean;
  setShowStats: (s: boolean) => void;
  showSettings: boolean;
  setShowSettings: (s: boolean) => void;
  isGameOverLocal: boolean;
  setIsGameOverLocal: (o: boolean) => void;
}> = ({ authLoading, showHowTo, setShowHowTo, showStats, setShowStats, showSettings, setShowSettings, isGameOverLocal, setIsGameOverLocal }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const isStatsEnabled = isGameOverLocal || location.pathname === '/train' || location.pathname === '/ruta';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold animate-pulse">{t.loading}</p>
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
              showStats={showStats}
              setShowStats={setShowStats}
              onGameOver={setIsGameOverLocal}
            />
          } />
          <Route path="/ruta" element={
            <RutaGame
              showStats={showStats}
              setShowStats={setShowStats}
              onGameOver={setIsGameOverLocal}
            />
          } />
          <Route path="/train" element={
            <PracticeGame
              showStats={showStats}
              setShowStats={setShowStats}
            />
          } />
        </Routes>
      </main>

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isGameOverLocal, setIsGameOverLocal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
        isGameOverLocal={isGameOverLocal}
        setIsGameOverLocal={setIsGameOverLocal}
      />
    </Router>
  );
};

export default App;
