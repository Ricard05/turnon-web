/**
 * Queue statistics utilities
 */

import type { Turn, QueueStat } from '@/core/types';
import { normalizeStatus } from '@/features/turns/utils';

/**
 * Calculate queue statistics from turns
 */
export function calculateQueueStats(turns: Turn[]): QueueStat[] {
  const totalTurns = turns.length;
  const pendingTurns = turns.filter((turn) => normalizeStatus(turn) === 'PENDING');
  const activeTurns = turns.filter((turn) => normalizeStatus(turn) === 'ACTIVE');
  const completedTurns = turns.filter((turn) => normalizeStatus(turn) === 'COMPLETED');

  return [
    {
      label: 'Total registrados',
      value: totalTurns.toString(),
      accent: 'bg-blue-500',
    },
    {
      label: 'Pendientes',
      value: pendingTurns.length.toString(),
      accent: 'bg-indigo-500',
    },
    {
      label: 'Activos',
      value: activeTurns.length.toString(),
      accent: 'bg-green-500',
    },
    {
      label: 'Completados',
      value: completedTurns.length.toString(),
      accent: 'bg-orange-500',
    },
  ];
}

/**
 * Calculate simple queue stats for queue management view
 */
export function calculateSimpleQueueStats(turns: Turn[]): QueueStat[] {
  const pending = turns.filter((turn) => normalizeStatus(turn) === 'PENDING').length;
  const active = turns.filter((turn) => normalizeStatus(turn) === 'ACTIVE').length;

  return [
    { label: 'En cola', value: pending.toString(), accent: 'bg-blue-500' },
    { label: 'Atendiendo', value: active.toString(), accent: 'bg-green-500' },
    { label: 'Espera promedio', value: '—', accent: 'bg-orange-400' },
  ];
}
