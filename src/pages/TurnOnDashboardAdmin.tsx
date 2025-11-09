import { useMemo, useState } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import HomeIcon from '../assets/icono inicio.png';
import TurnsIconOutline from '../assets/carpeta sin relleno.png';
import TurnsIconFilled from '../assets/carpeta negra.png';
import LogoutIcon from '../assets/cerrar sesion icono.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import DashboardHome from '../components/dashboard/DashboardHome';
import AdminTurnsScreen from './admin/AdminTurnsScreen';
import AdminUsersScreen from './admin/AdminUsersScreen';
import { Moon, Sun, Users } from 'lucide-react';

type NavKey = 'inicio' | 'turnos' | 'usuarios';

type NavItem = {
  key: NavKey;
  label: string;
  renderIcon: (args: { isActive: boolean; isDarkMode: boolean }) => JSX.Element;
};

const navItems: NavItem[] = [
  {
    key: 'inicio',
    label: 'Inicio',
    renderIcon: () => (
      <img src={HomeIcon} alt="Inicio" className="h-5 w-5 object-contain" />
    ),
  },
  {
    key: 'turnos',
    label: 'Turnos',
    renderIcon: ({ isActive }) => (
      <img
        src={isActive ? TurnsIconFilled : TurnsIconOutline}
        alt="Turnos"
        className="h-5 w-5 object-contain"
      />
    ),
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    renderIcon: ({ isActive, isDarkMode }) => (
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          isActive
            ? isDarkMode
              ? 'border-white bg-white/20 text-white'
              : 'border-sky-500 bg-sky-100 text-sky-600'
            : isDarkMode
              ? 'border-white/20 text-slate-300'
              : 'border-slate-200 text-slate-400'
        }`}
      >
        <Users className="h-3.5 w-3.5" />
      </span>
    ),
  },
];

type TurnOnDashboardAdminProps = {
  onLogout?: () => void;
};

const TurnOnDashboardAdmin = ({ onLogout }: TurnOnDashboardAdminProps) => {
  const [activeSection, setActiveSection] = useState<NavKey>('inicio');
  const [activeTab, setActiveTab] = useState('mensual');
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    onLogout?.();
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const renderSection = () => {
    if (activeSection === 'turnos') {
      return <AdminTurnsScreen isDarkMode={isDarkMode} />;
    }

    if (activeSection === 'usuarios') {
      return <AdminUsersScreen isDarkMode={isDarkMode} />;
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
                {item.renderIcon({ isActive, isDarkMode })}
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
                  : activeSection === 'usuarios'
                    ? 'Gestión de usuarios'
                    : 'Dashboard'}
              </h1>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-400'}>
                {activeSection === 'turnos'
                  ? 'Panel de control de turnos internos'
                  : activeSection === 'usuarios'
                    ? 'Administración del equipo y sus permisos'
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

export default TurnOnDashboardAdmin;

