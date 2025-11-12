import { useCallback, useEffect, useMemo, useState } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import SidebarIllustration from '../assets/Group 450.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import IconInicio from '../assets/icono inicio.png';
import IconFilas from '../assets/filas icono.png';
import IconTurnos from '../assets/carpeta sin relleno.png';
import IconEnCola from '../assets/en cola.png';
import IconAtendiendo from '../assets/atendiendo.png';
import IconEspera from '../assets/espera promedio.png';
import IconFlechaIzquierda from '../assets/flecha izquierda.png';
import IconFlechaDerecha from '../assets/flecha derecha.png';
import IconEliminar from '../assets/eliminar.png';
import IconSun from '../assets/Vector.png';
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
  ticketCode: string;
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
        ticketCode: `Q${String(index + 1).padStart(3, '0')}`,
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
  const isAttending = currentTurn?.status === 'ACTIVE';

  const upcomingList = entries.slice(1);

  const doctorOptions = useMemo(
    () => [
      { name: 'Dr. Garcia' },
      { name: 'Dr. Martinez' },
      { name: 'Dra. López' },
      { name: 'Dr. Hernández' },
      { name: 'Dra. Ruiz' },
    ],
    [],
  );

  const [doctorIndex, setDoctorIndex] = useState(0);
  const currentDoctor = doctorOptions[doctorIndex] ?? doctorOptions[0];

  const goPreviousDoctor = () => {
    setDoctorIndex((prev) => (prev - 1 + doctorOptions.length) % doctorOptions.length);
  };

  const goNextDoctor = () => {
    setDoctorIndex((prev) => (prev + 1) % doctorOptions.length);
  };

  const statsSummary = useMemo(() => {
    const getValue = (label: string, fallback: string) =>
      stats.find((item) => item.label.toLowerCase().includes(label))?.value ?? fallback;

    return [
      {
        label: 'En cola',
        value: getValue('cola', '3'),
        icon: IconEnCola,
        iconBg: 'bg-[#eff5ff]',
        accent: 'text-[#2563eb]',
      },
      {
        label: 'Atendiendo',
        value: getValue('atend', '1'),
        icon: IconAtendiendo,
        iconBg: 'bg-[#fff5eb]',
        accent: 'text-[#f97316]',
      },
      {
        label: 'Espera promedio',
        value: getValue('espera', '7 min'),
        icon: IconEspera,
        iconBg: 'bg-[#edfdf5]',
        accent: 'text-[#10b981]',
      },
    ];
  }, [stats]);

  const sampleQueue = useMemo(
    () => [
      {
        position: '#1',
        name: 'Angel Fuentes',
        schedule: '14 noviembre 12:00pm',
      },
      {
        position: '#1',
        name: 'Angel Fuentes',
        schedule: '14 noviembre 12:00pm',
      },
      {
        position: '#1',
        name: 'Angel Fuentes',
        schedule: '14 noviembre 12:00pm',
      },
      {
        position: '#1',
        name: 'Angel Fuentes',
        schedule: '14 noviembre 12:00pm',
      },
    ],
    [],
  );

  const formatSchedule = (iso?: string, fallback?: string) => {
    if (!iso) return fallback ?? 'Sin horario';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return fallback ?? 'Sin horario';
    const day = date.getDate();
    const month = date.toLocaleString('es-MX', { month: 'long' });
    const time = date
      .toLocaleString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace('a. m.', 'am')
      .replace('p. m.', 'pm')
      .replace(' a. m.', 'am')
      .replace(' p. m.', 'pm');
    return `${day} ${month} ${time}`;
  };

  const upcomingDisplay =
    upcomingList.length > 0
      ? upcomingList.map((item) => ({
          position: item.position,
          name: item.name,
          schedule: item.startTime ? formatSchedule(item.startTime, item.time) : item.time,
        }))
      : sampleQueue;

  const layoutClass = isAttending
    ? 'mt-10 flex justify-center'
    : 'mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[330px_minmax(0,1fr)_230px]';

  return (
    <div className="min-h-screen w-full bg-[#12121a] py-10 px-6">
      <div className="mx-auto flex w-full max-w-[1300px] overflow-hidden rounded-[38px] bg-[radial-gradient(circle_at_top_left,_#f6fbff_0%,_#f2f2ff_45%,_#fdf7ff_80%,_#ffffff_100%)] shadow-[0_35px_70px_rgba(108,140,255,0.25)]">
        {/* Sidebar */}
        <aside className="flex w-[260px] flex-col gap-10 bg-white/65 px-8 py-10 backdrop-blur-md">
          <div className="flex items-center">
            <img src={SmileUpLogo} alt="SmileUp" className="h-10 object-contain" />
          </div>

          <nav className="space-y-3">
            {[
              { label: 'Inicio', key: 'inicio' as const, icon: IconInicio },
              { label: 'Filas', key: 'filas' as const, icon: IconFilas },
              { label: 'Turnos', key: 'turnos' as const, icon: IconTurnos },
            ].map((item) => {
              const isActive = item.key === 'filas';
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate?.(item.key)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#1ac1ff] text-white shadow-[0_12px_30px_rgba(32,152,255,0.35)]'
                      : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isActive ? 'bg-white/15' : 'bg-[#eff6ff]'
                    }`}
                  >
                    <img src={item.icon} alt={item.label} className="h-6 w-6 object-contain" />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-10">
            <img src={SidebarIllustration} alt="Ilustración filas" className="mx-auto w-44 object-contain" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-[#e4ecff] bg-white/70 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white"
            >
              <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-12 py-12">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-bold text-slate-800">Manejo de la fila</h1>
              <p className="text-sm text-slate-400">Control general de los turnos</p>
            </div>
            <div className="flex items-center gap-5">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_10px_35px_rgba(31,152,255,0.2)]">
                <img src={IconSun} alt="Cambiar tema" className="h-5 w-5 object-contain" />
              </button>
              <div className="flex items-center gap-3 rounded-[22px] bg-white px-5 py-3 shadow-[0_15px_45px_rgba(31,152,255,0.2)]">
                <img src={AvatarImage} alt="Avatar" className="h-10 w-10 rounded-full border border-white object-cover" />
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">Elio Lujan</p>
                  <span className="text-xs text-slate-400">Empleado</span>
                </div>
              </div>
            </div>
          </header>

          <div className={layoutClass}>
            {/* Doctor card */}
            <section
              className={`flex flex-col rounded-[34px] border border-[#d6e6ff] bg-white/80 px-8 py-9 shadow-[0_30px_60px_rgba(142,172,255,0.25)] ${
                isAttending ? 'mx-auto w-full max-w-[360px]' : ''
              }`}
            >
              <div className="rounded-[26px] border border-[#cfe7ff] bg-white/90 p-6 shadow-[0_15px_30px_rgba(148,174,255,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#415974]">Doctor</p>
                <div className="mt-6 flex items-center justify-between rounded-[24px] border border-[#73d7ff]/50 bg-white px-6 py-5 shadow-[0_22px_40px_rgba(80,190,255,0.22)]">
                  <button
                    onClick={goPreviousDoctor}
                    className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#19c4ff] text-white shadow-[0_12px_24px_rgba(25,196,255,0.35)] transition hover:bg-[#11b8f1]"
                    aria-label="Doctor anterior"
                  >
                    <img src={IconFlechaIzquierda} alt="" className="h-4 w-4" />
                  </button>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#1b3246]">{currentDoctor?.name ?? 'Sin asignar'}</p>
                    <div className="mt-3 flex items-center gap-[6px]">
                      {doctorOptions.map((_, index) => (
                        <span
                          key={`indicator-${index}`}
                          className={`h-2 w-2 rounded-full ${
                            index === doctorIndex ? 'bg-[#19c4ff]' : 'bg-[#d6eaff]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={goNextDoctor}
                    className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#19c4ff] text-white shadow-[0_12px_24px_rgba(25,196,255,0.35)] transition hover:bg-[#11b8f1]"
                    aria-label="Doctor siguiente"
                  >
                    <img src={IconFlechaDerecha} alt="" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex-1 rounded-[26px] border border-[#d4e5ff] bg-white/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Atendiendo</p>
                {!isAttending && (
                  <button className="mt-5 w-full rounded-full bg-[#1ebcff] py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(30,188,255,0.35)]">
                    Llamar siguiente
                  </button>
                )}

                <div className="mt-7 rounded-[22px] border border-[#e4ecff] bg-white px-5 py-5 text-sm text-slate-500">
                  {isAttending ? (
                    <>
                      <div className="text-center text-5xl font-bold text-[#1cc0ff]">
                        {currentTurn?.ticketCode ?? 'Q---'}
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span>Cliente</span>
                        <span className="font-semibold text-slate-700">{currentTurn?.name ?? 'Sin asignar'}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span>Tiempo</span>
                        <span className="font-semibold text-slate-700">
                          {currentTurn?.time ?? 'Por definir'}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span>Posición</span>
                        <span className="font-semibold text-[#16c0ff]">{currentTurn?.position ?? '--'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-sm font-medium text-slate-400">
                      No hay turno en curso.
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full rounded-full bg-[#29cc72] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(41,204,114,0.35)]">
                    Completar
                  </button>
                  <button className="w-full rounded-full bg-[#ff5d70] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,93,112,0.35)]">
                    Cancelar
                  </button>
                  <button className="w-full rounded-full border border-[#e0e4f0] py-3 text-sm font-semibold text-slate-500 transition hover:bg-white">
                    Ausente
                  </button>
                </div>
              </div>
            </section>

            {!isAttending && (
              <>
                {/* Queue list */}
                <section className="rounded-[34px] border border-[#d6e6ff] bg-white/75 px-10 py-9 shadow-[0_30px_60px_rgba(142,172,255,0.25)]">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Próximos en espera</h2>
                    <p className="text-xs text-slate-400">Turnos en cola</p>
                  </div>

                  <div className="mt-7 space-y-4">
                    {error && (
                      <div className="flex items-center justify-center rounded-[22px] border border-rose-200 bg-rose-50 px-6 py-6 text-sm font-semibold text-rose-500">
                        {error}
                      </div>
                    )}

                    {!error && (
                      <div className="space-y-4">
                        {upcomingDisplay.map((item, idx) => (
                          <article
                            key={`${item.position}-${idx}-${item.name}`}
                            className="flex items-center justify-between gap-4 rounded-[26px] border border-[#e6ecff] bg-white px-6 py-4 shadow-[0_18px_35px_rgba(162,186,255,0.25)] transition hover:shadow-[0_20px_40px_rgba(162,186,255,0.35)]"
                          >
                            <div className="flex items-center gap-5">
                              <span className="flex h-12 w-12 items-center justify-center rounded-[20px] border border-[#ffd9ff] bg-[#fff2ff] text-lg font-bold text-[#d25dff]">
                                {item.position}
                              </span>
                              <div>
                                <p className="text-base font-semibold text-slate-700">{item.name}</p>
                                <p className="mt-1 text-sm text-slate-400">{item.schedule}</p>
                              </div>
                            </div>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe9ee] text-rose-400 transition hover:bg-[#ffd7e0]">
                              <img src={IconEliminar} alt="Eliminar" className="h-4 w-4" />
                            </button>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Stats */}
                <section className="flex h-max flex-col gap-5 rounded-[34px] border border-[#d6e6ff] bg-white/70 px-6 py-7 shadow-[0_30px_60px_rgba(142,172,255,0.25)]">
                  <h2 className="text-sm font-semibold text-slate-600">Estadísticas</h2>
                  <div className="space-y-4">
                    {statsSummary.map((stat) => (
                      <article
                        key={stat.label}
                        className="flex items-center gap-4 rounded-[26px] border border-[#e6ecff] bg-white px-5 py-4 shadow-[0_16px_32px_rgba(166,190,255,0.25)]"
                      >
                        <span className={`flex h-11 w-11 items-center justify-center rounded-[18px] ${stat.iconBg}`}>
                          <img src={stat.icon} alt={stat.label} className="h-6 w-6 object-contain" />
                        </span>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                          <span className="text-xs text-slate-400">Actual</span>
                        </div>
                        <span className={`ml-auto text-lg font-bold ${stat.accent}`}>{stat.value}</span>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QueueManagement;