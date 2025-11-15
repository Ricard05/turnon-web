import { useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SmileUpLogo from '@/assets/smileup 1.png';
import LogoutIcon from '@/assets/cerrar sesion icono.png';
import SidebarIllustration from '@/assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '@/assets/notion-avatar-1761838847386 1.png';
import DashboardQueue from '../components/DashboardQueue';
import DashboardTurns from '../components/DashboardTurns';
import { Moon, Sun, Folder } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useQueueStats } from '@/features/queue';
import { createTurn, usePendingTurns } from '@/features/turns';
import type { UpcomingTurn } from '@/core/types';

type SubmitMessage =
  | {
      type: 'success' | 'error';
      text: string;
    }
  | null;

const navItems = [
  { key: 'filas' as const, label: 'Filas', icon: 'bars' },
  { key: 'turnos' as const, label: 'Turnos', icon: 'folder' },
];

type NavKey = 'filas' | 'turnos';

type TurnOnDashboardProps = {
  onLogout?: () => void;
};

type TurnoFormState = {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  servicioTipo: string;
  fecha: string;
};

const TurnOnDashboard = ({ onLogout }: TurnOnDashboardProps) => {
  const [activeSection, setActiveSection] = useState<NavKey>('filas');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [turnoForm, setTurnoForm] = useState<TurnoFormState>({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    servicioTipo: '',
    fecha: '',
  });
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage>(null);

  // Use custom hooks for queue data
  const { stats: queueStats } = useQueueStats();

  // Fetch pending turns
  const { turns: pendingTurns, loading: turnsLoading, error: turnsError, refetch } = usePendingTurns();

  console.log('🔍 TurnOnDashboard - pendingTurns:', pendingTurns);
  console.log('🔍 TurnOnDashboard - turnsLoading:', turnsLoading);
  console.log('🔍 TurnOnDashboard - turnsError:', turnsError);

  // Transform Turn[] to UpcomingTurn[]
  const upcomingTurns: UpcomingTurn[] = useMemo(() => {
    return pendingTurns.map((turn, index) => ({
      position: turn.turn || `#${index + 1}`,
      name: turn.patientName,
      time: new Date(turn.startTime).toLocaleString('es-MX', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      startTime: turn.startTime,
      status: turn.status,
    }));
  }, [pendingTurns]);

  const handleNavigate = (section: NavKey) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    setActiveSection('filas');
    onLogout?.();
  };

  const handleTurnoInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTurnoForm((prevState: TurnoFormState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTurnoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(null);

    const { nombre, email, telefono } = turnoForm;
    if (!nombre || !email || !telefono) {
      setSubmitMessage({ type: 'error', text: 'Por favor completa nombre, correo y número telefónico.' });
      return;
    }

    const phoneDigits = telefono.replace(/\D/g, '');
    if (!phoneDigits) {
      setSubmitMessage({ type: 'error', text: 'El número telefónico no es válido.' });
      return;
    }

    const now = new Date();
    const startTime = now.toISOString();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    setIsSubmittingTurn(true);
    try {
      await createTurn({
        patientName: nombre,
        patientEmail: email,
        patientPhone: Number(phoneDigits),
        companyId: 1,
        serviceId: 1,
        userId: 1,
        createdByUserId: 1,
        startTime,
        endTime,
        status: 'PENDING',
      });
      setSubmitMessage({ type: 'success', text: 'Turno registrado correctamente.' });
      setTurnoForm({ nombre: '', email: '', telefono: '', servicio: '', servicioTipo: '', fecha: '' });
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar el turno.';
      setSubmitMessage({ type: 'error', text: message });
    } finally {
      setIsSubmittingTurn(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode: boolean) => !prevMode);
  };

  const renderSection = () => {
    if (activeSection === 'turnos') {
      return (
        <DashboardTurns
          formData={turnoForm}
          onChange={handleTurnoInputChange}
          onSubmit={handleTurnoSubmit}
          isDarkMode={isDarkMode}
          submitting={isSubmittingTurn}
          statusMessage={submitMessage}
          upcoming={upcomingTurns}
        />
      );
    }

    return (
      <DashboardQueue
        stats={queueStats}
        upcoming={upcomingTurns}
        isDarkMode={isDarkMode}
        isLoading={turnsLoading && pendingTurns.length === 0}
        error={turnsError}
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
      {/* SIDEBAR CON ALTURA FIJA */}
      <div
        className={`w-64 h-[calc(100vh-48px)] ${sidebarThemeClass} backdrop-blur-sm flex flex-col p-6 rounded-[28px] ml-6 mr-6 mb-6 mt-12 transition-colors duration-300`}
      >
        {/* Logo */}
        <div className="mb-12 flex-shrink-0 flex justify-center">
          <img
            src={SmileUpLogo}
            alt="Smile.Up"
            className="h-16 object-contain"
            draggable={false}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-shrink-0 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            const activeClasses = 'bg-blue-600 text-white font-bold shadow-[0_12px_30px_rgba(37,99,235,0.35)]';
            const inactiveClasses = isDarkMode
              ? 'text-slate-300 hover:bg-white/10 hover:text-white'
              : 'text-slate-500 hover:bg-white/70 hover:text-slate-700';
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left transition ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                {item.icon === 'folder' ? (
                  <Folder className="h-5 w-5" fill="currentColor" />
                ) : item.icon === 'bars' ? (
                  <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
                ) : (
                  <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain" />
                )}
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Spacer flexible */}
        <div className="flex-1 min-h-0" />

        {/* Illustration */}
        <div className="my-8 flex justify-center flex-shrink-0">
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
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition flex-shrink-0 ${
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
      <div className="flex-1 px-8 py-10 overflow-y-scroll">
        <div className="mx-auto max-w-[1260px] flex flex-col gap-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {activeSection === 'turnos' ? 'Gestión de turnos' : 'Manejo de la fila'}
              </h1>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-400'}>
                {activeSection === 'turnos'
                  ? 'Programación y registro de turnos'
                  : 'Control general de los turnos'}
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