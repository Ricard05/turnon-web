/**
 * Turn transformation utilities
 */

import type { Turn, QueueEntry } from '@/core/types';
import { formatRelativeTime } from '@/shared/utils';

/**
 * Convert a Turn to a QueueEntry for display
 */
export function transformToQueueEntry(turn: Turn, index: number): QueueEntry {
  return {
    position: `#${index + 1}`,
    name: turn.patientName?.trim() || `Paciente ${index + 1}`,
    time: formatRelativeTime(turn.startTime),
    serviceName: turn.serviceName?.trim() || 'Servicio no especificado',
    status: turn.status?.toUpperCase?.() || 'PENDING',
    startTime: turn.startTime,
    ticketCode: `Q${String(index + 1).padStart(3, '0')}`,
    email: turn.patientEmail?.trim() || '—',
    phone: turn.patientPhone?.toString() || '—',
  };
}

/**
 * Normalize turn status to uppercase
 */
export function normalizeStatus(turn: Turn): string {
  return turn.status ? turn.status.toUpperCase() : 'PENDING';
}
