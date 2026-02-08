
import React from 'react';

interface AdPlaceholderProps {
    position: 'left' | 'right' | 'bottom';
}

const ADS_ENABLED = false;

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ position }) => {
    if (!ADS_ENABLED) return null;

    if (position === 'bottom') {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-8 min-[1300px]:hidden">
                <div className="w-full h-[100px] bg-zinc-900/20 border border-dashed border-zinc-800/50 rounded-2xl flex flex-col items-center justify-center p-4 text-center group transition-colors hover:border-zinc-700">
                    <span className="material-symbols-outlined text-zinc-800 group-hover:text-zinc-700 mb-1 text-xl transition-colors">ads_click</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-800 group-hover:text-zinc-700 transition-colors">Ad Space</span>
                    <div className="mt-1 text-[8px] text-zinc-800/50 uppercase font-bold tracking-tight">320x100 Mobile Banner</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`
      hidden min-[1300px]:flex flex-col items-center justify-start py-8 fixed top-24 bottom-32 transition-all duration-500
      ${position === 'left' ? 'left-4 min-[1800px]:left-12' : 'right-4 min-[1800px]:right-12'}
      w-[200px] min-[1800px]:w-[300px]
    `}>
            <div className="w-full h-full bg-zinc-900/20 border border-dashed border-zinc-800/50 rounded-3xl flex flex-col items-center justify-center p-4 text-center group transition-colors hover:border-zinc-700">
                <span className="material-symbols-outlined text-zinc-800 group-hover:text-zinc-700 mb-2 transition-colors">ads_click</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-800 group-hover:text-zinc-700 transition-colors">Ad Space</span>
                <div className="mt-2 text-[8px] text-zinc-800/50 uppercase font-bold tracking-tight">
                    <span className="min-[1800px]:hidden">160x600</span>
                    <span className="hidden min-[1800px]:inline">300x600</span>
                    {' '}Skyscraper
                </div>
            </div>
        </div>
    );
};

export default AdPlaceholder;
