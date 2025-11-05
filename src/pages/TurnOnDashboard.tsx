import { useState } from 'react';
import { Search, Sun, Moon, Grid, Layers, Folder, LogOut, TrendingUp, TrendingDown, User } from 'lucide-react';
import QueueManagement from './QueueManagement';
import ReportesView from './Reports';

type ActiveTab = 'inicio' | 'filas' | 'reporte';

interface TurnOnDashboardProps {
  onLogout?: () => void;
}

export default function TurnOnDashboard({ onLogout }: TurnOnDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Datos simulados para la gráfica
  const stats = [
    {
      title: 'Total de turnos atendidos hoy',
      value: '126',
      change: '+11.01%',
      isPositive: true
    },
    {
      title: 'Tiempo de espera promedio',
      value: '15 min',
      change: '-0.03%',
      isPositive: false
    },
    {
      title: 'Tiempo promedio de servicio',
      value: '8 min',
      change: '+15.03%',
      isPositive: true
    }
  ];

  // Datos simulados para la gráfica
  const hourlyData = [
    { hour: '9 AM', value: 390 },
    { hour: '10 AM', value: 200 },
    { hour: '11 AM', value: 380 },
    { hour: '12 PM', value: 300 },
    { hour: '1 PM', value: 150 },
    { hour: '2 PM', value: 370 }
  ];
  const chartMax = 500;

  // Si la pestaña activa es 'filas', renderiza QueueManagement
  // y le pasa todas las props necesarias (logout, modo oscuro, etc.)
  if (activeTab === 'filas') {
    return <QueueManagement 
      onBack={() => setActiveTab('inicio')}
      onGoToReporte={() => setActiveTab('reporte')}
      onLogout={onLogout}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />;
  }

  // Si no, renderiza el dashboard principal (Inicio o Reportes)
  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-slate-900 font-inter`}>
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 flex flex-col flex-shrink-0 border-r dark:border-slate-700">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.89543 7.89543 6 9 6H19C20.1046 6 21 6.89543 21 8V10H15V22H13V10H7V8Z" fill="#2563EB" />
            </svg>
            <span className="text-xl font-semibold text-gray-800 dark:text-slate-100">TurnOn</span>
          </div>
        </div>

        {/* Search Funcional */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Funcional */}
        <nav className="flex-1 px-4">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'inicio'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </button>
          <button
            onClick={() => setActiveTab('filas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              (activeTab as ActiveTab) === 'filas'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="font-medium">Filas</span>
          </button>
          <button
            onClick={() => setActiveTab('reporte')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'reporte'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Folder className="w-5 h-5" />
            <span className="font-medium">Reporte</span>
          </button>
        </nav>

        {/* Logout Funcional */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="h-full w-full bg-slate-100 dark:bg-slate-950 rounded-3xl p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* Botón de Modo Oscuro Funcional */}
            <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              {darkMode ? (
                <Sun className="w-5 h-5 text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Elio Lujan</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Administrador</div>
              </div>
              <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white dark:text-slate-200" />
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="mt-8">
            {/* Renderizado condicional de la pestaña */}
            {activeTab === 'reporte' ? (
              
              // --- VISTA DE REPORTES ---
              <ReportesView /> 

            ) : (
              
              // --- VISTA DE INICIO (GRÁFICAS) ---
              <>
                {/* Stats Cards (con datos simulados) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{stat.title}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          stat.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                          {stat.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Wrapper (con datos simulados) */}
                <div className="w-full lg:w-3/4"> 
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Turnos atendidos por hora</h2>
                    <div className="flex h-80">
                      {/* Y-axis labels */}
                      <div className="flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 pr-4" style={{ height: 'calc(100% - 1.75rem)' }}>
                        <span>500</span>
                        <span>400</span>
                        <span>300</span>
                        <span>200</span>
                        <span>100</span>
                        <span>0</span>
                      </div>
                      
                      {/* Main chart area (Bars + X-axis) */}
                      <div className="flex-1 flex flex-col"> 
                        {/* Bars + Grid lines */}
                        <div className="flex-1 w-full flex justify-around items-end relative pb-4"> 
                          {/* Grid lines */}
                          <div className="absolute top-0 left-0 w-full h-full pb-4"> 
                            <div className="h-full relative">
                              <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700" style={{ top: '0%' }}></div>
                              <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700" style={{ top: '20%' }}></div>
                              <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700" style={{ top: '40%' }}></div>
                              <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700" style={{ top: '60%' }}></div>
                              <div className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700" style={{ top: '80%' }}></div>
                            </div>
                          </div>
                          {/* Bars */}
                          {hourlyData.map((data, index) => (
                            <div key={index} className="h-full flex items-end justify-center z-10 w-full max-w-[40px]">
                              <div
                                className="w-full bg-blue-600 rounded-full transition-all duration-500 hover:bg-blue-700"
                                style={{
                                  height: `${(data.value / chartMax) * 100}%`,
                                  minHeight: '10px'
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        {/* X-axis labels */}
                        <div className="flex justify-around pt-2 h-7 border-t border-slate-200 dark:border-slate-700">
                          {hourlyData.map((data, index) => (
                            <div key={index} className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">{data.hour}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}