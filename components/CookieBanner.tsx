
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CookieBanner: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (accepted: boolean) => {
        localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-5xl mx-auto bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-500 text-2xl">cookie</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-zinc-300 text-xs leading-relaxed">
                            {t.cookieBannerText} <Link to="/cookies" className="text-red-500 hover:underline font-bold">{t.cookiesPolicy}</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => handleConsent(false)}
                        className="flex-1 md:flex-none px-6 h-11 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        {t.decline}
                    </button>
                    <button
                        onClick={() => handleConsent(true)}
                        className="flex-1 md:flex-none px-8 h-11 rounded-xl text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition-all active:scale-95"
                    >
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
