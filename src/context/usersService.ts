import { apiClient } from './apiClient';

type RawUser = Record<string, unknown>;

export type NormalizedStatus = 'ACTIVE' | 'INACTIVE' | string;

export interface UserAccount {
  id: string;
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  phone?: string;
  companyId?: number;
  companyName?: string;
  role: string;
  status: NormalizedStatus;
  lastAccessAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchUsersOptions {
  signal?: AbortSignal;
}

export interface CreateUserPayload {
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  password: string;
  phone?: string;
  companyId: number;
  role: string;
  status?: NormalizedStatus;
}

export interface UpdateUserPayload {
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  password?: string;
  phone?: string;
  companyId: number;
  role: string;
  status: NormalizedStatus;
}

const truthyStatus = new Set([
  'ACTIVE',
  'ACTIVO',
  'ENABLED',
  'HABILITADO',
  '1',
  'TRUE',
  'VERDADERO',
]);
const falsyStatus = new Set(['INACTIVE', 'INACTIVO', 'DISABLED', 'DESHABILITADO', '0', 'FALSE', 'FALSO']);

const getValue = (source: RawUser, ...keys: string[]) => {
  for (const key of keys) {
    if (key in source) {
      return source[key];
    }
  }
  return undefined;
};

const parseString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
};

const normalizeStatus = (value: unknown): NormalizedStatus => {
  const raw = parseString(value)?.toUpperCase();
  if (!raw) return 'ACTIVE';
  if (truthyStatus.has(raw)) return 'ACTIVE';
  if (falsyStatus.has(raw)) return 'INACTIVE';
  return raw;
};

const normalizeRole = (value: unknown): string => {
  const raw = parseString(value);
  if (!raw) return 'USER';
  return raw.toUpperCase();
};

const toIsoString = (value: unknown): string | undefined => {
  const raw = parseString(value);
  if (!raw) return undefined;
  const date = new Date(raw);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString();
  }
  return raw;
};

const normalizeUser = (raw: RawUser): UserAccount => {
  const idValue = getValue(raw, 'id', 'user_id', 'uuid', 'uid', 'identifier');
  const email = parseString(getValue(raw, 'email', 'mail', 'username')) ?? '';
  const firstName = parseString(getValue(raw, 'name', 'first_name', 'firstName', 'nombre'));
  const lastName = parseString(getValue(raw, 'last_name', 'lastName', 'apellido', 'apellido_paterno'));

  const status = normalizeStatus(getValue(raw, 'status', 'user_status', 'state'));
  const role = normalizeRole(getValue(raw, 'role', 'rol', 'user_role', 'userRole'));

  const phone =
    parseString(
      getValue(
        raw,
        'phone',
        'phone_number',
        'phoneNumber',
        'mobile',
        'mobile_phone',
        'mobilePhone',
        'celular',
      ),
    ) ?? undefined;

  const lastAccessAt = toIsoString(getValue(raw, 'last_access_at', 'last_access', 'last_login_at', 'lastLoginAt', 'lastLogin'));
  const createdAt = toIsoString(getValue(raw, 'created_at', 'createdAt'));
  const updatedAt = toIsoString(getValue(raw, 'updated_at', 'updatedAt'));
  const companyIdRaw = getValue(raw, 'company_id', 'companyId');
  const companyName = parseString(getValue(raw, 'company_name', 'companyName'));
  const ageRaw = getValue(raw, 'age', 'edad');

  const id =
    parseString(idValue) ??
    email ??
    `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    name: firstName ?? (email ? email.split('@')[0] : 'Usuario sin nombre'),
    lastName,
    email,
    phone,
    companyId:
      typeof companyIdRaw === 'number'
        ? companyIdRaw
        : parseString(companyIdRaw) != null
          ? Number(parseString(companyIdRaw))
          : undefined,
    companyName,
    age:
      typeof ageRaw === 'number'
        ? ageRaw
        : parseString(ageRaw) != null
          ? Number(parseString(ageRaw))
          : undefined,
    role,
    status,
    lastAccessAt,
    createdAt,
    updatedAt,
  };
};

const ensureArray = (response: unknown): RawUser[] => {
  if (Array.isArray(response)) {
    return response as RawUser[];
  }

  if (response && typeof response === 'object') {
    const obj = response as Record<string, unknown>;
    const candidates = [
      obj.data,
      obj.results,
      obj.items,
      obj.users,
      obj.content,
      obj.rows,
      obj.list,
    ].filter(Array.isArray) as RawUser[][];

    if (candidates.length > 0) {
      return candidates[0] as RawUser[];
    }

    const firstArray = Object.values(obj).find(Array.isArray);
    if (Array.isArray(firstArray)) {
      return firstArray as RawUser[];
    }

    return [obj as RawUser];
  }

  return [];
};

const toNumeric = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = parseString(value);
  if (!parsed) return undefined;
  const digitsOnly = parsed.replace(/[^\d]/g, '');
  if (digitsOnly.length === 0) return undefined;
  const numeric = Number(digitsOnly);
  return Number.isFinite(numeric) ? numeric : undefined;
};

const buildRequestBody = (payload: CreateUserPayload | UpdateUserPayload) => {
  const normalized: Record<string, unknown> = {};

  if (payload.name) {
    normalized.name = payload.name.trim();
  }

  if (payload.lastName) {
    normalized.lastName = payload.lastName.trim();
  }

  if ('age' in payload && payload.age != null) {
    const numericAge = toNumeric(payload.age);
    if (numericAge !== undefined) {
      normalized.age = numericAge;
    }
  }

  if (payload.email) {
    normalized.email = payload.email.trim();
  }

  if (payload.phone) {
    const numericPhone = toNumeric(payload.phone);
    normalized.phone = numericPhone ?? payload.phone;
  }

  if ('companyId' in payload && payload.companyId != null) {
    normalized.companyId = Number(payload.companyId);
  }

  if (payload.role) {
    normalized.role = normalizeRole(payload.role);
  }

  if (payload.status) {
    normalized.status = normalizeStatus(payload.status);
  }

  if ('password' in payload && payload.password) {
    normalized.password = payload.password;
  }

  return normalized;
};

export async function fetchUsers(options?: FetchUsersOptions): Promise<UserAccount[]> {
  const response = await apiClient.get<unknown>('/api/users', {
    signal: options?.signal,
  });

  return ensureArray(response).map((user) => normalizeUser(user));
}

export async function createUser(payload: CreateUserPayload): Promise<UserAccount> {
  const body = buildRequestBody({
    ...payload,
    status: payload.status ?? 'ACTIVE',
  });
  const response = await apiClient.post<unknown>('/api/users', body);
  return normalizeUser(response as RawUser);
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<UserAccount> {
  const body = buildRequestBody(payload);
  const response = await apiClient.put<unknown>(`/api/users/${id}`, body);
  return normalizeUser(response as RawUser);
}


