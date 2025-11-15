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
  turn: string;
  status: string;
  startTime: string;
  endTime: string;
  serviceId: number;
  serviceName: string;
  serviceDescription?: string;
  userId: number;
  userName: string;
  officeRoom?: string;
}

/**
 * Raw turn data from API (camelCase format from backend)
 */
export type RawTurn = {
  turnId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: number;
  turnNumber: string;
  status: string;
  startTime: string;
  endTime: string;
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  doctorId: number;
  doctorName: string;
  officeRoom: string;
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
  status?: string;
}
