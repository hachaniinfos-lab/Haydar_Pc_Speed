import React from 'react';
import { Download, Gauge, Zap } from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'cleaner'
  | 'startup'
  | 'optimizer'
  | 'diagnostic'
  | 'backup'
  | 'report';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenExeModal: () => void;
  targetOS: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenExeModal,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'cleaner', label: 'Nettoyage' },
    { id: 'startup', label: 'Démarrage' },
    { id: 'optimizer', label: 'Optimisations' },
    { id: 'diagnostic', label: 'Diagnostic' },
    { id: 'backup', label: 'Sauvegarde' },
    { id: 'report', label: 'Rapport' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single brand wordmark */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-slate-950 stroke-slate-950" />
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                XP SPEEDER PRO
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80 ml-2 hidden sm:inline">
                XP → Win 11
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenExeModal}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg hover:from-cyan-300 hover:to-teal-300 shadow-sm shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Générer le .EXE / Pack</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
