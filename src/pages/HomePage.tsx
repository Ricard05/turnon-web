import { type FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import SmileUpLogo from '../assets/smileup 1.png';
import TurnOnLogo from '../assets/TurnOn.png';
import QueueIllustration from '../assets/undraw_wait-in-line_fbdq (1) 1 (1).png';
import TurnOnDashboard from './TurnOnDashboard';
import TurnOnDashboardAdmin from './TurnOnDashboardAdmin';
import { useAuth } from '../context';

const LoginScreen = () => {
  const { isAuthenticated, user, login, logout, loading, error: authError, resetError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authError) {
      resetError();
    }
    try {
      await login(email, password);
    } catch {
      // El error se maneja en el contexto; no hacemos nada extra aquí.
    }
  };

  if (isAuthenticated && user) {
    const normalizedRole = user.role?.toUpperCase?.() ?? '';
    const isAdmin = normalizedRole.includes('ADMIN');
    return isAdmin ? <TurnOnDashboardAdmin onLogout={logout} /> : <TurnOnDashboard onLogout={logout} />;
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-1/2 text-white flex flex-col bg-gradient-to-br from-[#00B4D8] via-[#0197D6] to-[#035E9B] lg:rounded-tr-[48px] lg:rounded-br-[48px]">
        <img
          src={QueueIllustration}
          alt="Personas esperando en fila"
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full max-h-[70%] object-cover opacity-85"
        />

        <div className="relative z-10 flex h-full flex-col px-8 sm:px-12 lg:px-16 py-10">
          <img
            src={TurnOnLogo}
            alt="TurnOn"
            className="w-[88px] h-[88px] object-contain drop-shadow-[0_16px_38px_rgba(4,35,54,0.35)]"
          />

          <div className="mt-auto pb-14">
            <p className="uppercase tracking-[0.25em] text-sm font-bold text-white/90 mb-4 min-w-max">
              Fácilmente puedes
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight drop-shadow-[0_18px_42px_rgba(4,35,54,0.45)] max-w-sm">
              Acceder a tu sistema de gestión de turnos
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col px-10 sm:px-12 lg:px-24 py-12">
        <div className="flex justify-end mb-8">
          <img src={SmileUpLogo} alt="Smile.Up" className="h-28 object-contain" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-500 mt-3">
            Accede a tu cuenta para gestionar turnos y tareas del equipo.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Tu Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  if (authError) {
                    resetError();
                  }
                  setEmail(e.target.value);
                }}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#00B4D8] focus:ring-4 focus:ring-[#00B4D8]/20 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    if (authError) {
                      resetError();
                    }
                    setPassword(e.target.value);
                  }}
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#00B4D8] focus:ring-4 focus:ring-[#00B4D8]/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#00B4D8] transition"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {authError && <p className="text-red-600 text-sm">{authError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#15C4E9] to-[#0092D8] text-white font-semibold shadow-[0_12px_24px_rgba(0,148,219,0.35)] hover:from-[#03C3E4] hover:to-[#01A0E4] focus:outline-none focus:ring-4 focus:ring-[#00B4D8]/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Conectando…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;