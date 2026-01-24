
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station } from '../types';

export function useDailyStation() {
    const [station, setStation] = useState<Station | null>(null);
    const [dayNumber, setDayNumber] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDailyStation() {
            try {
                setLoading(true);

                // 1. Get the authoritative ID and Date from Server (RPC)
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_daily_station_id');

                if (rpcError) throw rpcError;
                if (!rpcData || rpcData.length === 0) {
                    // No schedule for "today" in BCN time?
                    throw new Error('No active game found for today (BCN time).');
                }

                const { date, station_id } = rpcData[0]; // RPC returns array

                // 2. Fetch full station details using the ID
                const { data, error } = await supabase
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
                    .eq('id', station_id)
                    .single();

                if (error) throw error;

                if (!data) throw new Error('Station data not found');

                // Calculate day number (days since start)
                const startDate = new Date('2026-01-01').getTime();
                const currentDate = new Date(date).getTime();
                const diffTime = Math.abs(currentDate - startDate);
                const dayNum = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setDayNumber(dayNum);

                // Map DB response to Station object
                const dbStation = data as any;
                const mappedStation: Station = {
                    id: dbStation.id,
                    name: dbStation.name,
                    type: dbStation.type,
                    positions: dbStation.positions,
                    lineOrders: dbStation.line_orders,
                    lines: dbStation.station_lines.map((sl: any) => sl.line_id),
                    connections: dbStation.station_connections.map((sc: any) => sc.connection_id)
                };

                setStation(mappedStation);

            } catch (err: any) {
                console.error('Error fetching daily station:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDailyStation();
    }, []);

    return { station, dayNumber, loading, error };
}
