import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  RotateCcw,
  Sliders,
  HardDrive,
  Cpu,
  Zap,
  Flame,
  Timer,
  Gauge,
  Pause,
  Play,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { SystemSpecs, WindowsVersion } from '../types';
import { IqonSection } from './IqonSidebar';
import { isInstalledOnSystem } from '../utils/systemDetector';

export interface TelemetryPoint {
  second: number;
  time: string;
  cpu: number;
  ram: number;
}

const createInitialTelemetry = (cpuBase: number, ramBase: number): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  for (let i = 59; i >= 0; i--) {
    const waveCpu = Math.sin(i * 0.35) * 8 + Math.cos(i * 0.8) * 4;
    const waveRam = Math.cos(i * 0.25) * 3;
    const cpu = Math.min(98, Math.max(8, Math.round(cpuBase + waveCpu)));
    const ram = Math.min(95, Math.max(15, Math.round(ramBase + waveRam)));
    points.push({
      second: 59 - i,
      time: i === 0 ? '0s' : `-${i}s`,
      cpu,
      ram,
    });
  }
  return points;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    color?: string;
    name?: string;
  }>;
  label?: string;
}

const TelemetryTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const cpu = payload.find((p) => p.dataKey === 'cpu');
    const ram = payload.find((p) => p.dataKey === 'ram');
    return (
      <div className="bg-[#0b0e14]/95 border border-[#1e2433] p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px]">
          <span className="text-slate-400">
            Temps : <strong className="text-white font-mono">{label === '0s' ? 'Maintenant (0s)' : label}</strong>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>
        <div className="space-y-1.5">
          {cpu && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                CPU (Processeur) :
              </span>
              <span className="font-mono font-bold text-emerald-400">{cpu.value}%</span>
            </div>
          )}
          {ram && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                RAM (Mémoire) :
              </span>
              <span className="font-mono font-bold text-cyan-400">{ram.value}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface IqonDashboardProps {
  specs: SystemSpecs;
  targetOS: WindowsVersion;
  onPurgeRam: () => void;
  isRamPurging: boolean;
  onRunOptimization: () => void;
  onNavigateSection: (section: IqonSection) => void;
  onOpenSupport: () => void;
  onOpenTools: () => void;
  tooltipMode: boolean;
}

export const IqonDashboard: React.FC<IqonDashboardProps> = ({
  specs,
  targetOS,
  onPurgeRam,
  isRamPurging,
  onRunOptimization,
  onNavigateSection,
  onOpenSupport,
  onOpenTools,
  tooltipMode,
}) => {
  // Settings toggle states
  const [appNotifications, setAppNotifications] = useState(true);
  const [autoInstallUpdates, setAutoInstallUpdates] = useState(false);
  const [defaultToMyPC, setDefaultToMyPC] = useState(true);
  const [realtimeMonitoring, setRealtimeMonitoring] = useState(true);
  const [performanceLogs, setPerformanceLogs] = useState(true);

  // 60-Second Real-Time Telemetry States
  const [telemetryFilter, setTelemetryFilter] = useState<'all' | 'cpu' | 'ram'>('all');
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() =>
    createInitialTelemetry(specs.cpuUsagePercent || 35, specs.ramUsagePercent || 52)
  );

  // Rolling 60-second telemetry update effect
  useEffect(() => {
    if (!realtimeMonitoring) return;

    const interval = setInterval(() => {
      setTelemetryHistory((prev) => {
        const lastPt = prev[prev.length - 1];
        const prevCpu = lastPt ? lastPt.cpu : (specs.cpuUsagePercent || 35);
        const prevRam = lastPt ? lastPt.ram : (specs.ramUsagePercent || 50);

        // Micro variations around current specs
        const cpuNoise = (Math.random() - 0.48) * 10;
        const ramNoise = (Math.random() - 0.49) * 3;

        const nextCpu = Math.min(99, Math.max(5, Math.round(prevCpu * 0.65 + specs.cpuUsagePercent * 0.35 + cpuNoise)));
        const nextRam = Math.min(97, Math.max(12, Math.round(prevRam * 0.85 + specs.ramUsagePercent * 0.15 + ramNoise)));

        const shifted = prev.slice(1).map((pt, idx) => ({
          ...pt,
          second: idx,
          time: idx === 58 ? '-1s' : `-${59 - idx}s`,
        }));

        shifted.push({
          second: 59,
          time: '0s',
          cpu: nextCpu,
          ram: nextRam,
        });

        return shifted;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [realtimeMonitoring, specs.cpuUsagePercent, specs.ramUsagePercent]);

  // Telemetry 60-second stats
  const telemetryStats = useMemo(() => {
    if (!telemetryHistory.length) {
      return {
        currentCpu: Math.round(specs.cpuUsagePercent),
        currentRam: Math.round(specs.ramUsagePercent),
        maxCpu: Math.round(specs.cpuUsagePercent),
        minCpu: Math.round(specs.cpuUsagePercent),
        avgCpu: Math.round(specs.cpuUsagePercent),
        maxRam: Math.round(specs.ramUsagePercent),
        minRam: Math.round(specs.ramUsagePercent),
        avgRam: Math.round(specs.ramUsagePercent),
      };
    }
    const cpuVals = telemetryHistory.map((p) => p.cpu);
    const ramVals = telemetryHistory.map((p) => p.ram);
    return {
      currentCpu: cpuVals[cpuVals.length - 1] ?? Math.round(specs.cpuUsagePercent),
      currentRam: ramVals[ramVals.length - 1] ?? Math.round(specs.ramUsagePercent),
      maxCpu: Math.max(...cpuVals),
      minCpu: Math.min(...cpuVals),
      avgCpu: Math.round(cpuVals.reduce((a, b) => a + b, 0) / cpuVals.length),
      maxRam: Math.max(...ramVals),
      minRam: Math.min(...ramVals),
      avgRam: Math.round(ramVals.reduce((a, b) => a + b, 0) / ramVals.length),
    };
  }, [telemetryHistory, specs.cpuUsagePercent, specs.ramUsagePercent]);

  // Moteur d'Accélération Ai Acceleration States
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.5);
  const [isTurboActive, setIsTurboActive] = useState<boolean>(true);
  const [speederPriority, setSpeederPriority] = useState<boolean>(true);
  const [speederTimerRes, setSpeederTimerRes] = useState<boolean>(true);
  const [speederUncapCpu, setSpeederUncapCpu] = useState<boolean>(true);
  const [turboFeedback, setTurboFeedback] = useState<string | null>(null);

  const handleToggleTurbo = () => {
    const nextState = !isTurboActive;
    setIsTurboActive(nextState);
    setTurboFeedback(
      nextState 
        ? 'Mode Turbo Moteur d\'Accélération Ai Activé : Priorité CPU Win32PrioritySeparation & Timer 1.0ms appliqués !' 
        : 'Mode Standard rétabli.'
    );
    setTimeout(() => setTurboFeedback(null), 4000);
  };

  // Dynamic values
  const cpuTemp = Math.round(42 + (specs.cpuUsagePercent * 0.15));
  const gpuTemp = Math.round(21 + (specs.cpuUsagePercent * 0.08));

  return (
    <div className="space-y-4">
      {/* Tooltip banner if tooltipMode is enabled */}
      {tooltipMode && (
        <div className="p-3 bg-[#10b981]/15 border border-[#10b981]/40 rounded-xl text-xs text-[#10b981] flex items-center justify-between">
          <span>
            ℹ <strong>Mode Aide Activé :</strong> Cliquez sur n'importe quel module pour lancer les optimisations natives Windows adaptées à votre PC.
          </span>
        </div>
      )}

      {/* Row 1: Welcome Hero, Processor, Video Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Welcome Back (Cols 5) */}
        <div className="lg:col-span-5 bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-[#2a303e] transition-all">
          {/* 3D Wireframe geometric mesh SVG in background */}
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none opacity-40">
            <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-500/30">
              <defs>
                <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8"/>
                  <stop offset="50%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#c084fc"/>
                </linearGradient>
              </defs>
              <ellipse cx="120" cy="80" rx="60" ry="25" fill="none" stroke="url(#meshGrad)" strokeWidth="0.8" transform="rotate(-25 120 80)"/>
              <ellipse cx="120" cy="80" rx="50" ry="20" fill="none" stroke="url(#meshGrad)" strokeWidth="0.8" transform="rotate(-25 120 80)"/>
              <ellipse cx="120" cy="80" rx="40" ry="15" fill="none" stroke="url(#meshGrad)" strokeWidth="0.8" transform="rotate(-25 120 80)"/>
              <ellipse cx="120" cy="80" rx="30" ry="10" fill="none" stroke="url(#meshGrad)" strokeWidth="0.8" transform="rotate(-25 120 80)"/>
              <ellipse cx="120" cy="80" rx="20" ry="6" fill="none" stroke="url(#meshGrad)" strokeWidth="0.8" transform="rotate(-25 120 80)"/>
              <line x1="80" y1="40" x2="160" y2="120" stroke="url(#meshGrad)" strokeWidth="0.6" strokeDasharray="2 2"/>
              <line x1="160" y1="40" x2="80" y2="120" stroke="url(#meshGrad)" strokeWidth="0.6" strokeDasharray="2 2"/>
            </svg>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="space-y-0.5">
              <span className="text-xs text-[#64748b] font-medium">Welcome back</span>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Haydar Speed Pro
              </h2>
            </div>

            {/* Status list with dots */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-[#10b981]/20" />
                <span className="font-semibold text-white">Temperatures</span>
                <span className="text-[11px] text-[#64748b] ml-auto">Optimal</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-[#10b981]/20" />
                <span className="font-semibold text-white">Health</span>
                <span className="text-[11px] text-[#64748b] ml-auto">Recently scanned</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-[#10b981]/20" />
                <span className="font-semibold text-white">Stability</span>
                <span className="text-[11px] text-[#64748b] ml-auto">No recent crashes</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-[#ef4444]/20" />
                <span className="font-semibold text-white">Drivers</span>
                <span className="text-[11px] text-[#64748b] ml-auto">Need to update</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end relative z-10">
            <button 
              onClick={onRunOptimization}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#171b22] hover:bg-[#202530] border border-[#232731] rounded-lg transition-colors"
            >
              <span>My PC</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Processor (Cols 3.5) */}
        <div className="lg:col-span-4 bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Processor</h3>
              <p className="text-xs text-[#64748b] font-medium truncate max-w-[170px]">
                {specs.targetOS === 'xp' ? 'Intel Pentium 4 / Celeron' : 'AMD Ryzen 9 7950X3D'}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs text-white font-medium">Optimal</span>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1c2029]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-500"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-bold text-white font-mono block leading-none">
                  {cpuTemp}°
                </span>
                <span className="text-[9px] text-[#64748b] uppercase tracking-wider block">Celsius</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#64748b]">Utilization</span>
              <span className="font-mono text-white font-bold">{specs.cpuUsagePercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#161a22] rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300" 
                style={{ width: `${specs.cpuUsagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Video Card (Cols 3.5) */}
        <div className="lg:col-span-3 bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Video Card</h3>
              <p className="text-xs text-[#64748b] font-medium truncate max-w-[130px]">
                {specs.targetOS === 'xp' ? 'Intel GMA / AGP' : 'NVIDIA RTX 4090'}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs text-white font-medium">Optimal</span>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1c2029]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-500"
                  strokeDasharray="25, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-bold text-white font-mono block leading-none">
                  {gpuTemp}°
                </span>
                <span className="text-[9px] text-[#64748b] uppercase tracking-wider block">Celsius</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#64748b]">Utilization</span>
              <span className="font-mono text-white font-bold">24%</span>
            </div>
            <div className="h-1.5 w-full bg-[#161a22] rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300" 
                style={{ width: `24%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: RAM, Storage, Network */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RAM Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">RAM</h3>
              <p className="text-xs text-[#64748b] font-medium">
                {specs.targetOS === 'xp' ? `${specs.totalRamGB} GB DDR2` : '64 GB DDR5-6000'}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs text-white font-medium">Optimal</span>
              </div>
            </div>
            <button 
              onClick={onPurgeRam}
              disabled={isRamPurging}
              title="Vider la RAM maintenant"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1d24] transition-colors"
            >
              <RotateCcw className={`w-4 h-4 ${isRamPurging ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          <div className="pt-6 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#64748b]">Utilization</span>
              <span className="font-mono text-white font-bold">{Math.round(specs.ramUsagePercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#161a22] rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300" 
                style={{ width: `${specs.ramUsagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Storage</h3>
              <p className="text-xs text-[#64748b] font-medium">
                {specs.targetOS === 'xp' ? 'HDD 80 GB (C:)' : '2TB 990 EVO PRO'}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs text-white font-medium">Optimal</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigateSection('cleaner')}
              title="Nettoyer le disque"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1d24] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          <div className="pt-6 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#64748b]">Utilisation Disque</span>
              <span className="font-mono text-white font-bold">{Math.round(specs.diskUsagePercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#161a22] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-300" 
                style={{ width: `${specs.diskUsagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Network Card (with Glowing Purple Wave Chart) */}
        <div 
          onClick={() => onNavigateSection('network')}
          className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all relative overflow-hidden cursor-pointer group"
        >
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">Network & Latence</h3>
              <p className="text-xs text-[#64748b] font-medium">DNS 1.1.1.1 / TCP NoDelay</p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs text-white font-medium">Optimisable</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <span className="flex items-center gap-0.5 text-slate-400">
                <ArrowUp className="w-3 h-3 text-purple-400" /> 6 MB/s
              </span>
              <span className="flex items-center gap-0.5 text-slate-400">
                <ArrowDown className="w-3 h-3 text-purple-400" /> 24 KB/s
              </span>
            </div>
          </div>

          {/* SVG Purple Wave Chart */}
          <div className="pt-4 h-16 w-full -mb-2">
            <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="purpleWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <path
                d="M0,45 Q30,50 60,35 T120,40 T180,25 T240,30 T300,20 L300,60 L0,60 Z"
                fill="url(#purpleWave)"
              />
              <path
                d="M0,45 Q30,50 60,35 T120,40 T180,25 T240,30 T300,20"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Recharts Real-Time 60-Second CPU & RAM Evolution Section */}
      <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-[#2a303e] transition-all">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header row: Title, status indicator & filter toggles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c2029] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Activity className="w-4 h-4 animate-pulse" />
                </span>
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  Télémétrie en Temps Réel <span className="text-xs font-mono text-emerald-400 font-bold ml-1">(60 Dernières Secondes)</span>
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                  realtimeMonitoring
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    realtimeMonitoring ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`} />
                  {realtimeMonitoring ? 'En Direct (1 Hz)' : 'En Pause'}
                </span>
              </div>
              <p className="text-xs text-[#8b95a5]">
                Visualisation continue via Recharts de la charge processeur (CPU) et de l'allocation mémoire (RAM) seconde par seconde.
              </p>
            </div>

            {/* Filter buttons & pause toggle */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="bg-[#141820] border border-[#232938] p-1 rounded-xl flex items-center gap-1 text-xs">
                <button
                  onClick={() => setTelemetryFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    telemetryFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tous (CPU + RAM)
                </button>
                <button
                  onClick={() => setTelemetryFilter('cpu')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    telemetryFilter === 'cpu'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CPU Seul
                </button>
                <button
                  onClick={() => setTelemetryFilter('ram')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    telemetryFilter === 'ram'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  RAM Seule
                </button>
              </div>

              {/* Pause / Resume Button */}
              <button
                onClick={() => setRealtimeMonitoring(!realtimeMonitoring)}
                title={realtimeMonitoring ? 'Mettre en pause' : 'Reprendre le flux en direct'}
                className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                  realtimeMonitoring
                    ? 'bg-[#141820] border-[#232938] text-slate-300 hover:text-white hover:bg-[#1a202d]'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                {realtimeMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* CPU Live Metric */}
            <div className="bg-[#12161f] border border-[#1e2433] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  CPU Actuel
                </span>
                <span className="font-mono">Pic 60s: {telemetryStats.maxCpu}%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black font-mono text-white">
                  {telemetryStats.currentCpu}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Moy: {telemetryStats.avgCpu}%
                </span>
              </div>
              <div className="h-1 w-full bg-[#1b2230] rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${telemetryStats.currentCpu}%` }}
                />
              </div>
            </div>

            {/* RAM Live Metric */}
            <div className="bg-[#12161f] border border-[#1e2433] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1 font-semibold text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  RAM Actuelle
                </span>
                <span className="font-mono">Pic 60s: {telemetryStats.maxRam}%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black font-mono text-white">
                  {telemetryStats.currentRam}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Moy: {telemetryStats.avgRam}%
                </span>
              </div>
              <div className="h-1 w-full bg-[#1b2230] rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${telemetryStats.currentRam}%` }}
                />
              </div>
            </div>

            {/* Sampling Frequency Metric */}
            <div className="bg-[#12161f] border border-[#1e2433] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="font-semibold text-slate-300">Échantillonnage</span>
                <span className="font-mono text-emerald-400">1000 ms</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black font-mono text-white">60 pts</span>
                <span className="text-[10px] text-slate-400 font-mono">Fenêtre glissante</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                <Timer className="w-3 h-3 text-slate-500" />
                Synchronisé avec l'horloge
              </div>
            </div>

            {/* Fast Action Metric */}
            <div className="bg-[#12161f] border border-[#1e2433] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="font-semibold text-slate-300">Action Rapide</span>
                <span className="font-mono text-emerald-400">Instantané</span>
              </div>
              <button
                onClick={onPurgeRam}
                disabled={isRamPurging}
                className="mt-1 w-full py-1.5 px-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isRamPurging ? 'Purge en cours...' : 'Vider la RAM'}</span>
              </button>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={telemetryHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="telemetryCpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="telemetryRamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1c2230" vertical={false} />

                <XAxis
                  dataKey="time"
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1c2230' }}
                  interval={9}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1c2230' }}
                  unit="%"
                  width={36}
                />

                <Tooltip content={<TelemetryTooltip />} />

                {(telemetryFilter === 'all' || telemetryFilter === 'cpu') && (
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    name="CPU (%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#telemetryCpuGrad)"
                    isAnimationActive={false}
                  />
                )}

                {(telemetryFilter === 'all' || telemetryFilter === 'ram') && (
                  <Area
                    type="monotone"
                    dataKey="ram"
                    name="RAM (%)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#telemetryRamGrad)"
                    isAnimationActive={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart footer legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#64748b] pt-2 border-t border-[#1c2029] gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-1 rounded-full bg-emerald-400" />
                <strong className="text-white">Processeur (CPU)</strong> · Cycles et tranches de temps
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-1 rounded-full bg-cyan-400" />
                <strong className="text-white">Mémoire Vive (RAM)</strong> · WorkingSets physiques actifs
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              60s glissantes · Résolution 1s
            </div>
          </div>
        </div>
      </div>

      {/* Moteur d'Accélération Ai Real-Time Acceleration Card */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isTurboActive 
          ? 'bg-gradient-to-br from-[#0c1815] via-[#10191c] to-[#0c1218] border-emerald-500/50 shadow-2xl shadow-emerald-500/10' 
          : 'bg-[#0f1217] border-[#1c2029]'
      }`}>
        {/* Ambient background glow */}
        {isTurboActive && (
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </span>
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  Moteur d'Accélération Ai <span className="text-xs font-mono text-emerald-400 font-bold ml-1">v2.5 (Optimisation Temps Réel)</span>
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isTurboActive ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isTurboActive ? 'Mode Turbo Actif' : 'Mode Standard'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Piloté par le <em>Moteur d'Accélération Ai</em> : élévation dynamique des tranches de temps CPU, horloge système 1.0 ms et débridage des quotas de cycles Windows.
              </p>
            </div>

            <button
              onClick={handleToggleTurbo}
              className={`px-5 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shrink-0 ${
                isTurboActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300'
                  : 'bg-[#1b202a] text-slate-300 hover:text-white border border-[#2c3342] hover:bg-[#232936]'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isTurboActive ? 'Mode Turbo Activé (x' + speedMultiplier + ')' : 'Activer Moteur d\'Accélération Ai'}</span>
            </button>
          </div>

          {/* Feedback Toast */}
          {turboFeedback && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{turboFeedback}</span>
            </div>
          )}

          {/* Speed Multiplier Bar */}
          <div className="p-4 rounded-xl bg-[#090b0e] border border-[#1e232d] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Multiplicateur d'Accélération Système & Jeux</span>
              </span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Cadence : {speedMultiplier}x
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { mult: 1.0, label: '1.0x Éco', desc: 'Horloge standard' },
                { mult: 1.25, label: '1.25x Fluide', desc: 'Délai menus 0ms' },
                { mult: 1.5, label: '1.5x Boost', desc: 'Priorité CPU active' },
                { mult: 2.0, label: '2.0x Turbo', desc: 'Timer 1.0ms + Quota' },
                { mult: 3.0, label: '3.0x Max', desc: 'Performance Ultime' },
              ].map((item) => (
                <button
                  key={item.mult}
                  onClick={() => setSpeedMultiplier(item.mult)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    speedMultiplier === item.mult
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-[#12151b] border-[#1e232d] text-slate-400 hover:text-slate-200 hover:bg-[#181d26]'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* The 3 Core vrBrothers Optimization Techniques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Tech 1: Win32PrioritySeparation */}
            <div className="p-3.5 rounded-xl bg-[#12151b] border border-[#1e232d] space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Win32PrioritySeparation</span>
                  </span>
                  <button
                    onClick={() => setSpeederPriority(!speederPriority)}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                      speederPriority ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      speederPriority ? 'translate-x-3' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Technique maîtresse du Moteur d'Accélération Ai : modifie l'ordonnanceur CPU pour accorder des tranches de temps étendues à la fenêtre active (valeur hex 0x26 = 38).
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">HKLM\...\PriorityControl</span>
            </div>

            {/* Tech 2: Timer Resolution */}
            <div className="p-3.5 rounded-xl bg-[#12151b] border border-[#1e232d] space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-purple-400" />
                    <span>Horloge 1.0 ms (timeBeginPeriod)</span>
                  </span>
                  <button
                    onClick={() => setSpeederTimerRes(!speederTimerRes)}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                      speederTimerRes ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      speederTimerRes ? 'translate-x-3' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Windows utilise par défaut 15.6 ms. Le Moteur d'Accélération Ai force 1.0 ms pour réduire drastiquement l'input lag de la souris et des logiciels.
                </p>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">Latence divisée par 15</span>
            </div>

            {/* Tech 3: SystemResponsiveness */}
            <div className="p-3.5 rounded-xl bg-[#12151b] border border-[#1e232d] space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Débridage 100% CPU</span>
                  </span>
                  <button
                    onClick={() => setSpeederUncapCpu(!speederUncapCpu)}
                    className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                      speederUncapCpu ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      speederUncapCpu ? 'translate-x-3' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Windows réserve 20% des ressources pour l'arrière-plan. <code className="text-amber-300">SystemResponsiveness = 0</code> libère 100% du processeur pour vos programmes.
                </p>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">SystemResponsiveness = 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Performance Analyzer, Optimization, Health Center, 24/7 Support, Platform Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Performance Analyzer Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all relative overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Rapport Avant / Après</h3>
            <p className="text-xs text-[#64748b]">Benchmark boot, RAM et processus</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-white font-medium">Gain estimé : +48%</span>
            </div>
          </div>

          <div className="py-4 opacity-30">
            <div className="grid grid-cols-8 gap-1.5 w-32">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigateSection('beforeafter')}
              className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
            >
              <span>Voir le Rapport</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optimization Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all relative overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Optimisation Système</h3>
            <p className="text-xs text-[#64748b]">Noyau Windows, NTFS, Latence 0 ms</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-white font-medium">Profils Vintage & Max</span>
            </div>
          </div>

          <div className="py-4 opacity-40">
            <svg viewBox="0 0 100 40" className="w-28 h-10 text-cyan-400">
              <path d="M0,20 Q25,5 50,20 T100,20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M0,25 Q25,10 50,25 T100,25" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M0,30 Q25,15 50,30 T100,30" fill="none" stroke="currentColor" strokeWidth="0.8"/>
            </svg>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button 
              onClick={onRunOptimization}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              1-Clic Rapide
            </button>
            <button 
              onClick={() => onNavigateSection('tweaks')}
              className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>Détails Tweaks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Health Center Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Centre de Diagnostic</h3>
            <p className="text-xs text-[#64748b]">Audit automatique & Recommandations</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-white font-medium">Santé 74/100</span>
            </div>
          </div>

          <div className="py-4 opacity-25">
            <Activity className="w-12 h-12 text-slate-400" />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigateSection('diagnostic')}
              className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
            >
              <span>Lancer le Diagnostic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 24/7 Support Card */}
        <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2a303e] transition-all">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">24/7 Support</h3>
            <p className="text-xs text-[#64748b]">Professional help is right here</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-xs text-white font-medium">Online</span>
            </div>
          </div>

          <div className="py-2 text-[11px] text-emerald-400 font-arabic font-bold text-center" dir="rtl">
            صدقة جارية على روح أخي حيدر حشاني رحمه الله
          </div>

          <div className="pt-2">
            <button 
              onClick={onOpenSupport}
              className="flex items-center gap-1 text-xs font-semibold text-white hover:text-[#10b981] transition-colors"
            >
              <span>Support</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Platform Settings Card (Spans across or nicely grouped) */}
        <div className="md:col-span-2 lg:col-span-2 bg-[#0f1217] border border-[#1c2029] rounded-2xl p-5 space-y-4 hover:border-[#2a303e] transition-all">
          <h3 className="text-base font-bold text-white">Platform Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* General Preferences */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#525a66] block">
                GENERAL PREFERENCES
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white">App Notifications</span>
                <button
                  onClick={() => setAppNotifications(!appNotifications)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    appNotifications ? 'bg-[#10b981]' : 'bg-[#2a303c]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    appNotifications ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8b95a5] max-w-[180px]">Automatically install updates when available</span>
                <button
                  onClick={() => setAutoInstallUpdates(!autoInstallUpdates)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    autoInstallUpdates ? 'bg-[#10b981]' : 'bg-[#2a303c]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoInstallUpdates ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white">Default to 'My PC' when opening</span>
                <button
                  onClick={() => setDefaultToMyPC(!defaultToMyPC)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    defaultToMyPC ? 'bg-[#10b981]' : 'bg-[#2a303c]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    defaultToMyPC ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* System Tracking Settings */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#525a66] block">
                SYSTEM TRACKING SETTINGS
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8b95a5]">Real-Time Monitoring</span>
                <button
                  onClick={() => setRealtimeMonitoring(!realtimeMonitoring)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    realtimeMonitoring ? 'bg-[#10b981]' : 'bg-[#2a303c]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    realtimeMonitoring ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white">Performance Logs</span>
                <button
                  onClick={() => setPerformanceLogs(!performanceLogs)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    performanceLogs ? 'bg-[#10b981]' : 'bg-[#2a303c]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    performanceLogs ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              onClick={() => {
                if (isInstalledOnSystem()) {
                  onNavigateSection('tweaks');
                } else {
                  onOpenTools();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#171b22] hover:bg-[#202530] border border-[#232731] rounded-lg transition-colors cursor-pointer"
            >
              <span>All Settings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
