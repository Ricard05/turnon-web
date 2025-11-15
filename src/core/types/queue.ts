/**
 * Queue types - Queue management UI models
 */

import type { TurnStatus } from './turn';

/**
 * Queue entry for display in lists
 */
export interface QueueEntry {
  position: string;
  name: string;
  time: string;
  serviceName: string;
  status: TurnStatus;
  startTime?: string;
  ticketCode: string;
  email?: string;
  phone?: string;
}

/**
 * Queue statistics for dashboard
 */
export interface QueueStat {
  label: string;
  value: string;
  accent: string;
}

/**
 * Doctor option for selection
 */
export interface DoctorOption {
  id?: string;
  name: string;
}
