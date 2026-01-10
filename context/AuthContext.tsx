
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            // 1. Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (mounted) {
                if (session) {
                    setUser(session.user);
                    setLoading(false);
                } else {
                    // 2. No session? Sign in anonymously
                    console.log('No session found, signing in anonymously...');
                    const { data, error } = await supabase.auth.signInAnonymously();

                    if (error) {
                        console.error('Error signing in anonymously:', error.message);
                        // Fallback: Maybe they are offline? We can't do much without auth for syncing.
                    } else if (data.session) {
                        console.log('Signed in as anonymous user:', data.user?.id);
                        setUser(data.user);
                    }
                    setLoading(false);
                }
            }
        }

        initAuth();

        // 3. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                if (!session) {
                    // If we logged out, maybe re-login? 
                    // ideally we don't logout anonymous users.
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
