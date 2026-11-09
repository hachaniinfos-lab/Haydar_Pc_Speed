import React, { useEffect } from 'react';
import { X, MessageCircle, Phone, ShieldCheck, Volume2, Play, Pause, Plus, Minus } from 'lucide-react';
import {
  subscribeDouaaAudio,
  togglePlayPauseDouaa,
  adjustDouaaVolume,
  getDouaaState,
} from '../utils/douaaAudio';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState<string | null>(null);
  const [showDouaaBox, setShowDouaaBox] = React.useState(false);
  const [douaaState, setDouaaState] = React.useState(getDouaaState);

  useEffect(() => {
    return subscribeDouaaAudio(setDouaaState);
  }, []);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 3000);
  };

  const handlePhotoTouch = () => {
    setShowDouaaBox(true);
    togglePlayPauseDouaa();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f1217] border border-[#232731] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2029] bg-[#14171d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Assistance & Support 24/7</h3>
              <p className="text-xs text-slate-400">Haydar Speed Pro • Gratuit & Sans engagement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f242d] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-300 text-xs">
          {/* Dedication in Golden Islamic Calligraphy Outlined in Black (No background) */}
          <div className="py-2 text-center space-y-2">
            <div className="text-xs font-calligraphy calligraphy-gold-black" dir="rtl">
              بسم الله الرحمن الرحيم
            </div>
            <p className="font-calligraphy text-xl font-bold leading-relaxed calligraphy-gold-black" dir="rtl">
              صدقة جارية على روح أخي حيدر حشاني رحمه الله
            </p>
            <p className="text-[11px] text-slate-300 pt-1">
              Logiciel entièrement bénévole et offert pour tous, sans licence ni abonnement.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Canaux Directs de Contact
            </span>

            {/* WhatsApp */}
            <div className="p-3.5 rounded-xl bg-[#14171d] border border-[#232731] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">WhatsApp Direct</div>
                  <div className="text-[11px] text-emerald-400 font-mono">+216 55 405 159</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('+21655405159', 'whatsapp')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1f242d] hover:bg-[#282e3b] text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {copied === 'whatsapp' ? 'Copié !' : 'Copier'}
                </button>
                <a
                  href="https://wa.me/21655405159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px] transition-colors"
                >
                  Ouvrir WhatsApp
                </a>
              </div>
            </div>

            {/* Email with Creator Photo & 2cm x 2cm Douaa Frame */}
            <div className="p-3.5 rounded-xl bg-[#14171d] border border-[#232731] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 relative">
                <button
                  type="button"
                  onClick={handlePhotoTouch}
                  title="Toucher pour ouvrir/écouter le Douaa : اللهم إرحمه و أغفر له"
                  className="relative block rounded-full bg-gradient-to-b from-[#1a2230] to-[#0b0e14] p-0.5 border-2 border-[#ffd700] ring-2 ring-black shadow-lg shrink-0 hover:scale-105 transition-transform cursor-pointer"
                >
                  <img
                    src="/assets/aistudio/a3f0ca96-711d-4eb3-a43a-b3df7ecb2200_0881c12a.png"
                    alt="Hachani - Haydar Speed Pro"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover object-top"
                  />
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 ring-2 ring-black absolute bottom-0 right-0 flex items-center justify-center">
                    <Volume2 className={`w-2.5 h-2.5 ${douaaState.isPlaying ? 'animate-bounce' : ''}`} />
                  </span>
                </button>

                {showDouaaBox && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 bottom-full mb-2 z-50 w-[2cm] h-[2cm] rounded-xl bg-[#07090d]/95 border-2 border-[#ffd700] ring-2 ring-black shadow-[0_0_25px_rgba(255,215,0,0.45)] flex flex-col items-center justify-between p-1 text-center animate-in fade-in zoom-in-95 duration-200 select-none"
                  >
                    <div className="w-full flex items-center justify-between px-0.5">
                      <span className="text-[8px] font-mono font-bold text-[#ffd700]">
                        {Math.round(douaaState.volume * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDouaaBox(false)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <p className="font-calligraphy text-[10px] font-bold leading-tight calligraphy-gold-black px-0.5" dir="rtl">
                      اللهم إرحمه و أغفر له
                    </p>

                    <div className="w-full flex items-center justify-center gap-1 pt-0.5">
                      <button
                        type="button"
                        onClick={() => adjustDouaaVolume(-0.1)}
                        className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={togglePlayPauseDouaa}
                        className="w-5 h-4 rounded bg-[#ffd700] hover:bg-[#fde047] text-slate-950 flex items-center justify-center cursor-pointer"
                      >
                        {douaaState.isPlaying ? (
                          <Pause className="w-2.5 h-2.5 fill-current" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-current" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustDouaaVolume(0.1)}
                        className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-white">Email du Créateur</div>
                  <div className="text-[11px] text-sky-400 font-mono">hachaniinfos@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('hachaniinfos@gmail.com', 'email')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1f242d] hover:bg-[#282e3b] text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {copied === 'email' ? 'Copié !' : 'Copier'}
                </button>
                <a
                  href="mailto:hachaniinfos@gmail.com?subject=Haydar%20Speed%20Pro%20Support%20et%20Assistance"
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-[11px] transition-colors"
                >
                  Envoyer Email
                </a>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-2 p-3 bg-[#13161c] rounded-xl border border-[#212630] text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
            <span>Aucune donnée n'est collectée. 100% sécurisé et conforme à Windows XP SP3 jusqu'à Windows 11.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1c2029] bg-[#14171d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1f242d] hover:bg-[#282e3a] text-slate-200 text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
