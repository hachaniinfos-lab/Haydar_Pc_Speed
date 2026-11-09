import React from 'react';
import { 
  Play, 
  PowerOff, 
  Power, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { StartupItem, WindowsVersion } from '../types';
import { downloadTextFile } from '../utils/downloadHelper';

interface StartupModuleProps {
  items: StartupItem[];
  onToggleItem: (id: string) => void;
  onDisableAllHeavy: () => void;
  targetOS: WindowsVersion;
}

export const StartupModule: React.FC<StartupModuleProps> = ({
  items,
  onToggleItem,
  onDisableAllHeavy,
  targetOS,
}) => {
  const enabledItems = items.filter((i) => i.enabled);
  const totalBootDelay = enabledItems.reduce((acc, curr) => acc + curr.bootImpactSeconds, 0);
  const disabledCount = items.length - enabledItems.length;

  const handleExportStartupBatch = () => {
    let script = `@echo off\nchcp 65001 >nul 2>&1\ntitle Haydar Speed Pro - Optimisation Demarrage\ncolor 0B\ncls\n`;
    script += `:: ============================================================================\n`;
    script += `:: OPTIMISATION DU DÉMARRAGE WINDOWS (XP À 11)\n`;
    script += `:: صدقة جارية على روح أخي حيدر حشاني رحمه الله\n`;
    script += `:: Contacter : hachaniinfos@gmail.com | WhatsApp : +21655405159\n`;
    script += `:: ============================================================================\n\n`;

    items.forEach((item) => {
      if (!item.enabled) {
        script += `echo [*] Desactivation du demarrage automatique : ${item.name}...\n`;
        script += `reg delete "${item.location}" /v "${item.name}" /f >nul 2>&1\n`;
      }
    });

    script += `\necho.\necho [+] Demarrage optimise ! Environ ${totalBootDelay.toFixed(1)} secondes economisees au boot.\necho.\npause\n`;

    downloadTextFile(script, 'Haydar_Speed_Pro_Optimiser_Demarrage.bat');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Delay Statistics */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Gestionnaire de Démarrage Windows
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">msconfig / TaskManager</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Accélérer l'Allumage du PC
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Sur les anciens ordinateurs à disque dur mécanique (HDD), chaque programme lancé au démarrage génère des accès concurrents qui gèlent l'ordinateur pendant plusieurs minutes.
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs text-slate-400">Retard estimé au boot</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold text-cyan-300 tabular-nums">
                +{totalBootDelay.toFixed(1)}s
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {disabledCount} application(s) désactivée(s)
            </span>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Impact Élevé (&gt;5s)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Impact Moyen (3-5s)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Impact Faible (&lt;3s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDisableAllHeavy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Désactiver tous les éléments lourds</span>
            </button>

            <button
              onClick={handleExportStartupBatch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exporter Script (.bat)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Startup Items Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Éditeur & Emplacement</th>
                <th className="py-3 px-4">Impact Démarrage</th>
                <th className="py-3 px-4 text-right">Statut & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      !item.enabled ? 'opacity-60 bg-slate-950/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{item.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-300 font-medium">{item.publisher}</span>
                        <div className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                          {item.location}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-[11px] uppercase ${
                            item.impact === 'high'
                              ? 'text-rose-400'
                              : item.impact === 'medium'
                              ? 'text-amber-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          {item.impact === 'high' ? 'Élevé' : item.impact === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                        <span className="font-mono text-slate-400 tabular-nums">
                          (+{item.bootImpactSeconds}s)
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          item.enabled
                            ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50 hover:bg-rose-900/50'
                            : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/50'
                        }`}
                      >
                        {item.enabled ? (
                          <>
                            <PowerOff className="w-3.5 h-3.5" />
                            <span>Désactiver</span>
                          </>
                        ) : (
                          <>
                            <Power className="w-3.5 h-3.5" />
                            <span>Réactiver</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
