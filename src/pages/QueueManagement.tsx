import { useCallback, useEffect, useState } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import { TurnsService } from '../context';

type QueueManagementProps = {
  onNavigate?: (section: 'filas' | 'turnos' | 'inicio') => void;
  onLogout?: () => void;
};

type QueueEntry = {
  position: string;
  name: string;
  time: string;
  serviceName: string;
  status: string;
  startTime?: string;
};

type QueueStat = {
  label: string;
  value: string;
  accent: string;
};

const formatRelativeTime = (iso?: string) => {
  if (!iso) return 'Sin horario';
  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return 'Sin horario';
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 0) return 'En curso';
  if (diffMinutes < 60) return `En ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `En ${hours}h ${minutes}m`;
};

const QueueManagement = ({ onNavigate, onLogout }: QueueManagementProps) => {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<QueueStat[]>([
    { label: 'En cola', value: '0', accent: 'bg-blue-500' },
    { label: 'Atendiendo', value: '0', accent: 'bg-green-500' },
    { label: 'Espera promedio', value: '—', accent: 'bg-orange-400' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const turns = await TurnsService.fetchTurns();
      const sorted = [...turns].sort((a, b) => {
        const timeA = a.startTime ? new Date(a.startTime).getTime() : Number.MAX_SAFE_INTEGER;
        const timeB = b.startTime ? new Date(b.startTime).getTime() : Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      });
      const mapped = sorted.map<QueueEntry>((turn, index) => ({
        position: `#${index + 1}`,
        name: turn.patientName?.trim() || `Paciente ${index + 1}`,
        time: formatRelativeTime(turn.startTime),
        serviceName: turn.serviceName?.trim() || 'Servicio no especificado',
        status: turn.status?.toUpperCase?.() || 'PENDING',
        startTime: turn.startTime,
      }));

      const pending = sorted.filter((turn) => (turn.status ?? '').toUpperCase() === 'PENDING').length;
      const active = sorted.filter((turn) => (turn.status ?? '').toUpperCase() === 'ACTIVE').length;

      setEntries(mapped);
      setStats([
        { label: 'En cola', value: pending.toString(), accent: 'bg-blue-500' },
        { label: 'Atendiendo', value: active.toString(), accent: 'bg-green-500' },
        { label: 'Espera promedio', value: '—', accent: 'bg-orange-400' },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo cargar la lista de turnos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const currentTurn = entries[0];
  const queueList = entries.slice(1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e7f0ff] via-[#e8efff] to-[#f6f5ff] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white shadow-[0_15px_60px_rgba(80,130,255,0.25)] rounded-tr-[40px] rounded-br-[40px] flex flex-col py-10 px-8">
        <div className="flex items-center justify-between">
          <img src={SmileUpLogo} alt="SmileUp" className="h-10 object-contain" />
        </div>

        <nav className="mt-12 space-y-3">
          {[
            { label: 'Filas', key: 'filas' as const },
            { label: 'Turnos', key: 'turnos' as const },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              className={`w-full text-left px-5 py-3 rounded-2xl font-semibold transition ${
                item.key === 'filas'
                  ? 'bg-gradient-to-r from-[#27c3ff] to-[#2a8bff] text-white shadow-[0_10px_30px_rgba(39,195,255,0.25)]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <img src={SidebarIllustration} alt="Queue" className="w-40 mx-auto" />
          <button
            onClick={onLogout}
            className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-semibold"
          >
            <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 py-12 px-16">
        <div className="mx-auto max-w-[1050px]">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-slate-800">Manejo de la fila</h1>
              <p className="text-slate-400">Control general de los turnos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">Elio Lujan</p>
                <span className="text-xs text-slate-400">Administrador</span>
              </div>
              <img src={AvatarImage} alt="Avatar" className="h-10 w-10 object-cover rounded-full border border-slate-200" />
            </div>
          </header>

          <div className="mt-10 grid grid-cols-[330px_1fr] gap-8">
            {/* Current ticket card */}
            <section className="rounded-[30px] border border-[#cfe1ff] bg-white/80 px-8 py-10 shadow-[0_25px_45px_rgba(122,161,255,0.25)]">
              <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
                {currentTurn ? currentTurn.status : 'Sin turnos'}
              </h2>
              <p className="mt-4 text-6xl font-bold text-[#27c3ff]">
                {currentTurn ? currentTurn.position : '--'}
              </p>

              <div className="mt-8 space-y-3 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Cliente</span>
                  <span className="font-semibold text-slate-600">{currentTurn ? currentTurn.name : 'Sin asignar'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo</span>
                  <span className="font-semibold text-slate-600">{currentTurn ? currentTurn.time : 'Por definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posición</span>
                  <span className="font-semibold text-slate-600">{currentTurn ? currentTurn.position : '--'}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button className="w-full rounded-full bg-gradient-to-r from-[#29cc72] to-[#1fb86f] py-3 text-white font-semibold shadow-[0_12px_30px_rgba(41,204,114,0.3)]">
                  Completar
                </button>
                <button className="w-full rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ff4d6d] py-3 text-white font-semibold shadow-[0_12px_30px_rgba(255,107,107,0.35)]">
                  Cancelar
                </button>
                <button className="w-full rounded-full border border-[#d9dce8] py-3 text-slate-500 font-semibold hover:bg-slate-100">
                  Ausente
                </button>
              </div>

              <div className="mt-10 rounded-[24px] border border-[#cfe1ff] bg-white/70 p-6">
                <h3 className="text-sm font-semibold text-slate-600">Estadísticas</h3>
                <div className="mt-4 space-y-4 text-sm">
                  {stats.map((stat: QueueStat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${stat.accent}`} />
                      <span className="text-slate-500">{stat.label}</span>
                      <span className="ml-auto font-semibold text-slate-700">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Upcoming list */}
            <section className="rounded-[30px] border border-[#cfe1ff] bg-white/80 px-8 py-10 shadow-[0_25px_45px_rgba(148,167,255,0.25)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Próximos en espera</h2>
                  <p className="text-xs text-slate-400">
                    {currentTurn?.startTime
                      ? `Próximo turno: ${new Date(currentTurn.startTime).toLocaleTimeString()}`
                      : 'Turnos en cola'}
                  </p>
                </div>
                <button className="rounded-full border border-[#d9dce8] px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                  Gestionar lista
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {loading && (
                  <div className="flex items-center justify-center rounded-[22px] border border-[#d9dce8] bg-white/70 px-6 py-6 text-sm text-slate-500">
                    Cargando turnos…
                  </div>
                )}

                {error && (
                  <div className="flex items-center justify-center rounded-[22px] border border-red-200 bg-red-50 px-6 py-6 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {!loading && !error && queueList.length === 0 && (
                  <div className="flex items-center justify-center rounded-[22px] border border-[#d9dce8] bg-white/70 px-6 py-6 text-sm text-slate-500">
                    No hay turnos en espera.
                  </div>
                )}

                {!error && queueList.length > 0 && (
                  <div className="overflow-hidden rounded-[22px] border border-[#d9dce8] bg-white/70">
                    <table className="min-w-full text-left text-sm text-slate-600">
                      <thead className="bg-[#eef4ff] text-xs uppercase tracking-[0.3em] text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Turno</th>
                          <th className="px-5 py-3">Paciente</th>
                          <th className="px-5 py-3">Horario</th>
                          <th className="px-5 py-3">Servicio</th>
                          <th className="px-5 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d9dce8]">
                        {queueList.map((item: QueueEntry, idx: number) => (
                          <tr key={`${item.position}-${idx}-${item.name}`}>
                            <td className="px-5 py-4 font-semibold text-[#9b59ff]">{item.position}</td>
                            <td className="px-5 py-4">{item.name}</td>
                            <td className="px-5 py-4">{item.time}</td>
                            <td className="px-5 py-4">{item.serviceName}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                  item.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-700'
                                    : item.status === 'ACTIVE'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueueManagement;