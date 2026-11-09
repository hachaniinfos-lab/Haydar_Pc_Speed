import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Clock, 
  Check, 
  FileCheck, 
  AlertCircle,
  Database,
  FileText
} from 'lucide-react';
import { RestoreSnapshot, WindowsVersion } from '../types';
import { downloadTextFile } from '../utils/downloadHelper';
import { generateRestoreBatchScript, generateRegistryBackupFile } from '../utils/scriptGenerator';

interface BackupRestoreModuleProps {
  snapshots: RestoreSnapshot[];
  onCreateSnapshot: (label: string) => void;
  onResetAllDefaults: () => void;
  targetOS: WindowsVersion;
}

export const BackupRestoreModule: React.FC<BackupRestoreModuleProps> = ({
  snapshots,
  onCreateSnapshot,
  onResetAllDefaults,
  targetOS,
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCreateSnapshot = () => {
    const label = snapshotName.trim() || `Point de sauvegarde Haydar Speed Pro (${new Date().toLocaleTimeString('fr-FR')})`;
    onCreateSnapshot(label);
    setSnapshotName('');
    setStatusMessage('Point de sauvegarde enregistré avec succès.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDownloadRegistryBackup = () => {
    const label = snapshotName.trim() || `Cliché Registre Haydar Speed Pro (${new Date().toLocaleTimeString('fr-FR')})`;
    const regContent = generateRegistryBackupFile(label);
    downloadTextFile(regContent, 'Haydar_Speed_Pro_Registry_Backup.reg');
    onCreateSnapshot(`Registry Backup .REG (${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')})`);
    setStatusMessage('Fichier de sauvegarde du Registre (.reg) généré et téléchargé avec succès !');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDownloadRestoreBatch = () => {
    const script = generateRestoreBatchScript();
    downloadTextFile(script, 'Haydar_Speed_Pro_Restaurer_Defauts.bat');
  };

  const handleConfirmRestore = () => {
    onResetAllDefaults();
    setShowRestoreModal(false);
    setStatusMessage('Tous les paramètres ont été réinitialisés aux valeurs Windows d\'origine.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Sécurité & Réversibilité Totale
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Zéro Risque</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Sauvegarde & Restauration Système
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Haydar Speed Pro ne supprime aucun fichier critique du système. Toutes les modifications du registre et des services peuvent être annulées en 1 clic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Dedicated Registry Backup Button */}
            <button
              onClick={handleDownloadRegistryBackup}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-sm shadow-cyan-500/20 transition-all cursor-pointer"
              title="Générer un fichier .reg contenant un instantané complet des ruches système clés"
            >
              <Database className="w-3.5 h-3.5 text-slate-950" />
              <span>Registry Backup (.reg)</span>
            </button>

            <button
              onClick={handleDownloadRestoreBatch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exporter Script Undo (.bat)</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 3-Column Restoration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Custom In-App Snapshot */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">
                Point de sauvegarde interne
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mémorise l'état actuel de tous vos services, clés de registre et éléments de démarrage avant d'appliquer de nouvelles optimisations.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Ex: Avant désactivation SysMain..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleCreateSnapshot}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              Créer Snapshot
            </button>
          </div>
        </div>

        {/* Card 2: Registry Backup (.reg) - Key System Optimization Hives */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-900/40 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Registry Backup (.reg)
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Génère un instantané <code className="text-cyan-300">.reg</code> officiel des ruches système clés modifiées (Bureau, Mémoire vive, Moteur d'Accélération Ai, Multimédia et QoS). Double-cliquez dessus sous Windows pour restaurer en 1 clic.
            </p>
          </div>

          <button
            onClick={handleDownloadRegistryBackup}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger Registry Backup (.reg)</span>
          </button>
        </div>

        {/* Card 3: Factory Reset Card */}
        <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">
                Rétablir les paramètres d'origine
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Annule toutes les optimisations appliquées et réactive les paramètres Windows par défaut (délai menus 400ms, Superfetch, télémétrie).
            </p>
          </div>

          <button
            onClick={() => setShowRestoreModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les paramètres par défaut</span>
          </button>
        </div>
      </div>

      {/* Snapshots History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Historique des sauvegardes ({snapshots.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Horodaté et chiffré</span>
        </div>

        <div className="divide-y divide-slate-800">
          {snapshots.map((snap) => (
            <div key={snap.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">{snap.label}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{snap.timestamp}</span>
                  <span>·</span>
                  <span>{snap.tweaksCount} réglages sauvegardés</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 font-mono">Prêt pour restauration</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Confirmer la restauration d'origine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Voulez-vous vraiment réinitialiser toutes les clés du Registre, réactiver les applications au démarrage et remettre les paramètres d'origine de Windows ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Oui, réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
