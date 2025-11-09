import { useMemo } from 'react';
import PendingIcon from '../../assets/Turnos Pendientes.png';
import ServedIcon from '../../assets/turnos atendidos.png';
import WaitIcon from '../../assets/reloj.png';
import AbsentIcon from '../../assets/image-yZfsnncmpy35qSJuzG8S5mSf9Xee5l 1.png';

type ChartPoint = {
  label: string;
  value: number;
};

type DashboardHomeProps = {
  chartSource: readonly ChartPoint[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isDarkMode: boolean;
};

const DashboardHome = ({ chartSource, activeTab, onChangeTab, isDarkMode }: DashboardHomeProps) => {
  const chartConfig = useMemo(() => {
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
      if (!points.length) {
        return { smoothLinePath: '', smoothAreaPath: '' };
      }
      if (points.length === 1) {
        const [{ x, y }] = points;
        return {
          smoothLinePath: `M ${x} ${y}`,
          smoothAreaPath: `M ${x} ${chartBaseline} L ${x} ${y} L ${x} ${chartBaseline} Z`,
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
        smoothLinePath: lineCommands.join(' '),
        smoothAreaPath: areaCommands.join(' '),
      };
    };

    const { smoothLinePath, smoothAreaPath } = buildSmoothPaths(chartPoints);
    const highlightIndex = 3;
    const safeIndex = chartPoints.length
      ? Math.min(highlightIndex, chartPoints.length - 1)
      : -1;
    const highlightPoint = safeIndex >= 0 ? chartPoints[safeIndex] : null;
    const highlightPercent = highlightPoint ? (highlightPoint.x / chartWidth) * 100 : 0;

    return {
      chartWidth,
      chartHeight,
      chartBaseline,
      chartPoints,
      smoothLinePath,
      smoothAreaPath,
      highlightPoint,
      highlightPercent,
    };
  }, [chartSource]);

  const { chartWidth, chartHeight, chartBaseline, chartPoints, smoothLinePath, smoothAreaPath, highlightPoint, highlightPercent } =
    chartConfig;
  const verticalGuides = chartPoints.map((point) => point.x);

  const chartContainerClass = isDarkMode
    ? 'bg-[rgba(15,23,42,0.85)] border border-white/10 shadow-[0_25px_60px_rgba(8,47,73,0.55)]'
    : 'bg-gradient-to-br from-white via-sky-50 to-blue-100/40 shadow-xl';

  const statsCardClass = `backdrop-blur-sm rounded-[24px] shadow-lg w-full max-w-[320px] h-[192px] px-6 py-6 flex flex-col items-center text-center ${
    isDarkMode ? 'bg-white/10 border border-white/10 text-slate-100' : 'bg-white/90 text-gray-600'
  }`;

  const sectionTitleClass = isDarkMode ? 'text-xl font-semibold text-slate-100' : 'text-xl font-semibold text-gray-800';
  const sectionSubtitleClass = isDarkMode ? 'text-sm text-slate-400 mt-1' : 'text-sm text-gray-400 mt-1';
  const tabButtonActive = isDarkMode
    ? 'bg-white/20 text-white shadow-md'
    : 'bg-cyan-500 text-white shadow-md';
  const tabButtonInactive = isDarkMode
    ? 'text-slate-300 hover:text-white hover:bg-white/10'
    : 'text-gray-500 hover:text-gray-700';
  const guideColor = isDarkMode ? 'rgba(148,163,184,0.35)' : '#D6E8FF';
  const lineStartColor = isDarkMode ? '#7dd3fc' : '#38BDF8';
  const lineEndColor = isDarkMode ? '#38bdf8' : '#0EA5E9';
  const areaTopOpacity = isDarkMode ? 0.9 : 0.55;
  const areaBottomOpacity = isDarkMode ? 0.28 : 0.16;
  const pointFillColor = isDarkMode ? '#0ea5e9' : '#0284c7';
  const pointStrokeColor = isDarkMode ? '#e0f2fe' : '#e0f2fe';
  const axisLabelClass = isDarkMode ? 'text-[11px] fill-slate-400' : 'text-[11px] fill-gray-400';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,720px)_minmax(0,340px)] gap-4 justify-center xl:justify-between">
      {/* Chart Section */}
      <div className={`relative h-[360px] rounded-[24px] px-8 py-7 flex flex-col justify-between transition-colors duration-300 overflow-hidden ${chartContainerClass}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={sectionTitleClass}>Distribución de Turnos</h3>
            <p className={sectionSubtitleClass}>Evolución del total durante el mes</p>
          </div>
          <div
            className={`flex gap-1 rounded-full p-1 backdrop-blur ${
              isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white/70'
            }`}
          >
            <button
              onClick={() => onChangeTab('mensual')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'mensual' ? tabButtonActive : tabButtonInactive
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => onChangeTab('diario')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === 'diario' ? tabButtonActive : tabButtonInactive
              }`}
            >
              Diario
            </button>
          </div>
        </div>

        <div className="relative h-[272px]">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="chart-fill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={lineStartColor} stopOpacity={areaTopOpacity} />
                <stop offset="100%" stopColor={lineStartColor} stopOpacity={areaBottomOpacity} />
              </linearGradient>
              <linearGradient id="chart-line" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={lineStartColor} />
                <stop offset="100%" stopColor={lineEndColor} />
              </linearGradient>
            </defs>

            {verticalGuides.map((x, idx) => (
              <line
                key={`guide-${idx}`}
                x1={x}
                x2={x}
                y1={chartBaseline - 240}
                y2={chartBaseline + 24}
                stroke={guideColor}
                strokeWidth={1}
              />
            ))}

            <path d={smoothAreaPath} fill="url(#chart-fill)" />
            <path
              d={smoothLinePath}
              stroke="url(#chart-line)"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.95}
              style={{ filter: 'drop-shadow(0 6px 14px rgba(14,165,233,0.35))' }}
            />
            <path
              d={smoothLinePath}
              stroke={isDarkMode ? '#22d3ee' : '#0ea5e9'}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={0.75}
            />
            {chartPoints.map((point) => (
              <circle
                key={`dot-${point.label}`}
                cx={point.x}
                cy={point.y}
                r={isDarkMode ? 5 : 4}
                fill={pointFillColor}
                stroke={pointStrokeColor}
                strokeWidth={2}
              />
            ))}
            {chartPoints.map((point) => (
              <text
                key={point.label}
                x={point.x}
                y={chartBaseline + 24}
                textAnchor="middle"
                className={axisLabelClass}
              >
                {point.label}
              </text>
            ))}
          </svg>

          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${
              isDarkMode ? 'from-[#0f172a] via-[#0f172a]/30 to-transparent' : 'from-white via-white/40 to-transparent'
            }`}
          />

          {highlightPoint && (
            <div
              className="absolute -translate-x-1/2"
              style={{
                left: `calc(${highlightPercent}%)`,
                top: `${(highlightPoint.y / chartHeight) * 100}%`,
              }}
            >
              <div className="-translate-y-8 rounded-full bg-slate-900 px-3 py-1.5 text-white text-xs font-medium shadow-xl whitespace-nowrap">
                Ahora · {highlightPoint.value} turnos
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* Stats */}
      <div className="xl:col-span-2">
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-between">
          <div className={statsCardClass}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
              <img
                src={ServedIcon}
                alt="Turnos atendidos"
                className="h-12 w-12 object-contain"
                draggable={false}
              />
            </div>
            <div className="mt-4 space-y-2 w-full">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>Turnos Atendidos</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl font-bold text-cyan-400 leading-none">82%</span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>164/200</span>
              </div>
              <div className={`mx-auto mt-3 h-2 w-[200px] rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '82%' }} />
              </div>
            </div>
          </div>

          <div className={statsCardClass}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
              <img
                src={WaitIcon}
                alt="Espera promedio"
                className="h-12 w-12 object-contain"
                draggable={false}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>Espera promedio</p>
              <div className="text-3xl font-bold text-orange-400 leading-none">15 min</div>
              <p className={`mt-1 text-xs flex items-center justify-center gap-1 ${isDarkMode ? 'text-emerald-300' : 'text-green-600'}`}>
                <span>+11,01% vs ayer</span>
              </p>
            </div>
          </div>

          <div className={statsCardClass}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 via-red-200 to-red-300">
              <img
                src={AbsentIcon}
                alt="Turnos ausentes"
                className="h-12 w-12 object-contain"
                draggable={false}
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>Turnos Ausentes</p>
              <div className="text-3xl font-bold text-red-400 leading-none">7</div>
              <p className={`mt-1 text-xs ${isDarkMode ? 'text-rose-300' : 'text-red-500'}`}>+11,01% vs ayer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

