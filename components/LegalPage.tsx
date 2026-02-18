
import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LegalPageProps {
    type: 'privacy' | 'cookies';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
    const { t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    const title = type === 'privacy' ? t.privacyPolicy : t.cookiesPolicy;
    const content = type === 'privacy' ? t.privacyContent : t.cookiesContent;

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-500/20">
                    <span className="material-symbols-outlined text-red-500">
                        {type === 'privacy' ? 'security' : 'cookie'}
                    </span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                    {title}
                </h1>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <div className="prose prose-invert prose-zinc max-w-none">
                    <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                        {content}
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600">
                        {t.copyright}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
