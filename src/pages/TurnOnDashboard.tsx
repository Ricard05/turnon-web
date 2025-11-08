import { useState } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import HomeIcon from '../assets/icono inicio.png';
import QueueIcon from '../assets/filas icono.png';
import TurnsIconOutline from '../assets/carpeta sin relleno.png';
import LogoutIcon from '../assets/cerrar sesion icono.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import PendingIcon from '../assets/Turnos Pendientes.png';
import ServedIcon from '../assets/turnos atendidos.png';
import WaitIcon from '../assets/Frame.png';
import AbsentIcon from '../assets/image-yZfsnncmpy35qSJuzG8S5mSf9Xee5l 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import QueueManagement from './QueueManagement';

type TurnOnDashboardProps = {
  onLogout: () => void;
};

const TurnOnDashboard = ({ onLogout }: TurnOnDashboardProps) => {
  const [activeSection, setActiveSection] = useState<'inicio' | 'filas' | 'turnos'>('inicio');
  const [activeTab, setActiveTab] = useState('mensual');
  const chartSource = [
    { label: 'Ene', value: 18 },
    { label: 'Feb', value: 24 },
    { label: 'Mar', value: 14 },
    { label: 'Abr', value: 43 },
    { label: 'May', value: 31 },
    { label: 'Jun', value: 22 },
    { label: 'Jul', value: 16 },
  ] as const;

  const chartWidth = 420;
  const chartHeight = 320;
  const chartBaseline = 278;
  const horizontalPadding = 32;
  const amplitude = 2.6;

  const chartPoints = chartSource.map((point, index) => {
    const x =
      horizontalPadding +
      (index / (chartSource.length - 1)) * (chartWidth - horizontalPadding * 2);
    const y = chartBaseline - point.value * amplitude;
    return { ...point, x, y };
  });

  const buildSmoothPaths = (points: typeof chartPoints) => {
    if (!points.length) return { line: '', area: '' };
    if (points.length === 1) {
      const [{ x, y }] = points;
      return {
        line: `M ${x} ${y}`,
        area: `M ${x} ${chartBaseline} L ${x} ${y} L ${x} ${chartBaseline} Z`,
      };
    }

    const lineCommands: string[] = [`M ${points[0].x} ${points[0].y}`];
    const areaCommands: string[] = [
      `M ${points[0].x} ${chartBaseline}`,
      `L ${points[0].x} ${points[0].y}`,
    ];

    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      const command = `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      lineCommands.push(command);
      areaCommands.push(command);
    }

    areaCommands.push(
      `L ${points[points.length - 1].x} ${chartBaseline}`,
      'Z',
    );

    return {
      line: lineCommands.join(' '),
      area: areaCommands.join(' '),
    };
  };

  const { line: smoothLinePath, area: smoothAreaPath } = buildSmoothPaths(chartPoints);
  const verticalGuides = chartPoints.map((point) => point.x);

  const highlightIndex = 3;
  const highlightPoint = chartPoints[highlightIndex];
  const highlightPercent = (highlightPoint.x / chartWidth) * 100;

  const handleNavigate = (section: 'inicio' | 'filas' | 'turnos') => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    setActiveSection('inicio');
    onLogout();
  };

  if (activeSection === 'filas') {
    return <QueueManagement onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/85 backdrop-blur-sm shadow-[0_25px_50px_rgba(59,130,246,0.25)] flex flex-col p-6 rounded-[28px] m-6">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={SmileUpLogo}
            alt="Smile.Up"
            className="h-10 object-contain"
            draggable={false}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {[
            { icon: HomeIcon, label: 'Inicio', key: 'inicio' as const },
            { icon: QueueIcon, label: 'Filas', key: 'filas' as const },
            { icon: TurnsIconOutline, label: 'Turnos', key: 'turnos' as const },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left font-semibold transition ${
                activeSection === item.key
                  ? 'bg-white/90 text-slate-700 shadow-[0_10px_30px_rgba(59,130,246,0.18)]'
                  : 'text-slate-400 hover:bg-white/50'
              }`}
            >
              <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Illustration */}
        <div className="my-8 flex justify-center">
          <img
            src={SidebarIllustration}
            alt="Personas esperando su turno"
            className="w-40 object-contain"
            draggable={false}
          />
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50">
            <img src={LogoutIcon} alt="Cerrar sesión" className="h-6 w-6" draggable={false} />
          </span>
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-10 overflow-y-auto">
        <div className="mx-auto max-w-[1260px] flex flex-col gap-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-slate-800">
                {activeSection === 'inicio' ? 'Dashboard' : 'Gestión de turnos'}
              </h1>
              <p className="text-slate-400">
                {activeSection === 'inicio'
                  ? 'Resumen de la actividad de hoy'
                  : 'Panel de control de turnos internos'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">Elio Lujan</p>
                <span className="text-xs text-slate-400">Administrador</span>
              </div>
              <img src={AvatarImage} alt="Avatar" className="h-10 w-10 object-cover rounded-full border border-slate-200" />
            </div>
          </header>

          {activeSection === 'turnos' ? (
            <div className="rounded-[32px] bg-white/80 p-16 text-center shadow-[0_25px_45px_rgba(160,180,255,0.28)]">
              <h2 className="text-2xl font-semibold text-slate-700">Gestión de turnos</h2>
              <p className="mt-4 text-slate-500">
                Aquí podrás visualizar y gestionar los turnos asignados. Esta sección está en construcción.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,720px)_minmax(0,340px)] gap-4 justify-center xl:justify-between">
            {/* Chart Section */}
            <div className="relative h-[360px] rounded-[24px] bg-gradient-to-br from-white via-sky-50 to-blue-100/40 shadow-xl px-8 py-7 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Distribución de Turnos</h3>
                  <p className="text-sm text-gray-400 mt-1">Evolución del total durante el mes</p>
                </div>
                <div className="flex gap-1 bg-white/70 backdrop-blur rounded-full p-1">
                  <button
                    onClick={() => setActiveTab('mensual')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      activeTab === 'mensual'
                        ? 'bg-cyan-500 text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setActiveTab('diario')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      activeTab === 'diario'
                        ? 'bg-cyan-500 text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Diario
                  </button>
                </div>
              </div>

              {/* Wave Chart */}
              <div className="relative h-[272px]">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="chart-fill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chart-line" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>

                  {verticalGuides.map((x, idx) => (
                    <line
                      key={`guide-${idx}`}
                      x1={x}
                      x2={x}
                      y1={chartBaseline - 240}
                      y2={chartBaseline + 24}
                      stroke="#D6E8FF"
                      strokeWidth={1}
                    />
                  ))}

                  <path d={smoothAreaPath} fill="url(#chart-fill)" />
                  <path
                    d={smoothLinePath}
                    stroke="url(#chart-line)"
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                  />
                  {chartPoints.map((point) => (
                    <text
                      key={point.label}
                      x={point.x}
                      y={chartBaseline + 24}
                      textAnchor="middle"
                      className="text-[11px] fill-gray-400"
                    >
                      {point.label}
                    </text>
                  ))}
                </svg>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent" />

                <div
                  className="absolute -translate-x-1/2"
                  style={{
                    left: `calc(${highlightPercent}% )`,
                    top: `${(highlightPoint.y / chartHeight) * 100}%`,
                  }}
                >
                  <div className="-translate-y-8 rounded-full bg-slate-900 px-3 py-1.5 text-white text-xs font-medium shadow-xl whitespace-nowrap">
                    Ahora · {highlightPoint.value} turnos
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Turns Card */}
            <div className="relative w-full max-w-[340px] h-[200px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#6366F1] shadow-[0_25px_60px_rgba(99,102,241,0.33)] px-6 py-7 text-white mt-6 xl:mt-[80px] xl:-ml-[95px]">
              <div className="absolute -right-7 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/15 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold opacity-85 tracking-[0.2em] uppercase">Turnos pendientes</p>
                  <span className="text-[48px] font-bold leading-none drop-shadow-[0_8px_22px_rgba(0,0,0,0.2)]">5</span>
                  <p className="text-sm opacity-85">En espera de atención</p>
                </div>

                <div className="flex items-center gap-3 text-sm opacity-90">
                  <img
                    src={PendingIcon}
                    alt="Notificación de turnos"
                    className="h-12 w-12 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]"
                    draggable={false}
                  />
                  <span className="text-xs uppercase tracking-[0.3em]">Alerta activa</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="xl:col-span-2">
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-between">
                <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-lg w-full max-w-[320px] h-[192px] px-6 py-6 flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
                    <img
                      src={ServedIcon}
                      alt="Turnos atendidos"
                      className="h-12 w-12 object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-4 space-y-2 w-full">
                    <p className="text-sm font-medium text-gray-500">Turnos Atendidos</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold text-cyan-500 leading-none">82%</span>
                      <span className="text-xs text-gray-400">164/200</span>
                    </div>
                    <div className="mx-auto mt-3 h-2 w-[200px] rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-lg w-full max-w-[320px] h-[192px] px-6 py-6 flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
                    <img
                      src={WaitIcon}
                      alt="Espera promedio"
                      className="h-12 w-12 object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-500">Espera promedio</p>
                    <div className="text-3xl font-bold text-orange-500 leading-none">15 min</div>
                    <p className="mt-1 text-xs text-green-600 flex items-center justify-center gap-1">
                      <span>+11,01% vs ayer</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-lg w-full max-w-[320px] h-[192px] px-6 py-6 flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 via-red-200 to-red-300">
                    <img
                      src={AbsentIcon}
                      alt="Turnos ausentes"
                      className="h-12 w-12 object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-500">Turnos Ausentes</p>
                    <div className="text-3xl font-bold text-red-500 leading-none">7</div>
                    <p className="mt-1 text-xs text-red-500">+11,01% vs ayer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnOnDashboard;