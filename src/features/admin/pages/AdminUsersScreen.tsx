import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardUsers from '@/features/dashboard/components/DashboardUsers';
import { useAuth } from '@/core/auth';
import { fetchUsers, createUser, updateUser } from '@/features/users';
import type {
  CreateUserPayload,
  UserStatus,
  UpdateUserPayload,
  UserAccount,
  DashboardUser,
} from '@/core/types';

type AdminUsersScreenProps = {
  isDarkMode: boolean;
};

const ADMIN_ROLE_KEYWORDS = ['ADMIN'];
const DEFAULT_COMPANY_ID = 1;

const isAdminRole = (role?: string | null) => {
  const normalized = role?.toUpperCase?.() ?? '';
  return ADMIN_ROLE_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const normalizeRoleLabel = (role?: string) => {
  const normalized = role?.toUpperCase?.() ?? '';
  if (normalized.includes('ADMIN')) return 'Administrador';
  if (normalized === 'USER' || normalized === 'USUARIO') return 'Usuario';
  if (normalized === 'SUPERVISOR') return 'Supervisor';
  if (normalized.startsWith('AGENT') || normalized === 'AGENTE') return 'Agente';
  return role ?? 'Sin rol';
};

const toServiceRole = (label?: string) => {
  const normalized = label?.toUpperCase?.() ?? 'USER';
  if (normalized.includes('ADMIN')) return 'ADMIN';
  if (normalized === 'USUARIO' || normalized === 'USER') return 'USER';
  if (normalized === 'SUPERVISOR') return 'SUPERVISOR';
  if (normalized.startsWith('AGENT') || normalized === 'AGENTE') return 'AGENT';
  return 'USER';
};

const normalizeStatusLabel = (status: UserStatus): 'Activo' | 'Inactivo' => {
  const normalized = status?.toString().toUpperCase?.() ?? 'ACTIVE';
  return normalized === 'INACTIVE' || normalized === 'INACTIVO' ? 'Inactivo' : 'Activo';
};

const toServiceStatus = (label?: string): UserStatus => {
  const normalized = label?.toUpperCase?.() ?? 'ACTIVE';
  if (normalized === 'INACTIVO' || normalized === 'INACTIVE') return 'INACTIVE';
  if (normalized === 'ACTIVO' || normalized === 'ACTIVE') return 'ACTIVE';
  return normalized;
};

const formatLastAccess = (iso?: string) => {
  if (!iso) return 'Sin registro';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  return formatted
    .replace('a. m.', 'a. m.')
    .replace('p. m.', 'p. m.')
    .replace('a.m.', 'a. m.')
    .replace('p.m.', 'p. m.');
};

const adaptUserToDashboard = (user: UserAccount): DashboardUser => {
  const status = normalizeStatusLabel(user.status);
  const lastAccessSource = user.lastAccessAt ?? user.updatedAt ?? user.createdAt;
  const firstName = user.name?.trim() || user.email;
  const lastName = user.lastName?.trim();
  const phone =
    user.phone != null && String(user.phone).trim().length > 0
      ? String(user.phone)
      : 'Sin número';

  return {
    id: String(user.id),
    firstName,
    lastName,
    age: typeof user.age === 'number' ? user.age : undefined,
    role: normalizeRoleLabel(user.role),
    email: user.email,
    phone,
    status,
    lastAccess: formatLastAccess(lastAccessSource),
    companyId: user.companyId ?? DEFAULT_COMPANY_ID,
  };
};

const buildCreatePayload = (
  user: Omit<DashboardUser, 'id' | 'lastAccess'>,
): CreateUserPayload => {
  const phone = user.phone?.trim();
  const password = user.password?.trim() ?? '';
  const age =
    typeof user.age === 'number' && Number.isFinite(user.age) ? user.age : undefined;

  return {
    name: user.firstName.trim(),
    lastName: user.lastName?.trim() || undefined,
    age,
    email: user.email.trim(),
    password,
    phone: phone && phone.length > 0 ? phone : undefined,
    companyId: user.companyId ?? DEFAULT_COMPANY_ID,
    role: toServiceRole(user.role),
    status: toServiceStatus(user.status),
  };
};

const buildUpdatePayload = (
  user: DashboardUser,
  password?: string,
): UpdateUserPayload => {
  const phone = user.phone?.trim();
  const age =
    typeof user.age === 'number' && Number.isFinite(user.age) ? user.age : undefined;

  const payload: UpdateUserPayload = {
    name: user.firstName.trim(),
    lastName: user.lastName?.trim() || undefined,
    age,
    email: user.email.trim(),
    phone: phone && phone.length > 0 ? phone : undefined,
    companyId: user.companyId ?? DEFAULT_COMPANY_ID,
    role: toServiceRole(user.role),
    status: toServiceStatus(user.status),
  };

  if (password && password.trim().length > 0) {
    payload.password = password.trim();
  }

  return payload;
};

const AdminUsersScreen = ({ isDarkMode }: AdminUsersScreenProps) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManageUsers = useMemo(() => isAdminRole(user?.role), [user?.role]);

  useEffect(() => {
    let abortController: AbortController | undefined;
    if (!canManageUsers) {
      setError('No tienes permisos para visualizar otros usuarios.');
      setUsers([]);
      return;
    }
    setError(null);
    abortController = new AbortController();
    setIsFetching(true);
    fetchUsers({ signal: abortController.signal })
      .then((response) => {
        setUsers(response.map((account) => adaptUserToDashboard(account)));
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'No se pudieron cargar los usuarios.';
        setError(message);
      })
      .finally(() => {
        setIsFetching(false);
      });

    return () => {
      abortController?.abort();
    };
  }, [canManageUsers]);

  const handleCreateUser = useCallback(
    (newUser: Omit<DashboardUser, 'id' | 'lastAccess'>) => {
      void (async () => {
        setIsMutating(true);
        setError(null);
        try {
          const created = await createUser(buildCreatePayload(newUser));
          setUsers((prev) => [adaptUserToDashboard(created), ...prev]);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'No se pudo crear el usuario.';
          setError(message);
        } finally {
          setIsMutating(false);
        }
      })();
    },
    [],
  );

  const handleUpdateUser = useCallback(
    (id: string, updates: Partial<Omit<DashboardUser, 'id'>>) => {
      const current = users.find((item) => item.id === id);
      if (!current) {
        return;
      }

      const merged: DashboardUser = {
        ...current,
        ...updates,
        age: updates.age !== undefined ? updates.age : current.age,
        firstName: updates.firstName ?? current.firstName,
        lastName: updates.lastName ?? current.lastName,
        email: updates.email ?? current.email,
        phone: updates.phone ?? current.phone,
        role: updates.role ?? current.role,
        status: updates.status ?? current.status,
        companyId: current.companyId ?? DEFAULT_COMPANY_ID,
      };

      const password =
        (updates as { password?: string }).password?.trim().length
          ? (updates as { password?: string }).password?.trim()
          : undefined;

      void (async () => {
        setIsMutating(true);
        setError(null);
        try {
          const updated = await updateUser(id, buildUpdatePayload(merged, password));
          setUsers((prev) =>
            prev.map((userItem) => (userItem.id === id ? adaptUserToDashboard(updated) : userItem)),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : 'No se pudo actualizar el usuario.';
          setError(message);
        } finally {
          setIsMutating(false);
        }
      })();
    },
    [users],
  );

  const handleToggleUserStatus = useCallback(
    (id: string) => {
      const target = users.find((item) => item.id === id);
      if (!target) return;

      const toggledUser: DashboardUser = {
        ...target,
        status: target.status === 'Activo' ? 'Inactivo' : 'Activo',
      };

      void (async () => {
        setIsMutating(true);
        setError(null);
        try {
          const updated = await updateUser(
            id,
            buildUpdatePayload(toggledUser),
          );
          setUsers((prev) =>
            prev.map((userItem) => (userItem.id === id ? adaptUserToDashboard(updated) : userItem)),
          );
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'No se pudo actualizar el estado del usuario.';
          setError(message);
        } finally {
          setIsMutating(false);
        }
      })();
    },
    [users],
  );

  if (!canManageUsers) {
    const containerClass = isDarkMode
      ? 'bg-slate-900/70 border border-white/10 text-slate-100'
      : 'bg-white border border-slate-200 text-slate-600';
    return (
      <section className={`rounded-[32px] p-10 shadow-lg ${containerClass}`}>
        <h2 className="text-xl font-semibold">Acceso restringido</h2>
        <p className="mt-3 text-sm">
          No cuentas con permisos para gestionar otros usuarios. Por favor contacta a un administrador.
        </p>
      </section>
    );
  }

  const infoMessage = isFetching
    ? 'Cargando usuarios…'
    : isMutating
      ? 'Guardando cambios…'
      : null;

  const infoClasses = isDarkMode
    ? 'bg-sky-500/10 border border-sky-400/40 text-slate-100'
    : 'bg-sky-50 border border-sky-200 text-sky-600';

  const errorClasses = isDarkMode
    ? 'bg-rose-500/10 border border-rose-400/40 text-rose-200'
    : 'bg-rose-50 border border-rose-200 text-rose-600';

  return (
    <div className="space-y-4">
      {infoMessage && <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${infoClasses}`}>{infoMessage}</div>}
      {error && (
        <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${errorClasses}`}>
          {error}
        </div>
      )}
      <DashboardUsers
        users={users}
        isDarkMode={isDarkMode}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        onToggleStatus={handleToggleUserStatus}
      />
    </div>
  );
};

export default AdminUsersScreen;
