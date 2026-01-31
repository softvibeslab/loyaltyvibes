'use client';

import { TierLevel } from '@/features/auth/types';

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const TIER_CONFIG = {
  explorador: {
    label: 'Explorador',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
    icon: '🌱',
    multiplier: '1.0x',
  },
  conocedor: {
    label: 'Conocedor',
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    bgLight: 'bg-amber-50',
    icon: '⭐',
    multiplier: '1.2x',
  },
  embajador: {
    label: 'Embajador',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    bgLight: 'bg-purple-50',
    icon: '👑',
    multiplier: '1.5x',
  },
} as const;

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function TierBadge({ tier, size = 'md', showLabel = true }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgLight} ${config.textColor} ${sizeClass}`}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function TierMultiplier({ tier }: { tier: TierLevel }) {
  const config = TIER_CONFIG[tier];

  return (
    <span className={`font-bold ${config.textColor}`}>
      {config.multiplier}
    </span>
  );
}

export { TIER_CONFIG };
