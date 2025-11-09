import React, { useState } from 'react';
import SmileUpLogo from '../assets/smileup 1.png';
import HomeIcon from '../assets/icono inicio.png';
import QueueIcon from '../assets/filas icono.png';
import FolderIcon from '../assets/carpeta sin relleno.png';
import FolderActiveIcon from '../assets/carpeta negra.png';
import LogoutIcon from '../assets/cerrar sesion icono.png';
import SidebarIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1.png';
import TicketIcon from '../assets/Vector.png';
import Clipboards from '../assets/Papel.png';
import AvatarImage from '../assets/notion-avatar-1761838847386 1.png';

const navItems = [
  { key: 'inicio' as const, label: 'Inicio', icon: HomeIcon },
  { key: 'filas' as const, label: 'Filas', icon: QueueIcon },
  { key: 'turnos' as const, label: 'Turnos', icon: FolderIcon, activeIcon: FolderActiveIcon },
];

type NavKey = 'inicio' | 'filas' | 'turnos';

type TurnosProps = {
  onNavigate?: (section: NavKey) => void;
  onLogout?: () => void;
};

const Turnos = ({ onNavigate, onLogout }: TurnosProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio) {
      alert('Por favor completa todos los campos');
      return;
    }
    alert('¡Turno solicitado exitosamente!');
    console.log('Datos del turno:', formData);
  };

  const handleNavigate = (key: NavKey) => {
    if (key === 'turnos') return;
    onNavigate?.(key);
  };

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

        <main className="relative flex flex-1 flex-col px-12 py-14">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[30px] font-semibold text-slate-800">Gestión de turnos</h1>
              <p className="mt-1 text-sm text-slate-400">Panel de control de turnos internos</p>
            </div>
            <div className="flex items-center gap-4 rounded-full bg-white/80 px-6 py-2 shadow-[0_16px_38px_rgba(15,38,70,0.12)]">
              <img src={AvatarImage} alt="Avatar" className="h-11 w-11 rounded-full object-cover" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-700">Elio Lujan</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-inner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 1 .33 1.82l-.93 2.13a1.8 1.8 0 0 1-2.15 1l-1.97-.66a1.8 1.8 0 0 0-1.14 0l-1.97.66a1.8 1.8 0 0 1-2.15-1l-.93-2.13A1.65 1.65 0 0 1 4.6 15l1.68-1.31a1.65 1.65 0 0 0 .57-1.54l-.32-2.14a1.8 1.8 0 0 1 1.51-2.07l2.06-.3a1.8 1.8 0 0 0 1.37-.97l.92-1.92a1.8 1.8 0 0 1 3.23 0l.92 1.92a1.8 1.8 0 0 0 1.37.97l2.06.3a1.8 1.8 0 0 1 1.51 2.07l-.32 2.14a1.65 1.65 0 0 0 .57 1.54L19.4 15Z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="mt-10 flex w-full justify-center">
            <div className="flex w-full max-w-[620px] flex-wrap items-center gap-4 rounded-[36px] bg-white/85 px-10 py-6 shadow-[0_20px_60px_rgba(52,84,209,0.16)] backdrop-blur">
              <img src={SmileUpLogo} alt="Smile.Up" className="h-9" />
              <div className="flex flex-1 flex-wrap justify-end gap-3">
                {navItems.map((item) => {
                  const isActive = item.key === 'turnos';
                  const iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNavigate(item.key)}
                      disabled={isActive}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#00b4ff] text-white shadow-[0_16px_32px_rgba(0,148,255,0.35)] cursor-default'
                          : 'bg-white/70 text-slate-500 hover:bg-white'
                      }`}
                    >
                      <img src={iconSrc} alt={item.label} className="h-4 w-4 object-contain" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-16 flex flex-1 justify-center">
            <div className="absolute inset-x-0 top-[-90px] mx-auto h-[560px] max-w-[840px] rounded-[54px] bg-gradient-to-br from-[#f0f5ff] via-[#f4f8ff] to-[#fbfdff] shadow-[0_40px_90px_rgba(59,130,246,0.22)]" />

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[420px] rounded-[28px] bg-white/90 px-10 py-12 text-slate-600 shadow-[0_35px_80px_rgba(52,84,209,0.2)] backdrop-blur"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#d5e4ff] via-[#e0ecff] to-[#f0f4ff] shadow-[0_18px_40px_rgba(59,130,246,0.18)]">
                <img src={TicketIcon} alt="Ticket" className="h-10 w-10" />
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
                    <option value="">Selecciona un servicio</option>
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
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#11c5ff] py-3 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(17,197,255,0.4)] transition hover:scale-[1.01] hover:bg-[#0fb0e5] focus:outline-none focus:ring-2 focus:ring-[#11c5ff]/30"
              >
                Registrar Turno
              </button>
            </form>
          </div>

          <img
            src={Clipboards}
            alt="Documentos"
            className="pointer-events-none absolute bottom-10 right-16 w-40 opacity-80"
            draggable={false}
          />
        </main>
      </div>
    </div>
  );
};

export default Turnos;
