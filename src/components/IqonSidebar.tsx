import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Sliders, 
  Rocket, 
  Cpu, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  Download,
  MessageCircle,
  Volume2,
  Play,
  Pause,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { isInstalledOnSystem } from '../utils/systemDetector';
import {
  subscribeDouaaAudio,
  togglePlayPauseDouaa,
  adjustDouaaVolume,
  getDouaaState,
} from '../utils/douaaAudio';

export type IqonSection = 
  | 'home' 
  | 'cleaner' 
  | 'tweaks' 
  | 'startup' 
  | 'ram' 
  | 'network' 
  | 'diagnostic' 
  | 'backup' 
  | 'beforeafter' 
  | 'installer';

interface IqonSidebarProps {
  currentSection: IqonSection;
  onSelectSection: (section: IqonSection) => void;
  onOpenSupport: () => void;
  onOpenTools: () => void;
}

interface NavItem {
  id: IqonSection;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const IqonSidebar: React.FC<IqonSidebarProps> = ({
  currentSection,
  onSelectSection,
  onOpenSupport,
}) => {
  const installedOnSystem = isInstalledOnSystem();
  const [showDouaaBox, setShowDouaaBox] = useState(false);
  const [douaaState, setDouaaState] = useState(getDouaaState);

  useEffect(() => {
    return subscribeDouaaAudio(setDouaaState);
  }, []);

  const handlePhotoTouch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDouaaBox(true);
    togglePlayPauseDouaa();
  };

  const allNavSections: NavSection[] = [
    {
      group: 'VUE PRINCIPALE',
      items: [
        {
          id: 'home',
          label: 'Tableau de Bord',
          sublabel: 'Vue globale & Jauges',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'OPTIMISATION & SYSTÈME',
      items: [
        {
          id: 'cleaner' as IqonSection,
          label: 'Nettoyeur & Cache',
          sublabel: 'Fichiers temporaires & Disque',
          icon: Trash2,
          badge: '6.8 Go',
        },
        {
          id: 'tweaks' as IqonSection,
          label: 'Optimiseur Noyau',
          sublabel: 'Registre & Fluidité',
          icon: Sliders,
        },
        {
          id: 'startup' as IqonSection,
          label: 'Démarrage & Services',
          sublabel: 'Accélération du boot',
          icon: Rocket,
        },
        {
          id: 'ram' as IqonSection,
          label: 'Purgeur de RAM',
          sublabel: 'EmptyWorkingSet en direct',
          icon: Cpu,
        },
        {
          id: 'network' as IqonSection,
          label: 'Accélérateur Réseau',
          sublabel: 'DNS rapide & TCP NoDelay',
          icon: Wifi,
        },
      ],
    },
    {
      group: 'SÉCURITÉ & AUDIT',
      items: [
        {
          id: 'diagnostic' as IqonSection,
          label: 'Diagnostic & Santé',
          sublabel: 'Audit et score PC',
          icon: Activity,
        },
        {
          id: 'backup' as IqonSection,
          label: 'Sauvegarde & Restauration',
          sublabel: 'Points de retour 1-clic',
          icon: ShieldCheck,
        },
        {
          id: 'beforeafter' as IqonSection,
          label: 'Rapport Avant / Après',
          sublabel: 'Statistiques & gains',
          icon: BarChart3,
        },
      ],
    },
    {
      group: 'DÉPLOIEMENT & SETUP',
      items: [
        {
          id: 'installer' as IqonSection,
          label: 'Installateur .EXE',
          sublabel: 'Setup standard Windows',
          icon: Download,
          badge: '468 Ko',
          highlight: true,
        },
      ],
    },
  ];

  const navSections = installedOnSystem
    ? allNavSections.filter((s) => s.group !== 'DÉPLOIEMENT & SETUP')
    : allNavSections;

  return (
    <aside className="w-64 bg-[#0a0c0f] border-r border-[#1a1d24] flex flex-col justify-between shrink-0 select-none p-3.5 min-h-[920px]">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-[#181c24]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
              H
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-wide text-white block">
                Haydar Speed
              </span>
              <span className="text-[10px] font-mono text-emerald-400 block -mt-0.5">
                PRO EDITION
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-[#161a22] border border-[#232731] px-1.5 py-0.5 rounded">
            v2.5
          </span>
        </div>

        {/* User Capsule */}
        <div className="p-1 rounded-xl bg-[#12151b] border border-[#1e232d] relative">
          <div
            onClick={() => onSelectSection('home')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left cursor-pointer ${
              currentSection === 'home'
                ? 'bg-[#181d26] text-white border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'text-slate-300 hover:text-white hover:bg-[#161a22]'
            }`}
          >
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={handlePhotoTouch}
                title="Toucher pour ouvrir/écouter le Douaa : اللهم إرحمه و أغفر له"
                className="relative block rounded-full bg-gradient-to-b from-[#1a2230] to-[#0b0e14] p-0.5 border-2 border-[#ffd700] ring-2 ring-black shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src="/assets/aistudio/a3f0ca96-711d-4eb3-a43a-b3df7ecb2200_0881c12a.png"
                  alt="Haydar Speed Pro"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover object-top"
                />
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 absolute bottom-0 right-0 ring-2 ring-[#12151b] flex items-center justify-center">
                  <Volume2 className={`w-2.5 h-2.5 ${douaaState.isPlaying ? 'animate-bounce' : ''}`} />
                </div>
              </button>

              {showDouaaBox && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-2 z-50 w-[2cm] h-[2cm] rounded-xl bg-[#07090d]/95 border-2 border-[#ffd700] ring-2 ring-black shadow-[0_0_25px_rgba(255,215,0,0.45)] flex flex-col items-center justify-between p-1 text-center animate-in fade-in zoom-in-95 duration-200 select-none"
                >
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[8px] font-mono font-bold text-[#ffd700]">
                      {Math.round(douaaState.volume * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDouaaBox(false);
                      }}
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
                      title="Volume -"
                      className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlayPauseDouaa}
                      title={douaaState.isPlaying ? 'Pause' : 'Play'}
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
                      title="Volume +"
                      className="w-4 h-4 rounded bg-[#161b24] hover:bg-[#232b38] border border-[#ffd700]/40 text-[#ffd700] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white truncate block">Haydar Speed Pro</span>
              <span className="text-[10px] text-slate-300 block truncate font-mono">hachaniinfos@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
          {navSections.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#525a66] px-2 block">
                {grp.group}
              </span>

              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectSection(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 text-white border border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                          : item.highlight
                          ? 'text-emerald-300 hover:text-white hover:bg-[#151a22] border border-emerald-500/20'
                          : 'text-[#8b95a5] hover:text-white hover:bg-[#13161c]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-400' : item.highlight ? 'text-emerald-400' : 'text-slate-400'
                        }`} />
                        <div className="truncate">
                          <span className={`text-xs block truncate ${
                            isActive ? 'font-bold text-white' : 'font-medium'
                          }`}>
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate -mt-0.5">
                            {item.sublabel}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950'
                            : item.highlight
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#1b2029] text-slate-400 border border-[#232731]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Sidebar: 24/7 Support & Islamic Calligraphy Dedication */}
      <div className="space-y-3 pt-3 border-t border-[#181c24]">
        {/* Support Card */}
        <div className="rounded-xl border border-[#232731] bg-[#12151b] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Assistance 24/7</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Gratuit</span>
          </div>
          <button
            onClick={onOpenSupport}
            className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Contacter le Créateur</span>
          </button>
        </div>

        {/* Dedication in Golden Islamic Calligraphy Outlined in Black (No background) */}
        <div className="pt-1 text-center space-y-1">
          <p className="font-calligraphy text-sm font-bold leading-snug calligraphy-gold-black" dir="rtl">
            صدقة جارية على روح أخي حيدر حشاني رحمه الله
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            hachaniinfos@gmail.com
          </div>
        </div>
      </div>
    </aside>
  );
};
