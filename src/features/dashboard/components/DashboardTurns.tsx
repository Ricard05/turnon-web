import { useMemo, useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertCircle, CheckCircle, Mail, Phone, User, Calendar as CalendarIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DoctorFindImage from '@/assets/doctor_find.png';
import type { UpcomingTurn, DoctorService, Turn } from '@/core/types';
import { useDoctorsWithServices } from '@/features/doctors';
import { fetchPendingTurns } from '@/features/turns/api';

type StatusMessage =
  | {
      type: 'success' | 'error';
      text: string;
    }
  | null;

type DashboardTurnsProps = {
  formData: {
    nombre: string;
    email: string;
    telefono: string;
    servicio: string;
    servicioTipo?: string;
    fecha?: string;
  };
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isDarkMode: boolean;
  submitting: boolean;
  statusMessage: StatusMessage;
};

/**
 * Generate calendar matrix for a specific month and year
 */
const generateMonthMatrix = (year: number, month: number): (number | null)[][] => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Fill initial empty days
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  // Fill days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);

    // If week is complete (7 days), add to matrix and start new week
    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining days with null if needed
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    matrix.push(currentWeek);
  }

  return matrix;
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DashboardTurns = ({
  formData,
  onChange,
  onSubmit,
  isDarkMode,
  submitting,
  statusMessage,
}: DashboardTurnsProps) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<number>(now.getDate());
  const [availableServices, setAvailableServices] = useState<DoctorService[]>([]);
  const [turnsByDate, setTurnsByDate] = useState<Turn[]>([]);
  const [loadingTurns, setLoadingTurns] = useState<boolean>(false);

  // Fetch doctors with services
  const { doctors, loading: loadingDoctors } = useDoctorsWithServices();

  // Generate calendar matrix for current month
  const monthMatrix = useMemo(
    () => generateMonthMatrix(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const calendarDays = useMemo(() => monthMatrix.flat(), [monthMatrix]);

  // Update available services when doctor changes
  useEffect(() => {
    if (formData.servicio) {
      const selectedDoctor = doctors.find((doc) => doc.id === Number(formData.servicio));
      if (selectedDoctor) {
        setAvailableServices(selectedDoctor.services);
      }
    } else {
      setAvailableServices([]);
    }
  }, [formData.servicio, doctors]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Adjust selected date when month changes to maintain the same day
  useEffect(() => {
    const daysInNewMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (selectedDate > daysInNewMonth) {
      setSelectedDate(daysInNewMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  // Fetch turns for selected date
  useEffect(() => {
    const fetchTurnsForDate = async () => {
      setLoadingTurns(true);
      try {
        // Format date as YYYY-MM-DD
        const year = currentYear;
        const month = String(currentMonth + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const turns = await fetchPendingTurns(dateString);
        setTurnsByDate(turns);
      } catch (error) {
        setTurnsByDate([]);
      } finally {
        setLoadingTurns(false);
      }
    };

    fetchTurnsForDate();
  }, [selectedDate, currentMonth, currentYear]);

  const displayAppointments = useMemo(() => {
    // Show all turns without slicing
    return turnsByDate.map((turn, index) => {
      const date = turn.startTime ? new Date(turn.startTime) : null;
      const formatted = date
        ? date.toLocaleString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      return {
        id: `${turn.id}-${index}`,
        position: turn.turn || `#${index + 1}`,
        name: turn.patientName,
        date: formatted,
      };
    });
  }, [turnsByDate]);

  const iconColor = isDarkMode ? 'text-slate-400' : 'text-[#94a3b8]';
  const helperTextClass = isDarkMode ? 'text-slate-300' : 'text-slate-400';
  const inputClass = isDarkMode
    ? 'w-full rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-12 pr-4 text-sm text-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.45)] placeholder:text-slate-400 focus:border-slate-500 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-slate-500/30'
    : 'w-full rounded-2xl border border-[#dbe7ff] bg-white/80 py-3 pl-12 pr-4 text-sm text-slate-600 shadow-[0_8px_24px_rgba(130,166,255,0.12)] placeholder:text-slate-400 focus:border-[#5ec9ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5ec9ff]/20';
  const selectClass = isDarkMode
    ? 'w-full appearance-none rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-12 pr-12 text-sm text-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.45)] focus:border-slate-500 focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-slate-500/30'
    : 'w-full appearance-none rounded-2xl border border-[#dbe7ff] bg-white/80 py-3 pl-12 pr-12 text-sm text-slate-600 shadow-[0_8px_24px_rgba(130,166,255,0.12)] focus:border-[#5ec9ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5ec9ff]/20';
  const monthButtonClass = isDarkMode
    ? 'rounded-full bg-white/10 px-2 py-1 text-slate-100 hover:bg-white/20'
    : 'rounded-full bg-[#eef4ff] px-2 py-1 text-slate-500 hover:bg-[#dce7ff]';

  const cardClass = isDarkMode
    ? 'rounded-[40px] bg-slate-900/80 border border-white/10 shadow-[0_35px_80px_rgba(15,23,42,0.5)]'
    : 'rounded-[40px] bg-white/95 shadow-[0_40px_90px_rgba(143,177,255,0.25)]';

  const rightPanelClass = isDarkMode
    ? 'rounded-[40px] border border-white/10 bg-slate-900/80 text-slate-100 shadow-[0_35px_80px_rgba(15,23,42,0.5)]'
    : 'rounded-[40px] bg-white/95 text-slate-600 shadow-[0_40px_90px_rgba(143,177,255,0.25)]';

  return (
    <div className="relative flex flex-1 items-start justify-center gap-10 px-6 pb-10 pt-12">
      <div
        className={`absolute inset-0 -z-10 transition ${
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_top,_rgba(148,163,255,0.2),rgba(15,23,42,0.5))] backdrop-blur'
            : 'bg-[radial-gradient(circle_at_top,_rgba(114,195,255,0.25),rgba(255,255,255,0))]'
        }`}
      />

      <div className={`w-full max-w-[560px] ${cardClass} p-11 backdrop-blur self-stretch`}>
        <form onSubmit={onSubmit} className={`${isDarkMode ? 'text-slate-200' : 'text-slate-600'} h-full flex flex-col`}>
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] shadow-[0_18px_40px_rgba(80,143,255,0.22)] ${
            isDarkMode ? 'bg-slate-800/80 border border-slate-700' : 'bg-white/90'
          }`}>
            <FontAwesomeIcon icon={faTicket} className={`h-10 w-10 ${isDarkMode ? 'text-blue-400' : 'text-[#3b82f6]'}`} />
          </div>
          <h2 className={`mt-6 text-center text-[24px] font-semibold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
            Solicitar Turno
          </h2>
          <p className={`mt-2 text-center text-sm ${helperTextClass}`}>
            Completa el formulario para obtener un número de turno
          </p>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <User className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`} />
              <input
                name="nombre"
                value={formData.nombre}
                onChange={onChange}
                placeholder="Nombre"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Correo Electrónico"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Phone className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`} />
              <input
                name="telefono"
                value={formData.telefono}
                onChange={onChange}
                placeholder="Número Telefónico"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <svg
                className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.5 3A1.5 1.5 0 0 0 5 4.5V7H3.5A1.5 1.5 0 0 0 2 8.5v6A1.5 1.5 0 0 0 3.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 16.5 7H15V4.5A1.5 1.5 0 0 0 13.5 3h-7ZM13 7V4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V7h8ZM3.5 8H16.5a.5.5 0 0 1 .5.5V11H3V8.5a.5.5 0 0 1 .5-.5Zm-.5 3.5h14v3a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-3Z" />
              </svg>
              <select
                name="servicio"
                value={formData.servicio}
                onChange={onChange}
                className={selectClass}
                disabled={loadingDoctors}
              >
                <option value="">
                  {loadingDoctors ? 'Cargando doctores...' : 'Seleccionar doctor'}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.officeRoom}
                  </option>
                ))}
              </select>
              <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${iconColor}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            <div className="relative">
              <svg
                className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5Zm2 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm-1 5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm1 3a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" />
              </svg>
              <select
                name="servicioTipo"
                value={formData.servicioTipo ?? ''}
                onChange={onChange}
                className={selectClass}
                disabled={!formData.servicio || availableServices.length === 0}
              >
                <option value="">
                  {!formData.servicio
                    ? 'Primero selecciona un doctor'
                    : availableServices.length === 0
                    ? 'Este doctor no tiene servicios disponibles'
                    : 'Selecciona un servicio'}
                </option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.durationMins} min)
                  </option>
                ))}
              </select>
              <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${iconColor}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            <div className="relative">
              <CalendarIcon className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColor}`} />
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={onChange}
                className={inputClass}
              />
            </div>
          </div>

          {statusMessage && statusMessage.type === 'success' && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_12px_32px_rgba(16,185,129,0.18)] ${
                isDarkMode ? 'bg-emerald-500/10 text-emerald-200' : 'bg-[#ecfdf5] text-emerald-600'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <CheckCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Turno creado correctamente</p>
                <p className="text-xs opacity-80">{statusMessage.text}</p>
              </div>
            </div>
          )}

          {statusMessage && statusMessage.type === 'error' && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_12px_32px_rgba(244,63,94,0.18)] ${
                isDarkMode ? 'bg-rose-500/10 text-rose-200' : 'bg-[#fef2f2] text-rose-600'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">No se pudo registrar el turno</p>
                <p className="text-xs opacity-80">{statusMessage.text}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#15C4E9] to-[#0092D8] py-3 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(0,148,255,0.35)] transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#00b4ff]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
            {submitting ? 'Registrando…' : 'Registrar Turno'}
          </button>
        </form>
      </div>

      <div className={`w-full max-w-[560px] ${rightPanelClass} px-9 py-9 backdrop-blur self-stretch flex flex-col`}>
        <div className={`flex items-center justify-between text-sm font-semibold ${
          isDarkMode ? 'text-slate-100' : 'text-slate-600'
        }`}>
          <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={handlePreviousMonth}
              className={monthButtonClass}
              type="button"
            >
              &lt;
            </button>
            <button
              onClick={handleNextMonth}
              className={monthButtonClass}
              type="button"
            >
              &gt;
            </button>
          </div>
        </div>
        <div className={`mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold ${
          isDarkMode ? 'text-slate-300' : 'text-slate-400'
        }`}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <span key={`empty-${idx}`} className="h-10 rounded-xl bg-transparent" />;
            }
            const isSelected = day === selectedDate;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`h-10 w-full rounded-xl border text-sm font-semibold transition ${
                  isSelected
                    ? 'border-transparent bg-[#00b4ff] text-white shadow-[0_15px_30px_rgba(0,180,255,0.35)]'
                    : isDarkMode
                    ? 'border-white/10 bg-slate-900/50 text-slate-200 hover:bg-slate-900/70'
                    : 'border-transparent bg-white/60 text-slate-500 hover:bg-white'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex-1 overflow-y-auto pr-2">
          {(!turnsByDate || turnsByDate.length === 0) && !loadingTurns ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No hay turnos para este día
              </p>
              <img
                src={DoctorFindImage}
                alt="No hay turnos"
                className="w-64 object-contain"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {displayAppointments.map((item) => (
                <article
                  key={item.id}
                  className={`flex items-center justify-between gap-4 rounded-[26px] border px-6 py-4 shadow-[0_18px_35px_rgba(162,186,255,0.25)] transition hover:shadow-[0_20px_40px_rgba(162,186,255,0.35)] ${
                    isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#e6ecff] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span
                      className={`flex h-12 min-w-12 items-center justify-center rounded-[22px] border px-3 text-lg font-bold ${
                        isDarkMode
                          ? 'border-white/20 bg-white/10 text-[#15C4E9]'
                          : 'border-[#ffd9ff] bg-gradient-to-r from-[#15C4E9] to-[#0092D8] text-[#ffffff]'
                      }`}
                    >
                      {item.position}
                    </span>
                    <div>
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-700'}`}>
                        {item.name}
                      </p>
                      <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.date}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTurns;

