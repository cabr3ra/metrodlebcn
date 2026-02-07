
import React from 'react';

interface AdPlaceholderProps {
    position: 'left' | 'right';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ position }) => {
    return (
        <div className={`hidden 2xl:flex flex-col items-center justify-start py-8 fixed top-24 bottom-32 w-[300px] ${position === 'left' ? 'left-42' : 'right-42'}`}>
            <div className="w-full h-full bg-zinc-900/20 border border-dashed border-zinc-800/50 rounded-3xl flex flex-col items-center justify-center p-4 text-center group transition-colors hover:border-zinc-700">
                <span className="material-symbols-outlined text-zinc-800 group-hover:text-zinc-700 mb-2">ads_click</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-800 group-hover:text-zinc-700">Ad Space</span>
                <div className="mt-2 text-[8px] text-zinc-800/50 uppercase font-bold tracking-tight">300x600 Skyscraper</div>
            </div>
        </div>
    );
};

export default AdPlaceholder;
