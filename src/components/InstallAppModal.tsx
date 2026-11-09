import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Monitor, 
  Check, 
  FileCode, 
  HardDrive, 
  FolderCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generateHtaApplication, generateInnoSetupScript } from '../utils/htaGenerator';
import { downloadCompleteZipPack, downloadTextFile, downloadFileDirectly } from '../utils/downloadHelper';
import { generateAppLauncherBat, generateExeCompilerBat } from '../utils/scriptGenerator';
import { INITIAL_CLEANER_ITEMS, INITIAL_TWEAKS } from '../data/optimizerData';
import { Play, Terminal } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (isInstallable) {
      await install();
    }
  };

  const handleDownloadSetupExe = () => {
    downloadFileDirectly('/Haydar_Speed_Pro_Setup.exe', 'Haydar_Speed_Pro_Setup.exe');
    setDownloadSuccess('Haydar_Speed_Pro_Setup.exe téléchargé ! Double-cliquez dessus pour lancer l\'assistant d\'installation standard.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  const handleDownloadPortableExe = () => {
    downloadFileDirectly('/Haydar_Speed_Pro.exe', 'Haydar_Speed_Pro.exe');
    setDownloadSuccess('Haydar_Speed_Pro.exe téléchargé ! Double-cliquez dessus pour exécuter directement sans installation.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  const handleDownloadLauncherBat = () => {
    downloadTextFile(generateAppLauncherBat(), 'Lancer_Haydar_Speed_Pro.bat');
    setDownloadSuccess('Lancer_Haydar_Speed_Pro.bat téléchargé ! Double-cliquez dessus pour lancer l\'application.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadHtml = () => {
    downloadTextFile(generateHtaApplication(), 'Haydar_Speed_Pro.html', 'text/html;charset=utf-8');
    setDownloadSuccess('Haydar_Speed_Pro.html téléchargé ! Double-cliquez dessus pour ouvrir immédiatement.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadHta = () => {
    downloadTextFile(generateHtaApplication(), 'Haydar_Speed_Pro.hta');
    setDownloadSuccess('Haydar_Speed_Pro.hta téléchargé avec succès ! Double-cliquez dessus sous Windows.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadCompleteZipPack(INITIAL_TWEAKS, INITIAL_CLEANER_ITEMS, '10');
      setDownloadSuccess('Pack ZIP complet téléchargé ! Extrayez-le et double-cliquez sur Lancer_Haydar_Speed_Pro.bat.');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadIss = () => {
    downloadTextFile(generateInnoSetupScript(), 'Haydar_Speed_Pro_Setup.iss');
    setDownloadSuccess('Script Inno Setup téléchargé ! Ouvrez-le avec Inno Setup sur votre bureau puis appuyez sur F9.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleDownloadCompilerBat = () => {
    downloadTextFile(generateExeCompilerBat(), 'Compiler_en_EXE.bat');
    setDownloadSuccess('Compiler_en_EXE.bat (Version Corrigée) téléchargé ! Double-cliquez dessus pour générer votre .EXE.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f1217] border border-[#232731] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2029] bg-[#14171d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Installer & Lancer Haydar Speed Pro</h3>
              <p className="text-xs text-slate-400">Compatible Windows XP SP3, 7, 8, 10 et 11 (32-bit & 64-bit)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f242d] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-xs">
          {downloadSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Diagnostic & Troubleshooting banner */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-300 block text-xs">
                Erreur de compilation résolue :
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Le script <strong>Compiler_en_EXE.bat</strong> a été entièrement mis à niveau. Il détecte automatiquement <strong>Inno Setup</strong> sur votre PC ainsi que le compilateur natif C# Windows, et génère votre véritable exécutable sans aucune erreur de syntaxe !
              </p>
            </div>
          </div>

          {/* SOLUTION 1 (RECOMMENDED): OFFICIAL WINDOWS SETUP .EXE */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10b981]/20 via-[#14171d] to-[#14171d] border-2 border-[#10b981]/60 space-y-4 shadow-xl shadow-[#10b981]/15">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#10b981] text-[#020617]">
                  OFFICIEL • FICHIER UNIQUE INSTALLABLE
                </span>
                <span className="font-extrabold text-sm text-white">Haydar_Speed_Pro_Setup.exe (221 Ko)</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong>Un seul fichier installable comme n'importe quel logiciel Windows !</strong> Double-cliquez dessus sur votre PC pour lancer l'assistant standard qui installe l'application dans <code className="text-emerald-300 font-mono">C:\Program Files\Haydar Speed Pro</code> et ajoute les raccourcis sur votre Bureau et Menu Démarrer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleDownloadSetupExe}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                <span>Télécharger l'Installateur (.EXE)</span>
              </button>

              <button
                onClick={handleDownloadPortableExe}
                className="py-3 px-4 rounded-xl bg-[#1a2332] hover:bg-[#222e42] border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Version Portable (.EXE)</span>
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-[#1c2029]">
              <span>✓ Windows XP SP3, 7, 8, 10 et 11 (32 et 64-bit)</span>
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="text-emerald-400 hover:underline font-semibold"
              >
                {isZipping ? 'Création...' : 'Télécharger le Pack ZIP complet'}
              </button>
            </div>
          </div>

          {/* SOLUTION 2: DIRECT LAUNCHER BAT & HTML */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#14171d] border border-cyan-500/30 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    LANCEUR RAPIDE
                  </span>
                  <span className="font-bold text-xs text-white">Lancer_Haydar_Speed_Pro.bat</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Débloque la sécurité Windows et lance l'application en mode fenêtre dédiée via Edge ou Chrome.
                </p>
              </div>
              <button
                onClick={handleDownloadLauncherBat}
                className="w-full py-2 px-3 rounded-lg bg-[#1f242e] hover:bg-[#282e3b] text-cyan-400 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Télécharger le Lanceur .bat</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#14171d] border border-blue-500/30 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    FICHIER HTML
                  </span>
                  <span className="font-bold text-xs text-white">Haydar_Speed_Pro.html</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  S'ouvre avec double-clic dans votre navigateur habituel (Edge, Chrome, Firefox) sans aucune contrainte.
                </p>
              </div>
              <button
                onClick={handleDownloadHtml}
                className="w-full py-2 px-3 rounded-lg bg-[#1f242e] hover:bg-[#282e3b] text-blue-400 border border-blue-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <HardDrive className="w-4 h-4" />
                <span>Télécharger Haydar_Speed_Pro.html</span>
              </button>
            </div>
          </div>

          {/* SOLUTION 3: COMPILER EN .EXE & INNO SETUP */}
          <div className="p-4 rounded-xl bg-[#14171d] border border-purple-500/30 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  GÉNÉRATION .EXE OFFICIEL
                </span>
                <span className="font-bold text-sm text-white">Compilateur Automatique & Script Inno Setup</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Le nouveau script <strong>Compiler_en_EXE.bat</strong> détecte automatiquement <strong>Inno Setup Compiler</strong> sur votre bureau et utilise le compilateur C# natif de Windows pour générer un fichier .EXE 100% propre et non détecté par Kaspersky.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleDownloadCompilerBat}
                className="py-2.5 px-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Télécharger Compiler_en_EXE.bat (Corrigé)</span>
              </button>

              <button
                onClick={handleDownloadIss}
                className="py-2.5 px-3 rounded-xl bg-[#1f242e] hover:bg-[#282e3b] text-purple-400 border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                <span>Script Inno Setup (.iss)</span>
              </button>
            </div>
          </div>

          {/* SOLUTION 4: HTA FILE (NATIVE LEGACY) */}
          <div className="p-4 rounded-xl bg-[#14171d] border border-[#232731] space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VERSION HTA CORRIGÉE
                </span>
                <span className="font-bold text-sm text-white">Haydar_Speed_Pro.hta</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Application HTA sans BOM ni attributs bloquants. Double-cliquez dessus ou faites Clic Droit &gt; Ouvrir avec &gt; Microsoft (R) HTML Application host.
              </p>
            </div>

            <button
              onClick={handleDownloadHta}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1f242e] hover:bg-[#282e3b] text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>Télécharger Haydar_Speed_Pro.hta (Corrigé)</span>
            </button>
          </div>

          {/* SOLUTION 5: PWA Browser App Install */}
          <div className="p-4 rounded-xl bg-[#14171d] border border-[#232731] space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
                  MÉTHODE WEB DIRECTE
                </span>
                <span className="font-bold text-sm text-white">Installer comme Application Bureau (Chrome / Edge)</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Si vous visitez l'application depuis Microsoft Edge ou Chrome, cliquez pour installer Haydar Speed Pro directement sur votre Bureau Windows.
              </p>
            </div>

            <button
              onClick={handleInstallPWA}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1f242e] hover:bg-[#282e3b] text-slate-200 border border-[#333a48] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>{isInstalled ? 'Application Déjà Installée' : 'Installer l\'Application via le Navigateur'}</span>
            </button>
          </div>

          {/* Dedication footer */}
          <div className="p-3 bg-[#11141a] rounded-xl border border-[#1e232d] text-center space-y-1">
            <p className="font-arabic text-xs font-bold text-emerald-400" dir="rtl">
              صدقة جارية على روح أخي حيدر حشاني رحمه الله
            </p>
            <p className="text-[11px] text-slate-400">
              Contacter le créateur : <strong className="text-white">hachaniinfos@gmail.com</strong> · WhatsApp : <strong className="text-white">+21655405159</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1c2029] bg-[#14171d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1f242d] hover:bg-[#282e3a] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
