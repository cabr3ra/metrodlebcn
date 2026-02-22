
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Station } from '../types';
import { STATIONS } from '../constants';


export function useRutaState(date: string, origin: Station | null, destination: Station | null) {
    const { user } = useAuth();
    const [correctStationIds, setCorrectStationIds] = useState<string[]>([]);
    const [errorLog, setErrorLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbSessionId, setDbSessionId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [errors, setErrors] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);
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
                    .eq('mode_id', 'ruta')
                    .maybeSingle();


                if (mounted && data) {
                    setDbSessionId(data.id);
                    setIsCompleted(data.completed);
                    if (data.attempts && Array.isArray(data.attempts)) {
                        setCorrectStationIds(data.attempts);
                    }
                    if (data.error_log && Array.isArray(data.error_log)) {
                        setErrorLog(data.error_log);
                    }
                    setSharesCount(data.shares_count || 0);
                    setStartTime(new Date(data.created_at).getTime());
                    if (data.errors !== undefined) {
                        setErrors(data.errors);
                    }
                } else if (mounted) {
                    // Initialize session as 'started'
                    const { data: newData, error: insertError } = await supabase
                        .from('game_sessions')
                        .insert({
                            user_id: user!.id,
                            date,
                            mode_id: 'ruta',
                            status: 'started',
                            completed: false,
                            attempts: [origin.id]
                        })
                        .select()
                        .single();

                    if (!insertError && newData) {
                        setDbSessionId(newData.id);
                    }
                    setCorrectStationIds([origin.id]);
                    setErrorLog([]);
                    setIsCompleted(false);
                    setSharesCount(0);
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

    const persistProgress = async (newIds: string[], completed: boolean, failedStationId?: string) => {
        if (!user) return;

        const newErrorLog = failedStationId ? [...errorLog, failedStationId] : errorLog;
        if (failedStationId) setErrorLog(newErrorLog);

        const payload = {
            user_id: user.id,
            date,
            mode_id: 'ruta',
            attempts: newIds,
            won: completed,
            completed: completed,
            status: completed ? 'completed' : 'started',
            errors: newErrorLog.length,
            error_log: newErrorLog,
            updated_at: new Date().toISOString()
        };

        if (dbSessionId) {
            await supabase.from('game_sessions').update(payload).eq('id', dbSessionId);
        } else {
            const { data } = await supabase.from('game_sessions').insert(payload).select().single();
            if (data) setDbSessionId(data.id);
        }
    };

    const persistShare = async () => {
        if (!user || !dbSessionId) return;
        const newCount = sharesCount + 1;
        setSharesCount(newCount);
        await supabase.from('game_sessions').update({ shares_count: newCount }).eq('id', dbSessionId);
    };

    return {
        loading,
        correctStationIds,
        setCorrectStationIds,
        persistProgress,
        persistShare,
        isCompleted,
        errors,
        setErrors,
        startTime
    };
}
