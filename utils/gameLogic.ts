
import { Station, GuessResult, MatchType } from '../types';

/**
 * Builds an adjacency list from a list of stations.
 */
const getAdjacencyList = (stations: Station[]) => {
    const lineStations = new Map<string, { id: string, order: number }[]>();
    stations.forEach(s => {
        s.lines.forEach(line => {
            if (!lineStations.has(line)) lineStations.set(line, []);
            lineStations.get(line)!.push({ id: s.id, order: s.lineOrders[line] });
        });
    });

    // Sort each line by order
    lineStations.forEach(stationsList => stationsList.sort((a, b) => a.order - b.order));

    const neighbors = new Map<string, Set<string>>();
    lineStations.forEach(stationsList => {
        for (let i = 0; i < stationsList.length - 1; i++) {
            const s1 = stationsList[i].id;
            const s2 = stationsList[i + 1].id;
            if (!neighbors.has(s1)) neighbors.set(s1, new Set());
            if (!neighbors.has(s2)) neighbors.set(s2, new Set());
            neighbors.get(s1)!.add(s2);
            neighbors.get(s2)!.add(s1);
        }
    });
    return neighbors;
};

const calculateShortestDistance = (startId: string, endId: string, neighbors: Map<string, Set<string>>): number => {
    if (startId === endId) return 0;

    const queue: [string, number][] = [[startId, 0]];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
        const [currentId, dist] = queue.shift()!;

        const currentNeighbors = neighbors.get(currentId);
        if (currentNeighbors) {
            for (const neighborId of currentNeighbors) {
                if (neighborId === endId) return dist + 1;
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push([neighborId, dist + 1]);
                }
            }
        }
    }

    return 99; // Fallback should not happen in a connected network
};

export const calculateResult = (guessed: Station, targetStation: Station, allStations: Station[]): GuessResult => {
    const nameMatch = guessed.id === targetStation.id;
    const neighbors = getAdjacencyList(allStations);

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

    // Distància: Càlcul real basat en BFS (nombre d'estacions)
    const distanceMatch = calculateShortestDistance(guessed.id, targetStation.id, neighbors);
    let distanceDirection: 'up' | 'down' | 'none' = 'none';

    // Determinar dirección solo si están en la misma línea
    if (sharedLines.length > 0) {
        const line = sharedLines[0];
        const orderGuessed = guessed.lineOrders[line];
        const orderTarget = targetStation.lineOrders[line];
        if (orderGuessed !== undefined && orderTarget !== undefined) {
            distanceDirection = orderGuessed < orderTarget ? 'up' : orderGuessed > orderTarget ? 'down' : 'none';
        }
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
