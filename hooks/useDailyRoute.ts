
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station } from '../types';

export interface DailyRoute {
    date: string;
    origin: Station;
    destination: Station;
    dayNumber: number;
}

export function useDailyRoute() {
    const [route, setRoute] = useState<DailyRoute | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDailyRoute() {
            try {
                setLoading(true);

                // 1. Get the route IDs from RPC
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_daily_route');

                if (rpcError) throw rpcError;
                if (!rpcData || rpcData.length === 0) {
                    throw new Error('No active route found for today.');
                }

                const { date, origin_id, destination_id } = rpcData[0];

                // 2. Fetch both station details
                const { data: stationsData, error: stationsError } = await supabase
                    .from('stations')
                    .select(`
                        id,
                        name,
                        type,
                        positions,
                        line_orders,
                        station_lines ( line_id ),
                        station_connections ( connection_id )
                    `)
                    .in('id', [origin_id, destination_id]);

                if (stationsError) throw stationsError;
                if (!stationsData || stationsData.length < 2) throw new Error('Route stations not found');

                // Map helpers
                const mapStation = (dbStation: any): Station => ({
                    id: dbStation.id,
                    name: dbStation.name,
                    type: dbStation.type,
                    positions: dbStation.positions,
                    lineOrders: dbStation.line_orders,
                    lines: dbStation.station_lines.map((sl: any) => sl.line_id),
                    connections: dbStation.station_connections.map((sc: any) => sc.connection_id)
                });

                const origin = mapStation(stationsData.find(s => s.id === origin_id));
                const destination = mapStation(stationsData.find(s => s.id === destination_id));

                // Calculate day number
                const startDate = new Date('2026-01-01').getTime();
                const currentDate = new Date(date).getTime();
                const diffTime = Math.abs(currentDate - startDate);
                const dayNum = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                setRoute({
                    date,
                    origin,
                    destination,
                    dayNumber: dayNum
                });

            } catch (err: any) {
                console.error('Error fetching daily route:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDailyRoute();
    }, []);

    return { route, loading, error };
}
