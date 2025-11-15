/**
 * Turn types - Medical appointments/turns domain models
 */

export type TurnStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;

/**
 * Payload for creating a new turn
 */
export interface CreateTurnPayload {
  patientName: string;
  patientEmail: string;
  patientPhone: number;
  companyId: number;
  serviceId: number;
  userId: number;
  createdByUserId: number;
  startTime: string;
  endTime: string;
  status: TurnStatus;
}

/**
 * Turn response from API
 */
export interface TurnResponse extends CreateTurnPayload {
  id?: number;
}

/**
 * Normalized Turn model used throughout the app
 */
export interface Turn {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  startTime?: string;
  endTime?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: number | null;
  companyName?: string | null;
  serviceId?: number | null;
  serviceName?: string | null;
  userId?: number | null;
  userName?: string | null;
  createdByUserId?: number | null;
  createdByUserName?: string | null;
  checkIn?: string | null;
  actualEndTime?: string | null;
  turn?: string | null;
}

/**
 * Raw turn data from API (snake_case)
 */
export type RawTurn = {
  id: number;
  patient_name: string | null;
  patient_email: string | null;
  patient_phone: string | number | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  company_id?: number | null;
  service_id?: number | null;
  user_id?: number | null;
  created_by_user?: number | null;
  check_in?: string | null;
  actual_end_time?: string | null;
  [key: string]: unknown;
};

/**
 * Turn row representation for admin table views
 */
export interface TurnRow {
  id: string;
  number: string;
  client: string;
  service: string;
  status: string;
  scheduledAt: string;
  waitTime: string;
}

/**
 * Upcoming turn for display in lists
 */
export interface UpcomingTurn {
  position: string;
  name: string;
  time: string;
  startTime?: string;
}
