/**
 * Doctors service - API calls and data normalization
 */

import { apiClient } from '@/core/api/client';
import type { Doctor, RawDoctor } from '@/core/types';

/**
 * Normalize raw doctor data from API to application format
 */
function normalizeDoctor(doctor: RawDoctor): Doctor {
  return {
    id: doctor.id,
    name: doctor.name,
    officeRoom: doctor.officeRoom,
    services: doctor.services || [],
  };
}

/**
 * Ensure response is an array
 */
const ensureArray = (response: unknown): RawDoctor[] => {
  if (Array.isArray(response)) {
    return response as RawDoctor[];
  }

  if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    const candidates = [
      obj.data,
      obj.results,
      obj.items,
      obj.doctors,
      obj.content,
      obj.rows,
      obj.list,
    ].filter(Array.isArray) as RawDoctor[][];

    if (candidates.length > 0) {
      return candidates[0] as RawDoctor[];
    }

    const firstArray = Object.values(obj).find(Array.isArray);
    if (Array.isArray(firstArray)) {
      return firstArray as RawDoctor[];
    }

    return [obj as RawDoctor];
  }

  return [];
};

/**
 * Fetch doctors with their services from API
 */
export async function fetchDoctorsWithServices(): Promise<Doctor[]> {
  const response = await apiClient.get<unknown>('/api/doctors/with-services');
  const doctors = ensureArray(response).map((doctor) => normalizeDoctor(doctor));
  return doctors;
}
