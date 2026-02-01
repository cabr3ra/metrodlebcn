
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Station } from '../types';
import { STATIONS } from '../constants';

export function useRutaState(date: string, origin: Station | null, destination: Station | null) {
    const { user } = useAuth();
    const [correctStationIds, setCorrectStationIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbSessionId, setDbSessionId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        if (!user || !date || !origin || !destination) return;

        let mounted = true;

        async function loadState() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('game_sessions')
                    .select('*')
                    .eq('user_id', user!.id)
                    .eq('date', date)
                    .eq('game_id', 'ruta')
                    .maybeSingle();

                if (mounted && data) {
                    setDbSessionId(data.id);
                    setIsCompleted(data.completed);
                    if (data.guesses && Array.isArray(data.guesses)) {
                        setCorrectStationIds(data.guesses);
                    }
                    setStartTime(new Date(data.created_at).getTime());
                    if (data.errors !== undefined) {
                        setErrors(data.errors);
                    }
                    // For Ruta, we might store errors in a separate column or just count them from a meta field.
                    // For now, let's just use local state for errors during the session.
                } else if (mounted) {
                    setCorrectStationIds([origin.id]); // Start with origin
                    setDbSessionId(null);
                    setIsCompleted(false);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadState();
        return () => { mounted = false; };
    }, [user, date, origin, destination]);

    const persistProgress = async (newIds: string[], completed: boolean, errorOverride?: number) => {
        if (!user) return;

        const payload = {
            user_id: user.id,
            date,
            game_id: 'ruta',
            guesses: newIds,
            won: completed,
            completed: completed,
            errors: errorOverride !== undefined ? errorOverride : errors,
            updated_at: new Date().toISOString()
        };

        if (dbSessionId) {
            await supabase.from('game_sessions').update(payload).eq('id', dbSessionId);
        } else {
            const { data } = await supabase.from('game_sessions').insert(payload).select().single();
            if (data) setDbSessionId(data.id);
        }
    };

    return {
        loading,
        correctStationIds,
        setCorrectStationIds,
        persistProgress,
        isCompleted,
        errors,
        setErrors,
        startTime
    };
}
