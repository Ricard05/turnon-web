import { apiClient } from './apiClient';

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
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;
}

export interface TurnResponse extends CreateTurnPayload {
  id?: number;
}

export function createTurn(payload: CreateTurnPayload) {
  return apiClient.post<TurnResponse>('/api/turns', payload);
}

type RawTurn = {
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

function normalizeTurn(turn: RawTurn | Record<string, unknown>): Turn {
  const get = (keySnake: string, keyCamel: string) => {
    if (keySnake in turn) return (turn as Record<string, unknown>)[keySnake];
    if (keyCamel in turn) return (turn as Record<string, unknown>)[keyCamel];
    return undefined;
  };

  const statusRaw =
    get('status', 'status') ??
    get('turn_status', 'turnStatus') ??
    get('state', 'state') ??
    'PENDING';
  const status =
    typeof statusRaw === 'string' && statusRaw.trim().length > 0
      ? statusRaw.toUpperCase()
      : 'PENDING';

  const startTimeValue =
    get('start_time', 'startTime') ??
    get('check_in', 'checkIn') ??
    get('created_at', 'createdAt');

  const endTimeValue =
    get('end_time', 'endTime') ??
    get('actual_end_time', 'actualEndTime') ??
    get('created_at', 'createdAt');

  return {
    id: Number(get('id', 'id')) || 0,
    patientName: (get('patient_name', 'patientName') ?? '').toString(),
    patientEmail: (get('patient_email', 'patientEmail') ?? '').toString(),
    patientPhone: (() => {
      const value =
        get('patient_phone', 'patientPhone') ??
        get('phone', 'phone');
      return value != null ? String(value) : '';
    })(),
    startTime: (() => {
      const value = startTimeValue;
      return value != null ? String(value) : undefined;
    })(),
    endTime: (() => {
      const value = endTimeValue;
      return value != null ? String(value) : undefined;
    })(),
    status,
    createdAt: (() => {
      const value = get('created_at', 'createdAt');
      return value != null ? String(value) : undefined;
    })(),
    updatedAt: (() => {
      const value = get('updated_at', 'updatedAt');
      return value != null ? String(value) : undefined;
    })(),
    companyId: (() => {
      const value = get('company_id', 'companyId');
      return value != null ? Number(value) : undefined;
    })(),
    companyName: (() => {
      const value = get('company_name', 'companyName');
      return value != null ? String(value) : undefined;
    })(),
    serviceId: (() => {
      const value = get('service_id', 'serviceId');
      return value != null ? Number(value) : undefined;
    })(),
    serviceName: (() => {
      const value = get('service_name', 'serviceName');
      return value != null ? String(value) : undefined;
    })(),
    userId: (() => {
      const value = get('user_id', 'userId');
      return value != null ? Number(value) : undefined;
    })(),
    createdByUserId: (() => {
      const value = get('created_by_user', 'createdByUserId');
      return value != null ? Number(value) : undefined;
    })(),
    userName: (() => {
      const value = get('user_name', 'userName');
      return value != null ? String(value) : undefined;
    })(),
    createdByUserName: (() => {
      const value = get('created_by_user_name', 'createdByUserName');
      return value != null ? String(value) : undefined;
    })(),
    checkIn: (() => {
      const value = get('check_in', 'checkIn');
      return value != null ? String(value) : undefined;
    })(),
    actualEndTime: (() => {
      const value = get('actual_end_time', 'actualEndTime');
      return value != null ? String(value) : undefined;
    })(),
    turn: (() => {
      const value = get('turn', 'turn');
      return value != null ? String(value) : undefined;
    })(),
  };
}

export async function fetchTurns() {
  const response = await apiClient.get<unknown>('/api/turns');
  console.log('[TurnsService] raw /api/turns response:', response);

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

  console.log('[TurnsService] normalized list source length:', list.length);
  const normalized = list.map((item) => normalizeTurn(item as RawTurn));
  console.log('[TurnsService] normalized turns:', normalized);

  if (normalized.length === 0) {
    const now = new Date();
    const fallbackTurn: Turn = {
      id: 0,
      patientName: 'Turno Demo',
      patientEmail: 'demo@example.com',
      patientPhone: '0000000000',
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
      status: 'PENDING',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    return [fallbackTurn];
  }

  return normalized;
}


