/**
 * Turns hooks
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Turn } from '@/core/types';
import { fetchTurns } from '../api/turnsService';

interface UseTurnsResult {
  turns: Turn[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage turns data
 */
export function useTurns(): UseTurnsResult {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadTurns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTurns();
      if (!isMountedRef.current) return;
      setTurns(data);
    } catch (err) {
      if (!isMountedRef.current) return;
      const message = err instanceof Error ? err.message : 'No se pudo cargar la lista de turnos.';
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadTurns();
  }, [loadTurns]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { turns, loading, error, refetch: loadTurns };
}
