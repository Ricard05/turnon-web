import { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SidebarIllustration from '@/assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '@/assets/notion-avatar-1761838847386 1.png';
import LogoSmWhite from '@/assets/logos/sm-white.png';
import LogoFull from '@/assets/logos/smileup-completo.png';
import LogoFullWhite from '@/assets/logos/smileup-completo-white.png';
import DashboardQueue from '../components/DashboardQueue';
import DashboardTurns from '../components/DashboardTurns';
import { Moon, Sun, Folder, Monitor } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useQueueStats } from '@/features/queue';
import { createTurn, usePendingTurns, useActiveTurns } from '@/features/turns';
import type { UpcomingTurn } from '@/core/types';

type SubmitMessage =
  | {
    type: 'success' | 'error';
    text: string;
  }
  | null;

const navItems = [
  { key: 'filas' as const, label: 'Filas', icon: 'layer-group' },
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
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
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

  // Fetch active turns
  const { turns: activeTurns, refetch: refetchActiveTurns } = useActiveTurns();

  // Fetch pending turns
  const { turns: pendingTurns, loading: turnsLoading, error: turnsError, refetch: refetchPendingTurns } = usePendingTurns();

  // Escuchar cambios en turnos a través de BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('turnos-updates');

    channel.onmessage = (event) => {
      if (event.data.type === 'turnos-updated') {
        // Actualizar turnos inmediatamente cuando se notifica un cambio
        refetchActiveTurns();
        refetchPendingTurns();
      }
    };

    return () => {
      channel.close();
    };
  }, [refetchActiveTurns, refetchPendingTurns]);

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
    setTurnoForm((prevState: TurnoFormState) => {
      // If doctor (servicio) changes, reset the service type (servicioTipo)
      if (name === 'servicio') {
        return {
          ...prevState,
          servicio: value,
          servicioTipo: '', // Reset service type when doctor changes
        };
      }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleTurnoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(null);

    const { nombre, email, telefono, servicio, servicioTipo, fecha } = turnoForm;
    if (!nombre || !email || !telefono) {
      setSubmitMessage({ type: 'error', text: 'Por favor completa nombre, correo y número telefónico.' });
      return;
    }

    if (!servicio) {
      setSubmitMessage({ type: 'error', text: 'Por favor selecciona un doctor.' });
      return;
    }

    if (!servicioTipo) {
      setSubmitMessage({ type: 'error', text: 'Por favor selecciona un servicio.' });
      return;
    }

    if (!fecha) {
      setSubmitMessage({ type: 'error', text: 'Por favor selecciona una fecha.' });
      return;
    }

    const phoneDigits = telefono.replace(/\D/g, '');
    if (!phoneDigits) {
      setSubmitMessage({ type: 'error', text: 'El número telefónico no es válido.' });
      return;
    }

    // Parse the selected date and set time to noon to avoid timezone issues
    // fecha comes as YYYY-MM-DD from the input type="date"
    const [year, month, day] = fecha.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day, 12, 0, 0); // Set to noon local time
    const startTime = selectedDate.toISOString();
    const endTime = new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString();

    setIsSubmittingTurn(true);
    try {
      await createTurn({
        patientName: nombre,
        patientEmail: email,
        patientPhone: Number(phoneDigits),
        companyId: 1,
        serviceId: Number(servicioTipo),
        doctorId: Number(servicio),
        createdByUserId: 1,
        startTime,
        endTime,
        status: 'PENDING',
      });
      setSubmitMessage({ type: 'success', text: 'Turno registrado correctamente.' });
      setTurnoForm({ nombre: '', email: '', telefono: '', servicio: '', servicioTipo: '', fecha: '' });
      refetchPendingTurns();

      // Notificar a todas las pantallas que hubo un cambio en los turnos
      const channel = new BroadcastChannel('turnos-updates');
      channel.postMessage({ type: 'turnos-updated' });
      channel.close();
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

  const shellBackground = isDarkMode
    ? 'bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#020617] text-slate-200'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-700';

  return (
    <div className={`min-h-screen flex ${shellBackground}`}>
      {/* Spacer for sidebar */}
      <div className={`hidden md:block flex-shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isSidebarHovered ? 'w-72' : 'w-20'}`} />

      {/* FIXED COLLAPSIBLE SIDEBAR */}
      <div
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed top-0 left-0 h-screen z-50 border-r shadow-xl flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isSidebarHovered ? 'w-72' : 'w-20'
          } ${isDarkMode
            ? 'bg-slate-900 border-slate-800 shadow-blue-900/5'
            : 'bg-white border-gray-100 shadow-blue-900/5'
          }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center relative overflow-hidden">
          {isSidebarHovered ? (
            <img
              src={isDarkMode ? LogoFullWhite : LogoFull}
              alt="SmileUp Logo"
              className="h-16 px-4 object-contain transition-all duration-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <img
                src={LogoSmWhite}
                alt="SmileUp Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/50 dark:scrollbar-thumb-slate-700/50">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`relative flex items-center h-12 rounded-xl transition-all duration-200 group overflow-hidden ${isActive
                  ? isDarkMode
                    ? 'bg-[#0092D8]/20 text-[#15C4E9]'
                    : 'bg-[#0092D8]/10 text-[#0092D8]'
                  : isDarkMode
                    ? 'hover:bg-slate-800 text-gray-400'
                    : 'hover:bg-gray-50 text-gray-500'
                  } ${isSidebarHovered ? 'px-4 gap-3 w-full' : 'justify-center w-12 mx-auto'}`}
              >
                {item.icon === 'folder' ? (
                  <Folder
                    className={`flex-shrink-0 transition-all duration-300 w-6 h-6 ${isActive
                      ? isDarkMode ? 'text-[#15C4E9]' : 'text-[#0092D8]'
                      : isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className={`flex-shrink-0 transition-all duration-300 w-6 h-6 ${isActive
                      ? isDarkMode ? 'text-[#15C4E9]' : 'text-[#0092D8]'
                      : isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                  />
                )}

                <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isSidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-14'
                  }`}>
                  {item.label}
                </span>

                {/* Active Indicator Strip */}
                {isActive && !isSidebarHovered && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Illustration / Support Area */}
        <div className={`px-6 pb-6 transition-all duration-500 ${isSidebarHovered ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none absolute bottom-20'}`}>
          {isSidebarHovered && (
            <div className={`rounded-2xl p-4 border text-center relative overflow-hidden group ${isDarkMode
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700'
              : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'
              }`}>
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'
                }`}></div>
              <img
                src={SidebarIllustration}
                alt="Soporte"
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Soporte
              </h4>
              <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ¿Necesitas ayuda con la plataforma?
              </p>
              <button className={`text-xs font-semibold hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                Contactar
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
          <button
            onClick={handleLogout}
            className={`relative flex items-center h-12 rounded-xl transition-all duration-200 group overflow-hidden ${isDarkMode
              ? 'hover:bg-slate-800 text-gray-400 hover:text-red-400'
              : 'hover:bg-gray-50 text-gray-500 hover:text-red-500'
              } ${isSidebarHovered ? 'px-4 gap-3 w-full' : 'justify-center w-12 mx-auto'}`}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="flex-shrink-0 w-6 h-6 transition-all duration-300"
            />

            <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isSidebarHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute left-14'
              }`}>
              Cerrar Sesión
            </span>
          </button>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className={`fixed top-0 left-0 right-0 h-16 z-40 border-b flex items-center justify-between px-6 ${isSidebarHovered ? 'pl-[288px]' : 'pl-[80px]'
        } transition-[padding] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isDarkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-gray-100'
        }`}>
        {/* Left: Page Title */}
        <div className="ml-4">
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {activeSection === 'turnos' ? 'Gestión de turnos' : 'Manejo de la fila'}
          </h1>
        </div>

        {/* Right: Pantalla de turnos button, User Info & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Pantalla de turnos button */}
          {activeSection === 'filas' && (
            <button
              onClick={() => {
                const publicUrl = `${window.location.origin}${window.location.pathname}?public=true`;
                window.open(publicUrl, '_blank', 'width=1920,height=1080,fullscreen=yes');
              }}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-r from-[#15C4E9] to-[#0092D8] text-white hover:from-[#03C3E4] hover:to-[#01A0E4] shadow-lg shadow-blue-400/25'
                }`}
            >
              <Monitor className="w-4 h-4" />
              Pantalla de turnos
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isDarkMode
              ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
              : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}>
                Elio Lujan
              </p>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Administrador
              </span>
            </div>
            <img
              src={AvatarImage}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 pt-24 px-6 pb-6 overflow-y-scroll ${isDarkMode ? 'bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#020617]' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }`}>
        <div className={`w-full h-full rounded-tl-[32px] p-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
          }`}>
          <div className="w-full flex flex-col gap-6">
            {activeSection === 'turnos' && (
              <DashboardTurns
                formData={turnoForm}
                onChange={handleTurnoInputChange}
                onSubmit={handleTurnoSubmit}
                isDarkMode={isDarkMode}
                submitting={isSubmittingTurn}
                statusMessage={submitMessage}
              />
            )}
            {activeSection === 'filas' && (
              <DashboardQueue
                stats={queueStats}
                upcoming={upcomingTurns}
                activeTurns={activeTurns}
                isDarkMode={isDarkMode}
                isLoading={turnsLoading && pendingTurns.length === 0}
                error={turnsError}
                onRefetchActiveTurns={refetchActiveTurns}
                onRefetchPendingTurns={refetchPendingTurns}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnOnDashboard;