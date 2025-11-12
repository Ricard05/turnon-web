import { useMemo, useState } from 'react';
import IconEnCola from '../../assets/en cola.png';
import IconAtendiendo from '../../assets/atendiendo.png';
import IconEspera from '../../assets/espera promedio.png';
import IconEliminar from '../../assets/eliminar.png';

type QueueStat = {
  label: string;
  value: string;
  accent: string;
};

type UpcomingItem = {
  position: string;
  name: string;
  time: string;
  status: string;
  serviceName: string;
  email: string;
  phone: string;
  startTime?: string;
  ticketCode?: string;
};

type DashboardQueueProps = {
  stats: QueueStat[];
  upcoming: UpcomingItem[];
  isDarkMode: boolean;
  isLoading?: boolean;
  error?: string | null;
};

const doctorOptions = [
  { name: 'Dr. Garcia' },
  { name: 'Dr. Martinez' },
  { name: 'Dra. López' },
  { name: 'Dr. Hernández' },
];

const DashboardQueue = ({
  stats,
  upcoming,
  isDarkMode,
  isLoading = false,
  error = null,
}: DashboardQueueProps) => {
  const currentTurn = upcoming[0];
  const upcomingList = upcoming.slice(1);
  const [doctorIndex, setDoctorIndex] = useState(0);
  const isAttending = currentTurn?.status === 'ACTIVE';

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

  const sampleQueue = [
    { position: '#1', name: 'Angel Fuentes', schedule: '14 noviembre 12:00pm' },
    { position: '#1', name: 'Angel Fuentes', schedule: '14 noviembre 12:00pm' },
    { position: '#1', name: 'Angel Fuentes', schedule: '14 noviembre 12:00pm' },
    { position: '#1', name: 'Angel Fuentes', schedule: '14 noviembre 12:00pm' },
  ];

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
  const ticketCode = currentTurn?.ticketCode ?? 'Q---';
  const layoutClass = isAttending
    ? 'grid grid-cols-1 justify-items-center gap-6'
    : 'grid grid-cols-1 xl:grid-cols-[330px_minmax(0,1fr)_230px] gap-6 justify-center';

  return (
    <div className={`${layoutClass} ${isDarkMode ? 'text-slate-100' : 'text-slate-600'}`}>
      {/* Doctor / Turno actual */}
      <section
        className={`flex flex-col rounded-[34px] px-8 py-9 shadow-[0_30px_60px_rgba(142,172,255,0.25)] ${
          isDarkMode ? 'bg-white/5 border border-white/10 backdrop-blur' : 'bg-white/80 border border-[#d6e6ff]'
        } ${isAttending ? 'w-full max-w-[360px]' : ''}`}
      >
        <div
          className={`rounded-[26px] border px-6 py-6 ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#cfe7ff] bg-white/90'
          } shadow-[0_15px_30px_rgba(148,174,255,0.18)]`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.25em] ${
              isDarkMode ? 'text-slate-300' : 'text-[#415974]'
            }`}
          >
            Doctor
          </p>
          <div
            className={`mt-6 flex flex-col items-center gap-6 rounded-[24px] border px-10 py-7 shadow-[0_22px_40px_rgba(80,190,255,0.22)] ${
              isDarkMode ? 'border-white/10 bg-slate-900/60 backdrop-blur' : 'border-[#73d7ff]/50 bg-white'
            }`}
          >
            <p
              className={`text-xl font-semibold ${isDarkMode ? 'text-slate-100' : 'text-[#1b3246]'}`}
            >
              {doctorOptions[doctorIndex]?.name ?? 'Sin asignar'}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={goPreviousDoctor}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_14px_24px_rgba(28,200,255,0.35)] transition duration-200 ${
                  isDarkMode
                    ? 'border border-white/15 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 hover:scale-105'
                    : 'bg-gradient-to-br from-[#28d4ff] via-[#1fc2ff] to-[#18aaf5] hover:scale-105'
                }`}
                aria-label="Doctor anterior"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M14.7 6.3a1 1 0 0 1 0 1.4L11.41 11H19a1 1 0 1 1 0 2h-7.59l3.3 3.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.41 0Z" />
                </svg>
              </button>
              <div className="flex flex-col items-center gap-2">
                <span className="h-1 w-14 rounded-full bg-gradient-to-r from-[#1bc2ff] to-[#7fe2ff]" />
                <div className="flex items-center justify-center gap-[6px]">
                  {doctorOptions.map((_, index) => (
                    <span
                      key={`indicator-${index}`}
                      className={`h-2 w-2 rounded-full ${
                        index === doctorIndex
                          ? 'bg-[#19c4ff]'
                          : isDarkMode
                          ? 'bg-white/20'
                          : 'bg-[#d6eaff]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={goNextDoctor}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_14px_24px_rgba(28,200,255,0.35)] transition duration-200 ${
                  isDarkMode
                    ? 'border border-white/15 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 hover:scale-105'
                    : 'bg-gradient-to-br from-[#28d4ff] via-[#1fc2ff] to-[#18aaf5] hover:scale-105'
                }`}
                aria-label="Doctor siguiente"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M9.3 6.3a1 1 0 0 0 0 1.4L12.59 11H5a1 1 0 1 0 0 2h7.59l-3.3 3.3a1 1 0 0 0 1.42 1.4l5-5a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.41 0Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`mt-6 flex-1 rounded-[26px] border px-6 py-6 ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#d4e5ff] bg-white/80'
          }`}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.25em] ${
              isDarkMode ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            Atendiendo
          </p>
          {!isAttending && (
            <button className="mt-5 w-full rounded-full bg-[#1ebcff] py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(30,188,255,0.35)]">
              Llamar siguiente
            </button>
          )}

          <div
            className={`mt-7 rounded-[22px] border px-5 py-5 text-sm ${
              isDarkMode ? 'border-white/10 bg-slate-900/60 text-slate-200' : 'border-[#e4ecff] bg-white text-slate-500'
            }`}
          >
            {isAttending ? (
              <>
                <div
                  className={`text-center text-5xl font-bold ${
                    isDarkMode ? 'text-[#4fd4ff]' : 'text-[#1cc0ff]'
                  }`}
                >
                  {ticketCode}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className={isDarkMode ? 'text-slate-300' : undefined}>Cliente</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {currentTurn?.name ?? 'Sin asignar'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={isDarkMode ? 'text-slate-300' : undefined}>Tiempo</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {currentTurn?.time ?? 'Por definir'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span>Posición</span>
                  <span className="font-semibold text-[#16c0ff]">{currentTurn?.position ?? '--'}</span>
                </div>
              </>
            ) : (
              <div
                className={`py-6 text-center text-sm font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
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
            <button
              className={`w-full rounded-full py-3 text-sm font-semibold transition ${
                isDarkMode ? 'border border-white/15 text-slate-200 hover:bg-white/10' : 'border border-[#e0e4f0] text-slate-500 hover:bg-white'
              }`}
            >
              Ausente
            </button>
          </div>
        </div>
      </section>

      {!isAttending && (
        <>
          {/* Lista de espera */}
          <section
            className={`rounded-[34px] px-10 py-9 shadow-[0_30px_60px_rgba(142,172,255,0.25)] ${
              isDarkMode ? 'border border-white/10 bg-white/5 backdrop-blur' : 'border border-[#d6e6ff] bg-white/75'
            }`}
          >
            <div>
              <h2
                className={`text-sm font-semibold uppercase tracking-[0.3em] ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                Próximos en espera
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Turnos en cola</p>
            </div>

            <div className="mt-7 space-y-4">
              {error && (
                <div
                  className={`flex items-center justify-center rounded-[22px] border px-6 py-6 text-sm font-semibold ${
                    isDarkMode
                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                      : 'border-rose-200 bg-rose-50 text-rose-500'
                  }`}
                >
                  {error}
                </div>
              )}

              {!error && (
                <div className="space-y-4">
                  {upcomingDisplay.map((item, idx) => (
                    <article
                      key={`${item.position}-${idx}-${item.name}`}
                      className={`flex items-center justify-between gap-4 rounded-[26px] border px-6 py-4 shadow-[0_18px_35px_rgba(162,186,255,0.25)] transition hover:shadow-[0_20px_40px_rgba(162,186,255,0.35)] ${
                        isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#e6ecff] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-[20px] border text-lg font-bold ${
                            isDarkMode
                              ? 'border-white/20 bg-white/10 text-[#fbcafa]'
                              : 'border-[#ffd9ff] bg-[#fff2ff] text-[#d25dff]'
                          }`}
                        >
                          {item.position}
                        </span>
                        <div>
                          <p className={`text-base font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}>
                            {item.name}
                          </p>
                          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}>{item.schedule}</p>
                        </div>
                      </div>
                      <button
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                          isDarkMode
                            ? 'bg-white/10 text-rose-200 hover:bg-white/20'
                            : 'bg-[#ffe9ee] text-rose-400 hover:bg-[#ffd7e0]'
                        }`}
                      >
                        <img src={IconEliminar} alt="Eliminar" className="h-4 w-4" />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Estadísticas */}
          <section
            className={`flex h-max flex-col gap-5 rounded-[34px] px-6 py-7 shadow-[0_30px_60px_rgba(142,172,255,0.25)] ${
              isDarkMode ? 'border border-white/10 bg-white/5 backdrop-blur' : 'border border-[#d6e6ff] bg-white/70'
            }`}
          >
            <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>Estadísticas</h2>
            <div className="space-y-5">
              {statsSummary.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 rounded-[26px] border px-4 py-3 shadow-[0_16px_32px_rgba(166,190,255,0.25)] ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#e6ecff] bg-white'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-[18px] ${
                      isDarkMode ? 'bg-white/10' : stat.iconBg
                    }`}
                  >
                    <img src={stat.icon} alt={stat.label} className="h-6 w-6 object-contain" />
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                      {stat.label}
                    </p>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Actual</span>
                  </div>
                  <span
                    className={`ml-auto text-lg font-bold ${
                      isDarkMode ? 'text-slate-100' : stat.accent
                    }`}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardQueue;