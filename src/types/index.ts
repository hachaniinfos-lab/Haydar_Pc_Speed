export type WindowsVersion = 'xp' | 'vista' | '7' | '8' | '10' | '11';
export type Architecture = '32-bit' | '64-bit';

export interface SystemSpecs {
  osName: string;
  targetOS: WindowsVersion;
  arch: Architecture;
  cpuCores: number;
  totalRamGB: number;
  usedRamMB: number;
  freeRamMB: number;
  ramUsagePercent: number;
  cpuUsagePercent: number;
  diskTotalGB: number;
  diskUsedGB: number;
  diskUsagePercent: number;
  diskType: 'HDD' | 'SSD';
  bootTimeSeconds: number;
  processCount: number;
  uptimeHours: number;
}

export interface CleanerItem {
  id: string;
  name: string;
  description: string;
  path: string;
  sizeMB: number;
  safetyLevel: 'safe' | 'recommended' | 'optional';
  category: 'temp' | 'cache' | 'logs' | 'system';
  selected: boolean;
  minWinVersion: WindowsVersion;
}

export interface StartupItem {
  id: string;
  name: string;
  publisher: string;
  path: string;
  impact: 'high' | 'medium' | 'low';
  bootImpactSeconds: number;
  enabled: boolean;
  location: 'HKCU\\Run' | 'HKLM\\Run' | 'StartupFolder';
  description: string;
}

export interface TweakItem {
  id: string;
  title: string;
  description: string;
  category: 'graphics' | 'memory' | 'services' | 'network' | 'disk';
  recommendedForOldPC: boolean;
  enabled: boolean;
  regPath?: string;
  regKey?: string;
  regValue?: string | number;
  serviceName?: string;
  command?: string;
  reversable: boolean;
  minWinVersion: WindowsVersion;
}

export interface DiagnosticIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  tweakIds: string[];
  cleanerIds?: string[];
  startupIds?: string[];
  estimatedGain: string;
}

export interface RestoreSnapshot {
  id: string;
  timestamp: string;
  label: string;
  tweaksCount: number;
  startupModified: number;
  spaceFreedMB: number;
}
