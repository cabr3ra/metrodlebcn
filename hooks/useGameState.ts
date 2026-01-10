
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GuessResult, Station, MatchType } from '../types';
import { STATIONS } from '../constants'; // Fallback for hydration
import { calculateResult } from '../utils/gameLogic';

// Helper to calculate match (logic copied from App.tsx or moved to utils)
// Ideally this logic should be a shared utility.
// For now, we assume we just need to reconstruct the objects.

export function useGameState(date: string, targetStation: Station | null) {
    const { user } = useAuth();
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbSessionId, setDbSessionId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

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
                    .maybeSingle();

                if (error) console.error('Error loading game session:', error);

                if (mounted && data) {
                    setDbSessionId(data.id);
                    setIsCompleted(data.completed);

                    // Hydrate guesses
                    if (data.guesses && Array.isArray(data.guesses)) {
                        // Map IDs back to Station objects and calculate results
                        const hydratedGuesses = data.guesses.map((id: string) => {
                            const station = STATIONS.find(s => s.id === id);
                            if (!station) return null;
                            return calculateResult(station, targetStation);
                        }).filter(g => g !== null) as GuessResult[];

                        setGuesses(hydratedGuesses);
                    }
                } else if (mounted) {
                    // No session exists, reset state
                    setGuesses([]);
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
    }, [user, date, targetStation]);

    const persistGuess = async (newGuessIds: string[], won: boolean) => {
        if (!user) return;

        const payload = {
            user_id: user.id,
            date,
            station_id: targetStation?.id,
            guesses: newGuessIds,
            won,
            completed: won || newGuessIds.length >= 6,
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
        guesses, // <--- Added this
        persistGuess,
        dbSessionId,
        isCompleted
    };
}
