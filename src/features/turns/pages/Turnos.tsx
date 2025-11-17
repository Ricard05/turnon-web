import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import SmileUpLogo from '@/assets/smileup 1.png';
import HomeIcon from '@/assets/icono inicio.png';
import QueueIcon from '@/assets/filas icono.png';
import FolderIcon from '@/assets/carpeta sin relleno.png';
import FolderActiveIcon from '@/assets/carpeta negra.png';
import LogoutIcon from '@/assets/cerrar sesion icono.png';
import SidebarIllustration from '@/assets/undraw_wait-in-line_fbdq (1) 1.png';
import Clipboards from '@/assets/Papel.png';
import AvatarImage from '@/assets/notion-avatar-1761838847386 1.png';

type NavKey = 'inicio' | 'filas' | 'turnos';

type TurnosProps = {
  onNavigate?: (section: NavKey) => void;
  onLogout?: () => void;
};

type TurnoForm = {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
};

const monthMatrix: (number | null)[][] = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, null],
];

const appointments = [
  { id: 'a1', position: '#1', name: 'Angel Fuentes', date: '14 noviembre 12:00pm' },
  { id: 'a2', position: '#1', name: 'Angel Fuentes', date: '14 noviembre 12:00pm' },
  { id: 'a3', position: '#1', name: 'Angel Fuentes', date: '14 noviembre 12:00pm' },
  { id: 'a4', position: '#1', name: 'Angel Fuentes', date: '14 noviembre 12:00pm' },
];

const Turnos = ({ onNavigate, onLogout }: TurnosProps) => {
  const [formData, setFormData] = useState<TurnoForm>({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    fecha: '',
  });
  const [selectedDate, setSelectedDate] = useState<number>(8);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof TurnoForm]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.fecha) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('¡Turno solicitado exitosamente!');
  };

  const handleNavigate = (key: NavKey) => {
    if (key === 'turnos') return;
    onNavigate?.(key);
  };

  const calendarDays = useMemo(() => monthMatrix.flat(), []);

  return (
    <div className="min-h-screen w-full bg-[#10131f]">
      <div className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#f6f9ff] via-[#f1f5ff] to-[#ffffff]">
        <aside className="flex w-[260px] flex-col bg-white/92 px-8 py-12 backdrop-blur">
          <div className="mb-14">
            <img src={SmileUpLogo} alt="Smile.Up" className="h-10 object-contain" />
          </div>

          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-500">
            <button
              onClick={() => handleNavigate('inicio')}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100/70"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <img src={HomeIcon} alt="Inicio" className="h-4 w-4" />
              </span>
              Inicio
            </button>
            <button
              onClick={() => handleNavigate('filas')}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100/70"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <img src={QueueIcon} alt="Filas" className="h-4 w-4" />
              </span>
              Filas
            </button>
            <button className="flex items-center gap-3 rounded-xl bg-[#11c5ff] px-4 py-3 text-white shadow-[0_12px_32px_rgba(17,197,255,0.35)] transition hover:shadow-[0_16px_36px_rgba(17,197,255,0.45)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <img src={FolderActiveIcon} alt="Turnos" className="h-4 w-4" />
              </span>
              Turnos
            </button>
          </nav>

          <div className="mt-12 flex justify-center">
            <img
              src={SidebarIllustration}
              alt="Personas esperando turno"
              className="w-40 object-contain"
              draggable={false}
            />
          </div>

          <button
            onClick={onLogout}
            className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100/70"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <img src={LogoutIcon} alt="Cerrar sesión" className="h-4 w-4" />
            </span>
            Cerrar Sesión
          </button>
        </aside>

        <main className="relative flex flex-1 flex-col px-12 py-12">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-bold text-slate-800">Manejo de la fila</h1>
              <p className="text-sm text-slate-400">Control general de los turnos</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-[0_12px_28px_rgba(59,130,246,0.18)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b6b90" strokeWidth="1.6">
                  <path d="M21 12a9 9 0 1 1-9-9v9Z" />
                </svg>
              </button>
              <div className="flex items-center gap-3 rounded-[22px] bg-white/85 px-5 py-3 shadow-[0_20px_50px_rgba(59,130,246,0.18)]">
                <img src={AvatarImage} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">Elio Lujan</p>
                  <span className="text-xs text-slate-400">Empleado</span>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-12 flex flex-1 flex-col items-center justify-center gap-10 xl:flex-row xl:items-start xl:justify-between">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[430px] rounded-[30px] bg-white/90 px-10 py-12 text-slate-600 shadow-[0_35px_80px_rgba(52,84,209,0.2)] backdrop-blur"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#d5e4ff] via-[#e0ecff] to-[#f0f4ff] shadow-[0_18px_40px_rgba(59,130,246,0.18)]">
                <FontAwesomeIcon icon={faTicket} className="h-10 w-10 text-[#3b82f6]" />
              </div>
              <h2 className="mt-6 text-center text-2xl font-semibold text-slate-800">Solicitar Turno</h2>
              <p className="mt-2 text-center text-sm text-slate-400">
                Completa el formulario para obtener un número de turno
              </p>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eef2fb]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6">
                      <path d="M20 21a8 8 0 1 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="w-full rounded-xl border border-[#e3eaf7] bg-[#f7f9fd] py-3 pl-14 pr-4 text-sm text-slate-600 transition focus:border-[#66d0ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#66d0ff]/30"
                  />
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eef2fb]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6">
                      <path d="m4 6 8 6 8-6" />
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Correo Electrónico"
                    className="w-full rounded-xl border border-[#e3eaf7] bg-[#f7f9fd] py-3 pl-14 pr-4 text-sm text-slate-600 transition focus:border-[#66d0ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#66d0ff]/30"
                  />
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eef2fb]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.66 12.66 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.66 12.66 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </span>
                  <input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Número Telefónico"
                    className="w-full rounded-xl border border-[#e3eaf7] bg-[#f7f9fd] py-3 pl-14 pr-4 text-sm text-slate-600 transition focus:border-[#66d0ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#66d0ff]/30"
                  />
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eef2fb]">
                    <img src={FolderIcon} alt="Servicio" className="h-4 w-4 opacity-80" />
                  </span>
                  <select
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-xl border border-[#e3eaf7] bg-[#f7f9fd] py-3 pl-14 pr-12 text-sm text-slate-600 transition focus:border-[#66d0ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#66d0ff]/30"
                  >
                    <option value="">Seleccionar doctor</option>
                    <option value="consulta">Consulta General</option>
                    <option value="limpieza">Limpieza Dental</option>
                    <option value="ortodoncia">Ortodoncia</option>
                    <option value="endodoncia">Endodoncia</option>
                    <option value="cirugia">Cirugía</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#98a2b3]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#eef2fb]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e3eaf7] bg-[#f7f9fd] py-3 pl-14 pr-4 text-sm text-slate-600 transition focus:border-[#66d0ff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#66d0ff]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#0fb0e5] py-3 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(17,197,255,0.35)] transition hover:scale-[1.01] hover:bg-[#0aa0cf] focus:outline-none focus:ring-2 focus:ring-[#0fb0e5]/30"
              >
                Registrar Turno
              </button>
            </form>

            <aside className="w-full max-w-[320px] space-y-6 rounded-[30px] bg-white/80 px-8 py-8 shadow-[0_30px_70px_rgba(62,94,201,0.18)] backdrop-blur">
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>Noviembre 2025</span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <button className="rounded-full bg-[#eef4ff] px-2 py-1">&lt;</button>
                    <button className="rounded-full bg-[#eef4ff] px-2 py-1">&gt;</button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
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
                            : 'border-transparent bg-white/60 text-slate-500 hover:bg-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {appointments.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-[20px] border border-[#e6ecff] bg-white px-5 py-3 shadow-[0_18px_36px_rgba(162,186,255,0.22)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-[#ffd9ff] bg-[#fff2ff] text-sm font-bold text-[#d25dff]">
                      {item.position}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                      <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                    <span className="text-[#00b4ff]">•</span>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <img
            src={Clipboards}
            alt="Documentos"
            className="pointer-events-none absolute bottom-10 right-16 w-36 opacity-80"
            draggable={false}
          />
        </main>
      </div>
    </div>
  );
};

export default Turnos;
