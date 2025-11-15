/**
 * Turns hooks
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Turn } from '@/core/types';
import { fetchTurns, fetchPendingTurns } from '../api/turnsService';

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
    console.log('🔄 Iniciando carga de turnos pendientes...');
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Llamando a fetchPendingTurns()...');
      const data = await fetchPendingTurns();
      console.log('✅ Respuesta recibida del endpoint /api/turns/pending:', data);
      console.log('📊 Turnos pendientes:', data);
      setTurns(data);
      console.log('✅ setTurns llamado con', data.length, 'turnos');
    } catch (err) {
      console.error('❌ Error al cargar turnos pendientes:', err);
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
