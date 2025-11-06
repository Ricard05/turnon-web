import { useState, type FormEvent } from 'react';
import TurnOnDashboard from './TurnOnDashboard';
import { Eye, EyeOff } from 'lucide-react'; // Importar los íconos para la contraseña
import { useAuth } from '../context';

const LoginScreen = () => {
  const { isAuthenticated, login, logout, loading, error: authError } = useAuth();
  
  // --- Añadimos la funcionalidad del formulario ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError((authError || (err instanceof Error ? err.message : 'Error al iniciar sesión')) ?? '');
    }
  };
  // --- Fin de la funcionalidad ---

  // Si está logueado, muestra el dashboard
  if (isAuthenticated) return <TurnOnDashboard onLogout={logout} />;

  // Si no, muestra la pantalla de login
  return (
    <div className="flex w-full h-screen overflow-x-hidden bg-gray-100">
      
      {/* Sección Izquierda - Gradiente Azul */}
      <div className="hidden lg:flex basis-1/2 grow bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-300 p-10 flex-col justify-between min-h-screen rounded-tl-[70px] rounded-bl-[70px]">
        
        {/* Logo (de la imagen) */}
        <div className="flex items-center gap-3 mb-6">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8C7 6.89543 7.89543 6 9 6H19C20.1046 6 21 6.89543 21 8V10H15V22H13V10H7V8Z" fill="#FFFFFF" />
          </svg>
          <span className="text-2xl font-semibold text-white">TurnOn</span>
        </div>
        
        {/* Texto (de la imagen) */}
        <div className="text-white flex flex-col items-start mb-[18vh]">
          <p className="text-2xl">Fácilmente puedes</p>
          <h1 className="text-5xl font-bold leading-tight">Acceder a tu sistema de gestión de turnos</h1>
        </div>
      </div>

      {/* Sección Derecha - Formulario Login */}
      <div className="w-full lg:basis-1/2 bg-white p-6 sm:p-10 md:p-16 flex flex-col justify-center shadow-lg min-h-screen">
        
        {/* Logo (de la imagen) */}
        <div className="flex items-center gap-3 mb-8 lg:mb-12">
           <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.89543 7.89543 6 9 6H19C20.1046 6 21 6.89543 21 8V10H15V22H13V10H7V8Z" fill="#2563EB" />
            </svg>
            <span className="text-xl font-semibold text-gray-800">TurnOn</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Iniciar sesión</h2>
        <p className="text-gray-600 mb-8 text-2xl font-sans">Accede a tu cuenta para gestionar turnos y tareas del equipo.</p>

        {/* Formulario funcional */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Tu Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-base"
              placeholder="TurnOn@gmail.com"
              value={email} // Conectado al estado
              onChange={(e) => setEmail(e.target.value)} // Conectado al estado
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Conectado al estado
                id="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 pr-10 text-base"
                placeholder="**********"
                value={password} // Conectado al estado
                onChange={(e) => setPassword(e.target.value)} // Conectado al estado
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Conectado al estado
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {/* Cambia el ícono según el estado */}
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Muestra el error si existe */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit" // Tipo submit para que el 'onSubmit' del form funcione
            className="w-full bg-blue-600 text-white py-4 text-lg rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-2xl drop-shadow-2xl border border-blue-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.30), 0 2px 4px 0 rgba(0,0,0,0.15)'}}
            disabled={loading}
          >
            {loading ? 'Conectando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;