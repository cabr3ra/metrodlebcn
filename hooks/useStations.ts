
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station } from '../types';
import { STATIONS } from '../constants'; // Fallback

export function useStations() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStations() {
            try {
                setLoading(true);
                // We need lines and connections too.
                // It's efficient enough for 180 stations to fetch all at once.
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
          `);

                if (error) throw error;

                if (data) {
                    const mapped: Station[] = data.map((d: any) => ({
                        id: d.id,
                        name: d.name,
                        type: d.type,
                        positions: d.positions,
                        lineOrders: d.line_orders,
                        lines: d.station_lines.map((sl: any) => sl.line_id),
                        connections: d.station_connections.map((sc: any) => sc.connection_id)
                    }));
                    setStations(mapped);
                } else {
                    setStations(STATIONS);
                }
            } catch (e) {
                console.error('Error fetching stations:', e);
                setStations(STATIONS); // Fallback
            } finally {
                setLoading(false);
            }
        }

        fetchStations();
    }, []);

    return { stations, loading };
}
