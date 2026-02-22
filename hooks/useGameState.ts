
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GuessResult, Station, MatchType } from '../types';
import { STATIONS } from '../constants'; // Fallback for hydration
import { calculateResult } from '../utils/gameLogic';

// Helper to calculate match (logic copied from App.tsx or moved to utils)
// Ideally this logic should be a shared utility.
// For now, we assume we just need to reconstruct the objects.


export function useGameState(date: string, targetStation: Station | null, modeId: string = 'metrodle') {
    const { user } = useAuth();
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbSessionId, setDbSessionId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [solveTimeState, setSolveTimeState] = useState<number | null>(null);
    const [sharesCount, setSharesCount] = useState(0);

    useEffect(() => {
        if (!user || !date || !targetStation) return;

        let mounted = true;


        async function loadState() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('game_sessions')
                    .select('*')
                    .eq('user_id', user!.id)
                    .eq('date', date)
                    .eq('mode_id', modeId)
                    .maybeSingle();

                if (error) console.error('Error loading game session:', error);

                if (mounted && data) {
                    setDbSessionId(data.id);
                    setIsCompleted(data.completed);
                    setStartTime(new Date(data.created_at).getTime());
                    setSharesCount(data.shares_count || 0);
                    if (data.duration_seconds) setSolveTimeState(data.duration_seconds);

                    // Hydrate attempts (guesses)
                    if (data.attempts && Array.isArray(data.attempts)) {
                        const hydratedGuesses = data.attempts.map((id: string) => {
                            const station = STATIONS.find(s => s.id === id);
                            if (!station) return null;
                            return calculateResult(station, targetStation);
                        }).filter(g => g !== null) as GuessResult[];

                        setGuesses(hydratedGuesses);
                    }
                } else if (mounted) {
                    // Initialize session as 'started'
                    const { data: newData, error: insertError } = await supabase
                        .from('game_sessions')
                        .insert({
                            user_id: user!.id,
                            date,
                            mode_id: modeId,
                            target_station_id: targetStation?.id,
                            status: 'started',
                            completed: false
                        })
                        .select()
                        .single();

                    if (!insertError && newData) {
                        setDbSessionId(newData.id);
                    }
                    setGuesses([]);
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
    }, [user, date, targetStation]);

    const persistGuess = async (newAttemptIds: string[], won: boolean, duration?: number) => {
        if (!user) return;

        const completed = won || (modeId === 'metrodle' && newAttemptIds.length >= 6);

        const payload = {
            user_id: user.id,
            date,
            target_station_id: targetStation?.id,
            mode_id: modeId,
            attempts: newAttemptIds,
            won,
            completed,
            status: completed ? 'completed' : 'started',
            duration_seconds: duration !== undefined ? duration : solveTimeState,
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
        guesses,
        persistGuess,
        persistShare,
        dbSessionId,
        isCompleted,
        startTime,
        solveTime: solveTimeState
    };
}
