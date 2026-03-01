
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station } from '../types';
import { mapDbStation, STATION_SELECT_QUERY } from '../utils/supabaseUtils';

export function useDailyStation() {
    const [station, setStation] = useState<Station | null>(null);
    const [dayNumber, setDayNumber] = useState<number>(0);
    const [date, setDate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchDailyStation() {
            try {
                if (isMounted) setLoading(true);

                // 1. Get the authoritative ID and Date from Server (RPC)
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_daily_station_id');

                if (rpcError) throw rpcError;
                if (!rpcData || rpcData.length === 0) {
                    throw new Error('No active game found for today (BCN time).');
                }

                if (!isMounted) return;

                const { date: dbDate, station_id } = rpcData[0];
                setDate(dbDate);

                // 2. Fetch full station details using the ID
                const { data, error } = await supabase
                    .from('stations')
                    .select(STATION_SELECT_QUERY)
                    .eq('id', station_id)
                    .single();

                if (error) throw error;
                if (!data) throw new Error('Station data not found');

                if (!isMounted) return;

                // Calculate day number (days since start)
                const startDate = new Date('2026-01-01').getTime();
                const currentDate = new Date(dbDate).getTime();
                const diffTime = Math.abs(currentDate - startDate);
                const dayNum = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setDayNumber(dayNum);

                // Map DB response using utility
                setStation(mapDbStation(data));

            } catch (err: any) {
                console.error('Error fetching daily station:', err);
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDailyStation();
        return () => { isMounted = false; };
    }, []);

    return { station, dayNumber, date, loading, error };
}
