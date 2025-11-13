import { type FormEvent, useMemo, useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';

export type DashboardUser = {
  id: string;
  firstName: string;
  lastName?: string;
  age?: number;
  role: string;
  email: string;
  phone: string;
  status: 'Activo' | 'Inactivo';
  lastAccess: string;
  companyId?: number;
  password?: string;
};

type DashboardUsersProps = {
  users: DashboardUser[];
  isDarkMode: boolean;
  onCreate: (user: Omit<DashboardUser, 'id' | 'lastAccess'>) => void;
  onUpdate: (id: string, updates: Partial<Omit<DashboardUser, 'id'>>) => void;
  onToggleStatus: (id: string) => void;
};

const statusStyles = {
  Activo: 'bg-emerald-500/15 text-emerald-500 border border-emerald-400/50',
  Inactivo: 'bg-rose-500/15 text-rose-400 border border-rose-400/40',
} as const;

const roles = ['Administrador', 'Usuario'] as const;

type FormState = {
  firstName: string;
  lastName: string;
  age: string;
  role: (typeof roles)[number];
  email: string;
  phone: string;
  status: 'Activo' | 'Inactivo';
  password: string;
};

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  age: '',
  role: roles[1],
  email: '',
  phone: '',
  status: 'Activo',
  password: '',
};

const DashboardUsers = ({
  users,
  isDarkMode,
  onCreate,
  onUpdate,
  onToggleStatus,
}: DashboardUsersProps) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = query
      ? users.filter((user) =>
          [
            user.firstName,
            user.lastName ?? '',
            user.role,
            user.email,
            user.phone,
          ]
            .join(' ')
            .toLowerCase()
            .includes(query),
        )
      : users;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      rows: base.slice(start, end),
      total: base.length,
      totalPages: Math.max(1, Math.ceil(base.length / rowsPerPage)),
    };
  }, [users, search, page, rowsPerPage]);

  const activeUsers = useMemo(
    () => users.filter((user) => user.status === 'Activo').length,
    [users],
  );

  const inactiveUsers = users.length - activeUsers;

  const containerClass = isDarkMode
    ? 'bg-gradient-to-br from-[#0f172a] via-[#0c1830] to-[#081021] border border-white/10 text-slate-100'
    : 'bg-gradient-to-br from-white via-[#eef6ff] to-[#d9e7ff] text-slate-600 border border-[#d0e5ff]';

  const headerAccentClass = isDarkMode
    ? 'bg-gradient-to-r from-sky-500/25 to-cyan-400/20 text-slate-100 shadow-[0_18px_35px_rgba(56,189,248,0.32)]'
    : 'bg-white text-slate-600 shadow-[0_18px_35px_rgba(58,134,255,0.22)]';

  const tableHeaderClass = isDarkMode
    ? 'bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white'
    : 'bg-[#3AD0FF] text-white';

  const tableContainerClass = isDarkMode
    ? 'bg-white/5 border border-white/10 text-slate-100 shadow-[0_24px_48px_rgba(8,47,73,0.55)]'
    : 'bg-white/90 border border-white/60 text-slate-600 shadow-[0_20px_40px_rgba(59,130,246,0.12)]';

  const rowHoverClass = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50';

  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormState(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (user: DashboardUser) => {
    setEditingUserId(user.id);
    setFormState({
      firstName: user.firstName ?? user.email,
      lastName: user.lastName ?? '',
      age: user.age != null ? String(user.age) : '',
      role: user.role,
      email: user.email,
      phone: user.phone,
      status: user.status,
      password: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormState(initialFormState);
    setEditingUserId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.firstName.trim() || !formState.email.trim()) {
      return;
    }

    const ageValue = formState.age.trim().length > 0 ? Number(formState.age) : undefined;
    const normalizedAge =
      ageValue !== undefined && Number.isFinite(ageValue) ? ageValue : undefined;

    const payload = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      age: normalizedAge,
      role: formState.role,
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      status: formState.status,
      password: formState.password.trim(),
    };

    if (editingUserId) {
      onUpdate(editingUserId, {
        ...payload,
        password: payload.password.length > 0 ? payload.password : undefined,
      });
    } else {
      if (payload.password.length === 0) {
        return;
      }
      onCreate(payload);
      setPage(1);
    }

    handleCloseModal();
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const total = filteredUsers.totalPages;
    if (total <= 5) {
      return Array.from({ length: total }, (_, idx) => idx + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, '…', total] as (number | string)[];
    }
    if (page >= total - 2) {
      return [1, '…', total - 3, total - 2, total - 1, total] as (number | string)[];
    }
    return [1, '…', page - 1, page, page + 1, '…', total] as (number | string)[];
  }, [page, filteredUsers.totalPages]);

  return (
    <section className={`rounded-[36px] px-10 py-10 shadow-[0_35px_65px_rgba(58,134,255,0.18)] transition-colors duration-300 ${containerClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Usuarios</h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500/80'}`}>
            Controla a los empleados que pueden acceder al sistema.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`flex items-center gap-4 rounded-3xl px-6 py-3 text-sm font-semibold ${headerAccentClass}`}
          >
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.25em] opacity-60">Activos</span>
              <span className="text-lg">{activeUsers}</span>
            </div>
            <span className="h-10 w-px bg-slate-200/50 dark:bg-white/10" />
            <div className="flex flex-col text-right">
              <span className="text-xs uppercase tracking-[0.25em] opacity-60">Inactivos</span>
              <span className="text-lg">{inactiveUsers}</span>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3AD0FF] to-[#67E5BC] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(58,134,255,0.35)] transition hover:shadow-[0_20px_32px_rgba(58,134,255,0.45)]"
            type="button"
          >
            <UserPlus className="h-4 w-4" />
            Agregar usuario
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search
            className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, correo o rol…"
            className={`w-full rounded-full border px-12 py-3 text-sm outline-none transition ${
              isDarkMode
                ? 'border-white/10 bg-white/10 text-slate-100 placeholder:text-slate-400 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                : 'border-white/60 bg-white/80 text-slate-600 placeholder:text-slate-400 focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-300">Mostrar</span>
          <select
            value={rowsPerPage}
            onChange={(event) => handleChangeRowsPerPage(Number(event.target.value))}
            className={`rounded-full border px-3 py-2 text-sm ${
              isDarkMode
                ? 'border-white/20 bg-[#13203a] text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                : 'border-white/70 bg-white text-slate-600'
            }`}
          >
            {[5, 10, 15, 20].map((option) => (
              <option
                key={option}
                value={option}
                className={isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-600'}
              >
                {option}
              </option>
            ))}
          </select>
          <span className="text-slate-500 dark:text-slate-300">filas</span>
        </div>
      </div>

      <div className={`mt-8 overflow-hidden rounded-[28px] backdrop-blur-sm ${tableContainerClass}`}>
        <div className={`${tableHeaderClass} text-xs font-semibold uppercase tracking-[0.3em]`}>
          <div className="grid grid-cols-[1.4fr_1fr_1.4fr_1fr_1fr_1fr] px-8 py-4">
            <span>Nombre</span>
            <span>Rol</span>
            <span>Correo</span>
            <span>Teléfono</span>
            <span>Último acceso</span>
            <span className="text-right">% estado</span>
          </div>
        </div>

        <div className={isDarkMode ? 'divide-y divide-white/10' : 'divide-y divide-slate-100'}>
          {filteredUsers.rows.map((user) => (
            <div
              key={user.id}
              className={`grid grid-cols-[1.4fr_1fr_1.4fr_1fr_1fr_1fr] px-8 py-5 text-sm transition ${rowHoverClass}`}
            >
              <div className="flex flex-col">
                <span className="font-semibold">
                  {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                </span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">{user.role}</div>
              <div className="hidden items-center text-sm md:flex">{user.email}</div>
              <div className="flex items-center text-sm">{user.phone}</div>
              <div className="flex items-center text-sm text-slate-400">{user.lastAccess}</div>
              <div className="flex items-center justify-end gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[user.status]
                  }`}
                >
                  {user.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(user)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isDarkMode
                      ? 'border border-white/15 text-slate-200 hover:bg-white/10'
                      : 'border border-[#d9dce8] text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStatus(user.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    user.status === 'Activo'
                      ? isDarkMode
                        ? 'border border-rose-400/60 text-rose-300 hover:bg-rose-500/10'
                        : 'border border-[#ffc4d6] text-[#ff7aa2] hover:bg-[#ffeff5]'
                      : isDarkMode
                        ? 'border border-emerald-400/70 text-emerald-300 hover:bg-emerald-500/10'
                        : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {user.status === 'Activo' ? 'Inactivar' : 'Reactivar'}
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.rows.length === 0 && (
            <div className="px-8 py-12 text-center text-sm text-slate-400">
              No se encontraron usuarios para la búsqueda “{search}”.
            </div>
          )}
        </div>
      </div>

      <div className={`mt-6 flex flex-wrap items-center justify-between gap-4 text-sm ${
        isDarkMode ? 'text-slate-300' : 'text-slate-500'
      }`}>
        <span>
          Mostrando {(filteredUsers.rows.length && (page - 1) * rowsPerPage + 1) || 0}-
          {(page - 1) * rowsPerPage + filteredUsers.rows.length} de {filteredUsers.total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
              page === 1
                ? `cursor-not-allowed ${isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-200/50 text-slate-400'}`
                : `${isDarkMode ? 'bg-white/10 text-slate-100 hover:bg-white/20' : 'bg-white/80 text-slate-600 hover:bg-white'}`
            }`}
          >
            ‹
          </button>
          {pageNumbers.map((item, index) =>
            typeof item === 'number' ? (
              <button
                type="button"
                key={`page-${item}-${index}`}
                onClick={() => setPage(item)}
                className={`h-8 min-w-[2rem] rounded-full px-3 text-xs font-semibold transition ${
                  page === item
                    ? 'bg-gradient-to-r from-[#3AD0FF] to-[#67E5BC] text-white shadow-[0_12px_24px_rgba(58,134,255,0.35)]'
                    : isDarkMode
                      ? 'bg-white/10 text-slate-100 hover:bg-white/20'
                      : 'bg-white/70 text-slate-600 hover:bg-white'
                }`}
              >
                {item}
              </button>
            ) : (
              <span key={`ellipsis-${index}`} className="px-1">
                {item}
              </span>
            ),
          )}
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(filteredUsers.totalPages, prev + 1))}
            disabled={page === filteredUsers.totalPages}
            className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
              page === filteredUsers.totalPages
                ? `cursor-not-allowed ${isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-200/50 text-slate-400'}`
                : `${isDarkMode ? 'bg-white/10 text-slate-100 hover:bg-white/20' : 'bg-white/80 text-slate-600 hover:bg-white'}`
            }`}
          >
            ›
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-lg rounded-3xl p-8 shadow-xl transition ${
              isDarkMode ? 'bg-slate-900/80 text-slate-100' : 'bg-white text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {editingUserId ? 'Editar usuario' : 'Agregar usuario'}
                </h3>
                <p className="text-sm text-slate-400">
                  Completa los campos para {editingUserId ? 'actualizar' : 'crear'} el acceso.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Nombre
                  </label>
                  <input
                    required
                    value={formState.firstName}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, firstName: event.target.value }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Apellidos
                  </label>
                  <input
                    value={formState.lastName}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, lastName: event.target.value }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Rol
                  </label>
                  <select
                    value={formState.role}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, role: event.target.value as FormState['role'] }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Estado
                  </label>
                  <select
                    value={formState.status}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        status: event.target.value as 'Activo' | 'Inactivo',
                      }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Edad
                  </label>
                  <input
                    min={0}
                    type="number"
                    value={formState.age}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, age: event.target.value }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                    placeholder="Ej. 30"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Correo electrónico
                  </label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    Teléfono
                  </label>
                  <input
                    required
                    type="tel"
                    value={formState.phone}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                      isDarkMode
                        ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                        : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
                  Contraseña {editingUserId ? '(deja en blanco para mantener)' : ''}
                </label>
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required={!editingUserId}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                    isDarkMode
                      ? 'border-white/20 bg-white/5 text-slate-100 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                      : 'border-slate-200 bg-white focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
                  }`}
                  placeholder={editingUserId ? '•••••••• (sin cambios)' : '••••••••'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isDarkMode
                      ? 'border border-white/15 text-slate-200 hover:bg-white/10'
                      : 'border border-[#d9dce8] text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-[#3AD0FF] to-[#67E5BC] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(58,134,255,0.35)] transition hover:shadow-[0_22px_32px_rgba(58,134,255,0.45)]"
                >
                  {editingUserId ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardUsers;

