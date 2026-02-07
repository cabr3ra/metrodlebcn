
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="w-full py-6 px-4 bg-zinc-950 border-t border-zinc-900 mt-auto">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                    <Link
                        to="/privacy"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors"
                    >
                        {t.privacyPolicy}
                    </Link>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    <Link
                        to="/cookies"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors"
                    >
                        {t.cookiesPolicy}
                    </Link>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    <a
                        href="mailto:hola@metrodlebcn.app"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 transition-colors"
                    >
                        {t.contact}
                    </a>
                </div>

                <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.15em] text-center opacity-60">
                    {t.copyright}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
