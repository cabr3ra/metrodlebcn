
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ca' | 'es' | 'en';

interface Translation {
    title: string;
    day: string;
    won: string;
    lost: string;
    theStationWas: string;
    viewStats: string;
    howToPlay: string;
    congrats: string;
    almost: string;
    secretStation: string;
    viewOnMap: string;
    games: string;
    winPct: string;
    streak: string;
    maxStreak: string;
    share: string;
    copied: string;
    settings: string;
    language: string;
    done: string;
    close: string;
    searchPlaceholder: string;
    station: string;
    line: string;
    posShort: string;
    typeShort: string;
    connShort: string;
    distShort: string;
    practiceMode: string;
    comingSoon: string;
    routeDesc: string;
    practiceDesc: string;
    attributes: string;
    name: string;
    position: string;
    type: string;
    connections: string;
    distance: string;
    correct: string;
    partial: string;
    none: string;
    howToDesc: string;
    nameDesc: string;
    lineDesc: string;
    posDesc: string;
    typeDesc: string;
    connDesc: string;
    distDesc: string;
    nextGame: string;
    backTo: string;
    statsLabel: string;
    subterranean: string;
    surface: string;
    extreme: string;
    central: string;
    loading: string;
    stops: string;
    nextStop: string;
    pathCompleted: string;
    isNotNext: string;
    errors: string;
    attempts: string;
}

const translations: Record<Language, Translation> = {
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
        close: "Tancar",
        searchPlaceholder: "Cerca una estació...",
        station: "Estació",
        line: "Línia",
        posShort: "Pos.",
        typeShort: "Tipus",
        connShort: "Conn.",
        distShort: "Dist.",
        practiceMode: "Mode Pràctica",
        comingSoon: "Pròximament",
        routeDesc: "Planifica la ruta més curta entre dues estacions. Un nou repte cada dia!",
        practiceDesc: "Entrena les teves habilitats sense límit de partides diàries. Ideal per conèixer totes les estacions de la xarxa.",
        attributes: "Atributs",
        name: "Nom",
        position: "Posició",
        type: "Tipus",
        connections: "Connexions",
        distance: "Distància",
        correct: "Correcte",
        partial: "Parcial",
        none: "Diferent",
        howToDesc: "Cada intent compara els següents atributs entre l'estació introduïda i l'estació secreta del dia.",
        nameDesc: "S'il·lumina en verd si el nom és el correcte, encara que altres atributs no coincideixin.",
        lineDesc: "Línies de metro que passen per l'estació. Verd si coincideixen totes, groc si en comparteixen alguna.",
        posDesc: "Compara si l'estació està en un extrem o a la zona central de la línia.",
        typeDesc: "L'estructura de l'estació: Subterrània o Superfície.",
        connDesc: "Connexions fora del metro (FGC, Rodalies, Tram, Bus, etc.).",
        distDesc: "Distància en nombre de parades respecte a l'estació secreta seguint la línia més curta.",
        nextGame: "Següent joc",
        backTo: "Tornar al",
        statsLabel: "Estadístiques",
        subterranean: "Subterrània",
        surface: "Superfície",
        extreme: "Extrem",
        central: "Central",
        loading: "Carregant...",
        stops: "parades",
        nextStop: "Propera parada...",
        pathCompleted: "Ruta completada!",
        isNotNext: "no és la propera parada",
        errors: "Errors",
        attempts: "Intents"
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
        close: "Cerrar",
        searchPlaceholder: "Busca una estación...",
        station: "Estación",
        line: "Línea",
        posShort: "Pos.",
        typeShort: "Tipo",
        connShort: "Conn.",
        distShort: "Dist.",
        practiceMode: "Modo Práctica",
        comingSoon: "Próximamente",
        routeDesc: "Planifica la ruta más corta entre dos estaciones. ¡Un nuevo reto cada día!",
        practiceDesc: "Entrena tus habilidades sin límite de partidas diarias. Ideal para conocer todas las estaciones de la red.",
        attributes: "Atributos",
        name: "Nombre",
        position: "Posición",
        type: "Tipo",
        connections: "Conexiones",
        distance: "Distancia",
        correct: "Correcto",
        partial: "Parcial",
        none: "Diferente",
        howToDesc: "Cada intento compara los siguientes atributos entre la estación introducida y la estación secreta del día.",
        nameDesc: "Se ilumina en verde si el nombre es el correcto, aunque otros atributos no coincidan.",
        lineDesc: "Líneas de metro que pasan por la estación. Verde si coinciden todas, amarillo si comparten alguna.",
        posDesc: "Compara si la estación está en un extremo o en la zona central de la línea.",
        typeDesc: "La estructura de la estación: Subterránea o Superficie.",
        connDesc: "Conexiones fuera del metro (FGC, Cercanías, Tranvía, Autobús, etc.).",
        distDesc: "Distancia en número de paradas respecto a la estación secreta siguiendo la línea más corta.",
        nextGame: "Siguiente juego",
        backTo: "Volver al",
        statsLabel: "Estadísticas",
        subterranean: "Subterránea",
        surface: "Superficie",
        extreme: "Extremo",
        central: "Central",
        loading: "Cargando...",
        stops: "paradas",
        nextStop: "Próxima parada...",
        pathCompleted: "¡Ruta completada!",
        isNotNext: "no es la próxima parada",
        errors: "Errores",
        attempts: "Intentos"
    },
    en: {
        title: "Metrodle BCN",
        day: "Day",
        won: "🎉 Well done!",
        lost: "😢 Oh no!",
        theStationWas: "The station was",
        viewStats: "View statistics",
        howToPlay: "How to play?",
        congrats: "Congratulations!",
        almost: "Almost!",
        secretStation: "The secret station was:",
        viewOnMap: "View on map",
        games: "Played",
        winPct: "Win %",
        streak: "Streak",
        maxStreak: "Max Streak",
        share: "Share",
        copied: "Results copied to clipboard!",
        settings: "Settings",
        language: "Language",
        done: "Got it!",
        close: "Close",
        searchPlaceholder: "Search for a station...",
        station: "Station",
        line: "Line",
        posShort: "Pos.",
        typeShort: "Type",
        connShort: "Conn.",
        distShort: "Dist.",
        practiceMode: "Practice Mode",
        comingSoon: "Coming Soon",
        routeDesc: "Plan the shortest route between two stations. A new challenge every day!",
        practiceDesc: "Train your skills with no daily limits. Ideal to get to know all the network stations.",
        attributes: "Attributes",
        name: "Name",
        position: "Position",
        type: "Type",
        connections: "Connections",
        distance: "Distance",
        correct: "Correct",
        partial: "Partial",
        none: "Different",
        howToDesc: "Each attempt compares the following attributes between the station entered and the secret station of the day.",
        nameDesc: "Lights up in green if the name is correct, even if other attributes don't match.",
        lineDesc: "Metro lines passing through the station. Green if all match, yellow if they share some.",
        posDesc: "Compares if the station is at an end or in the central area of the line.",
        typeDesc: "The structure of the station: Underground or Surface.",
        connDesc: "Connections outside the metro (FGC, Rodalies, Tram, Bus, etc.).",
        distDesc: "Distance in number of stops from the secret station following the shortest line.",
        nextGame: "Next game",
        backTo: "Back to",
        statsLabel: "Statistics",
        subterranean: "Underground",
        surface: "Surface",
        extreme: "Terminal",
        central: "Central",
        loading: "Loading...",
        stops: "stops",
        nextStop: "Next stop...",
        pathCompleted: "Path completed!",
        isNotNext: "is not the next stop",
        errors: "Errors",
        attempts: "Attempts"
    }
};

const valueTranslations: Record<Language, Record<string, string>> = {
    ca: {
        'Subterrània': 'Subterrània',
        'Superfície': 'Superfície',
        'Extrem': 'Extrem',
        'Central': 'Central'
    },
    es: {
        'Subterrània': 'Subterránea',
        'Superfície': 'Superficie',
        'Extrem': 'Extremo',
        'Central': 'Central'
    },
    en: {
        'Subterrània': 'Underground',
        'Superfície': 'Surface',
        'Extrem': 'Terminal',
        'Central': 'Central'
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translation;
    translateValue: (val: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(
        (localStorage.getItem('metrodle-lang') as Language) || 'ca'
    );

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('metrodle-lang', lang);
    };

    const t = translations[language];

    const translateValue = (val: string) => {
        return valueTranslations[language][val] || val;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translateValue }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
