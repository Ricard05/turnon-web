import { useState } from 'react';
import { 
  Filter, ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react';

// --- INICIO: Componente para la vista de Reportes ---
export default function ReportesView() {
  
  // Estado para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState<'fecha' | 'motivo' | null>(null);

  // --- Datos de simulación ---
  const allReportData = [
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'July 1, 2024', turnos: 15, tiempo: '12 minutos' },
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'July 25, 2024', turnos: 15, tiempo: '12 minutos' },
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'August 1, 2024', turnos: 12, tiempo: '12 minutos' },
    { motivo: 'Motivo 2', operador: 'Dr. Jones', fecha: 'August 22, 2024', turnos: 6, tiempo: '10 minutos' },
    { motivo: 'Motivo 2', operador: 'Dr. Jones', fecha: 'August 29, 2024', turnos: 6, tiempo: '10 minutos' },
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'September 5, 2024', turnos: 7, tiempo: '12 minutos' },
    // Añadimos más datos para simular paginación
    { motivo: 'Motivo 3', operador: 'Dr. Brown', fecha: 'September 6, 2024', turnos: 10, tiempo: '8 minutos' },
    { motivo: 'Motivo 2', operador: 'Dr. Jones', fecha: 'September 7, 2024', turnos: 5, tiempo: '9 minutos' },
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'September 8, 2024', turnos: 14, tiempo: '11 minutos' },
    { motivo: 'Motivo 3', operador: 'Dr. Brown', fecha: 'September 9, 2024', turnos: 11, tiempo: '8 minutos' },
    { motivo: 'Motivo 1', operador: 'Dr. Smith', fecha: 'September 10, 2024', turnos: 12, tiempo: '12 minutos' },
    { motivo: 'Motivo 2', operador: 'Dr. Jones', fecha: 'September 11, 2024', turnos: 7, tiempo: '10 minutos' },
  ];

  // --- Lógica de filtrado y paginación funcional ---
  const filteredData = allReportData.filter(row => {
    if (activeFilter === 'motivo') {
      // Simulación: mostrar solo "Motivo 1"
      return row.motivo === 'Motivo 1';
    }
    if (activeFilter === 'fecha') {
      // Simulación: mostrar solo los de "August"
      return row.fecha.includes('August');
    }
    // Si no hay filtro, mostrar todo
    return true; 
  });

  // Lógica de paginación
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // --- Fin de la lógica funcional ---

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleFilterClick = (filter: 'fecha' | 'motivo') => {
    if (activeFilter === filter) {
      setActiveFilter(null); // Desactivar si se hace clic de nuevo
    } else {
      setActiveFilter(filter);
    }
    goToPage(1); // Resetear a página 1 al cambiar filtro
  };


  return (
    <div className="w-full">
      {/* Header & Filter Funcional */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reportes</h2>
          <p className="text-slate-500 dark:text-slate-400">Genera reportes basados en la fecha, motivo u operador</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Filter className="w-4 h-4" />
          <span>Filtrar por</span>
          <button 
            onClick={() => handleFilterClick('fecha')}
            className={`font-medium dark:text-blue-400 ${activeFilter === 'fecha' ? 'text-blue-700 dark:text-blue-300 underline' : 'text-blue-600 hover:underline'}`}
          >
            Fecha (Agosto)
          </button>
          <button 
            onClick={() => handleFilterClick('motivo')}
            className={`font-medium dark:text-blue-400 ${activeFilter === 'motivo' ? 'text-blue-700 dark:text-blue-300 underline' : 'text-blue-600 hover:underline'}`}
          >
            Motivo (Motivo 1)
          </button>
        </div>
      </div>

      {/* "Table" List */}
      <div className="flex flex-col gap-3">
        {/* Header Row */}
        <div className="grid grid-cols-5 gap-4 bg-blue-600 text-white p-4 rounded-lg font-medium text-sm">
          <div>Motivo</div>
          <div>Operador</div>
          <div>Fecha</div>
          <div>Total de turnos</div>
          <div>% tiempo espera</div>
        </div>
        
        {/* Data Rows (funcionales con paginación) */}
        {paginatedData.map((row, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm text-sm text-slate-700 dark:text-slate-300 items-center">
            <div>{row.motivo}</div>
            <div>{row.operador}</div>
            <div>{row.fecha}</div>
            <div>{row.turnos}</div>
            <div>{row.tiempo}</div>
          </div>
        ))}
      </div>
      
      {/* Pagination Funcional */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span>Mostrar</span>
          <div className="relative">
            <select 
              className="appearance-none bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                goToPage(1); // Resetear a página 1 al cambiar filas
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <span>Filas</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* --- INICIO DE LA CORRECCIÓN --- */}
          {/* Botones de página (generados dinámicamente) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded-md font-medium ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {page}
            </button>
          ))}
          {/* --- FIN DE LA CORRECCIÓN --- */}
          
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};