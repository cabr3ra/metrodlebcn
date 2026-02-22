
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import HowToPlay from './components/HowToPlay';
import SettingsModal from './components/SettingsModal';
import MetrodleGame from './components/MetrodleGame';
import RutaGame from './components/RutaGame';
import PracticeGame from './components/PracticeGame';


import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import LegalPage from './components/LegalPage';
import CookieBanner from './components/CookieBanner';
import AdPlaceholder from './components/AdPlaceholder';

const AppContent: React.FC<{
  authLoading: boolean;
  showHowTo: boolean;
  setShowHowTo: (s: boolean) => void;
  showStats: boolean;
  setShowStats: (s: boolean) => void;
  showSettings: boolean;
  setShowSettings: (s: boolean) => void;
  metrodleOver: boolean;
  setMetrodleOver: (o: boolean) => void;
  rutaOver: boolean;
  setRutaOver: (o: boolean) => void;
}> = ({ authLoading, showHowTo, setShowHowTo, showStats, setShowStats, showSettings, setShowSettings, metrodleOver, setMetrodleOver, rutaOver, setRutaOver }) => {
  const { t } = useLanguage();
  const location = useLocation();

  // Cerrar modales al cambiar de página
  useEffect(() => {
    setShowHowTo(false);
    setShowStats(false);
  }, [location.pathname, setShowHowTo, setShowStats]);

  // El botón de estadísticas se habilita solo si el juego de la página actual ha terminado
  const isStatsEnabled = location.pathname === '/ruta' ? rutaOver : metrodleOver;

  // Determinar qué estadísticas mostrar en el modal
  const statsGameType = location.pathname === '/ruta' ? 'ruta' : 'metrodle';

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

      <main className="flex-1 flex flex-col items-center p-4 max-w-4xl mx-auto w-full relative">
        <AdPlaceholder position="left" />
        <AdPlaceholder position="right" />

        <Routes>
          <Route path="/" element={
            <MetrodleGame
              showStats={showStats}
              setShowStats={setShowStats}
              onGameOver={setMetrodleOver}
            />
          } />
          <Route path="/ruta" element={
            <RutaGame
              showStats={showStats}
              setShowStats={setShowStats}
              onGameOver={setRutaOver}
            />
          } />
          <Route path="/train" element={
            <PracticeGame
              showStats={showStats}
              setShowStats={setShowStats}
            />
          } />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />

          <Route path="/cookies" element={<LegalPage type="cookies" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
      <AdPlaceholder position="bottom" />

      {showHowTo && (
        <HowToPlay
          onClose={() => setShowHowTo(false)}
          gameType={statsGameType}
        />
      )}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <CookieBanner />
    </div>
  );
};

const App: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [metrodleOver, setMetrodleOver] = useState(false);
  const [rutaOver, setRutaOver] = useState(false);

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
        metrodleOver={metrodleOver}
        setMetrodleOver={setMetrodleOver}
        rutaOver={rutaOver}
        setRutaOver={setRutaOver}
      />
    </Router>
  );
};

export default App;
