import React, { useState, useEffect } from 'react';
import { Download, Check, Volume2, Volume1, VolumeX, Play, Pause, Plus, Minus, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { isInstalledOnSystem } from '../utils/systemDetector';
import {
  subscribeDouaaAudio,
  togglePlayPauseDouaa,
  adjustDouaaVolume,
  setDouaaBoxOpen,
  getDouaaState,
} from '../utils/douaaAudio';

interface IqonTopBarProps {
  pcName: string;
  tooltipMode: boolean;
  onToggleTooltip: () => void;
  targetOS: string;
  onSelectTargetOS: (os: any) => void;
  onOpenInstallModal: () => void;
}

export const CREATOR_PHOTO_URL = '/assets/aistudio/a3f0ca96-711d-4eb3-a43a-b3df7ecb2200_0881c12a.png';

export const IqonTopBar: React.FC<IqonTopBarProps> = ({
  pcName,
  tooltipMode,
  onToggleTooltip,
  targetOS,
  onSelectTargetOS,
  onOpenInstallModal,
}) => {
  const { isInstalled } = usePWAInstall();
  const [installSuccess] = useState(false);
  const [douaaState, setDouaaState] = useState(getDouaaState);
  const installedOnSystem = isInstalledOnSystem();

  useEffect(() => {
    return subscribeDouaaAudio(setDouaaState);
  }, []);

  const handleInstallClick = () => {
    onOpenInstallModal();
  };

  const handlePhotoTouch = () => {
    if (!douaaState.isBoxOpen) {
      setDouaaBoxOpen(true);
      if (!douaaState.isPlaying) {
        togglePlayPauseDouaa();
      }
    } else {
      togglePlayPauseDouaa();
    }
  };

  const volumePercent = Math.round(douaaState.volume * 100);

  return (
    <div className="border-b border-[#1a1d24] bg-[#0d0f12]">
      {/* Top Crown Banner: Golden Islamic Calligraphy Outlined in Black (Transparent Background) */}
      <div className="w-full px-4 pt-3 pb-1">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 sm:gap-5">
          {/* Left Islamic Geometric Star Ornament */}
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 22,12 33,12 24,19 27,30 18,23 9,30 12,19 3,12 14,12" stroke="#000000" strokeWidth="3" fill="none" />
            <polygon points="18,2 22,12 33,12 24,19 27,30 18,23 9,30 12,19 3,12 14,12" stroke="#ffd700" strokeWidth="1.5" fill="#d4af37" fillOpacity="0.2" />
            <circle cx="18" cy="18" r="4" fill="#ffd700" stroke="#000000" strokeWidth="1.5" />
          </svg>

          {/* Transparent Golden Calligraphy with Black Outline */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-[11px] sm:text-xs font-calligraphy text-[#fde68a] tracking-widest mb-0.5 calligraphy-gold-black" dir="rtl">
              بسم الله الرحمن الرحيم
            </div>
            <p
              className="font-calligraphy text-xl sm:text-2xl md:text-3xl font-bold tracking-wide leading-relaxed calligraphy-gold-black select-all"
              dir="rtl"
            >
              صدقة جارية على روح أخي حيدر حشاني رحمه الله
            </p>
          </div>

          {/* Right Islamic Geometric Star Ornament */}
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#d4af37] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 22,12 33,12 24,19 27,30 18,23 9,30 12,19 3,12 14,12" stroke="#000000" strokeWidth="3" fill="none" />
            <polygon points="18,2 22,12 33,12 24,19 27,30 18,23 9,30 12,19 3,12 14,12" stroke="#ffd700" strokeWidth="1.5" fill="#d4af37" fillOpacity="0.2" />
            <circle cx="18" cy="18" r="4" fill="#ffd700" stroke="#000000" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Main Header Row */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4">
        {/* Left: PC Name */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
            PC Name
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {pcName}
            </h1>
            {/* Target OS Selector badge */}
            <div className="flex items-center gap-1 bg-[#161a22] border border-[#232731] rounded-lg p-0.5">
              {['xp', '7', '10', '11'].map((os) => (
                <button
                  key={os}
                  onClick={() => onSelectTargetOS(os)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all cursor-pointer ${
                    targetOS === os
                      ? 'bg-[#10b981] text-[#020617] shadow-sm shadow-[#10b981]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {os.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-5 self-end sm:self-center">
          {/* Tooltip Mode Switch */}
          <div className="flex items-center gap-3 bg-[#14171d] border border-[#232731] rounded-xl px-3.5 py-2">
            <div className="text-right">
              <span className="text-xs font-semibold text-white block">
                Tooltip Mode
              </span>
              <span className="text-[10px] text-[#64748b] hidden md:block">
                Turn it on, if you don't understand how something work
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleTooltip}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                tooltipMode ? 'bg-[#10b981]' : 'bg-[#2a303c]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  tooltipMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* PWA / App Install Button — Hidden automatically once installed on a system */}
          {!installedOnSystem && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-slate-950 rounded-xl shadow-lg shadow-[#10b981]/20 transition-all hover:scale-102 focus:outline-none cursor-pointer"
            >
              {isInstalled || installSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Application Installée</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Installer l'App (.EXE)</span>
                </>
              )}
            </button>
          )}

          {/* User Profile Badge with Enlarged Circle Photo, Audio Controls & 2cm x 2cm Douaa Frame */}
          <div className="flex items-center gap-3.5 pl-4 border-l border-[#1e232c] relative">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={handlePhotoTouch}
                title="Toucher pour ouvrir/écouter le Douaa : اللهم إرحمه و أغفر له"
                className="relative block rounded-full bg-gradient-to-b from-[#1a2230] to-[#0b0e14] p-0.5 border-2 border-[#ffd700] ring-2 ring-black shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none"
              >
                <img
                  src={CREATOR_PHOTO_URL}
                  alt="Hachani - Haydar Speed Pro"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-top"
                />
                <span className="w-5 h-5 rounded-full bg-[#10b981] text-slate-950 ring-2 ring-black absolute bottom-0.5 right-0.5 flex items-center justify-center shadow-md">
                  {douaaState.isPlaying ? (
                    <Volume2 className="w-3 h-3 animate-bounce" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current" />
                  )}
                </span>
              </button>

              {/* 2cm x 2cm Frame playing Douaa "اللهم إرحمه و أغفر له" with Play/Pause & Volume +/- */}
              {douaaState.isBoxOpen && (
                <div
                  className="absolute right-0 top-full mt-2 z-50 w-[2cm] h-[2cm] rounded-xl bg-[#07090d]/95 border-2 border-[#ffd700] ring-2 ring-black shadow-[0_0_25px_rgba(255,215,0,0.45)] flex flex-col items-center justify-between p-1 text-center animate-in fade-in zoom-in-95 duration-200 select-none"
                >
                  {/* Top close button + Volume % */}
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[8px] font-mono font-bold text-[#ffd700]">
                      {volumePercent}%
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDouaaBoxOpen(false);
                      }}
                      title="Masquer le cadre"
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Arabic Douaa Text */}
                  <p
                    className="font-calligraphy text-[10px] font-bold leading-tight calligraphy-gold-black px-0.5"
                    dir="rtl"
                  >
                    اللهم إرحمه و أغفر له
                  </p>

                  {/* Mini Controls inside 2cm x 2cm box: Vol- | Play/Pause | Vol+ */}
                  <div className="w-full flex items-center justify-center gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustDouaaVolume(-0.1);
                      }}
                      title="Baisser le volume (-)"
                      className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPauseDouaa();
                      }}
                      title={douaaState.isPlaying ? 'Pause' : 'Lecture (Play)'}
                      className="w-5 h-4 rounded bg-[#ffd700] hover:bg-[#fde047] text-slate-950 flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      {douaaState.isPlaying ? (
                        <Pause className="w-2.5 h-2.5 fill-current" />
                      ) : (
                        <Play className="w-2.5 h-2.5 fill-current" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        adjustDouaaVolume(0.1);
                      }}
                      title="Augmenter le volume (+)"
                      className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-left">
              <div className="hidden sm:block">
                <span className="text-xs text-[#e2e8f0] block font-mono font-semibold">
                  hachaniinfos@gmail.com
                </span>
                <span className="text-sm font-extrabold text-[#ffd700] block">
                  Haydar Speed Pro
                </span>
              </div>

              {/* Dedicated Audio Controls Bar (Play/Pause + Volume Down/Up) */}
              <div className="flex items-center gap-1.5 bg-[#14171d] border border-[#ffd700]/40 rounded-lg px-2 py-1 shadow-inner">
                <button
                  type="button"
                  onClick={togglePlayPauseDouaa}
                  title={douaaState.isPlaying ? 'Mettre le Douaa en Pause' : 'Écouter le Douaa (Play)'}
                  className="px-2 py-0.5 rounded bg-[#ffd700] hover:bg-[#fde047] text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {douaaState.isPlaying ? (
                    <>
                      <Pause className="w-2.5 h-2.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => adjustDouaaVolume(-0.1)}
                  title="Baisser le volume (Vol -)"
                  className="w-5 h-5 rounded bg-[#1c212b] hover:bg-[#262d3b] text-[#ffd700] border border-[#2d3545] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="text-[10px] font-mono font-bold text-[#ffd700] min-w-[30px] text-center flex items-center justify-center gap-0.5">
                  {douaaState.volume === 0 ? (
                    <VolumeX className="w-3 h-3 text-slate-400" />
                  ) : douaaState.volume < 0.5 ? (
                    <Volume1 className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                  {volumePercent}%
                </span>

                <button
                  type="button"
                  onClick={() => adjustDouaaVolume(0.1)}
                  title="Augmenter le volume (Vol +)"
                  className="w-5 h-5 rounded bg-[#1c212b] hover:bg-[#262d3b] text-[#ffd700] border border-[#2d3545] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
