
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
    howToPlayRutaTitle: string;
    rutaStep1Title: string;
    rutaStep1Desc: string;
    rutaStep2Title: string;
    rutaStep2Desc: string;
    rutaStep3Title: string;
    rutaStep3Desc: string;
    rutaStep4Title: string;
    rutaStep4Desc: string;
    privacyPolicy: string;
    cookiesPolicy: string;
    copyright: string;
    privacyContent: string;
    cookiesContent: string;
    accept: string;
    decline: string;
    cookieBannerText: string;
    contact: string;
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
        posShort: "Ubic.",
        typeShort: "Estr.",
        connShort: "Enll.",
        distShort: "Dist.",
        practiceMode: "Mode Pràctica",
        comingSoon: "Pròximament",
        routeDesc: "Troba el recorregut més curt entre dues estacions.",
        practiceDesc: "Entrena les teves habilitats sense límit. Ideal per conèixer cada racó de la xarxa.",
        attributes: "Atributs",
        name: "Nom",
        position: "Ubicació",
        type: "Estructura",
        connections: "Enllaços",
        distance: "Distància",
        correct: "Correcte",
        partial: "Parcial",
        none: "Diferent",
        howToDesc: "Cada intent compara aquests atributs amb l'estació secreta del dia.",
        nameDesc: "Verd si el nom coincideix exactament.",
        lineDesc: "Línies que passen per l'estació. Groc si en comparteixen alguna, verd si totes coincideixen.",
        posDesc: "Indica si l'estació es troba en un extrem o a la zona central de la línia.",
        typeDesc: "L'estructura física de l'estació: Subterrània o en Superfície.",
        connDesc: "Intercanvis amb altres transports (FGC, Rodalies, Tram, Bus, etc.).",
        distDesc: "Nombre d'estacions de distància pel camí més curt.",
        nextGame: "Següent joc",
        backTo: "Tornar a",
        statsLabel: "Estadístiques",
        subterranean: "Subterrània",
        surface: "Superfície",
        extreme: "Extrem",
        central: "Central",
        loading: "Carregant el traçat...",
        stops: "estacions",
        nextStop: "Propera parada...",
        pathCompleted: "Recorregut completat!",
        isNotNext: "no és la parada correcta",
        errors: "Errors",
        attempts: "Intents",
        howToPlayRutaTitle: "Com jugar a Ruta BCN?",
        rutaStep1Title: "Origen i Destí",
        rutaStep1Desc: "Cada dia tindràs una estació d'origen i una de destinació diferents.",
        rutaStep2Title: "Troba el camí",
        rutaStep2Desc: "L'objectiu és trobar el recorregut més curt entre les dues estacions.",
        rutaStep3Title: "Pas a pas",
        rutaStep3Desc: "Has d'anar endevinant quina és la següent estació de la ruta en ordre.",
        rutaStep4Title: "Atenció als errors",
        rutaStep4Desc: "Si t'equivoques d'estació, sumaràs un error. Completa la ruta amb el mínim d'errors possibles!",
        privacyPolicy: "Privacitat",
        cookiesPolicy: "Cookies",
        copyright: "© 2026 Metrodle BCN. Tots els drets reservats.",
        privacyContent: "A Metrodle BCN respectem la teva privacitat. Utilitzem Google Analytics per entendre com es fa servir el joc i Google AdSense per mostrar anuncis que ens permeten mantenir el servei gratuït. No venem les teves dades a tercers. En jugar, acceptes la recollida de dades anònimes per a fins estadístics i publicitaris.",
        cookiesContent: "Utilitzem cookies per personalitzar el contingut, els anuncis i analitzar el trànsit. Les cookies de tercers (com les de Google) s'utilitzen per oferir anuncis basats en les teves visites prèvies a aquesta o altres webs. Pots configurar-les o rebutjar-les des dels ajustos del teu navegador.",
        accept: "Acceptar",
        decline: "Rebutjar",
        cookieBannerText: "Fem servir cookies pròpies i de tercers per millorar la teva experiència i mostrar-te publicitat relacionada amb les teves preferències.",
        contact: "Contacte"
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
        posShort: "Ubic.",
        typeShort: "Estr.",
        connShort: "Trans.",
        distShort: "Dist.",
        practiceMode: "Modo Práctica",
        comingSoon: "Próximamente",
        routeDesc: "Encuentra el recorrido más corto entre dos estaciones.",
        practiceDesc: "Entrena tus habilidades sin límites. Ideal para conocer cada rincón de la red.",
        attributes: "Atributos",
        name: "Nombre",
        position: "Ubicación",
        type: "Estructura",
        connections: "Correspondencias",
        distance: "Distancia",
        correct: "Correcto",
        partial: "Parcial",
        none: "Diferente",
        howToDesc: "Cada intento compara estos atributos con la estación secreta del día.",
        nameDesc: "Verde si el nombre coincide exactamente.",
        lineDesc: "Líneas que pasan por la estación. Amarillo si comparten alguna, verde si todas coinciden.",
        posDesc: "Indica si la estación está en un extremo o en la zona central de la línea.",
        typeDesc: "La estructura física de la estación: Subterránea o en Superficie.",
        connDesc: "Intercambios con otros transportes (FGC, Cercanías, Tranvía, Autobús, etc.).",
        distDesc: "Número de estaciones de distancia por el camino más corto.",
        nextGame: "Siguiente juego",
        backTo: "Volver a",
        statsLabel: "Estadísticas",
        subterranean: "Subterránea",
        surface: "Superficie",
        extreme: "Extremo",
        central: "Central",
        loading: "Cargando trazado...",
        stops: "estaciones",
        nextStop: "Próxima parada...",
        pathCompleted: "¡Recorrido completado!",
        isNotNext: "no es la parada correcta",
        errors: "Errores",
        attempts: "Intentos",
        howToPlayRutaTitle: "¿Cómo jugar a Ruta BCN?",
        rutaStep1Title: "Origen y Destino",
        rutaStep1Desc: "Cada día tendrás una estación de origen y una de destino diferentes.",
        rutaStep2Title: "Encuentra el camino",
        rutaStep2Desc: "El objetivo es encontrar el recorrido más corto entre ambas estaciones.",
        rutaStep3Title: "Paso a paso",
        rutaStep3Desc: "Debes ir adivinando cuál es la siguiente estación de la ruta en orden.",
        rutaStep4Title: "Cuidado con los errores",
        rutaStep4Desc: "Si te equivocas de estación, sumarás un error. ¡Completa la ruta con el mínimo de errores posibles!",
        privacyPolicy: "Privacidad",
        cookiesPolicy: "Cookies",
        copyright: "© 2026 Metrodle BCN. Todos los derechos reservados.",
        privacyContent: "En Metrodle BCN respetamos tu privacidad. Utilizamos Google Analytics para entender cómo se usa el juego y Google AdSense para mostrar anuncios que nos permiten mantener el servicio gratuito. No vendemos tus datos a terceros. Al jugar, aceptas la recogida de datos anónimos para fines estadísticos y publicitarios.",
        cookiesContent: "Utilizamos cookies para personalizar el contenido, los anuncios y analizar el tráfico. Las cookies de terceros (como las de Google) se utilizan para ofrecer anuncios basados en tus visitas previas a esta u otras webs. Puedes configurarlas o rechazarlas desde los ajustes de tu navegador.",
        accept: "Aceptar",
        decline: "Rechazar",
        cookieBannerText: "Utilizamos cookies propias y de terceros para mejorar tu experiencia y mostrarte publicidad relacionada con tus preferencias.",
        contact: "Contacto"
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
        posShort: "Loc.",
        typeShort: "Type",
        connShort: "Int.",
        distShort: "Dist.",
        practiceMode: "Practice Mode",
        comingSoon: "Coming Soon",
        routeDesc: "Find the shortest route between two stations.",
        practiceDesc: "Train your skills with no limits. Ideal to learn every corner of the network.",
        attributes: "Attributes",
        name: "Name",
        position: "Location",
        type: "Structure",
        connections: "Interchanges",
        distance: "Distance",
        correct: "Correct",
        partial: "Partial",
        none: "Different",
        howToDesc: "Each attempt compares these attributes with the day's secret station.",
        nameDesc: "Green if the name matches exactly.",
        lineDesc: "Lines passing through the station. Yellow if some match, green if all match.",
        posDesc: "Indicates if the station is at a terminus or in the central area of the line.",
        typeDesc: "The physical structure of the station: Underground or Surface.",
        connDesc: "Interchanges with other transport modes (FGC, Rodalies, Tram, Bus, etc.).",
        distDesc: "Number of stations away via the shortest path.",
        nextGame: "Next game",
        backTo: "Back to",
        statsLabel: "Statistics",
        subterranean: "Underground",
        surface: "Surface",
        extreme: "Terminus",
        central: "Central",
        loading: "Loading network...",
        stops: "stations",
        nextStop: "Next stop...",
        pathCompleted: "Path completed!",
        isNotNext: "is not the correct stop",
        errors: "Errors",
        attempts: "Attempts",
        howToPlayRutaTitle: "How to play Ruta BCN?",
        rutaStep1Title: "Origin and Destination",
        rutaStep1Desc: "Every day you will have a different origin and destination station.",
        rutaStep2Title: "Find the path",
        rutaStep2Desc: "The goal is to find the shortest route between the two stations.",
        rutaStep3Title: "Step by step",
        rutaStep3Desc: "You must guess the next station in the route in the correct order.",
        rutaStep4Title: "Watch out for errors",
        rutaStep4Desc: "If you guess the wrong station, you add an error. Complete the route with as few errors as possible!",
        privacyPolicy: "Privacy",
        cookiesPolicy: "Cookies",
        copyright: "© 2026 Metrodle BCN. All rights reserved.",
        privacyContent: "At Metrodle BCN we respect your privacy. We use Google Analytics to understand how the game is used and Google AdSense to show ads that allow us to keep the service free. We do not sell your data to third parties. By playing, you agree to the collection of anonymous data for statistical and advertising purposes.",
        cookiesContent: "We use cookies to personalize content, ads and analyze traffic. Third-party cookies (such as Google's) are used to serve ads based on your previous visits to this or other websites. You can configure or reject them from your browser settings.",
        accept: "Accept",
        decline: "Decline",
        cookieBannerText: "We use own and third-party cookies to improve your experience and show you advertising related to your preferences.",
        contact: "Contact"
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
