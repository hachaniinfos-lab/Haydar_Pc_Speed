import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  Check, 
  Copy, 
  Archive, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { CleanerItem, TweakItem, WindowsVersion } from '../types';
import { 
  downloadCompleteZipPack, 
  downloadTextFile,
  downloadFileDirectly 
} from '../utils/downloadHelper';
import { 
  generateMasterBatchScript, 
  generateRamPurgeVbs, 
  generateRestoreBatchScript,
  generateExeCompilerBat,
  generateIExpressSed,
  generateFoolproofAdminBat
} from '../utils/scriptGenerator';
import {
  generateHtaApplication,
  generateInnoSetupScript
} from '../utils/htaGenerator';

interface ExeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tweaks: TweakItem[];
  cleanerItems: CleanerItem[];
  targetOS: WindowsVersion;
}

export const ExeGeneratorModal: React.FC<ExeGeneratorModalProps> = ({
  isOpen,
  onClose,
  tweaks,
  cleanerItems,
  targetOS,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'download' | 'tutorial' | 'code'>('download');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const masterBatCode = generateMasterBatchScript(tweaks, cleanerItems, targetOS);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(masterBatCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleDownloadHta = () => {
    downloadTextFile(generateHtaApplication(), 'Haydar_Speed_Pro.hta');
  };

  const handleDownloadFoolproofBat = () => {
    downloadTextFile(generateFoolproofAdminBat(), 'Lancer_Optimisation_1Clic.bat');
  };

  const handleDownloadInnoScript = () => {
    downloadTextFile(generateInnoSetupScript(), 'Haydar_Speed_Pro_Setup.iss');
  };

  const handleDownloadMasterBat = () => {
    downloadTextFile(masterBatCode, 'Haydar_Speed_Pro.bat');
  };

  const handleDownloadRamVbs = () => {
    downloadTextFile(generateRamPurgeVbs(), 'Liberer_RAM.vbs');
  };

  const handleDownloadRestoreBat = () => {
    downloadTextFile(generateRestoreBatchScript(), 'Restaurer_Defaut.bat');
  };

  const handleDownloadCompilerBat = () => {
    downloadTextFile(generateExeCompilerBat(), 'Compiler_en_EXE.bat');
  };

  const handleDownloadSed = () => {
    downloadTextFile(generateIExpressSed('Haydar_Speed_Pro.bat', 'Haydar_Speed_Pro.exe'), 'Haydar_Speed_Pro.sed');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Solutions Exécutables Windows (.EXE / .HTA / .BAT)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  XP → Win 11
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                100% Autonome · Compatible 32-bit et 64-bit · Zéro licence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveSubTab('download')}
            className={`pb-3 font-semibold transition-colors border-b-2 ${
              activeSubTab === 'download'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Téléchargements Directs
          </button>
          <button
            onClick={() => setActiveSubTab('tutorial')}
            className={`pb-3 font-semibold transition-colors border-b-2 ${
              activeSubTab === 'tutorial'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Guide & Solutions
          </button>
          <button
            onClick={() => setActiveSubTab('code')}
            className={`pb-3 font-semibold transition-colors border-b-2 ${
              activeSubTab === 'code'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspecteur de Code Source (.BAT)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeSubTab === 'download' && (
            <div className="space-y-6">
              {/* TOP SOLUTION 0: SINGLE FILE .EXE INSTALLER */}
              <div className="rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-950/60 via-[#14171d] to-[#14171d] p-5 space-y-4 shadow-xl shadow-emerald-950/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                        OFFICIEL • FICHIER UNIQUE INSTALLABLE (.EXE)
                      </span>
                      <h3 className="text-base font-extrabold text-white">
                        Haydar_Speed_Pro_Setup.exe
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        221 Ko · Prêt à l'emploi
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Un seul fichier installable comme n'importe quel logiciel Windows !</strong> Aucun compilateur ni outil tiers requis : téléchargez, double-cliquez, et l'assistant installe automatiquement l'application dans <code className="text-emerald-300 font-mono">C:\Program Files\Haydar Speed Pro</code> avec raccourcis Bureau et Menu Démarrer.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-emerald-400 font-medium pt-1">
                      <span>✓ 100% Autonome (1 seul fichier .EXE)</span>
                      <span>✓ Assistant officiel NSIS en français</span>
                      <span>✓ Windows XP SP3 à 11 (32/64 bits)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleDownloadSetupExe}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[3]" />
                      <span>Télécharger l'Installateur (.EXE)</span>
                    </button>

                    <button
                      onClick={handleDownloadPortableExe}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1b2230] hover:bg-[#232c3e] border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Version Portable (Haydar_Speed_Pro.exe)</span>
                    </button>

                    <button
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-[11px] transition-colors"
                    >
                      <span>{isZipping ? 'Création...' : 'Ou télécharger tout le Pack (ZIP)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* TOP SOLUTION 1: HTA STANDALONE NATIVE APP */}
              <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-5 space-y-3 shadow-lg shadow-emerald-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        ★
                      </div>
                      <h3 className="text-base font-bold text-white">
                        Solution 2 : Application Portable Autonome (Haydar_Speed_Pro.hta)
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        Recommandé · Sans Compilation
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      L'application native Windows par excellence : <strong>aucun compilateur requis</strong>. Un simple double-clic dessus ouvre l'application dans sa propre fenêtre Windows autonome et applique toutes les optimisations !
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadHta}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-lg shadow-md shadow-emerald-500/20 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Haydar_Speed_Pro.hta</span>
                  </button>
                </div>
              </div>

              {/* TOP SOLUTION 2: FOOLPROOF 1-CLICK SCRIPT */}
              <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-5 space-y-3 shadow-lg shadow-cyan-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-base font-bold text-white">
                        Solution 2 : Script 1-Clic Garanti (Lancer_Optimisation_1Clic.bat)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Élévation Administrateur automatique sans aucun blocage UAC. Double-cliquez, cliquez sur « Oui », et l'accélération s'exécute en 10 secondes avec rapport visuel complet.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadFoolproofBat}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-md shadow-cyan-500/20 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Script 1-Clic</span>
                  </button>
                </div>
              </div>

              {/* TOP SOLUTION 3: INNO SETUP (USER HAS IT INSTALLED) */}
              <div className="rounded-xl border border-purple-500/40 bg-slate-900 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-bold text-white">
                        Solution 3 : Script Inno Setup (Haydar_Speed_Pro_Setup.iss)
                      </h3>
                      <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        Pour Inno Setup déjà installé sur votre PC
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Comme <strong>Inno Setup Compiler</strong> est déjà installé sur votre bureau : ouvrez ce fichier avec Inno Setup et cliquez sur « Compile » (touche F9) pour générer votre véritable fichier <strong>Haydar_Speed_Pro_Setup.exe</strong> officiel !
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadInnoScript}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded-lg transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger Script Inno Setup</span>
                  </button>
                </div>
              </div>

              {/* Primary Master Pack ZIP */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        Pack Complet Tout-en-un (.ZIP)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl">
                      Archive contenant tous les scripts, l'application HTA, le script Inno Setup, le nettoyeur de RAM et le script de restauration.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all shrink-0 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isZipping ? 'Création...' : 'Télécharger le Pack .ZIP'}</span>
                  </button>
                </div>
              </div>

              {/* Single Files Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-white">Liberer_RAM.vbs</h5>
                    <p className="text-[11px] text-slate-400">Purge de mémoire vive instantanée.</p>
                  </div>
                  <button
                    onClick={handleDownloadRamVbs}
                    className="w-full py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    Télécharger .VBS
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-white">Restaurer_Defaut.bat</h5>
                    <p className="text-[11px] text-slate-400">Restauration des valeurs Windows.</p>
                  </div>
                  <button
                    onClick={handleDownloadRestoreBat}
                    className="w-full py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    Télécharger Undo
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-white">Haydar_Speed_Pro.bat</h5>
                    <p className="text-[11px] text-slate-400">Script maître interactif.</p>
                  </div>
                  <button
                    onClick={handleDownloadMasterBat}
                    className="w-full py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    Télécharger .BAT
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'tutorial' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Comment obtenir un vrai fichier Haydar_Speed_Pro.exe sans risque</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Windows intègre depuis Windows XP jusqu'à Windows 11 un outil officiel de compilation certifié par Microsoft : <strong>IExpress</strong> (<code className="text-cyan-300">C:\Windows\System32\iexpress.exe</code>).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-white">Téléchargez le Pack ZIP</h4>
                  <p className="text-[11px] text-slate-400">
                    Décompressez le dossier ZIP sur le bureau de votre PC ou sur une clé USB.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-white">Lancez "Compiler_en_EXE.bat"</h4>
                  <p className="text-[11px] text-slate-400">
                    Faites un simple double-clic sur le fichier. Il appelle automatiquement IExpress avec le profil configuré.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-white">Votre .EXE est prêt !</h4>
                  <p className="text-[11px] text-slate-400">
                    Le fichier <strong>Haydar_Speed_Pro.exe</strong> apparaît instantanément dans votre dossier, 100% exécutable et portable !
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Haydar_Speed_Pro.bat ({masterBatCode.split('\n').length} lignes)
                </span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-800 bg-black p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{masterBatCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Compatible : XP SP3, Vista, 7, 8, 8.1, 10, 11 (32 et 64-bit)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
