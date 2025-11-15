/**
 * Turn sorting utilities
 */

import type { Turn } from '@/core/types';

/**
 * Sort turns by start time (earliest first)
 * Turns without startTime are placed at the end
 */
export function sortByStartTime(a: Turn, b: Turn): number {
  const timeA = a.startTime ? new Date(a.startTime).getTime() : Number.MAX_SAFE_INTEGER;
  const timeB = b.startTime ? new Date(b.startTime).getTime() : Number.MAX_SAFE_INTEGER;
  return timeA - timeB;
}
