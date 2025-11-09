import { useState } from 'react';
import { Megaphone, ArrowLeftRight, X, Search, Sun, Moon, Grid, Layers, Folder, LogOut, User, Pause, Play } from 'lucide-react';

// Definimos cómo se ve un Turno
interface Turn {
  id: string;
  patient: string;
  reason: string;
}

// Simulamos nuestra "base de datos" de turnos pendientes
const initialQueue: Turn[] = [
  { id: 'A-124', patient: 'Ana Garcia', reason: 'Motivo 2' },
  { id: 'B-045', patient: 'Carlos Perez', reason: 'Motivo 1' },
  { id: 'C-101', patient: 'Sofia Lopez', reason: 'Motivo 3' },
  { id: 'A-125', patient: 'Miguel Torres', reason: 'Motivo 2' },
];

// Recibimos las props de modo oscuro y logout
interface QueueManagementProps {
  onBack?: () => void;
  onGoToReporte?: () => void;
  onLogout?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function QueueManagement({ 
  onBack, 
  onGoToReporte, 
  onLogout, 
  darkMode, 
  onToggleDarkMode 
}: QueueManagementProps) {
  
  const [isActive, setIsActive] = useState(true);
  const [search, setSearch] =useState('');
  
  const [currentTurn, setCurrentTurn] = useState<Turn | null>({
    id: 'A-123',
    patient: 'Elio Lujan',
    reason: 'Motivo 1',
  });
  
  const [pendingQueue, setPendingQueue] = useState<Turn[]>(initialQueue);

  const handleCallNext = () => {
    if (pendingQueue.length > 0) {
      const newQueue = [...pendingQueue];
      const nextTurn = newQueue.shift();
      setCurrentTurn(nextTurn || null);
      setPendingQueue(newQueue);
    } else {
      setCurrentTurn(null);
    }
  };

  const handleClearTurn = () => {
    setCurrentTurn(null);
  };


  return (
    // Aplicamos la clase dark y el fondo base
    <div className={`flex h-screen bg-white ${darkMode ? 'dark' : ''} dark:bg-slate-900`}>
      {/* Sidebar (con clases dark y logo corregido) */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        
        {/* Logo Unificado */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8C7 6.89543 7.89543 6 9 6H19C20.1046 6 21 6.89543 21 8V10H15V22H13V10H7V8Z" fill="#2563EB" />
            </svg>
            <span className="text-xl font-semibold text-gray-800 dark:text-slate-100">TurnOn</span>
          </div>
        </div>

        {/* Search Funcional */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Funcional */}
        <nav className="flex-1 px-4">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors bg-blue-600 text-white"
          >
            <Layers className="w-5 h-5" />
            <span className="font-medium">Filas</span>
          </button>
          <button
            onClick={onGoToReporte}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <Folder className="w-5 h-5" />
            <span className="font-medium">Reporte</span>
          </button>
        </nav>

        {/* Logout Funcional */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor principal con padding p-6 */}
      <main className="flex-1 overflow-auto p-6">
        
        {/* Contenedor de "tarjeta" unificado */}
        <div className="h-full w-full bg-slate-100 dark:bg-slate-950 rounded-3xl p-8 overflow-auto">

          {/* Header DENTRO de la tarjeta */}
          <header className="flex items-center justify-between">
            {/* Botón de Modo Oscuro Funcional */}
            <button onClick={onToggleDarkMode} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              {darkMode ? (
                <Sun className="w-5 h-5 text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-gray-800 dark:text-slate-100">Elio Lujan</div>
                <div className="text-sm text-gray-500 dark:text-slate-400">Administrador</div>
              </div>
              <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-slate-200" />
              </div>
            </div>
          </header>

          {/* Contenido de la página con mt-8 */}
          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Manejo de la fila</h1>
              <p className="text-gray-500 dark:text-slate-400 text-lg">
                Control general de los turnos. 
                <span className="font-medium text-blue-600 ml-2">{pendingQueue.length} turnos en espera.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Turno Actual Card (Funcional) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Turno Actual</h2>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-center gap-6">
                    {/* Queue Illustration */}
                    <div className="flex items-end gap-2 flex-shrink-0">
                      <div className="relative">
                        <div className="w-12 h-16 bg-teal-600 rounded-lg relative">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-6 bg-teal-700 rounded-t-lg flex items-center justify-center">
                            <div className="w-4 h-4">
                              <div className="w-full h-full bg-blue-500 rounded"></div>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="absolute -top-2 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-12 bg-gray-300 rounded-lg relative">
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-lg relative">
                          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Turn Info (condicional y funcional) */}
                    {currentTurn ? (
                      <div>
                        <h3 className="text-3xl font-bold text-blue-600 mb-1">Turno {currentTurn.id}</h3>
                        <p className="text-gray-600 mb-1">{currentTurn.reason}</p>
                        <p className="text-gray-700 font-medium">Paciente: {currentTurn.patient}</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-3xl font-bold text-gray-400 mb-1">No hay turno</h3>
                        <p className="text-gray-500">No hay pacientes siendo atendidos.</p>
                        <p className="text-gray-700 font-medium">Haga clic en "Llamar siguiente".</p>
                      </div>
                    )}

                  </div>
                </div>

                {/* Action Buttons (condicionales y funcionales) */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleClearTurn}
                    disabled={!currentTurn}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 border-2 border-orange-200 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                    Transferir turno
                  </button>
                  <button 
                    onClick={handleClearTurn}
                    disabled={!currentTurn}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-100 border-2 border-red-200 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    Cancelar turno
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Call Next Button (condicional y funcional) */}
                <button 
                  onClick={handleCallNext}
                  disabled={pendingQueue.length === 0} 
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
                >
                  <Megaphone className="w-6 h-6" />
                  {pendingQueue.length > 0 ? 'LLamar siguiente Turno' : 'No hay más turnos'}
                </button>

                {/* Status Card (con funcionalidad) */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Estado de atención</h3>
                  
                  <div className={`rounded-2xl p-6 flex items-center justify-between ${isActive ? 'bg-green-500' : 'bg-orange-500'}`}>
                    <span className="text-white font-bold text-2xl">
                      {isActive ? 'Activo' : 'En Pausa'}
                    </span>
                    
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`px-8 py-3 rounded-xl font-medium transition-colors bg-white hover:bg-gray-50 ${isActive ? 'text-orange-600' : 'text-green-600'}`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        <span>{isActive ? 'PAUSA' : 'REANUDAR'}</span>
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}