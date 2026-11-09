import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Layers, 
  HardDrive, 
  Globe, 
  Download, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { TweakItem, WindowsVersion } from '../types';
import { downloadTextFile } from '../utils/downloadHelper';

interface OptimizerModuleProps {
  tweaks: TweakItem[];
  onToggleTweak: (id: string) => void;
  onApplyProfile: (profile: 'vintage' | 'balanced' | 'max') => void;
  targetOS: WindowsVersion;
}

export const OptimizerModule: React.FC<OptimizerModuleProps> = ({
  tweaks,
  onToggleTweak,
  onApplyProfile,
  targetOS,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'graphics' | 'memory' | 'services' | 'disk' | 'network'>('all');

  const filteredTweaks = tweaks.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  const enabledCount = tweaks.filter((t) => t.enabled).length;

  const handleExportRegistryFile = () => {
    let reg = `Windows Registry Editor Version 5.00\n\n`;
    reg += `; ============================================================================\n`;
    reg += `; XP SPEEDER PRO - FICHIER REGISTRE D'OPTIMISATION UNIVERSELLE\n`;
    reg += `; Compatible Windows XP, Vista, 7, 8, 10, 11 (32 et 64-bit)\n`;
    reg += `; صدقة جارية على روح أخي حيدر حشاني رحمه الله\n`;
    reg += `; Contacter : hachaniinfos@gmail.com | WhatsApp : +21655405159\n`;
    reg += `; ============================================================================\n\n`;

    tweaks.filter((t) => t.enabled && t.regPath && t.regKey).forEach((t) => {
      reg += `; ${t.title}\n`;
      reg += `[${t.regPath}]\n`;
      if (typeof t.regValue === 'number') {
        reg += `"${t.regKey}"=dword:${t.regValue.toString(16).padStart(8, '0')}\n\n`;
      } else if (typeof t.regValue === 'string') {
        reg += `"${t.regKey}"="${t.regValue}"\n\n`;
      }
    });

    downloadTextFile(reg, 'Haydar_Speed_Pro_Optimisations.reg');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Profile Selector */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Optimisations Spécifiques Vieux PC
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Windows XP → Windows 11</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Régler Windows pour un Matériel Ancien
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Ces paramètres déverrouillent les performances bridées par défaut dans Windows, allègent le noyau et éliminent les goulots d'étranglement mémoires et disques.
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs text-slate-400">Réglages activés</span>
            <span className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
              {enabledCount} / {tweaks.length}
            </span>
          </div>
        </div>

        {/* Quick Profiles Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Profils recommandés :</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => onApplyProfile('vintage')}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                Mode Vintage (RAM ≤ 2 Go)
              </button>
              <button
                onClick={() => onApplyProfile('balanced')}
                className="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Mode Équilibré
              </button>
              <button
                onClick={() => onApplyProfile('max')}
                className="px-3 py-1.5 text-xs font-semibold rounded-md text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              >
                Performance Maximale
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportRegistryFile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exporter Registre (.reg)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'Toutes les catégories' },
          { id: 'graphics', label: 'Graphismes & Menu (4)' },
          { id: 'memory', label: 'Mémoire RAM & Swap (4)' },
          { id: 'services', label: 'Services Inutiles (4)' },
          { id: 'disk', label: 'Disque & NTFS (2)' },
          { id: 'network', label: 'Réseau & Bande Passante (2)' },
        ].map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tweaks List */}
      <div className="space-y-3">
        {filteredTweaks.map((tweak) => {
          return (
            <div
              key={tweak.id}
              className={`p-4 rounded-xl border transition-all ${
                tweak.enabled
                  ? 'border-emerald-500/30 bg-slate-900/60'
                  : 'border-slate-800 bg-slate-900/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">
                      {tweak.title}
                    </h3>
                    {tweak.recommendedForOldPC && (
                      <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        Recommandé Vieux PC
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    {tweak.description}
                  </p>

                  {/* Technical detail indicator */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
                    {tweak.regPath && (
                      <span className="truncate">
                        Registre : {tweak.regPath}\\{tweak.regKey}
                      </span>
                    )}
                    {tweak.serviceName && (
                      <span>Service Windows : {tweak.serviceName}</span>
                    )}
                    {tweak.command && (
                      <span className="truncate">Commande : {tweak.command}</span>
                    )}
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => onToggleTweak(tweak.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    tweak.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tweak.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
