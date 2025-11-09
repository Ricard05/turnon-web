import { useState } from 'react';
import TurnOnDashboard from './TurnOnDashboard';
import { Eye, EyeOff } from 'lucide-react'; // Importar los íconos para la contraseña

const LoginScreen = () => {
  const [logged, setLogged] = useState(false);
  
  // --- Añadimos la funcionalidad del formulario ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir que la página se recargue
    setError(''); // Limpiar errores previos

    // Simulación de login. En un proyecto real, esto iría al backend.
    // Usaremos TurnOn@gmail.com y 123456 como login de prueba
    if (email === 'TurnOn@gmail.com' && password === '123456') {
      setLogged(true); // ¡Login exitoso!
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  // Si está logueado, muestra el dashboard
  if (logged) return <TurnOnDashboard onLogout={() => setLogged(false)} />;

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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit" // Tipo submit para que el 'onSubmit' del form funcione
            className="w-full bg-blue-600 text-white py-4 text-lg rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-2xl drop-shadow-2xl border border-blue-900/30"
            style={{boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.30), 0 2px 4px 0 rgba(0,0,0,0.15)'}}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;