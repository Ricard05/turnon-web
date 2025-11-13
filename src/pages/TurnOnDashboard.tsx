import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import QueueIcon from '../assets/filas icono.png';
import TurnsIconOutline from '../assets/carpeta sin relleno.png';
import TurnsIconFilled from '../assets/carpeta negra.png';
import LogoutIcon from '../assets/cerrar sesion icono.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';
import DashboardQueue from '../components/dashboard/DashboardQueue';
import DashboardTurns from '../components/dashboard/DashboardTurns';
import { Moon, Sun } from 'lucide-react';
import { TurnsService } from '../context';
import type { Turn } from '../context/turnsService';

type SubmitMessage =
  | {
      type: 'success' | 'error';
      text: string;
    }
  | null;

const navItems = [
  { key: 'filas' as const, label: 'Filas', icon: QueueIcon },
  { key: 'turnos' as const, label: 'Turnos', icon: TurnsIconOutline, activeIcon: TurnsIconFilled },
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
  ticketCode: string;
};

const TurnOnDashboard = ({ onLogout }: TurnOnDashboardProps) => {
  const [activeSection, setActiveSection] = useState<NavKey>('filas');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMountedRef = useRef(true);
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
  const [queueUpcoming, setQueueUpcoming] = useState<UpcomingItem[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStat[]>([
    { label: 'Total registrados', value: '0', accent: 'bg-blue-500' },
    { label: 'Pendientes', value: '0', accent: 'bg-indigo-500' },
    { label: 'Activos', value: '0', accent: 'bg-green-500' },
  ]);
  const [queueLoading, setQueueLoading] = useState<boolean>(false);
  const [queueError, setQueueError] = useState<string | null>(null);
  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    setQueueError(null);
    try {
      const turns = await TurnsService.fetchTurns();
      if (!isMountedRef.current) return;

      const totalTurns = turns.length;
      const toStatus = (turn: Turn) =>
        (turn.status ? turn.status.toUpperCase() : 'PENDING');
      const pendingTurns = turns.filter(
        (turn) => toStatus(turn) === 'PENDING',
      );
      const activeTurns = turns.filter(
        (turn) => toStatus(turn) === 'ACTIVE',
      );
      const completedTurns = turns.filter(
        (turn) => toStatus(turn) === 'COMPLETED',
      );

      setQueueStats([
        {
          label: 'Total registrados',
          value: totalTurns.toString(),
          accent: 'bg-blue-500',
        },
        {
          label: 'Pendientes',
          value: pendingTurns.length.toString(),
          accent: 'bg-indigo-500',
        },
        {
          label: 'Activos',
          value: activeTurns.length.toString(),
          accent: 'bg-green-500',
        },
        {
          label: 'Completados',
          value: completedTurns.length.toString(),
          accent: 'bg-orange-500',
        },
      ]);

      const formatTime = (iso?: string) => {
        if (!iso) return 'Sin horario';
        const start = new Date(iso);
        if (Number.isNaN(start.getTime())) return 'Sin horario';
        const now = new Date();
        const diffMinutes = Math.max(0, Math.round((start.getTime() - now.getTime()) / 60000));
        if (diffMinutes <= 0) {
          return 'En curso';
        }
        if (diffMinutes < 60) {
          return `En ${diffMinutes} min`;
        }
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `En ${hours}h ${minutes}m`;
      };

      const upcomingList = turns
        .sort((a, b) => {
          const timeA = a.startTime ? new Date(a.startTime).getTime() : Number.MAX_SAFE_INTEGER;
          const timeB = b.startTime ? new Date(b.startTime).getTime() : Number.MAX_SAFE_INTEGER;
          return timeA - timeB;
        })
        .map((turn, index) => ({
          position: `#${index + 1}`,
          name: turn.patientName?.trim() || `Paciente ${index + 1}`,
          time: formatTime(turn.startTime),
          status: toStatus(turn),
          serviceName: turn.serviceName?.trim() || 'Servicio no especificado',
          email: turn.patientEmail?.trim() || '—',
          phone: turn.patientPhone?.toString() || '—',
          startTime: turn.startTime,
          ticketCode: `Q${String(index + 1).padStart(3, '0')}`,
        }));

      setQueueUpcoming(upcomingList);
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : 'No se pudo cargar la lista de turnos.';
      setQueueError(message);
    } finally {
      if (isMountedRef.current) {
        setQueueLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
      await TurnsService.createTurn({
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
      loadQueue();
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
          upcoming={queueUpcoming}
        />
      );
    }

    return (
      <DashboardQueue
        stats={queueStats}
        upcoming={queueUpcoming}
        isDarkMode={isDarkMode}
        isLoading={queueLoading && queueUpcoming.length === 0}
        error={queueError}
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
        className={`w-64 h-[calc(100vh-48px)] ${sidebarThemeClass} backdrop-blur-sm flex flex-col p-6 rounded-[28px] m-6 transition-colors duration-300`}
      >
        {/* Logo */}
        <div className="mb-12 flex-shrink-0">
          <img
            src={SmileUpLogo}
            alt="Smile.Up"
            className="h-10 object-contain"
            draggable={false}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-shrink-0 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            const iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;
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
                <img src={iconSrc} alt={item.label} className="h-5 w-5 object-contain" />
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