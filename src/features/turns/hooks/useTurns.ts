/**
 * Turns hooks
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Turn } from '@/core/types';
import { fetchTurns, fetchPendingTurns, fetchActiveTurns } from '../api/turnsService';

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

/**
 * Hook to fetch and manage pending turns data
 */
export function usePendingTurns(): UseTurnsResult {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPendingTurns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current date in YYYY-MM-DD format
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;

      const data = await fetchPendingTurns(today);
      setTurns(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la lista de turnos pendientes.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingTurns();
  }, [loadPendingTurns]);

  return { turns, loading, error, refetch: loadPendingTurns };
}

/**
 * Hook to fetch and manage active turns data
 */
export function useActiveTurns(): UseTurnsResult {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadActiveTurns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current date in YYYY-MM-DD format
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;

      const data = await fetchActiveTurns(today);
      if (!isMountedRef.current) return;
      setTurns(data);
    } catch (err) {
      if (!isMountedRef.current) return;
      const message = err instanceof Error ? err.message : 'No se pudo cargar la lista de turnos activos.';
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadActiveTurns();
  }, [loadActiveTurns]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { turns, loading, error, refetch: loadActiveTurns };
}
