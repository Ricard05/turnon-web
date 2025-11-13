import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { TurnsService } from '../../context';
import type { Turn } from '../../context/turnsService';

type TurnRow = {
  id: string;
  number: string;
  client: string;
  service: string;
  status: string;
  scheduledAt: string;
  waitTime: string;
};

type AdminTurnsScreenProps = {
  isDarkMode: boolean;
};

const formatTime = (iso?: string | null) => {
  if (!iso) return 'Sin horario';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Sin horario';
  return date
    .toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace('a. m.', 'am')
    .replace('p. m.', 'pm')
    .replace('a. m.', 'am')
    .replace('p. m.', 'pm');
};

const formatWait = (iso?: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 0) {
    return `En ${Math.abs(diffMinutes)} min`;
  }
  if (diffMinutes === 0) {
    return 'Ahora';
  }
  return `${diffMinutes} min`;
};

const normalizeTurnRow = (turn: Turn): TurnRow => {
  const number =
    (typeof turn.turn === 'string' && turn.turn.trim()) ||
    (turn.id ? `Q${String(turn.id).padStart(3, '0')}` : '—');

  const client = turn.patientName?.trim() || 'Paciente sin nombre';
  const service = turn.serviceName?.trim() || 'Servicio no asignado';
  const status = turn.status?.toString().toUpperCase?.() || 'PENDING';
  const scheduledAt = formatTime(turn.startTime ?? turn.checkIn ?? turn.createdAt);
  const waitTime = formatWait(turn.startTime ?? turn.checkIn ?? turn.createdAt);

  return {
    id: String(turn.id ?? number),
    number,
    client,
    service,
    status,
    scheduledAt,
    waitTime,
  };
};

const AdminTurnsScreen = ({ isDarkMode }: AdminTurnsScreenProps) => {
  const [turns, setTurns] = useState<TurnRow[]>([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTurns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TurnsService.fetchTurns();
      setTurns(response.map((turn) => normalizeTurnRow(turn)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron obtener los turnos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTurns();
  }, [loadTurns]);

  const filteredTurnos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = query
      ? turns.filter((turno) =>
          [turno.number, turno.client, turno.service, turno.status, turno.scheduledAt, turno.waitTime]
            .join(' ')
            .toLowerCase()
            .includes(query),
        )
      : turns;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return {
      rows: base.slice(start, end),
      total: base.length,
      totalPages: Math.max(1, Math.ceil(base.length / rowsPerPage)),
    };
  }, [turns, search, page, rowsPerPage]);

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const total = filteredTurnos.totalPages;
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
  }, [page, filteredTurnos.totalPages]);

  const containerClass = isDarkMode
    ? 'bg-gradient-to-br from-[#0f172a] via-[#101d39] to-[#172554] border border-white/10 text-slate-100'
    : 'bg-gradient-to-br from-white via-[#eef6ff] to-[#d9e7ff] text-slate-600 border border-[#d0e5ff]';

  const tableHeaderClass = isDarkMode
    ? 'bg-gradient-to-r from-[#3AD0FF] to-[#67E5BC] text-white'
    : 'bg-[#3AD0FF] text-white';

  const tableContainerClass = isDarkMode
    ? 'bg-white/5 border border-white/10 text-slate-100 shadow-[0_24px_48px_rgba(8,47,73,0.45)]'
    : 'bg-white/90 border border-white/60 text-slate-600 shadow-[0_20px_40px_rgba(59,130,246,0.12)]';

  const rowHoverClass = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-50';

  return (
    <section
      className={`rounded-[36px] px-10 py-10 shadow-[0_35px_65px_rgba(58,134,255,0.18)] transition-colors duration-300 ${containerClass}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Turnos activos</h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500/80'}`}>
            Visualiza los turnos en progreso y sus tiempos de espera.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:bg-white dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar por hora
        </button>
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
            placeholder="Buscar por cliente o número de turno…"
            className={`w-full rounded-full border px-12 py-3 text-sm outline-none transition ${
              isDarkMode
                ? 'border-white/10 bg-white/10 text-slate-100 placeholder:text-slate-400 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/40'
                : 'border-white/60 bg-white/80 text-slate-600 placeholder:text-slate-400 focus:border-[#3AD0FF] focus:ring-2 focus:ring-[#3AD0FF]/30'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-500'}>Mostrar</span>
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
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-500'}>filas</span>
        </div>
      </div>

      <div className={`mt-8 overflow-hidden rounded-[28px] backdrop-blur-sm ${tableContainerClass}`}>
        <div className={`${tableHeaderClass} text-xs font-semibold uppercase tracking-[0.3em]`}>
          <div className="grid grid-cols-[1fr_1.8fr_1.4fr_1fr_1fr] px-8 py-4">
            <span>Número</span>
            <span>Cliente</span>
            <span>Servicio</span>
            <span>Hora</span>
            <span className="text-right">Espera</span>
          </div>
        </div>

        <div className={isDarkMode ? 'divide-y divide-white/10' : 'divide-y divide-slate-100'}>
          {filteredTurnos.rows.map((turno) => (
            <div
              key={turno.id}
              className={`grid grid-cols-[1fr_1.8fr_1.4fr_1fr_1fr] px-8 py-5 text-sm transition ${rowHoverClass}`}
            >
              <span className="font-semibold">{turno.number}</span>
              <span>{turno.client}</span>
              <span>{turno.service}</span>
              <span>{turno.scheduledAt}</span>
              <span className="text-right text-slate-500 dark:text-slate-300">{turno.waitTime}</span>
            </div>
          ))}

          {filteredTurnos.rows.length === 0 && (
            <div className="px-8 py-12 text-center text-sm text-slate-400">
              No se encontraron turnos para la búsqueda “{search}”.
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-6 flex flex-wrap items-center justify-between gap-4 text-sm ${
          isDarkMode ? 'text-slate-300' : 'text-slate-500'
        }`}
      >
        <span>
          Mostrando {(filteredTurnos.rows.length && (page - 1) * rowsPerPage + 1) || 0}-
          {(page - 1) * rowsPerPage + filteredTurnos.rows.length} de {filteredTurnos.total}
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
            onClick={() => setPage((prev) => Math.min(filteredTurnos.totalPages, prev + 1))}
            disabled={page === filteredTurnos.totalPages}
            className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
              page === filteredTurnos.totalPages
                ? `cursor-not-allowed ${isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-200/50 text-slate-400'}`
                : `${isDarkMode ? 'bg-white/10 text-slate-100 hover:bg-white/20' : 'bg-white/80 text-slate-600 hover:bg-white'}`
            }`}
          >
            ›
          </button>
        </div>
      </div>

      {(loading || error) && (
        <div
          className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${
            error
              ? isDarkMode
                ? 'bg-rose-500/10 border border-rose-400/40 text-rose-200'
                : 'bg-rose-50 border border-rose-200 text-rose-600'
              : isDarkMode
                ? 'bg-sky-500/10 border border-sky-400/40 text-slate-100'
                : 'bg-sky-50 border border-sky-200 text-sky-600'
          }`}
        >
          {error ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void loadTurns()}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-100 hover:bg-white/10'
                    : 'border border-sky-200 text-sky-600 hover:bg-white'
                }`}
              >
                Reintentar
              </button>
            </div>
          ) : (
            'Cargando turnos…'
          )}
        </div>
      )}
    </section>
  );
};

export default AdminTurnsScreen;

