import SmileUpLogo from '../assets/smileup 1.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';

type QueueManagementProps = {
  onNavigate?: (section: 'inicio' | 'filas' | 'turnos') => void;
  onLogout?: () => void;
};

const QueueManagement = ({ onNavigate, onLogout }: QueueManagementProps) => {
  const upcoming = [
    { position: '#1', name: 'Ángel Fuentes', time: '12 min' },
    { position: '#2', name: 'Ángel Fuentes', time: '12 min' },
    { position: '#3', name: 'Ángel Fuentes', time: '12 min' },
    { position: '#4', name: 'Ángel Fuentes', time: '12 min' },
  ];

  const stats = [
    { label: 'En cola', value: '3', accent: 'bg-blue-500' },
    { label: 'Atendiendo', value: '1', accent: 'bg-green-500' },
    { label: 'Espera promedio', value: '7 min', accent: 'bg-orange-400' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e7f0ff] via-[#e8efff] to-[#f6f5ff] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white shadow-[0_15px_60px_rgba(80,130,255,0.25)] rounded-tr-[40px] rounded-br-[40px] flex flex-col py-10 px-8">
        <div className="flex items-center justify-between">
          <img src={SmileUpLogo} alt="SmileUp" className="h-10 object-contain" />
        </div>

        <nav className="mt-12 space-y-3">
          {[
            { label: 'Inicio', key: 'inicio' as const },
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
              <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Atendiendo</h2>
              <p className="mt-4 text-6xl font-bold text-[#27c3ff]">Q002</p>

              <div className="mt-8 space-y-3 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Cliente</span>
                  <span className="font-semibold text-slate-600">Eduardo Gurrola</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo</span>
                  <span className="font-semibold text-slate-600">8 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Posición</span>
                  <span className="font-semibold text-slate-600">#1</span>
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
                  {stats.map((stat) => (
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
                  <p className="text-xs text-slate-400">Actualizado hace 5 minutos</p>
                </div>
                <button className="rounded-full border border-[#d9dce8] px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                  Gestionar lista
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {upcoming.map((item) => (
                  <article
                    key={item.position}
                    className="flex items-center justify-between rounded-[22px] border border-[#d9dce8] bg-white/70 px-6 py-4 shadow-[0_15px_24px_rgba(209,220,255,0.45)]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-[#9b59ff]">{item.position}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#1fb6ff] text-white shadow-[0_12px_20px_rgba(36,198,255,0.38)]">
                        ↗
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ffc4d6] text-[#ff7aa2] hover:bg-[#ffeff5]">
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueueManagement;