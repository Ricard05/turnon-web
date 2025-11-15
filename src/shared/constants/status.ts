/**
 * Turn status constants
 */

import type { TurnStatus } from '@/core/types';

export const TURN_STATUS: Record<string, TurnStatus> = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const TURN_STATUS_LABELS: Record<TurnStatus, string> = {
  PENDING: 'Pendiente',
  ACTIVE: 'Activo',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};
