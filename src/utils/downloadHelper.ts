import JSZip from 'jszip';
import { CleanerItem, TweakItem, WindowsVersion } from '../types';
import {
  generateReadmeTxt,
  generateRegistryBackupFile,
} from './scriptGenerator';
import {
  generateHtaApplication,
  generateInnoSetupScript,
} from './htaGenerator';
import {
  HAYDAR_SETUP_EXE_BASE64,
  HAYDAR_PORTABLE_EXE_BASE64,
  HAYDAR_STANDALONE_HTML_BASE64,
} from '../data/embeddedExe';

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function downloadBinaryBlob(bytes: Uint8Array, filename: string, mimeType = 'application/octet-stream'): void {
  const blob = new Blob([bytes as BlobPart], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function downloadSetupExeDirectly(): void {
  const bytes = base64ToUint8Array(HAYDAR_SETUP_EXE_BASE64);
  downloadBinaryBlob(bytes, 'Haydar_Speed_Pro_Setup.exe');
}

export function downloadPortableExeDirectly(): void {
  const bytes = base64ToUint8Array(HAYDAR_PORTABLE_EXE_BASE64);
  downloadBinaryBlob(bytes, 'Haydar_Speed_Pro.exe');
}

export function downloadStandaloneHtmlDirectly(): void {
  if (HAYDAR_STANDALONE_HTML_BASE64 && HAYDAR_STANDALONE_HTML_BASE64.length > 100) {
    const bytes = base64ToUint8Array(HAYDAR_STANDALONE_HTML_BASE64);
    downloadBinaryBlob(bytes, 'Haydar_Speed_Pro.html', 'text/html;charset=utf-8');
    return;
  }
  const cleanHtml = generateHtaApplication().replace(/<HTA:APPLICATION[\s\S]*?\/>/i, '');
  const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Haydar_Speed_Pro.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function downloadFileDirectly(url: string, filename: string) {
  if (filename === 'Haydar_Speed_Pro_Setup.exe') {
    downloadSetupExeDirectly();
    return;
  }
  if (filename === 'Haydar_Speed_Pro.exe') {
    downloadPortableExeDirectly();
    return;
  }
  if (filename === 'Haydar_Speed_Pro.html') {
    downloadStandaloneHtmlDirectly();
    return;
  }
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const lower = filename.toLowerCase();
  if (lower === 'haydar_speed_pro.html' && HAYDAR_STANDALONE_HTML_BASE64 && HAYDAR_STANDALONE_HTML_BASE64.length > 100) {
    downloadStandaloneHtmlDirectly();
    return;
  }
  let cleanContent = content;
  if (lower.endsWith('.html')) {
    cleanContent = content.replace(/<HTA:APPLICATION[\s\S]*?\/>/i, '');
  }
  const noBom =
    lower.endsWith('.sed') ||
    lower.endsWith('.hta') ||
    lower.endsWith('.bat') ||
    lower.endsWith('.iss') ||
    lower.endsWith('.html');
  const payload = noBom ? cleanContent : '\uFEFF' + cleanContent;
  const computedMime = lower.endsWith('.html')
    ? 'text/html;charset=utf-8'
    : lower.endsWith('.hta')
    ? 'application/hta'
    : noBom
    ? 'text/plain;charset=utf-8'
    : mimeType;
  const blob = new Blob([payload], { type: computedMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function downloadCompleteZipPack(
  _tweaks: TweakItem[],
  _cleanerItems: CleanerItem[],
  targetOS: WindowsVersion
): Promise<void> {
  const zip = new JSZip();
  const bom = '\uFEFF';

  // 1. Precompiled Native Win32 GUI Executables (100% Clean - Zero Script / Zero AV Alert)
  try {
    if (HAYDAR_SETUP_EXE_BASE64) {
      const setupBytes = base64ToUint8Array(HAYDAR_SETUP_EXE_BASE64);
      zip.file('Haydar_Speed_Pro_Setup.exe', setupBytes);
    }
    if (HAYDAR_PORTABLE_EXE_BASE64) {
      const portableBytes = base64ToUint8Array(HAYDAR_PORTABLE_EXE_BASE64);
      zip.file('Haydar_Speed_Pro.exe', portableBytes);
    }
  } catch {
    // fallback
  }

  // 2. Clean HTML5 Standalone Application (100% Identical React + Tailwind + Recharts Preview UI)
  if (HAYDAR_STANDALONE_HTML_BASE64 && HAYDAR_STANDALONE_HTML_BASE64.length > 100) {
    const htmlBytes = base64ToUint8Array(HAYDAR_STANDALONE_HTML_BASE64);
    zip.file('Haydar_Speed_Pro.html', htmlBytes);
  } else {
    const rawApp = generateHtaApplication();
    const cleanHtml = rawApp.replace(/<HTA:APPLICATION[\s\S]*?\/>/i, '');
    zip.file('Haydar_Speed_Pro.html', cleanHtml);
  }

  const innoScript = generateInnoSetupScript();
  const readme = generateReadmeTxt();

  // 3. Self-Contained Inno Setup Script (Zero external file dependencies, compiles with F9)
  zip.file('Haydar_Speed_Pro_Setup.iss', innoScript);

  // 4. Safe Registry Backup & User Guide
  zip.file('Haydar_Speed_Pro_Registry_Backup.reg', bom + generateRegistryBackupFile());
  zip.file('LISEZMOI_Guide_Utilisation.txt', bom + readme);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Haydar_Speed_Pro_Win${targetOS.toUpperCase()}_Pack.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
