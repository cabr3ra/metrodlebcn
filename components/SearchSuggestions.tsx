
import React from 'react';
import { Station, GuessResult } from '../types';
import LineIcon from './LineIcon';

import { useLanguage } from '../context/LanguageContext';

interface SearchSuggestionsProps {
    suggestions: Station[];
    onSelect: (station: Station) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    show: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    onSelect,
    searchTerm,
    setSearchTerm,
    show
}) => {
    const { t } = useLanguage();
    return (
        <div className="relative">
            {show && suggestions.length > 0 && (
                <div className="absolute bottom-full mb-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
                    {suggestions.map(s => (
                        <button
                            key={s.id}
                            onClick={() => onSelect(s)}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-800 flex items-center justify-between group transition-colors"
                        >
                            <div>
                                <p className="font-bold text-white">{s.name}</p>
                                <div className="flex gap-1.5 mt-1 items-center">
                                    {s.lines.map(l => (
                                        <LineIcon key={l} line={l} className="w-5 h-5 sm:w-6 sm:h-6" />
                                    ))}
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-zinc-400 group-hover:text-red-500">add_circle</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-900 border-2 border-transparent focus:border-red-500 outline-none transition-all text-white placeholder:text-zinc-600 font-medium"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                </div>
            </div>
        </div>
    );
};

export default SearchSuggestions;
