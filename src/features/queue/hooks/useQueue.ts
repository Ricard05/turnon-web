/**
 * Queue hooks
 */

import { useMemo } from 'react';
import type { QueueEntry } from '@/core/types';
import { useTurns } from '@/features/turns';
import { transformToQueueEntry, sortByStartTime } from '@/features/turns/utils';

interface UseQueueResult {
  entries: QueueEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and transform turns into queue entries
 */
export function useQueue(): UseQueueResult {
  const { turns, loading, error, refetch } = useTurns();

  const entries = useMemo(() => {
    return [...turns]
      .sort(sortByStartTime)
      .map((turn, index) => transformToQueueEntry(turn, index));
  }, [turns]);

  return { entries, loading, error, refetch };
}
