
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

interface GameSession {
    id: string;
    user_id: string;
    mode_id: string;
    date: string;
    target_station_id: string | null;
    attempts: string[];
    won: boolean;
    completed: boolean;
    status: string;
    errors: number;
    error_log: string[];
    shares_count: number;
    duration_seconds: number;
    created_at: string;
}


interface UserJourney {
    user_id: string;
    date: string;
    metrodle?: GameSession;
    ruta?: GameSession;
    isFullChallenge: boolean;
    lastActive: string;
}


const Dashboard: React.FC = () => {
    const { t } = useLanguage();
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        loyalty: '', // All, Full, Solo Metro, Solo Ruta
        outcome: '', // All, Won, Lost, Abandoned
        viral: false, // Only shared
        date: '',
        search: ''
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    async function fetchSessions() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('game_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setSessions(data);
        } catch (err) {
            console.error('Error fetching sessions:', err);
        } finally {
            setLoading(false);
        }
    }

    // Grouping sessions into User Journeys
    const journeys = useMemo(() => {
        const groups: Record<string, UserJourney> = {};

        sessions.forEach(s => {
            const key = `${s.user_id}_${s.date}`;
            if (!groups[key]) {
                groups[key] = {
                    user_id: s.user_id,
                    date: s.date,
                    isFullChallenge: false,
                    lastActive: s.created_at
                };
            }

            if (s.mode_id === 'metrodle') groups[key].metrodle = s;
            if (s.mode_id === 'ruta') groups[key].ruta = s;

            const metroDone = groups[key].metrodle?.completed;
            const rutaDone = groups[key].ruta?.completed;
            groups[key].isFullChallenge = !!(metroDone && rutaDone);

            if (new Date(s.created_at) > new Date(groups[key].lastActive)) {
                groups[key].lastActive = s.created_at;
            }
        });

        return Object.values(groups).sort((a, b) =>
            new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        );
    }, [sessions]);

    const filteredJourneys = useMemo(() => {
        return journeys.filter(j => {
            // Search filter
            const matchesSearch = !filters.search ||
                j.user_id.toLowerCase().includes(filters.search.toLowerCase());

            // Date filter
            const matchesDate = !filters.date || j.date === filters.date;

            // Loyalty filter
            const matchesLoyalty = !filters.loyalty ||
                (filters.loyalty === 'full' && j.isFullChallenge) ||
                (filters.loyalty === 'metrodle' && j.metrodle && !j.ruta) ||
                (filters.loyalty === 'ruta' && j.ruta && !j.metrodle);

            // Outcome filter (Any game in the journey matching)
            const matchesOutcome = !filters.outcome || (() => {
                const s = [j.metrodle, j.ruta].filter(Boolean);
                if (filters.outcome === 'won') return s.some(x => x?.won);
                if (filters.outcome === 'lost') return s.some(x => x?.completed && !x?.won);
                if (filters.outcome === 'abandoned') return s.some(x => !x?.completed);
                return true;
            })();

            // Viral filter
            const matchesViral = !filters.viral || (j.metrodle?.shares_count || 0) > 0 || (j.ruta?.shares_count || 0) > 0;

            return matchesSearch && matchesDate && matchesLoyalty && matchesOutcome && matchesViral;
        });
    }, [journeys, filters]);

    const stats = useMemo(() => {
        const totalUsers = journeys.length;
        const fullCompletions = journeys.filter(j => j.isFullChallenge).length;
        const onlyMetro = journeys.filter(j => j.metrodle && !j.ruta).length;
        const onlyRuta = journeys.filter(j => j.ruta && !j.metrodle).length;
        const crossSellRate = totalUsers > 0 ? Math.round((fullCompletions / totalUsers) * 100) : 0;

        return { totalUsers, fullCompletions, onlyMetro, onlyRuta, crossSellRate };
    }, [journeys]);

    const formatTime = (seconds?: number) => {
        if (!seconds) return '--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading && sessions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Analizando arquitectura de datos...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                    { label: 'Usuarios únicos', value: stats.totalUsers, color: 'text-white' },
                    { label: 'Reto Completo', value: stats.fullCompletions, color: 'text-emerald-500' },
                    { label: 'Solo Metrodle', value: stats.onlyMetro, color: 'text-red-500' },
                    { label: 'Solo Ruta BCN', value: stats.onlyRuta, color: 'text-blue-500' },
                    { label: 'Retención %', value: `${stats.crossSellRate}%`, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl backdrop-blur-sm shadow-xl flex flex-col justify-center">
                        <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 mb-1 leading-tight">{stat.label}</p>
                        <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Advanced Filters */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl mb-8 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">tune</span> Panel de Filtros Analíticos
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-1">Usuario (ID)</label>
                        <input
                            type="text"
                            placeholder="Buscar ID..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-1">Fidelización</label>
                        <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                            value={filters.loyalty}
                            onChange={(e) => setFilters({ ...filters, loyalty: e.target.value })}
                        >
                            <option value="">Cualquier flujo</option>
                            <option value="full">🚀 Reto Completo</option>
                            <option value="metrodle">Solo Metrodle</option>
                            <option value="ruta">Solo Ruta BCN</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-1">Resultado UX</label>
                        <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                            value={filters.outcome}
                            onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
                        >
                            <option value="">Cualquier resultado</option>
                            <option value="won">Victorias</option>
                            <option value="lost">Derrotas (completado)</option>
                            <option value="abandoned">Abandonos (en curso)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-1">Social / Viral</label>
                        <div
                            onClick={() => setFilters({ ...filters, viral: !filters.viral })}
                            className={`w-full flex items-center justify-center gap-2 h-[46px] border rounded-2xl cursor-pointer transition-all ${filters.viral ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                        >
                            <span className="material-symbols-outlined text-sm">{filters.viral ? 'check_circle' : 'share'}</span>
                            <span className="text-xs font-black uppercase tracking-widest">Solo Compartidos</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            onClick={fetchSessions}
                            className="flex-1 h-[46px] bg-red-600 hover:bg-red-500 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            <span className="text-xs font-black uppercase tracking-widest">Actualizar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Journey Table */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/50 border-b border-zinc-800">
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Perfil y Viaje</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Fidelidad</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Metrodle (UX)</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Ruta BCN (UX)</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Viralidad</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Tiempo Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredJourneys.map((j) => (
                                <tr key={`${j.user_id}_${j.date}`} className="hover:bg-zinc-800/20 transition-colors group">

                                    <td className="p-5">
                                        <div>
                                            <p className="text-[9px] font-mono text-zinc-400 leading-none mb-1">{j.user_id.slice(0, 12)}...</p>
                                            <p className="font-black text-xs text-white uppercase tracking-tight">{new Date(j.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        {j.isFullChallenge ? (
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                Doble ✨
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-zinc-950 text-zinc-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-800">
                                                Simple
                                            </span>
                                        )}
                                    </td>
                                    {/* Column: Metrodle UX */}
                                    <td className="p-5">
                                        {j.metrodle ? (
                                            <div className="flex items-center gap-4">
                                                <div className={`p-1 rounded-lg ${j.metrodle.won ? 'bg-emerald-500/10 text-emerald-500' : (j.metrodle.completed ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500')}`}>
                                                    <span className="material-symbols-outlined text-base">
                                                        {j.metrodle.completed ? (j.metrodle.won ? 'task_alt' : 'cancel') : 'hourglass_top'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white">{j.metrodle.attempts.length}/6 Intentos</p>
                                                    <p className="text-[9px] font-bold text-zinc-500">{formatTime(j.metrodle.duration_seconds)} seg</p>
                                                </div>
                                            </div>
                                        ) : <span className="text-[10px] font-black text-zinc-800">—</span>}
                                    </td>
                                    {/* Column: Ruta BCN UX */}
                                    <td className="p-5">
                                        {j.ruta ? (
                                            <div className="flex items-center gap-4">
                                                <div className={`p-1 rounded-lg ${j.ruta.won ? 'bg-emerald-500/10 text-emerald-500' : (j.ruta.completed ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500')}`}>
                                                    <span className="material-symbols-outlined text-base">
                                                        {j.ruta.completed ? (j.ruta.won ? 'map' : 'wrong_location') : 'navigation'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white">{j.ruta.errors} Fallos</p>
                                                    <p className="text-[9px] font-bold text-zinc-500">{formatTime(j.ruta.duration_seconds)} seg</p>
                                                </div>
                                            </div>
                                        ) : <span className="text-[10px] font-black text-zinc-800">—</span>}
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="inline-flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                                            <span className="material-symbols-outlined text-xs text-zinc-600">publish</span>
                                            <span className="text-[10px] font-black text-zinc-400">{(j.metrodle?.shares_count || 0) + (j.ruta?.shares_count || 0)}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <p className="text-xs font-black text-red-500 font-mono">
                                            {formatTime((j.metrodle?.duration_seconds || 0) + (j.ruta?.duration_seconds || 0))}
                                        </p>
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                            {new Date(j.lastActive).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredJourneys.length === 0 && (
                        <div className="p-20 text-center bg-zinc-950/20">
                            <span className="material-symbols-outlined text-4xl text-zinc-800 mb-4 block">analytics</span>
                            <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-xs">Sin datos para este segmento de audiencia</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
