
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
        loading: "Pròxima estació...",
        stops: "estacions",
        nextStop: "Pròxima estació...",
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
        privacyContent: "POLÍTICA DE PRIVACITAT DE METRODLEBCN\n\nMetrodleBCN és una solució de gamificació cívica dissenyada per millorar l'alfabetització en mobilitat urbana. De conformitat amb el Reglament General de Protecció de Dades (RGPD), t'informem detalladament:\n\n1. RESPONSABLE DEL TRACTAMENT: [ENTITAT], amb correu electrònic de contacte: [CORREU].\n\n2. FINALITAT: Gestió de l'experiència de joc, recollida d'estadístiques de participació per a la validació del pilot cívic i optimització tècnica de la plataforma.\n\n3. NO REQUERIM REGISTRE: Per política de 'Privacitat per Defecte', MetrodleBCN no sol·licita ni emmagatzema dades d'identificació personal (nom, email o telèfon).\n\n4. EMMAGATZEMATGE LOCAL: Les teves estadístiques es guarden exclusivament al teu navegador mitjançant 'LocalStorage'. Aquesta informació no ens permet identificar-te personalment.\n\n5. SERVEIS DE TERCERS: Per al funcionament de la plataforma, utilitzem:\n- Supabase (Emmagatzematge anònim de dades de joc).\n- Vercel / Netlify (Infraestructura d'allotjament web).\n- Eines d'analítica agregada per mesurar l'impacte urbà del projecte.\n\n6. DRETS: Pots exercir els teus drets d'accés o supressió eliminant les dades de lloc i l'historial del teu navegador. Això reiniciarà completament el teu progrés en el joc.",
        cookiesContent: "POLÍTICA DE COOKIES DE METRODLEBCN\n\nAquesta web utilitza tecnologies d'emmagatzematge per garantir la funcionalitat del servei i analitzar-ne l'ús:\n\n1. QUÈ ÉS EL LOCALSTORAGE?: MetrodleBCN utilitza principalment 'LocalStorage' en lloc de cookies convencionals. Això permet que el teu progrés (estat de la partida diària i ratxes) quedi guardat al teu dispositiu sense necessitat de registre.\n\n2. COOKIES TÈCNIQUES I NECESSÀRIES: Són aquelles imprescindibles per al funcionament, com la selecció d'idioma i el manteniment de l'estat de la partida del dia.\n\n3. COOKIES D'ANALÍTICA: Podem recollir dades de navegació de forma agregada i totalment anònima per entendre l'èxit del projecte i la interacció amb la xarxa de metro.\n\n4. GESTIÓ I BLOQUEIG: Pots configurar el teu navegador per bloquejar o eliminar aquestes dades. Tingues en compte que fer-ho provocarà la pèrdua de les teves estadístiques i l'estat de la partida actual.",
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
        loading: "Próxima parada...",
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
        privacyContent: "POLÍTICA DE PRIVACIDAD DE METRODLEBCN\n\nMetrodleBCN es una solución de gamificación cívica diseñada para mejorar la alfabetización en movilidad urbana. De conformidad con el Reglamento General de Protección de Datos (RGPD), te informamos detalladamente:\n\n1. RESPONSABLE DEL TRATAMIENTO: [ENTIDAD], con correo electrónico de contacto: [CORREO].\n\n2. FINALIDAD: Gestión de la experiencia de juego, recogida de estadísticas de participación para la validación del piloto cívico y optimización técnica de la plataforma.\n\n3. SIN REGISTRO: Por política de 'Privacidad por Defecto', MetrodleBCN no solicita ni almacena datos de identificación personal (nombre, email o teléfono).\n\n4. ALMACENAMIENTO LOCAL: Tus estadísticas se guardan exclusivamente en tu navegador mediante 'LocalStorage'. Esta información no nos permite identificarte personalmente.\n\n5. SERVICIOS DE TERCEROS: Para el funcionamiento de la plataforma, utilizamos:\n- Supabase (Almacenamiento anónimo de datos de juego).\n- Vercel / Netlify (Infraestructura de alojamiento web).\n- Herramientas de analítica agregada para medir el impacto urbano del proyecto.\n\n6. DERECHOS: Puedes ejercer tus derechos de acceso o supresión borrando los datos de sitio y el historial de tu navegador. Esto reiniciará completamente tu progreso en el juego.",
        cookiesContent: "POLÍTICA DE COOKIES DE METRODLEBCN\n\nEsta web utiliza tecnologías de almacenamiento para garantizar la funcionalidad del servicio y analizar su uso:\n\n1. ¿QUÉ ES EL LOCALSTORAGE?: MetrodleBCN utiliza principalmente 'LocalStorage' en lugar de cookies convencionales. Esto permite que tu progreso (estado de la partida diaria y rachas) quede guardado en tu dispositivo sin necesidad de registro.\n\n2. COOKIES TÉCNICAS Y NECESARIAS: Son aquellas imprescindibles para el funcionamiento, como la selección de idioma y el mantenimiento del estado de la partida del día.\n\n3. COOKIES DE ANALÍTICA: Podemos recoger datos de navegación de forma agregada y totalmente anónima para entender el éxito del proyecto y la interacción con la red de metro.\n\n4. GESTIÓN Y BLOQUEO: Puedes configurar tu navegador para bloquear o eliminar estos datos. Ten en cuenta que hacerlo provocará la pérdida de tus estadísticas y el estado de la partida actual.",
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
        loading: "Next stop...",
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
        privacyContent: "METRODLEBCN PRIVACY POLICY\n\nMetrodleBCN is a civic gamification solution designed to improve urban mobility literacy. In accordance with the General Data Protection Regulation (GDPR), we inform you in detail:\n\n1. DATA CONTROLLER: [ENTITY], with contact email: [EMAIL].\n\n2. PURPOSE: Management of the gaming experience, collection of participation statistics for civic pilot validation, and technical optimization of the platform.\n\n3. NO REGISTRATION REQUIRED: By 'Privacy by Design' policy, MetrodleBCN does not request or store personal identification data (name, email, or phone number).\n\n4. LOCAL STORAGE: Your statistics are saved exclusively in your browser using 'LocalStorage'. This information does not allow us to identify you personally.\n\n5. THIRD-PARTY SERVICES: For platform operation, we use:\n- Supabase (Anonymous game data storage).\n- Vercel / Netlify (Web hosting infrastructure).\n- Aggregated analytics tools to measure the project's urban impact.\n\n6. YOUR RIGHTS: You can exercise your rights of access or erasure by clearing your browser's site data and history. This will completely reset your game progress.",
        cookiesContent: "METRODLEBCN COOKIES POLICY\n\nThis website uses storage technologies to ensure service functionality and analyze usage:\n\n1. WHAT IS LOCALSTORAGE?: MetrodleBCN primarily uses 'LocalStorage' instead of conventional cookies. This allows your progress (daily game status and streaks) to be saved on your device without registration.\n\n2. TECHNICAL AND NECESSARY COOKIES: These are essential for operation, such as language selection and maintaining the status of the day's game.\n\n3. ANALYTICAL COOKIES: We may collect browsing data in an aggregated and completely anonymous way to understand the project's success and interaction with the metro network.\n\n4. MANAGEMENT AND BLOCKING: You can configure your browser to block or delete this data. Please note that doing so will result in the loss of your statistics and current game status.",
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
