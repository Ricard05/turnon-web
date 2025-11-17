/**
 * Doctors hook
 */

import { useCallback, useEffect, useState } from 'react';
import type { UserAccount } from '@/core/types';
import { fetchDoctors } from '../api/usersService';

interface UseDoctorsResult {
  doctors: UserAccount[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage doctors data
 */
export function useDoctors(): UseDoctorsResult {
  const [doctors, setDoctors] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la lista de doctores.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return { doctors, loading, error, refetch: loadDoctors };
}
