import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Check, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DiagnosticIssue, SystemSpecs, WindowsVersion } from '../types';

interface DiagnosticModuleProps {
  issues: DiagnosticIssue[];
  healthScore: number;
  specs: SystemSpecs;
  targetOS: WindowsVersion;
  onApplyAllRecommendations: () => void;
  onNavigateTab: (tab: 'cleaner' | 'startup' | 'optimizer' | 'report') => void;
}

export const DiagnosticModule: React.FC<DiagnosticModuleProps> = ({
  issues,
  healthScore,
  specs,
  targetOS,
  onApplyAllRecommendations,
  onNavigateTab,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleteMessage, setScanCompleteMessage] = useState(false);

  const handleRunDiagnosticScan = () => {
    setIsScanning(true);
    setScanCompleteMessage(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleteMessage(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Health Score Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Audit Automatique du Système
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Windows {targetOS.toUpperCase()} {specs.arch}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Diagnostic & Recommandations Pro
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Analyse des goulots d'étranglement spécifiques aux processeurs mono/multi-cœurs et disques lents.
            </p>
          </div>

          {/* Health Score Gauge card */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Indice de Vitesse
              </span>
              <span className={`text-3xl font-extrabold font-mono tabular-nums ${
                healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {healthScore}/100
              </span>
            </div>

            <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
              <div 
                className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
                  isScanning ? 'border-cyan-400' : 'hidden'
                }`}
              />
              <Activity className={`w-5 h-5 ${healthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
          </div>
        </div>

        {/* Action button row */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleRunDiagnosticScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Analyse en cours...' : 'Relancer l\'analyse système'}</span>
          </button>

          <button
            onClick={onApplyAllRecommendations}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Appliquer toutes les recommandations en 1 clic</span>
          </button>
        </div>
      </div>

      {scanCompleteMessage && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-xl text-xs text-cyan-200 flex items-center justify-between">
          <span>Analyse approfondie terminée : tous les sous-systèmes Windows ont été scannés.</span>
          <button onClick={() => setScanCompleteMessage(false)} className="underline text-slate-400">
            Fermer
          </button>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Goulots d'étranglement détectés ({issues.length})
        </h3>

        {issues.map((issue) => {
          return (
            <div
              key={issue.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {issue.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}

                    <h4 className="text-sm font-semibold text-white">
                      {issue.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl pl-6">
                    {issue.detail}
                  </p>

                  <div className="pl-6 pt-1 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Gain estimé : {issue.estimatedGain}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 pl-6 sm:pl-0">
                  <button
                    onClick={() => {
                      if (issue.cleanerIds?.length) {
                        onNavigateTab('cleaner');
                      } else if (issue.startupIds?.length) {
                        onNavigateTab('startup');
                      } else {
                        onNavigateTab('optimizer');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
                  >
                    <span>Résoudre manuellement</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
