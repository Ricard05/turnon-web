/**
 * Queue statistics hooks
 */

import { useMemo } from 'react';
import type { QueueStat } from '@/core/types';
import { useTurns } from '@/features/turns';
import { calculateQueueStats, calculateSimpleQueueStats } from '../utils/stats';

interface UseQueueStatsResult {
  stats: QueueStat[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to calculate queue statistics
 */
export function useQueueStats(simple = false): UseQueueStatsResult {
  const { turns, loading, error } = useTurns();

  const stats = useMemo(() => {
    if (simple) {
      return calculateSimpleQueueStats(turns);
    }
    return calculateQueueStats(turns);
  }, [turns, simple]);

  return { stats, loading, error };
}
