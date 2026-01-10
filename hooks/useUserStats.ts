
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GameStats } from '../types';

// Extend GameStats to match DB or just map it
export interface UserStats extends GameStats {
    userId?: string;
}

export function useUserStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                // Fetch distribution from game sessions (as we didn't store it in user_stats yet)
                // Or we can just calculate it client side if we fetched all sessions?
                // For now, let's keep distribution empty or basic, or fetch it via a separate query
                // "distribution" in generic Wordle is count of wins by number of guesses.

                // Let's do a quick query to get distribution if needed, otherwise default [0,0,0,0,0,0]
                // To do it efficiently, maybe we'll skip it for now or implement a dedicated RPC function later.

                setStats({
                    played: data.games_played,
                    wins: data.wins,
                    streak: data.current_streak,
                    bestStreak: data.max_streak,
                    distribution: [0, 0, 0, 0, 0, 0] // Placeholder
                });
            } else {
                // No stats yet
                setStats({
                    played: 0,
                    wins: 0,
                    streak: 0,
                    bestStreak: 0,
                    distribution: [0, 0, 0, 0, 0, 0]
                });
            }
        } catch (e) {
            console.error('Error fetching user stats:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const updateStats = async (won: boolean, attempts: number) => {
        if (!user) return;

        // Optimistic update? Or refetch.
        // Let's calculate new values based on current stats + result
        const current = stats || { played: 0, wins: 0, streak: 0, bestStreak: 0, distribution: [] };

        const newPlayed = current.played + 1;
        const newWins = current.wins + (won ? 1 : 0);
        const newStreak = won ? current.streak + 1 : 0;
        const newBest = Math.max(current.bestStreak, newStreak);

        // We need to upsert into DB
        const payload = {
            user_id: user.id,
            games_played: newPlayed,
            wins: newWins,
            current_streak: newStreak,
            max_streak: newBest,
            last_played_date: new Date().toISOString()
        };

        const { error } = await supabase.from('user_stats').upsert(payload);
        if (error) console.error('Error updating stats:', error);
        else fetchStats(); // Sync back
    };

    return { stats, loading, updateStats, refetch: fetchStats };
}
