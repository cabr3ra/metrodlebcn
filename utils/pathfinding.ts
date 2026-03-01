
import { Station } from '../types';

export function findShortestPath(originId: string, destinationId: string, stations: Station[]): Station[] | null {
    if (stations.length === 0) return null;

    const queue: { id: string; path: string[] }[] = [{ id: originId, path: [originId] }];
    const visited = new Set<string>();
    visited.add(originId);

    const stationsMap = new Map<string, Station>();
    stations.forEach(s => stationsMap.set(s.id, s));

    while (queue.length > 0) {
        const { id, path } = queue.shift()!;

        if (id === destinationId) {
            return path.map(sid => stationsMap.get(sid)!);
        }

        const currentStation = stationsMap.get(id);
        if (!currentStation) continue;

        // Find neighbors (stations that share a line and are adjacent in LineOrder)
        const neighbors = new Set<string>();

        // For each line of the current station
        Object.keys(currentStation.lineOrders).forEach(lineId => {
            const order = currentStation.lineOrders[lineId];

            // Find other stations on the same line with order +1 or -1
            stations.forEach(s => {
                if (s.lineOrders[lineId] === order + 1 || s.lineOrders[lineId] === order - 1) {
                    neighbors.add(s.id);
                }
            });
        });

        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push({ id: neighborId, path: [...path, neighborId] });
            }
        }
    }

    return null;
}
