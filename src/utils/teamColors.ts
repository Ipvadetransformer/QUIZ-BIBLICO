import { TeamConfig } from '../types';

export const TEAM_COLOR_PALETTE: TeamConfig['color'][] = [
  'blue',
  'rose',
  'emerald',
  'purple',
  'amber',
  'cyan',
];

export const DEFAULT_TEAM_NAMES = [
  'Equipe Davi',
  'Equipe Salomão',
  'Equipe Ester',
  'Equipe Samuel',
  'Equipe Débora',
  'Equipe Daniel',
];

export interface TeamColorStyle {
  bgLight: string;
  textDark: string;
  border: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
  buttonBg: string;
}

export const TEAM_STYLES: Record<TeamConfig['color'], TeamColorStyle> = {
  blue: {
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-900',
    border: 'border-blue-300',
    ring: 'ring-blue-400',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    dot: 'bg-blue-500',
    buttonBg: 'bg-blue-600',
  },
  rose: {
    bgLight: 'bg-rose-50',
    textDark: 'text-rose-900',
    border: 'border-rose-300',
    ring: 'ring-rose-400',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    dot: 'bg-rose-500',
    buttonBg: 'bg-rose-600',
  },
  emerald: {
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-900',
    border: 'border-emerald-300',
    ring: 'ring-emerald-400',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    dot: 'bg-emerald-500',
    buttonBg: 'bg-emerald-600',
  },
  purple: {
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-900',
    border: 'border-purple-300',
    ring: 'ring-purple-400',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    dot: 'bg-purple-500',
    buttonBg: 'bg-purple-600',
  },
  amber: {
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-900',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    dot: 'bg-amber-500',
    buttonBg: 'bg-amber-600',
  },
  cyan: {
    bgLight: 'bg-cyan-50',
    textDark: 'text-cyan-900',
    border: 'border-cyan-300',
    ring: 'ring-cyan-400',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-900',
    dot: 'bg-cyan-500',
    buttonBg: 'bg-cyan-600',
  },
};

export function getTeamStyle(color?: TeamConfig['color']): TeamColorStyle {
  if (!color || !TEAM_STYLES[color]) return TEAM_STYLES.blue;
  return TEAM_STYLES[color];
}
