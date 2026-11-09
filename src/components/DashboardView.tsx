import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Sliders, 
  Server,
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import { SystemSpecs, WindowsVersion } from '../types';
import { WINDOWS_OS_PROFILES } from '../utils/systemDetector';

interface DashboardViewProps {
  specs: SystemSpecs;
  onUpdateTargetOS: (os: WindowsVersion) => void;
  onPurgeRam: () => void;
  isRamPurging: boolean;
  onNavigateTab: (tab: 'cleaner' | 'startup' | 'optimizer' | 'diagnostic' | 'report') => void;
  onQuickClean: () => void;
  healthScore: number;
  totalSpaceCleanableMB: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  specs,
  onUpdateTargetOS,
  onPurgeRam,
  isRamPurging,
  onNavigateTab,
  onQuickClean,
  healthScore,
  totalSpaceCleanableMB,
}) => {
  const currentProfile = WINDOWS_OS_PROFILES[specs.targetOS];
  const [showConsolePreview, setShowConsolePreview] = useState(false);

  const osList: WindowsVersion[] = ['xp', 'vista', '7', '8', '10', '11'];

  return (
    <div className="space-y-6">
      {/* Target OS & Machine Profile Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Profil Matériel & Système Cible
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {specs.arch} ({specs.cpuCores} Cœurs CPU)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {currentProfile.recommendedDescription}
            </p>
          </div>

          {/* OS Switcher segmented buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800 shrink-0">
            {osList.map((os) => {
              const active = specs.targetOS === os;
              return (
                <button
                  key={os}
                  onClick={() => onUpdateTargetOS(os)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    active
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Win {os.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Telemetry Grid: CPU, RAM, Disk, System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: RAM Telemetry */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Mémoire RAM</h3>
                <p className="text-[11px] text-slate-400">Capacité totale : {specs.totalRamGB} Go</p>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-cyan-300 tabular-nums">
              {Math.round(specs.ramUsagePercent)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  specs.ramUsagePercent > 80
                    ? 'bg-rose-500'
                    : specs.ramUsagePercent > 55
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                }`}
                style={{ width: `${Math.min(100, specs.ramUsagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Utilisé : {specs.usedRamMB} Mo</span>
              <span>Libre : {specs.freeRamMB} Mo</span>
            </div>
          </div>

          {/* Ram Purge action */}
          <button
            onClick={onPurgeRam}
            disabled={isRamPurging}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-700/50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRamPurging ? 'animate-spin' : ''}`} />
            <span>{isRamPurging ? 'Purge en cours...' : 'Libérer la RAM (Flush)'}</span>
          </button>
        </div>

        {/* Card 2: CPU Load */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Processeur CPU</h3>
                <p className="text-[11px] text-slate-400">{specs.cpuCores} Cœurs / x86</p>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-blue-400 tabular-nums">
              {Math.round(specs.cpuUsagePercent)}%
            </span>
          </div>

          {/* Visual pseudo-sparkline / load bars */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${Math.min(100, specs.cpuUsagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Fréquence : ~2.4 GHz</span>
              <span>Threads : {specs.cpuCores * 2}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Processus actifs</span>
            <span className="font-mono text-white font-medium">{specs.processCount}</span>
          </div>
        </div>

        {/* Card 3: Storage (C:) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Disque Système (C:)</h3>
                <p className="text-[11px] text-slate-400">
                  Type : <span className="text-amber-300 font-semibold">{specs.diskType}</span>
                </p>
              </div>
            </div>
            <span className="font-mono text-xl font-bold text-amber-300 tabular-nums">
              {Math.round(specs.diskUsagePercent)}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300"
                style={{ width: `${Math.min(100, specs.diskUsagePercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Occupé : {specs.diskUsedGB} Go</span>
              <span>Total : {specs.diskTotalGB} Go</span>
            </div>
          </div>

          <button
            onClick={onQuickClean}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg transition-colors focus:outline-none"
          >
            <span>Nettoyer {(totalSpaceCleanableMB / 1024).toFixed(1)} Go</span>
          </button>
        </div>

        {/* Card 4: Health Score & Responsiveness */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Score de Santé</h3>
                <p className="text-[11px] text-slate-400">Démarrage : {specs.bootTimeSeconds}s</p>
              </div>
            </div>
            <span className={`font-mono text-xl font-bold tabular-nums ${
              healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {healthScore}/100
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{healthScore >= 80 ? 'Optimisé' : healthScore >= 60 ? 'Moyen' : 'Ralenti'}</span>
              <span>Uptime : {specs.uptimeHours}h</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('diagnostic')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 rounded-lg transition-colors focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voir le Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Actions Rapides en 1-Clic
            </h2>
            <p className="text-xs text-slate-400">
              Optimisations universelles sans altérer la stabilité de vos logiciels.
            </p>
          </div>
          <button
            onClick={() => setShowConsolePreview(!showConsolePreview)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showConsolePreview ? 'Masquer la console' : 'Afficher la console CMD'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('cleaner')}
            className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <HardDrive className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                Nettoyeur de Fichiers
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Purger %TEMP%, Prefetch et corbeille sans risque.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('startup')}
            className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Play className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Gestionnaire de Démarrage
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Désactiver les logiciels lourds qui retardent le boot.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('optimizer')}
            className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sliders className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Réglages Spéciaux Vieux PC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              DisablePagingExecutive, MenuShowDelay et services.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('report')}
            className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                Rapport Avant / Après
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Comparer les gains en temps de boot, RAM et réactivité.
            </p>
          </button>
        </div>

        {/* Live CMD Console Simulation */}
        {showConsolePreview && (
          <div className="mt-4 rounded-lg bg-black border border-slate-800 p-4 font-mono text-xs text-emerald-400 space-y-1.5 overflow-x-auto shadow-inner">
            <div className="text-slate-500 pb-1 border-b border-slate-900 flex justify-between items-center">
              <span>C:\Windows\System32\cmd.exe - Haydar Speed Pro Engine</span>
              <span>ANSI UTF-8</span>
            </div>
            <p className="text-slate-400">[SYSTEM CHECK] Target OS: {currentProfile.name} ({specs.arch})</p>
            <p className="text-cyan-400">[KERNEL] DisablePagingExecutive = 1 (Noyau verrouillé en RAM)</p>
            <p className="text-amber-400">[STORAGE] Cache Prefetch: 310 Mo détectés · %TEMP%: 1.24 Go</p>
            <p className="text-emerald-400">[READY] Prêt pour exécution native ou export exécutable .EXE</p>
          </div>
        )}
      </div>
    </div>
  );
};
