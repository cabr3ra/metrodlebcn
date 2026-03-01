
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Station, LineStyle } from '../types';
import { mapDbStation, mapDbLines, STATION_SELECT_QUERY, LINE_SELECT_QUERY } from '../utils/supabaseUtils';

export function useStations() {
    const [stations, setStations] = useState<Station[]>([]);
    const [lineStyles, setLineStyles] = useState<Record<string, LineStyle>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);

                // Fetch both stations and lines in parallel
                const [stationsRes, linesRes] = await Promise.all([
                    supabase.from('stations').select(STATION_SELECT_QUERY),
                    supabase.from('lines').select(LINE_SELECT_QUERY)
                ]);

                if (stationsRes.error) throw stationsRes.error;
                if (linesRes.error) throw linesRes.error;

                if (isMounted) {
                    if (stationsRes.data) {
                        setStations(stationsRes.data.map(mapDbStation));
                    }
                    if (linesRes.data) {
                        setLineStyles(mapDbLines(linesRes.data));
                    }
                }
            } catch (e) {
                console.error('Error fetching game data:', e);
                if (isMounted) {
                    setStations([]);
                    setLineStyles({});
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return { stations, lineStyles, loading };
}
