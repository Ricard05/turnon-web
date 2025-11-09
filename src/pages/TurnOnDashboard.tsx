import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import HomeIcon from '../assets/icono inicio.png';
import QueueIcon from '../assets/filas icono.png';
import TurnsIconOutline from '../assets/carpeta sin relleno.png';
import TurnsIconFilled from '../assets/carpeta negra.png';
import LogoutIcon from '../assets/cerrar sesion icono.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import DashboardHome from '../components/dashboard/DashboardHome';
import DashboardQueue from '../components/dashboard/DashboardQueue';
import DashboardTurns from '../components/dashboard/DashboardTurns';
import { Moon, Sun } from 'lucide-react';

const navItems = [
  { key: 'inicio' as const, label: 'Inicio', icon: HomeIcon },
  { key: 'filas' as const, label: 'Filas', icon: QueueIcon },
  { key: 'turnos' as const, label: 'Turnos', icon: TurnsIconOutline, activeIcon: TurnsIconFilled },
];

type NavKey = 'inicio' | 'filas' | 'turnos';

type TurnOnDashboardProps = {
  onLogout: () => void;
};

const TurnOnDashboard = ({ onLogout }: TurnOnDashboardProps) => {
  const [activeSection, setActiveSection] = useState<NavKey>('inicio');
  const [activeTab, setActiveTab] = useState('mensual');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [turnoForm, setTurnoForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
  });
  const queueUpcoming = useMemo(
    () => [
      { position: '#1', name: 'Ángel Fuentes', time: '12 min' },
      { position: '#2', name: 'Laura Ruiz', time: '15 min' },
      { position: '#3', name: 'María López', time: '18 min' },
      { position: '#4', name: 'Pedro Gómez', time: '22 min' },
    ],
    [],
  );
  const queueStats = useMemo(
    () => [
      { label: 'En cola', value: '3', accent: 'bg-blue-500' },
      { label: 'Atendiendo', value: '1', accent: 'bg-green-500' },
      { label: 'Espera promedio', value: '7 min', accent: 'bg-orange-400' },
    ],
    [],
  );
  const chartSource = useMemo(
    () => [
      { label: 'Ene', value: 18 },
      { label: 'Feb', value: 24 },
      { label: 'Mar', value: 14 },
      { label: 'Abr', value: 43 },
      { label: 'May', value: 31 },
      { label: 'Jun', value: 22 },
      { label: 'Jul', value: 16 },
    ] as const,
    [],
  );

  const handleNavigate = (section: NavKey) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    setActiveSection('inicio');
    onLogout();
  };

  const handleTurnoInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTurnoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTurnoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { nombre, email, telefono, servicio } = turnoForm;
    if (!nombre || !email || !telefono || !servicio) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('¡Turno solicitado exitosamente!');
    console.log('Datos del turno:', turnoForm);
    setTurnoForm({ nombre: '', email: '', telefono: '', servicio: '' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const renderSection = () => {
    if (activeSection === 'turnos') {
      return (
        <DashboardTurns
          formData={turnoForm}
          onChange={handleTurnoInputChange}
          onSubmit={handleTurnoSubmit}
          isDarkMode={isDarkMode}
        />
      );
    }

    if (activeSection === 'filas') {
      return <DashboardQueue stats={queueStats} upcoming={queueUpcoming} isDarkMode={isDarkMode} />;
    }

    return (
      <DashboardHome
        chartSource={chartSource}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isDarkMode={isDarkMode}
      />
    );
  };

  const shellBackground = isDarkMode
    ? 'bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#020617] text-slate-200'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-700';

  const sidebarThemeClass = isDarkMode
    ? 'bg-white/10 border border-white/10 shadow-[0_25px_50px_rgba(8,47,73,0.45)]'
    : 'bg-white/85 shadow-[0_25px_50px_rgba(59,130,246,0.25)]';

  return (
    <div className={`min-h-screen flex ${shellBackground}`}>
      <div
        className={`w-64 ${sidebarThemeClass} backdrop-blur-sm flex flex-col p-6 rounded-[28px] m-6 transition-colors duration-300`}
      >
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
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            const iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;
            const activeClasses = isDarkMode
              ? 'bg-white/20 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]'
              : 'bg-white/90 text-slate-700 shadow-[0_10px_30px_rgba(59,130,246,0.18)]';
            const inactiveClasses = isDarkMode
              ? 'text-slate-300 hover:bg-white/10'
              : 'text-slate-400 hover:bg-white/50';
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left font-semibold transition ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                <img src={iconSrc} alt={item.label} className="h-5 w-5 object-contain" />
                {item.label}
              </button>
            );
          })}
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
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isDarkMode
              ? 'text-slate-200 hover:bg-red-500/10 hover:text-red-300'
              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              isDarkMode ? 'bg-red-500/15' : 'bg-red-50'
            }`}
          >
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
              <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {activeSection === 'turnos'
                  ? 'Gestión de turnos'
                  : activeSection === 'filas'
                    ? 'Manejo de la fila'
                    : 'Dashboard'}
              </h1>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-400'}>
                {activeSection === 'turnos'
                  ? 'Panel de control de turnos internos'
                  : activeSection === 'filas'
                    ? 'Control general de los turnos'
                    : 'Resumen de la actividad de hoy'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}>Elio Lujan</p>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Administrador</span>
                </div>
                <img
                  src={AvatarImage}
                  alt="Avatar"
                  className={`h-10 w-10 object-cover rounded-full ${
                    isDarkMode ? 'border border-white/20' : 'border border-slate-200'
                  }`}
                />
              </div>
              <button
                onClick={toggleDarkMode}
                aria-label="Alternar modo oscuro"
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isDarkMode
                    ? 'bg-white/15 text-yellow-300 hover:bg-white/25'
                    : 'bg-white/70 text-slate-600 shadow-sm hover:bg-white'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </header>

          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default TurnOnDashboard;
