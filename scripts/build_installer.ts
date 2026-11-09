import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';
import {
  generateRegistryBackupFile,
  generateReadmeTxt
} from '../src/utils/scriptGenerator';

const rootDir = process.cwd();
const payloadDir = '/tmp/haydar_payload';
const publicDir = path.join(rootDir, 'public');

function hasCommand(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function buildStandaloneReactHtml(): Promise<string> {
  console.log('1. Compilation de l\'application React + Tailwind + Recharts en fichier HTML5 unique (100% Identique à l\'Aperçu)...');

  // Find compiled Tailwind CSS in dist/assets
  const distAssetsDir = path.join(rootDir, 'dist', 'assets');
  let cssContent = '';
  if (fs.existsSync(distAssetsDir)) {
    const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.css'));
    if (cssFiles.length > 0) {
      cssContent = fs.readFileSync(path.join(distAssetsDir, cssFiles[0]), 'utf8');
    }
  }

  // Ensure calligraphy and gold-on-black classes are always present in standalone HTML
  const extraCalligraphyCss = `
  .font-arabic {
    font-family: 'Amiri', 'Aref Ruqaa', 'Cairo', 'Traditional Arabic', 'Segoe UI', Tahoma, serif;
  }
  .font-calligraphy {
    font-family: 'Aref Ruqaa', 'Amiri', 'Traditional Arabic', 'Arabic Typesetting', 'Cairo', serif;
  }
  .calligraphy-gold-black {
    color: #ffd700;
    text-shadow:
      -1.5px -1.5px 0 #000000,
       1.5px -1.5px 0 #000000,
      -1.5px  1.5px 0 #000000,
       1.5px  1.5px 0 #000000,
       0px    2px   4px #000000,
       0px    0px   12px rgba(245, 158, 11, 0.55);
  }
  `;

  const result = await esbuild.build({
    entryPoints: [path.join(rootDir, 'src/main.tsx')],
    bundle: true,
    write: false,
    format: 'iife',
    minify: true,
    target: ['es2020'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    plugins: [
      {
        name: 'stub-embedded-and-css',
        setup(build) {
          build.onResolve({ filter: /embeddedExe/ }, () => ({
            path: 'embeddedExe',
            namespace: 'stub-embedded',
          }));
          build.onLoad({ filter: /.*/, namespace: 'stub-embedded' }, () => ({
            contents: `
              export const HAYDAR_SETUP_EXE_BASE64 = "";
              export const HAYDAR_PORTABLE_EXE_BASE64 = "";
              export const HAYDAR_STANDALONE_HTML_BASE64 = "";
            `,
            loader: 'ts',
          }));
          build.onLoad({ filter: /\.css$/ }, () => ({
            contents: '',
            loader: 'text',
          }));
        },
      },
    ],
  });

  let rawJs = result.outputFiles[0].text;

  // Inline the attached creator photo & Douaa MP3 as single base64 data URI variables so offline file:/// HTML & EXE always work without network
  const photoRelPath = '/assets/aistudio/a3f0ca96-711d-4eb3-a43a-b3df7ecb2200_0881c12a.png';
  const photoDiskPath = path.join(publicDir, 'assets/aistudio/a3f0ca96-711d-4eb3-a43a-b3df7ecb2200_0881c12a.png');
  let avatarScriptPrefix = '';
  if (fs.existsSync(photoDiskPath)) {
    const photoBase64 = fs.readFileSync(photoDiskPath).toString('base64');
    const dataUri = `data:image/png;base64,${photoBase64}`;
    avatarScriptPrefix += `window.__HAYDAR_PHOTO_URI__=${JSON.stringify(dataUri)};`;
    rawJs = rawJs.split(JSON.stringify(photoRelPath)).join('window.__HAYDAR_PHOTO_URI__');
  }

  const douaaDiskPath = path.join(publicDir, 'assets/aistudio/doaa-al-maiet-allahum-eghfir-lh_f4c1b1ca.mp3');
  if (fs.existsSync(douaaDiskPath)) {
    const douaaBase64 = fs.readFileSync(douaaDiskPath).toString('base64');
    const douaaDataUri = `data:audio/mpeg;base64,${douaaBase64}`;
    avatarScriptPrefix += `window.__HAYDAR_DOUAA_URI__=${JSON.stringify(douaaDataUri)};`;
  }

  const safeJs = (avatarScriptPrefix + rawJs).replace(/<\/script>/gi, '<\\/script>');

  const standaloneHtml = `<!doctype html>
<html lang="fr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Haydar Speed Pro — Optimiseur &amp; Accélérateur Windows</title>
    <meta name="theme-color" content="#10b981" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Cairo:wght@400;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&display=swap" rel="stylesheet" />
    <style>${cssContent}\n${extraCalligraphyCss}</style>
  </head>
  <body class="bg-[#07090c] text-slate-100 antialiased">
    <div id="root"></div>
    <script>window.__HAYDAR_INSTALLED_APP__ = true;</script>
    <script>${safeJs}</script>
  </body>
</html>`;

  return standaloneHtml;
}

async function main() {
  if (!hasCommand('i686-w64-mingw32-gcc') || !hasCommand('makensis')) {
    console.log('Compilateurs MinGW/NSIS non détectés dans ce conteneur, conservation des binaires précompilés existants.');
    process.exit(0);
  }

  if (!fs.existsSync(payloadDir)) {
    fs.mkdirSync(payloadDir, { recursive: true });
  }

  const standaloneHtml = await buildStandaloneReactHtml();
  fs.writeFileSync(path.join(payloadDir, 'Haydar_Speed_Pro.html'), standaloneHtml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'Haydar_Speed_Pro.html'), standaloneHtml, 'utf8');

  console.log('2. Préparation des fichiers certifiés propres pour Haydar Speed Pro...');
  const bom = '\uFEFF';
  fs.writeFileSync(path.join(payloadDir, 'Haydar_Speed_Pro_Registry_Backup.reg'), bom + generateRegistryBackupFile(), 'utf8');
  fs.writeFileSync(path.join(payloadDir, 'LISEZMOI_Guide_Utilisation.txt'), bom + generateReadmeTxt(), 'utf8');
  fs.copyFileSync(path.join(publicDir, 'app.ico'), path.join(payloadDir, 'app.ico'));

  console.log('3. Compilation du lanceur natif Win32 Haydar_Speed_Pro.exe (Zéro Script / Zéro Alerte AV)...');
  execSync('i686-w64-mingw32-windres /app/applet/scripts/haydar_app.rc -O coff -o /tmp/haydar_app.res', { stdio: 'inherit' });
  execSync(
    'i686-w64-mingw32-gcc -O2 -mwindows /app/applet/scripts/haydar_launcher.c /tmp/haydar_app.res -o ' +
      path.join(payloadDir, 'Haydar_Speed_Pro.exe') +
      ' -lshell32 -lwinmm -lgdi32 -luser32 -ladvapi32 -lkernel32',
    { stdio: 'inherit' }
  );

  fs.copyFileSync(path.join(payloadDir, 'Haydar_Speed_Pro.exe'), path.join(publicDir, 'Haydar_Speed_Pro.exe'));

  console.log('4. Création du script d\'installation NSIS officiel (Embarquant l\'interface 100% identique à l\'aperçu)...');
  const nsisScript = `
!include "MUI2.nsh"

Name "Haydar Speed Pro"
Caption "Installation de Haydar Speed Pro 2.5 - Suite Universelle Windows"
OutFile "${path.join(publicDir, 'Haydar_Speed_Pro_Setup.exe')}"
InstallDir "$LOCALAPPDATA\\Programs\\Haydar Speed Pro"
InstallDirRegKey HKCU "Software\\HaydarSpeedPro" "InstallDir"
RequestExecutionLevel user

SetCompressor zlib

VIProductVersion "2.5.0.0"
VIAddVersionKey "ProductName" "Haydar Speed Pro"
VIAddVersionKey "CompanyName" "Haider Hachani Charity"
VIAddVersionKey "FileDescription" "Installateur Officiel Haydar Speed Pro v2.5"
VIAddVersionKey "FileVersion" "2.5.0.0"
VIAddVersionKey "ProductVersion" "2.5.0.0"
VIAddVersionKey "LegalCopyright" "Sadaqa Jariya - Haider Hachani"

!define MUI_ICON "${path.join(payloadDir, 'app.ico')}"
!define MUI_UNICON "${path.join(payloadDir, 'app.ico')}"
!define MUI_ABORTWARNING

; Welcome Page
!define MUI_WELCOMEPAGE_TITLE "Bienvenue dans l'installation de Haydar Speed Pro 2.5"
!define MUI_WELCOMEPAGE_TEXT "Cet assistant va installer l'application complète Haydar Speed Pro (interface 100% identique à l'aperçu avec jauges et graphique temps réel 60s) sur votre ordinateur Windows.\\r\\n\\r\\nCompatible Windows XP SP3, Vista, 7, 8, 10 et 11 (32-bit & 64-bit) sans droits administrateur requis.\\r\\n\\r\\nصدقة جارية على روح أخي حيدر حشاني رحمه الله\\r\\nContact : hachaniinfos@gmail.com - WhatsApp : +21655405159"
!insertmacro MUI_PAGE_WELCOME

; Directory Page
!insertmacro MUI_PAGE_DIRECTORY

; InstFiles Page
!insertmacro MUI_PAGE_INSTFILES

; Finish Page
!define MUI_FINISHPAGE_RUN "$INSTDIR\\Haydar_Speed_Pro.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Lancer Haydar Speed Pro v2.5 maintenant"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\\LISEZMOI_Guide_Utilisation.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Afficher le guide d'utilisation"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "French"

Section "Haydar Speed Pro (Application Complète)" SecCore
  SectionIn RO
  SetOutPath "$INSTDIR"

  File "${payloadDir}/Haydar_Speed_Pro.exe"
  File "${payloadDir}/Haydar_Speed_Pro.html"
  File "${payloadDir}/Haydar_Speed_Pro_Registry_Backup.reg"
  File "${payloadDir}/LISEZMOI_Guide_Utilisation.txt"
  File "${payloadDir}/app.ico"

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\\uninstall.exe"

  ; Desktop Shortcut
  CreateShortCut "$DESKTOP\\Haydar Speed Pro.lnk" "$INSTDIR\\Haydar_Speed_Pro.exe" "" "$INSTDIR\\app.ico" 0

  ; Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\\Haydar Speed Pro"
  CreateShortCut "$SMPROGRAMS\\Haydar Speed Pro\\Haydar Speed Pro.lnk" "$INSTDIR\\Haydar_Speed_Pro.exe" "" "$INSTDIR\\app.ico" 0
  CreateShortCut "$SMPROGRAMS\\Haydar Speed Pro\\Haydar Speed Pro (Navigateur).lnk" "$INSTDIR\\Haydar_Speed_Pro.html" "" "$INSTDIR\\app.ico" 0
  CreateShortCut "$SMPROGRAMS\\Haydar Speed Pro\\Optimisation 1-Clic.lnk" "$INSTDIR\\Haydar_Speed_Pro.exe" "/optimize" "$INSTDIR\\app.ico" 0
  CreateShortCut "$SMPROGRAMS\\Haydar Speed Pro\\Vider la RAM.lnk" "$INSTDIR\\Haydar_Speed_Pro.exe" "/ram" "$INSTDIR\\app.ico" 0
  CreateShortCut "$SMPROGRAMS\\Haydar Speed Pro\\Désinstaller Haydar Speed Pro.lnk" "$INSTDIR\\uninstall.exe" "" "" 0

  ; Register in Windows CurrentUser Uninstall (No UAC/AV block)
  WriteRegStr HKCU "Software\\HaydarSpeedPro" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "DisplayName" "Haydar Speed Pro 2.5"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "DisplayVersion" "2.5.0"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "Publisher" "Haider Hachani Charity"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "DisplayIcon" "$INSTDIR\\app.ico"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "UninstallString" '"$INSTDIR\\uninstall.exe"'
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "HelpLink" "mailto:hachaniinfos@gmail.com"
  WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "NoModify" 1
  WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro" "NoRepair" 1
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\\Haydar Speed Pro.lnk"
  Delete "$SMPROGRAMS\\Haydar Speed Pro\\Haydar Speed Pro.lnk"
  Delete "$SMPROGRAMS\\Haydar Speed Pro\\Haydar Speed Pro (Navigateur).lnk"
  Delete "$SMPROGRAMS\\Haydar Speed Pro\\Optimisation 1-Clic.lnk"
  Delete "$SMPROGRAMS\\Haydar Speed Pro\\Vider la RAM.lnk"
  Delete "$SMPROGRAMS\\Haydar Speed Pro\\Désinstaller Haydar Speed Pro.lnk"
  RMDir "$SMPROGRAMS\\Haydar Speed Pro"

  Delete "$INSTDIR\\Haydar_Speed_Pro.exe"
  Delete "$INSTDIR\\Haydar_Speed_Pro.html"
  Delete "$INSTDIR\\Haydar_Speed_Pro_Registry_Backup.reg"
  Delete "$INSTDIR\\LISEZMOI_Guide_Utilisation.txt"
  Delete "$INSTDIR\\app.ico"
  Delete "$INSTDIR\\uninstall.exe"
  RMDir "$INSTDIR"

  DeleteRegKey HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\HaydarSpeedPro"
  DeleteRegKey HKCU "Software\\HaydarSpeedPro"
SectionEnd
`;

  fs.writeFileSync('/tmp/installer.nsi', nsisScript, 'utf8');

  console.log('5. Compilation de l\'installateur officiel Haydar_Speed_Pro_Setup.exe avec NSIS...');
  execSync('makensis /tmp/installer.nsi', { stdio: 'inherit' });

  const setupStats = fs.statSync(path.join(publicDir, 'Haydar_Speed_Pro_Setup.exe'));
  const exeStats = fs.statSync(path.join(publicDir, 'Haydar_Speed_Pro.exe'));
  const htmlStats = fs.statSync(path.join(publicDir, 'Haydar_Speed_Pro.html'));
  console.log('✓ SUCCÈS ! Les fichiers suivants ont été générés dans /public :');
  console.log(`- Haydar_Speed_Pro_Setup.exe : ${Math.round(setupStats.size / 1024)} Ko`);
  console.log(`- Haydar_Speed_Pro.exe : ${Math.round(exeStats.size / 1024)} Ko`);
  console.log(`- Haydar_Speed_Pro.html : ${Math.round(htmlStats.size / 1024)} Ko`);

  console.log('6. Mise à jour de src/data/embeddedExe.ts...');
  const setupBase64 = fs.readFileSync(path.join(publicDir, 'Haydar_Speed_Pro_Setup.exe')).toString('base64');
  const portableBase64 = fs.readFileSync(path.join(publicDir, 'Haydar_Speed_Pro.exe')).toString('base64');
  const htmlBase64 = fs.readFileSync(path.join(publicDir, 'Haydar_Speed_Pro.html')).toString('base64');
  const embeddedTs = `// Embedded Windows binaries & Standalone React HTML compiled with esbuild, MinGW-w64 & NSIS
// Allows instant zero-network download directly from memory in browser Blob
export const HAYDAR_SETUP_EXE_BASE64 = "${setupBase64}";
export const HAYDAR_PORTABLE_EXE_BASE64 = "${portableBase64}";
export const HAYDAR_STANDALONE_HTML_BASE64 = "${htmlBase64}";
`;
  fs.writeFileSync(path.join(rootDir, 'src/data/embeddedExe.ts'), embeddedTs, 'utf8');
  console.log('✓ embeddedExe.ts mis à jour avec succès !');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
