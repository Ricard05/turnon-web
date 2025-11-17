/**
 * Doctors hooks
 */

import { useCallback, useEffect, useState } from 'react';
import type { Doctor } from '@/core/types';
import { fetchDoctorsWithServices } from '../api/doctorsService';

interface UseDoctorsResult {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage doctors with their services
 */
export function useDoctorsWithServices(): UseDoctorsResult {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDoctorsWithServices();
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
