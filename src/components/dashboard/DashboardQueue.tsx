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
};

type DashboardQueueProps = {
  stats: QueueStat[];
  upcoming: UpcomingItem[];
  isDarkMode: boolean;
  isLoading?: boolean;
  error?: string | null;
};

const DashboardQueue = ({
  stats,
  upcoming,
  isDarkMode,
  isLoading = false,
  error = null,
}: DashboardQueueProps) => {
  const primaryCardClass = `rounded-[30px] px-8 py-10 shadow-[0_25px_45px_rgba(122,161,255,0.25)] transition-colors duration-300 ${
    isDarkMode
      ? 'bg-white/10 border border-white/10 text-slate-100'
      : 'bg-white/80 border border-[#cfe1ff] text-slate-600'
  }`;

  const secondaryCardClass = `rounded-[30px] px-8 py-10 shadow-[0_25px_45px_rgba(148,167,255,0.25)] transition-colors duration-300 ${
    isDarkMode
      ? 'bg-white/8 border border-white/10 text-slate-200'
      : 'bg-white/80 border border-[#cfe1ff] text-slate-600'
  }`;

  const headingClass = isDarkMode ? 'text-slate-300' : 'text-slate-400';
  const labelClass = isDarkMode ? 'text-slate-200' : 'text-slate-600';
  const valueClass = isDarkMode ? 'text-slate-100' : 'text-slate-600';
  const listItemClass = isDarkMode
    ? 'border border-white/10 bg-white/[0.05] shadow-[0_15px_24px_rgba(8,47,73,0.35)]'
    : 'border border-[#d9dce8] bg-white/70 shadow-[0_15px_24px_rgba(209,220,255,0.45)]';
  const listButtonPrimary = isDarkMode
    ? 'bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white'
    : 'bg-gradient-to-r from-[#2dd4bf] to-[#1fb6ff] text-white';
  const listButtonSecondary = isDarkMode
    ? 'border border-red-400 text-rose-300 hover:bg-rose-500/10'
    : 'border border-[#ffc4d6] text-[#ff7aa2] hover:bg-[#ffeff5]';

  const currentTurn = upcoming[0];
  const queueList = upcoming;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-6 justify-center">
      <section className={primaryCardClass}>
        <h2 className={`text-sm font-medium uppercase tracking-[0.3em] ${headingClass}`}>
          {currentTurn ? currentTurn.status : 'Sin turnos'}
        </h2>
        <p className="mt-4 text-6xl font-bold text-[#27c3ff]">
          {currentTurn ? currentTurn.position : '--'}
        </p>

        <div className={`mt-8 space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
          <div className="flex justify-between">
            <span>Cliente</span>
            <span className={`font-semibold ${valueClass}`}>
              {currentTurn ? currentTurn.name : 'Sin asignar'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Contacto</span>
            <span className={`font-semibold ${valueClass}`}>
              {currentTurn ? currentTurn.email : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tiempo</span>
            <span className={`font-semibold ${valueClass}`}>
              {currentTurn ? currentTurn.time : 'Por definir'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Teléfono</span>
            <span className={`font-semibold ${valueClass}`}>
              {currentTurn ? currentTurn.phone : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Servicio</span>
            <span className={`font-semibold ${valueClass}`}>
              {currentTurn ? currentTurn.serviceName : '—'}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full rounded-full bg-gradient-to-r from-[#29cc72] to-[#1fb86f] py-3 text-white font-semibold shadow-[0_12px_30px_rgba(41,204,114,0.3)]">
            Completar
          </button>
          <button className="w-full rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ff4d6d] py-3 text-white font-semibold shadow-[0_12px_30px_rgba(255,107,107,0.35)]">
            Cancelar
          </button>
          <button
            className={`w-full rounded-full py-3 font-semibold transition ${
              isDarkMode
                ? 'border border-white/15 text-slate-200 hover:bg-white/10'
                : 'border border-[#d9dce8] text-slate-500 hover:bg-slate-100'
            }`}
          >
            Ausente
          </button>
        </div>

        <div
          className={`mt-10 rounded-[24px] p-6 transition-colors ${
            isDarkMode ? 'border border-white/10 bg-white/[0.04]' : 'border border-[#cfe1ff] bg-white/70'
          }`}
        >
          <h3 className={`text-sm font-semibold ${labelClass}`}>Estadísticas</h3>
          <div className="mt-4 space-y-4 text-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${stat.accent}`} />
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-500'}>{stat.label}</span>
                <span className={`ml-auto font-semibold ${valueClass}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={secondaryCardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className={`text-sm font-medium uppercase tracking-[0.3em] ${headingClass}`}>
              Próximos en espera
            </h2>
            <p className={`text-xs ${headingClass}`}>
              {currentTurn?.startTime
                ? `Próximo turno: ${new Date(currentTurn.startTime).toLocaleTimeString()}`
                : 'Turnos en cola'}
            </p>
          </div>
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              isDarkMode
                ? 'border border-white/15 text-slate-200 hover:bg-white/10'
                : 'border border-[#d9dce8] text-slate-500 hover:bg-slate-100'
            }`}
          >
            Gestionar lista
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading && (
            <div
              className={`flex items-center justify-center rounded-[22px] px-6 py-6 text-sm ${
                isDarkMode ? 'border border-white/10 bg-white/5 text-slate-300' : 'border border-[#d9dce8] bg-white/60 text-slate-500'
              }`}
            >
              Cargando turnos…
            </div>
          )}

          {error && (
            <div
              className={`flex items-center justify-center rounded-[22px] px-6 py-6 text-sm font-medium ${
                isDarkMode ? 'border border-rose-500/40 bg-rose-500/10 text-rose-200' : 'border border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              {error}
            </div>
          )}

          {!isLoading && !error && queueList.length === 0 && (
            <div
              className={`flex items-center justify-center rounded-[22px] px-6 py-6 text-sm ${
                isDarkMode ? 'border border-white/10 bg-white/5 text-slate-300' : 'border border-[#d9dce8] bg-white/60 text-slate-500'
              }`}
            >
              No hay turnos en espera.
            </div>
          )}

          {!error && queueList.length > 0 && (
            <div
              className={`overflow-hidden rounded-[22px] border ${
                isDarkMode ? 'border-white/10 bg-white/[0.05]' : 'border-[#d9dce8] bg-white'
              }`}
            >
              <table className="min-w-full text-left text-sm">
                <thead className={isDarkMode ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-600'}>
                  <tr>
                    <th className="px-5 py-3 font-semibold uppercase tracking-[0.2em] text-xs">Turno</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-[0.2em] text-xs">Paciente</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-[0.2em] text-xs">Horario</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-[0.2em] text-xs">Servicio</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-[0.2em] text-xs">Estado</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-white/10 text-slate-100' : 'divide-y divide-slate-100 text-slate-600'}>
                  {queueList.map((item, idx) => (
                    <tr key={`${item.position}-${idx}-${item.name}`}>
                      <td className="px-5 py-4 font-semibold">{item.position}</td>
                      <td className="px-5 py-4">{item.name}</td>
                      <td className="px-5 py-4">{item.time}</td>
                      <td className="px-5 py-4">{item.serviceName}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200'
                              : item.status === 'ACTIVE'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
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
  );
};

export default DashboardQueue;

