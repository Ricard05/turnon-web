type QueueStat = {
  label: string;
  value: string;
  accent: string;
};

type UpcomingItem = {
  position: string;
  name: string;
  time: string;
};

type DashboardQueueProps = {
  stats: QueueStat[];
  upcoming: UpcomingItem[];
  isDarkMode: boolean;
};

const DashboardQueue = ({ stats, upcoming, isDarkMode }: DashboardQueueProps) => {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-6 justify-center">
      <section className={primaryCardClass}>
        <h2 className={`text-sm font-medium uppercase tracking-[0.3em] ${headingClass}`}>Atendiendo</h2>
        <p className="mt-4 text-6xl font-bold text-[#27c3ff]">Q002</p>

        <div className={`mt-8 space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
          <div className="flex justify-between">
            <span>Cliente</span>
            <span className={`font-semibold ${valueClass}`}>Eduardo Gurrola</span>
          </div>
          <div className="flex justify-between">
            <span>Tiempo</span>
            <span className={`font-semibold ${valueClass}`}>8 min</span>
          </div>
          <div className="flex justify-between">
            <span>Posición</span>
            <span className={`font-semibold ${valueClass}`}>#1</span>
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
            <p className={`text-xs ${headingClass}`}>Actualizado hace 5 minutos</p>
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
          {upcoming.map((item) => (
            <article
              key={item.position}
              className={`flex items-center justify-between rounded-[22px] px-6 py-4 ${listItemClass}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-[#9b59ff]'}`}>
                  {item.position}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${valueClass}`}>{item.name}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`flex h-9 w-9 items-center justify-center rounded-full shadow-[0_12px_20px_rgba(36,198,255,0.38)] ${listButtonPrimary}`}
                >
                  ↗
                </button>
                <button
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${listButtonSecondary}`}
                >
                  ×
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardQueue;

