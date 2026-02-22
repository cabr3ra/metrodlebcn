
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

const Dashboard: React.FC = () => {
    const { t } = useLanguage();
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        mode_id: '',
        status: '',
        won: '',
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

    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const matchesMode = !filters.mode_id || s.mode_id === filters.mode_id;
            const matchesStatus = !filters.status || s.status === filters.status;
            const matchesWon = filters.won === '' || String(s.won) === filters.won;
            const matchesDate = !filters.date || s.date === filters.date;
            const matchesSearch = !filters.search ||
                s.user_id.toLowerCase().includes(filters.search.toLowerCase()) ||
                (s.target_station_id?.toLowerCase().includes(filters.search.toLowerCase()));

            return matchesMode && matchesStatus && matchesWon && matchesDate && matchesSearch;
        });
    }, [sessions, filters]);

    const stats = useMemo(() => {
        const total = filteredSessions.length;
        const wins = filteredSessions.filter(s => s.won).length;
        const starts = filteredSessions.filter(s => s.status === 'started' && !s.completed).length;
        const completionRate = total > 0 ? Math.round((filteredSessions.filter(s => s.completed).length / total) * 100) : 0;

        return { total, wins, starts, completionRate };
    }, [filteredSessions]);

    if (loading && sessions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Cargando datos del sistema...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Sesiones', value: stats.total, color: 'text-white' },
                    { label: 'Victorias', value: stats.wins, color: 'text-emerald-500' },
                    { label: 'En curso / Abandono', value: stats.starts, color: 'text-amber-500' },
                    { label: '% Completado', value: `${stats.completionRate}%`, color: 'text-red-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                        <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl mb-8 flex flex-wrap gap-4 items-end shadow-2xl">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Buscar Usuario o Estación</label>
                    <input
                        type="text"
                        placeholder="ID de usuario..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="w-full md:w-auto">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Modo</label>
                    <select
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        value={filters.mode_id}
                        onChange={(e) => setFilters({ ...filters, mode_id: e.target.value })}
                    >
                        <option value="">Todos</option>
                        <option value="metrodle">Metrodle</option>
                        <option value="ruta">Ruta BCN</option>
                    </select>
                </div>
                <div className="w-full md:w-auto">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Estado</label>
                    <select
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">Todos</option>
                        <option value="started">Started (Abandono)</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="w-full md:w-auto">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Resultado</label>
                    <select
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        value={filters.won}
                        onChange={(e) => setFilters({ ...filters, won: e.target.value })}
                    >
                        <option value="">Todos</option>
                        <option value="true">Victoria</option>
                        <option value="false">Derrota/Abandono</option>
                    </select>
                </div>
                <button
                    onClick={fetchSessions}
                    className="h-11 px-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/50 border-b border-zinc-800">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Fecha</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Modo</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Usuario</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Intentos</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Estado</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Tiempo</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Viral</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredSessions.map((s) => (
                                <tr key={s.id} className="hover:bg-zinc-800/20 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-xs">{new Date(s.date).toLocaleDateString('es-ES')}</p>
                                        <p className="text-[9px] text-zinc-600 font-mono">{new Date(s.created_at).toLocaleTimeString('es-ES')}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${s.mode_id === 'metrodle' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {s.mode_id}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-[10px] font-mono text-zinc-400 group-hover:text-red-400 transition-colors truncate max-w-[120px]" title={s.user_id}>
                                            {s.user_id}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-black ${s.won ? 'text-emerald-500' : 'text-zinc-500'}`}>
                                            {s.attempts?.length || 0}
                                        </span>
                                        {s.mode_id === 'ruta' && s.errors > 0 && <span className="text-red-500 text-[9px] ml-1 font-black">+{s.errors} ERR</span>}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <p className="text-xs font-bold text-zinc-400">
                                            {s.duration_seconds ? `${Math.floor(s.duration_seconds / 60)}:${(s.duration_seconds % 60).toString().padStart(2, '0')}` : '--:--'}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-xs text-zinc-600">share</span>
                                            <span className="text-xs font-black text-zinc-400">{s.shares_count || 0}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSessions.length === 0 && (
                        <div className="p-20 text-center">
                            <span className="material-symbols-outlined text-4xl text-zinc-800 mb-4 block">search_off</span>
                            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No se han encontrado registros con esos filtros</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
