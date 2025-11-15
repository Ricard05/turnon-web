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
  console.log('🔧 Normalizando turno - Datos crudos recibidos:', turn);

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

  console.log('✨ Turno normalizado - Resultado:', normalized);
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
 */
export async function fetchPendingTurns(): Promise<Turn[]> {
  const response = await apiClient.get<unknown>('/api/turns/pending');

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
