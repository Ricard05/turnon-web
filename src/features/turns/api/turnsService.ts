/**
 * Turns service - API calls and data normalization
 */

import { apiClient } from '@/core/api/client';
import type { Turn, RawTurn, CreateTurnPayload, TurnResponse } from '@/core/types';

/**
 * Create a new turn
 */
export function createTurn(payload: CreateTurnPayload) {
  return apiClient.post<TurnResponse>('/api/turns', payload);
}

/**
 * Normalize raw turn data from API to application format
 */
function normalizeTurn(turn: RawTurn): Turn {
  const normalized: Turn = {
    id: turn.turnId,
    patientName: turn.patientName,
    patientEmail: turn.patientEmail,
    patientPhone: String(turn.patientPhone),
    turn: turn.turnNumber,
    status: turn.status.toUpperCase(),
    startTime: turn.startTime,
    endTime: turn.endTime,
    serviceId: turn.serviceId,
    serviceName: turn.serviceName,
    serviceDescription: turn.serviceDescription,
    userId: turn.doctorId,
    userName: turn.doctorName,
    officeRoom: turn.officeRoom,
  };

  return normalized;
}

/**
 * Fetch all turns from API
 */
export async function fetchTurns(): Promise<Turn[]> {
  const response = await apiClient.get<unknown>('/api/turns');

  let list: unknown[] = [];
  if (Array.isArray(response)) {
    list = response;
  } else if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    const possibleArrays = [
      obj.data,
      obj.content,
      obj.turns,
      obj.items,
      obj.results,
      obj.rows,
    ].filter(Array.isArray) as unknown[][];

    if (possibleArrays.length > 0) {
      list = possibleArrays[0];
    } else {
      const firstArrayValue = Object.values(obj).find(Array.isArray);
      if (Array.isArray(firstArrayValue)) {
        list = firstArrayValue as unknown[];
      } else if (Object.keys(obj).length > 0) {
        list = [obj];
      }
    }
  }

  const normalized = list.map((item) => normalizeTurn(item as RawTurn));

  return normalized;
}

/**
 * Fetch pending turns from API
 * @param date - Optional date in YYYY-MM-DD format. If not provided, returns today's pending turns.
 */
export async function fetchPendingTurns(date?: string): Promise<Turn[]> {
  const url = date ? `/api/turns/pending?date=${date}` : '/api/turns/pending';
  const response = await apiClient.get<unknown>(url);

  let list: unknown[] = [];
  if (Array.isArray(response)) {
    list = response;
  } else if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    const possibleArrays = [
      obj.data,
      obj.content,
      obj.turns,
      obj.items,
      obj.results,
      obj.rows,
    ].filter(Array.isArray) as unknown[][];

    if (possibleArrays.length > 0) {
      list = possibleArrays[0];
    } else {
      const firstArrayValue = Object.values(obj).find(Array.isArray);
      if (Array.isArray(firstArrayValue)) {
        list = firstArrayValue as unknown[];
      } else if (Object.keys(obj).length > 0) {
        list = [obj];
      }
    }
  }

  const normalized = list.map((item) => normalizeTurn(item as RawTurn));

  return normalized;
}

/**
 * Fetch active turns from API
 * @param date - Optional date in YYYY-MM-DD format. If not provided, returns today's active turns.
 */
export async function fetchActiveTurns(date?: string): Promise<Turn[]> {
  const url = date ? `/api/turns/active?date=${date}` : '/api/turns/active';
  const response = await apiClient.get<unknown>(url);

  let list: unknown[] = [];
  if (Array.isArray(response)) {
    list = response;
  } else if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    const possibleArrays = [
      obj.data,
      obj.content,
      obj.turns,
      obj.items,
      obj.results,
      obj.rows,
    ].filter(Array.isArray) as unknown[][];

    if (possibleArrays.length > 0) {
      list = possibleArrays[0];
    } else {
      const firstArrayValue = Object.values(obj).find(Array.isArray);
      if (Array.isArray(firstArrayValue)) {
        list = firstArrayValue as unknown[];
      } else if (Object.keys(obj).length > 0) {
        list = [obj];
      }
    }
  }

  const normalized = list.map((item) => normalizeTurn(item as RawTurn));

  return normalized;
}

/**
 * Fetch active and completed turns from API
 * @param date - Date in YYYY-MM-DD format
 * @param limit - Maximum number of turns to return
 */
export async function fetchActiveAndCompletedTurns(date: string, limit: number = 5): Promise<Turn[]> {
  const url = `/api/turns/active-and-completed?date=${date}&limit=${limit}`;
  const response = await apiClient.get<unknown>(url);

  let list: unknown[] = [];

  // El backend devuelve { activeTurns: [], recentlyCompletedTurns: [] }
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const obj = response as Record<string, unknown>;

    // Combinar activeTurns y recentlyCompletedTurns en un solo array
    const activeTurns = Array.isArray(obj.activeTurns) ? obj.activeTurns : [];
    const completedTurns = Array.isArray(obj.recentlyCompletedTurns) ? obj.recentlyCompletedTurns : [];

    list = [...activeTurns, ...completedTurns];
  } else if (Array.isArray(response)) {
    list = response;
  }

  const normalized = list.map((item) => normalizeTurn(item as RawTurn));

  return normalized;
}

/**
 * Complete a turn (IN_CONSULTATION → COMPLETED)
 * @param id - Turn ID to complete
 */
export async function completeTurn(id: number): Promise<Turn> {
  const response = await apiClient.patch<unknown>(`/api/turns/${id}/complete`, {});
  return normalizeTurn(response as RawTurn);
}

/**
 * Cancel a turn (Any status → CANCELLED)
 * @param id - Turn ID to cancel
 */
export async function cancelTurn(id: number): Promise<Turn> {
  const response = await apiClient.patch<unknown>(`/api/turns/${id}/cancel`, {});
  return normalizeTurn(response as RawTurn);
}

