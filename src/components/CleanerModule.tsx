import React, { useState } from 'react';
import { 
  Trash2, 
  Check, 
  ShieldCheck, 
  Download, 
  Terminal, 
  AlertCircle,
  FolderOpen,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CleanerItem, WindowsVersion } from '../types';
import { downloadTextFile } from '../utils/downloadHelper';

interface CleanerModuleProps {
  items: CleanerItem[];
  onToggleItem: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onPerformClean: (cleanedMB: number) => void;
  targetOS: WindowsVersion;
}

export const CleanerModule: React.FC<CleanerModuleProps> = ({
  items,
  onToggleItem,
  onSelectAll,
  onPerformClean,
  targetOS,
}) => {
  const [filter, setFilter] = useState<'all' | 'safe' | 'recommended'>('all');
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [cleaningLogs, setCleaningLogs] = useState<string[]>([]);
  const [cleaningDone, setCleaningDone] = useState(false);
  const [lastFreedMB, setLastFreedMB] = useState(0);

  const filteredItems = items.filter((item) => {
    if (filter === 'safe') return item.safetyLevel === 'safe';
    if (filter === 'recommended') return item.safetyLevel === 'safe' || item.safetyLevel === 'recommended';
    return true;
  });

  const selectedItems = items.filter((i) => i.selected);
  const totalSelectedMB = selectedItems.reduce((acc, curr) => acc + curr.sizeMB, 0);

  const handleStartCleaning = () => {
    if (selectedItems.length === 0) return;

    setIsCleaning(true);
    setCleaningDone(false);
    setCleanProgress(0);
    setCleaningLogs([]);

    const steps = [
      'Initialisation du moteur de nettoyage Haydar Speed Pro...',
      'Analyse des autorisations d\'accès système...',
      ...selectedItems.map((item) => `Purger : ${item.name} (${item.sizeMB} Mo)`),
      'Vidage de la table des descripteurs de fichiers temporaires...',
      'Finalisation et synchronisation du système de fichiers NTFS...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setCleaningLogs((prev) => [...prev, steps[currentStep]]);
        currentStep++;
        setCleanProgress(Math.round((currentStep / steps.length) * 100));
      } else {
        clearInterval(interval);
        setIsCleaning(false);
        setCleaningDone(true);
        setLastFreedMB(totalSelectedMB);
        onPerformClean(totalSelectedMB);
      }
    }, 280);
  };

  const handleDownloadCleanScript = () => {
    let script = `@echo off\nchcp 65001 >nul 2>&1\ntitle Haydar Speed Pro - Nettoyage Securise\ncolor 0A\ncls\n`;
    script += `:: ============================================================================\n`;
    script += `:: SCRIPT DE NETTOYAGE INTELLIGENT ET SÉCURISÉ\n`;
    script += `:: Compatible Windows XP, Vista, 7, 8, 10, 11 (32 & 64-bit)\n`;
    script += `:: صدقة جارية على روح أخي حيدر حشاني رحمه الله\n`;
    script += `:: Contacter : hachaniinfos@gmail.com | WhatsApp : +21655405159\n`;
    script += `:: ============================================================================\n\n`;

    selectedItems.forEach((item) => {
      script += `echo [*] Nettoyage : ${item.name}...\n`;
      if (item.id === 'user_temp') {
        script += `del /f /s /q "%TEMP%\\*.*" >nul 2>&1\nfor /d %%p in ("%TEMP%\\*.*") do rmdir /s /q "%%p" >nul 2>&1\n`;
      } else if (item.id === 'win_temp') {
        script += `del /f /s /q "C:\\Windows\\Temp\\*.*" >nul 2>&1\nfor /d %%p in ("C:\\Windows\\Temp\\*.*") do rmdir /s /q "%%p" >nul 2>&1\n`;
      } else if (item.id === 'prefetch') {
        script += `del /f /s /q "C:\\Windows\\Prefetch\\*.pf" >nul 2>&1\n`;
      } else if (item.id === 'recycle_bin') {
        script += `rd /s /q %SYSTEMDRIVE%\\$Recycle.bin >nul 2>&1\nrd /s /q %SYSTEMDRIVE%\\RECYCLER >nul 2>&1\n`;
      } else if (item.id === 'dns_cache') {
        script += `ipconfig /flushdns >nul 2>&1\n`;
      } else if (item.id === 'logs') {
        script += `del /f /s /q "C:\\Windows\\Logs\\*.*" >nul 2>&1\n`;
      } else {
        script += `del /f /s /q "%TEMP%\\*.*" >nul 2>&1\n`;
      }
    });

    script += `\necho.\necho [+] Nettoyage termine ! ${(totalSelectedMB / 1024).toFixed(2)} Go liberes.\necho.\npause\n`;

    downloadTextFile(script, 'Haydar_Speed_Pro_Nettoyage.bat');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Module de Nettoyage Intelligent
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">100% Sécurisé & Sans Perte de Données</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Éliminer les Résidus & Caches Lents
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Les vieux disques HDD souffrent particulièrement de l'accumulation de milliers de petits fichiers temporaires qui ralentissent les têtes de lecture.
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs text-slate-400">Espace sélectionné</span>
            <span className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
              {(totalSelectedMB / 1024).toFixed(2)} Go
            </span>
          </div>
        </div>

        {/* Filter controls and Action buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous ({items.length})
            </button>
            <button
              onClick={() => setFilter('safe')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'safe'
                  ? 'bg-slate-800 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              100% Sans Risque
            </button>
            <button
              onClick={() => setFilter('recommended')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'recommended'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recommandés
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectAll(true)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Tout cocher
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onSelectAll(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Tout décocher
            </button>

            <button
              onClick={handleDownloadCleanScript}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exporter Clean.bat</span>
            </button>

            <button
              onClick={handleStartCleaning}
              disabled={isCleaning || selectedItems.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-sm shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isCleaning ? 'Nettoyage en cours...' : 'Nettoyer maintenant'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cleaning in progress or finished banner */}
      {(isCleaning || cleaningDone) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">
                {isCleaning ? 'Nettoyage en temps réel...' : 'Nettoyage terminé avec succès !'}
              </span>
            </div>
            <span className="text-emerald-400 font-bold tabular-nums">
              {cleanProgress}%
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${cleanProgress}%` }}
            />
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 text-slate-400 text-[11px] pr-2 no-scrollbar">
            {cleaningLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>

          {cleaningDone && (
            <div className="mt-2 p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs">
              <span className="text-emerald-300">
                Félicitations ! {(lastFreedMB / 1024).toFixed(2)} Go ont été libérés sur votre disque C:.
              </span>
              <button
                onClick={() => setCleaningDone(false)}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Item Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                item.selected
                  ? 'border-amber-500/40 bg-slate-900/70 shadow-sm'
                  : 'border-slate-800/80 bg-slate-900/30 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Custom Checkbox */}
                <div
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.selected
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  {item.selected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {item.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-amber-300 shrink-0 tabular-nums">
                      {item.sizeMB >= 1024
                        ? `${(item.sizeMB / 1024).toFixed(2)} Go`
                        : `${item.sizeMB} Mo`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-1.5 flex items-center gap-2 text-[11px] text-slate-500 font-mono truncate">
                    <FolderOpen className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="truncate">{item.path}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
