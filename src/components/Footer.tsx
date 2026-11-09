import React from 'react';
import { Mail, MessageCircle, Heart, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/95 py-8 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Special tribute & dedication card */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 p-5 text-center shadow-lg shadow-black/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
            {/* Arabic Tribute text */}
            <p className="font-arabic text-xl sm:text-2xl text-cyan-300 font-bold tracking-wide text-center drop-shadow-sm" dir="rtl">
              صدقة جارية على روح أخي حيدر حشاني رحمه الله
            </p>
            
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            {/* Creator contact text and links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-200">
              <span className="text-slate-400">Contacter le créateur :</span>
              
              <a
                href="mailto:hachaniinfos@gmail.com"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline underline-offset-4"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>hachaniinfos@gmail.com</span>
              </a>

              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>

              <a
                href="https://wa.me/21655405159"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium hover:underline underline-offset-4"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp +21655405159</span>
              </a>
            </div>
          </div>
        </div>

        {/* Specifications & License info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Gratuit · Sans licence ni abonnement
            </span>
            <span aria-hidden="true">·</span>
            <span>Version française</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Compatible Windows XP (SP3), Vista, 7, 8, 8.1, 10, 11 (32 et 64 bits)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
