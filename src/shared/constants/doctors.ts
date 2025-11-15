/**
 * Doctor options for selection
 */

import type { DoctorOption } from '@/core/types';

export const DOCTOR_OPTIONS: DoctorOption[] = [
  { id: '1', name: 'Dr. Garcia' },
  { id: '2', name: 'Dr. Martinez' },
  { id: '3', name: 'Dra. López' },
  { id: '4', name: 'Dr. Hernández' },
  { id: '5', name: 'Dra. Ruiz' },
] as const;
