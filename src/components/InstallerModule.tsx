import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Terminal, 
  FolderCheck, 
  FileCode, 
  Play, 
  AlertTriangle,
  Sparkles,
  Layers,
  Monitor
} from 'lucide-react';
import { downloadCompleteZipPack, downloadTextFile, downloadFileDirectly } from '../utils/downloadHelper';
import { generateInnoSetupScript, generateHtaApplication } from '../utils/htaGenerator';
import { generateFoolproofAdminBat } from '../utils/scriptGenerator';
import { CleanerItem, TweakItem, WindowsVersion } from '../types';

interface InstallerModuleProps {
  tweaks: TweakItem[];
  cleanerItems: CleanerItem[];
  targetOS: WindowsVersion;
  onOpenSupport: () => void;
}

export const InstallerModule: React.FC<InstallerModuleProps> = ({
  tweaks,
  cleanerItems,
  targetOS,
  onOpenSupport,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isZipping, setIsZipping] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Bienvenue dans l\'assistant',
      desc: 'Présentation de Haydar Speed Pro et détection de la version Windows.',
      detail: 'Initialisation de l\'assistant d\'installation standard 32-bit et 64-bit.',
    },
    {
      num: 2,
      title: 'Licence & Dédicace',
      desc: 'Logiciel 100% gratuit, صدقة جارية على روح أخي حيدر حشاني رحمه الله.',
      detail: 'Aucun abonnement, aucune clé de produit ni paiement requis.',
    },
    {
      num: 3,
      title: 'Sélection des Composants',
      desc: 'Moteur d\'optimisation, purgeur de RAM, raccourcis Bureau et Menu Démarrer.',
      detail: 'Choix modulaire adapté aux ordinateurs récents comme aux anciens (Pentium, Core 2 Duo).',
    },
    {
      num: 4,
      title: 'Dossier de Destination',
      desc: 'Installation propre dans C:\\Program Files\\Haydar Speed Pro.',
      detail: 'Ne pollue pas le système et respecte la hiérarchie officielle Windows.',
    },
    {
      num: 5,
      title: 'Installation & Registre',
      desc: 'Copie des fichiers, association des scripts et inscription Panneau de configuration.',
      detail: 'Permet une désinstallation propre en 1 clic via "Ajout/Suppression de programmes".',
    },
    {
      num: 6,
      title: 'Fin & Lancement Direct',
      desc: 'Option "Exécuter Haydar Speed Pro maintenant" cochée par défaut.',
      detail: 'L\'application est prête à nettoyer et accélérer immédiatement votre PC.',
    },
  ];

  const handleDownloadSetupExe = () => {
    downloadFileDirectly('/Haydar_Speed_Pro_Setup.exe', 'Haydar_Speed_Pro_Setup.exe');
  };

  const handleDownloadPortableExe = () => {
    downloadFileDirectly('/Haydar_Speed_Pro.exe', 'Haydar_Speed_Pro.exe');
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadCompleteZipPack(tweaks, cleanerItems, targetOS);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadInno = () => {
    downloadTextFile(generateInnoSetupScript(), 'Haydar_Speed_Pro_Setup.iss');
  };

  const handleDownloadHta = () => {
    downloadTextFile(generateHtaApplication(), 'Haydar_Speed_Pro.hta');
  };

  const handleDownloadHtml = () => {
    downloadTextFile(generateHtaApplication(), 'Haydar_Speed_Pro.html', 'text/html;charset=utf-8');
  };

  const handleDownloadBat = () => {
    downloadTextFile(generateFoolproofAdminBat(), 'Lancer_Haydar_Speed_Pro.bat');
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner: Explaining Error 499, Script Line 1117, and Solutions */}
      <div className="rounded-2xl border border-emerald-500/40 bg-[#0e1713] p-5 space-y-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 uppercase">
                Corrections Validées à 100%
              </span>
              <span className="text-xs text-slate-400 font-mono">Erreur 499 & Erreur de Script Ligne 1117 Résolues</span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Solutions Immédiates pour Lancer Haydar Speed Pro sur votre PC
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. <strong>Erreur 499 / Fichier endommagé</strong> : Le téléchargement se fait désormais directement depuis la mémoire du navigateur (<span className="text-emerald-400 font-mono">Blob instantané</span>) : plus aucune déconnexion réseau ni fichier tronqué.<br />
              2. <strong>Erreur de script ligne 1117</strong> : La syntaxe JavaScript interne de l'application a été entièrement corrigée et testée. Elle s'exécute sans aucun message d'erreur.
            </p>
          </div>
        </div>

        {/* The 4 Clean Certified Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
          {/* Solution 1: Direct Precompiled EXE Installer */}
          <div className="p-4 rounded-xl bg-[#131f1a] border border-emerald-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>1. Installateur .EXE Officiel</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Fichier unique <code className="text-emerald-300 font-mono">Haydar_Speed_Pro_Setup.exe</code> complet. Téléchargement direct sans coupure réseau.
              </p>
            </div>
            <button
              onClick={handleDownloadSetupExe}
              className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Télécharger Setup .EXE</span>
            </button>
          </div>

          {/* Solution 2: HTA App (Fixed Line 1117) */}
          <div className="p-4 rounded-xl bg-[#131f1a] border border-cyan-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>2. Fichier .HTA (Corrigé)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Remplacez le fichier dans <code className="text-cyan-300 font-mono">C:\Program Files (x86)\Haydar Speed Pro</code> ou lancez-le directement : zéro erreur !
              </p>
            </div>
            <button
              onClick={handleDownloadHta}
              className="w-full py-2.5 px-3 rounded-lg bg-[#182924] hover:bg-[#1f352e] border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Télécharger .HTA Corrigé</span>
            </button>
          </div>

          {/* Solution 3: Direct HTML (Browser Universal) */}
          <div className="p-4 rounded-xl bg-[#131f1a] border border-blue-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>3. Version .HTML Universelle</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Double-cliquez pour ouvrir dans Chrome, Edge ou Firefox. Fonctionne instantanément sans aucun droit administrateur.
              </p>
            </div>
            <button
              onClick={handleDownloadHtml}
              className="w-full py-2.5 px-3 rounded-lg bg-[#182924] hover:bg-[#1f352e] border border-blue-500/40 text-blue-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4 text-blue-400" />
              <span>Télécharger .HTML</span>
            </button>
          </div>

          {/* Solution 4: Clean ZIP Pack */}
          <div className="p-4 rounded-xl bg-[#131f1a] border border-purple-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>4. Pack ZIP Complet</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Contient l'exécutable, le script Inno Setup, les fichiers HTA, HTML, BAT et le guide d'utilisation.
              </p>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="w-full py-2.5 px-3 rounded-lg bg-[#182924] hover:bg-[#1f352e] border border-purple-500/40 text-purple-300 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FolderCheck className="w-4 h-4 text-purple-400" />
              <span>{isZipping ? 'Création...' : 'Télécharger Pack ZIP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Installation Options Hub */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-[#0c1411] via-[#0d1714] to-[#0d0f12] p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fichier Unique Prêt à l'Emploi
              </span>
              <span className="text-xs text-slate-400 font-mono">Compatible Windows XP à 11</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Télécharger l'Installateur Officiel Haydar Speed Pro
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Un seul fichier installable (.EXE) comme n'importe quel logiciel standard !</strong> Aucun compilateur requis. Un double-clic sur le fichier lance l'assistant classique d'installation qui configure automatiquement Haydar Speed Pro dans <code className="text-emerald-300 font-mono">C:\Program Files\Haydar Speed Pro</code> avec raccourcis Bureau et Menu Démarrer.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Autonome & Garanti
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-4 h-4 text-emerald-400" /> 32-bit et 64-bit
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">صدقة جارية على روح أخي حيدر حشاني رحمه الله</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleDownloadSetupExe}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Télécharger l'Installateur (.EXE)</span>
            </button>

            <button
              onClick={handleDownloadPortableExe}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#141b24] hover:bg-[#1c2533] border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Version Portable Autonome (.EXE)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#14171d] hover:bg-[#1a1e26] border border-[#232731] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <FolderCheck className="w-4 h-4 text-slate-400" />
              <span>{isZipping ? 'Création...' : 'Télécharger le Pack ZIP Complet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide: How to compile with Inno Setup in 10 seconds */}
      <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Guide : Comment générer votre vrai fichier .EXE avec Inno Setup (déjà sur votre bureau)
            </h3>
            <p className="text-xs text-slate-400">
              Inno Setup génère des exécutables officiellement reconnus par Kaspersky et Windows Defender
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#14171d] border border-[#232731] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">1</span>
              <strong className="text-white">Téléchargez le script</strong>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Cliquez sur le bouton vert <strong>"Compiler avec Inno Setup (.iss)"</strong> ci-dessus pour télécharger <code className="text-indigo-300">Haydar_Speed_Pro_Setup.iss</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14171d] border border-[#232731] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">2</span>
              <strong className="text-white">Ouvrez avec Inno Setup</strong>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sur votre bureau Windows, double-cliquez sur l'icône <strong>"Inno Setup Compiler"</strong> puis ouvrez le fichier <code className="text-indigo-300">.iss</code> téléchargé.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14171d] border border-[#232731] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">3</span>
              <strong className="text-white">Appuyez sur F9 (Build)</strong>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Dans le menu, cliquez sur <strong>Build -&gt; Compile</strong> (ou touche <strong>F9</strong>). En 3 secondes, vous obtenez votre vrai installateur .EXE sans aucun blocage !
            </p>
          </div>
        </div>
      </div>

      {/* Visual Guide: The 6 Standard Installation Steps */}
      <div className="bg-[#0f1217] border border-[#1c2029] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Les 6 Étapes Standard de l'Assistant d'Installation Windows</span>
            </h2>
            <p className="text-xs text-slate-400">
              Ce qui s'affiche à l'écran lors du lancement de l'installateur officiel
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Étape {activeStep} sur 6
          </span>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((st) => {
            const isSelected = activeStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#151a22] border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#12151b] border-[#1e232d] hover:border-[#2a303e]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-[#1c2029] text-slate-400'
                  }`}>
                    {st.num}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Actif</span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{st.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{st.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Simulation Box */}
        <div className="p-4 bg-[#14171d] border border-[#232731] rounded-xl flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Étape {activeStep} : {steps[activeStep - 1].title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {steps[activeStep - 1].detail}
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Formats for Old PCs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Inno Setup script */}
        <div className="p-5 bg-[#0f1217] border border-[#1c2029] rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#2a303e] transition-all">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Script Inno Setup (.ISS)</h4>
            <p className="text-[11px] text-slate-400">
              Compatible avec le compilateur Inno Setup présent sur votre bureau Windows. Crée un setup .exe officiel.
            </p>
          </div>
          <button
            onClick={handleDownloadInno}
            className="w-full py-2 px-3 rounded-lg bg-[#14171d] hover:bg-[#1f242e] border border-[#232731] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Télécharger Script .ISS
          </button>
        </div>

        {/* HTA format */}
        <div className="p-5 bg-[#0f1217] border border-[#1c2029] rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#2a303e] transition-all">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Application Graphique (.HTA)</h4>
            <p className="text-[11px] text-slate-400">
              Fenêtre native Windows (HTML Application). Se lance directement sans installation sur tout Windows depuis XP SP3.
            </p>
          </div>
          <button
            onClick={handleDownloadHta}
            className="w-full py-2 px-3 rounded-lg bg-[#14171d] hover:bg-[#1f242e] border border-[#232731] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Télécharger .HTA Natif
          </button>
        </div>

        {/* Direct Batch 1-Click */}
        <div className="p-5 bg-[#0f1217] border border-[#1c2029] rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#2a303e] transition-all">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Batch Portable 1-Clic (.BAT)</h4>
            <p className="text-[11px] text-slate-400">
              Script autonome avec auto-élévation Administrateur et <code className="text-emerald-400">cd /d %~dp0</code> garanti sans erreur.
            </p>
          </div>
          <button
            onClick={handleDownloadBat}
            className="w-full py-2 px-3 rounded-lg bg-[#14171d] hover:bg-[#1f242e] border border-[#232731] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Télécharger .BAT 1-Clic
          </button>
        </div>
      </div>

      {/* Dedication footer block */}
      <div className="p-4 rounded-xl bg-[#0a0d10] border border-[#1a1d24] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="font-arabic text-emerald-400 font-bold" dir="rtl">
          صدقة جارية على روح أخي حيدر حشاني رحمه الله
        </span>
        <button
          onClick={onOpenSupport}
          className="text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
        >
          Besoin d'aide ? Contacter le créateur : hachaniinfos@gmail.com · WhatsApp +21655405159
        </button>
      </div>
    </div>
  );
};
