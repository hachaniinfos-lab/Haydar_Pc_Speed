import { Architecture, SystemSpecs, WindowsVersion } from '../types';

export function isInstalledOnSystem(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as { __HAYDAR_INSTALLED_APP__?: boolean };
  return (
    win.__HAYDAR_INSTALLED_APP__ === true ||
    window.location.protocol === 'file:' ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function detectHostSystem(): Partial<SystemSpecs> {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const cores = nav?.hardwareConcurrency || 2;
  
  // deviceMemory is an experimental standard in Chrome/Edge (returns RAM in GB: 0.5, 1, 2, 4, 8)
  const deviceMemory = (nav as unknown as { deviceMemory?: number })?.deviceMemory || 2;
  
  const ua = nav?.userAgent || '';
  let detectedOS: WindowsVersion = 'xp';
  let osName = 'Windows XP Professional SP3';
  let arch: Architecture = '32-bit';

  if (ua.includes('Windows NT 10.0')) {
    detectedOS = '10';
    osName = 'Windows 10 / 11';
  } else if (ua.includes('Windows NT 6.3')) {
    detectedOS = '8';
    osName = 'Windows 8.1';
  } else if (ua.includes('Windows NT 6.1')) {
    detectedOS = '7';
    osName = 'Windows 7 SP1';
  } else if (ua.includes('Windows NT 6.0')) {
    detectedOS = 'vista';
    osName = 'Windows Vista SP2';
  } else if (ua.includes('Windows NT 5.1')) {
    detectedOS = 'xp';
    osName = 'Windows XP SP3';
  }

  if (ua.includes('Win64') || ua.includes('x64') || ua.includes('WOW64')) {
    arch = '64-bit';
  } else {
    arch = '32-bit';
  }

  return {
    osName,
    targetOS: detectedOS,
    arch,
    cpuCores: cores,
    totalRamGB: deviceMemory,
    diskType: deviceMemory <= 2 ? 'HDD' : 'SSD',
  };
}

export const WINDOWS_OS_PROFILES: Record<WindowsVersion, {
  name: string;
  defaultRamGB: number;
  defaultDiskGB: number;
  diskType: 'HDD' | 'SSD';
  arch: Architecture;
  recommendedDescription: string;
  vintageLevel: 'extreme' | 'classic' | 'modern';
}> = {
  xp: {
    name: 'Windows XP Professional SP3',
    defaultRamGB: 1,
    defaultDiskGB: 80,
    diskType: 'HDD',
    arch: '32-bit',
    recommendedDescription: 'Idéal pour vieux PC Pentium 4 / Celeron / Atom (256 Mo à 2 Go RAM). Priorité : alléger l\'interface et le swap.',
    vintageLevel: 'extreme',
  },
  vista: {
    name: 'Windows Vista SP2',
    defaultRamGB: 2,
    defaultDiskGB: 120,
    diskType: 'HDD',
    arch: '32-bit',
    recommendedDescription: 'Allègement du moteur d\'indexation lourd et arrêt des effets Aero gourmands.',
    vintageLevel: 'classic',
  },
  7: {
    name: 'Windows 7 Service Pack 1',
    defaultRamGB: 2,
    defaultDiskGB: 160,
    diskType: 'HDD',
    arch: '64-bit',
    recommendedDescription: 'Optimisation de Superfetch, désactivation de télémétrie rétro-portée et optimisation RAM.',
    vintageLevel: 'classic',
  },
  8: {
    name: 'Windows 8.1 Pro',
    defaultRamGB: 3,
    defaultDiskGB: 240,
    diskType: 'HDD',
    arch: '64-bit',
    recommendedDescription: 'Désactivation des applications Modern UI fantômes et des tâches de maintenance masquées.',
    vintageLevel: 'classic',
  },
  10: {
    name: 'Windows 10 (32 / 64 bits)',
    defaultRamGB: 4,
    defaultDiskGB: 500,
    diskType: 'HDD',
    arch: '64-bit',
    recommendedDescription: 'Élimination du bug 100% disque HDD (SysMain), suppression des bloatwares et télémétrie.',
    vintageLevel: 'modern',
  },
  11: {
    name: 'Windows 11 (64 bits)',
    defaultRamGB: 8,
    defaultDiskGB: 512,
    diskType: 'SSD',
    arch: '64-bit',
    recommendedDescription: 'Optimisation des widgets, désactivation des effets de flou Mica et des processus Edge en tâche de fond.',
    vintageLevel: 'modern',
  },
};
