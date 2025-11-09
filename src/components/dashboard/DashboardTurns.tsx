import TicketIcon from '../../assets/Vector.png';
import Clipboards from '../../assets/Papel.png';
import TurnsIconOutline from '../../assets/carpeta sin relleno.png';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';

type DashboardTurnsProps = {
  formData: {
    nombre: string;
    email: string;
    telefono: string;
    servicio: string;
  };
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isDarkMode: boolean;
};

const DashboardTurns = ({ formData, onChange, onSubmit, isDarkMode }: DashboardTurnsProps) => {
  const cardWrapperClass = `w-full max-w-[420px] overflow-hidden rounded-[32px] backdrop-blur transition-colors duration-300 shadow-[0_35px_80px_rgba(52,84,209,0.2)] ${
    isDarkMode ? 'bg-white/10 border border-white/10 text-slate-100' : 'bg-white text-slate-600'
  }`;

  const headerGradientClass = isDarkMode
    ? 'bg-gradient-to-br from-[#1e293b] via-[#1f2937] to-[#0f172a]'
    : 'bg-gradient-to-br from-[#d7e8ff] via-[#e4f0ff] to-[#f5f9ff]';

  const inputBaseClass = `w-full rounded-[18px] border py-3 pl-12 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
    isDarkMode
      ? 'border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30'
      : 'border-[#d9e4ff] bg-[#f7f9fd] text-slate-600 placeholder:text-slate-400 focus:border-[#66d0ff] focus:bg-white focus:ring-[#66d0ff]/30'
  }`;

  const selectClass = `w-full appearance-none rounded-[18px] border py-3 pl-12 pr-12 text-sm transition focus:outline-none focus:ring-2 ${
    isDarkMode
      ? 'border-white/15 bg-white/5 text-slate-100 focus:border-cyan-400 focus:ring-cyan-400/30'
      : 'border-[#d9e4ff] bg-[#f7f9fd] text-slate-600 focus:border-[#66d0ff] focus:bg-white focus:ring-[#66d0ff]/30'
  }`;

  const iconColorClass = isDarkMode ? 'text-slate-400' : 'text-[#94a3b8]';

  return (
    <div className="relative flex flex-1 justify-center pt-10">
      <div className={cardWrapperClass}>
        <div className={`h-28 ${headerGradientClass}`} />
        <form onSubmit={onSubmit} className={`px-10 pb-12 pt-10 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
          <div
            className={`mx-auto -mt-16 mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_18px_36px_rgba(59,130,246,0.2)] ${
              isDarkMode ? 'bg-white/90' : 'bg-white'
            }`}
          >
            <img src={TicketIcon} alt="Ticket" className="h-9 w-9" />
          </div>
          <h2 className={`text-center text-[22px] font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Solicitar Turno
          </h2>
          <p className={`mt-1 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            Completa el formulario para obtener un número de turno
          </p>

          <div className="mt-7 space-y-4">
            <div className="relative">
              <User className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColorClass}`} />
              <input
                name="nombre"
                value={formData.nombre}
                onChange={onChange}
                placeholder="Nombre"
                className={inputBaseClass}
              />
            </div>

            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColorClass}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Correo Electrónico"
                className={inputBaseClass}
              />
            </div>

            <div className="relative">
              <Phone className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${iconColorClass}`} />
              <input
                name="telefono"
                value={formData.telefono}
                onChange={onChange}
                placeholder="Número Telefónico"
                className={inputBaseClass}
              />
            </div>

            <div className="relative">
              <img
                src={TurnsIconOutline}
                alt="Servicio"
                className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  isDarkMode ? 'opacity-70' : 'opacity-70'
                }`}
              />
              <select
                name="servicio"
                value={formData.servicio}
                onChange={onChange}
                className={selectClass}
              >
                <option value="">Selecciona un servicio</option>
                <option value="consulta">Consulta General</option>
                <option value="limpieza">Limpieza Dental</option>
                <option value="ortodoncia">Ortodoncia</option>
                <option value="endodoncia">Endodoncia</option>
                <option value="cirugia">Cirugía</option>
              </select>
              <span
                className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-slate-400' : 'text-[#98a2b3]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-8 flex w-full items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#00b4ff] to-[#008cff] py-3 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(0,148,255,0.35)] transition hover:scale-[1.01] focus:outline-none focus:ring-2 ${
              isDarkMode ? 'focus:ring-cyan-400/30' : 'focus:ring-[#11c5ff]/30'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Registrar Turno
          </button>
        </form>
      </div>

      <img
        src={Clipboards}
        alt="Documentos"
        className={`pointer-events-none absolute bottom-6 right-6 w-40 opacity-100 ${
          isDarkMode ? 'mix-blend-screen' : ''
        }`}
        draggable={false}
      />
    </div>
  );
};

export default DashboardTurns;

