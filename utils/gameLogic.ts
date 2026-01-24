
import { Station, GuessResult, MatchType } from '../types';

export const calculateResult = (guessed: Station, targetStation: Station): GuessResult => {
    const nameMatch = guessed.id === targetStation.id;

    // Línia
    const sharedLines = guessed.lines.filter(l => targetStation.lines.includes(l));
    let lineMatch = MatchType.WRONG;
    if (guessed.lines.length === targetStation.lines.length && sharedLines.length === guessed.lines.length) {
        lineMatch = MatchType.CORRECT;
    } else if (sharedLines.length > 0) {
        lineMatch = MatchType.PARTIAL;
    }

    // Posició (Extrem vs Central) logic
    let positionMatch = MatchType.WRONG;
    let displayedPosition = '';

    const guessedValues = Object.values(guessed.positions);
    const targetValues = Object.values(targetStation.positions);

    // Case 1: Shared Lines - Check strict match on specific lines
    if (sharedLines.length > 0) {
        const match = sharedLines.find(l => guessed.positions[l] === targetStation.positions[l]);
        if (match) {
            positionMatch = MatchType.CORRECT;
            displayedPosition = guessed.positions[match];
        } else {
            positionMatch = MatchType.WRONG;
            // Display position of the first shared line to show the context of the error
            displayedPosition = guessed.positions[sharedLines[0]];
        }
    } else {
        // Case 2: No Shared Lines - Check for partial availability
        const hasOverlap = guessedValues.some(v => targetValues.includes(v));
        if (hasOverlap) {
            positionMatch = MatchType.PARTIAL;
        }
        // Fallback display
        displayedPosition = guessedValues[0] || '';
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
        distanceDirection,
        displayedPosition
    };
};
