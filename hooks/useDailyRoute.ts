
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station } from '../types';
import { mapDbStation, STATION_SELECT_QUERY } from '../utils/supabaseUtils';

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
        let isMounted = true;

        async function fetchDailyRoute() {
            try {
                if (isMounted) setLoading(true);

                // 1. Get the route IDs from RPC
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_daily_route');

                if (rpcError) throw rpcError;
                if (!rpcData || rpcData.length === 0) {
                    throw new Error('No active route found for today.');
                }

                if (!isMounted) return;

                const { date, origin_id, destination_id } = rpcData[0];

                // 2. Fetch both station details
                const { data: stationsData, error: stationsError } = await supabase
                    .from('stations')
                    .select(STATION_SELECT_QUERY)
                    .in('id', [origin_id, destination_id]);

                if (stationsError) throw stationsError;
                if (!stationsData || stationsData.length < 2) throw new Error('Route stations not found');

                if (!isMounted) return;

                const origin = mapDbStation(stationsData.find(s => s.id === origin_id));
                const destination = mapDbStation(stationsData.find(s => s.id === destination_id));

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
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDailyRoute();
        return () => { isMounted = false; };
    }, []);

    return { route, loading, error };
}
