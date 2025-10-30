import React, { useState } from 'react';
import { Megaphone, ArrowLeftRight, X, Search, Sun, Star, Folder, Settings } from 'lucide-react';

export default function QueueManagement() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-200 p-4">
        <h2 className="text-gray-500 text-sm font-medium mb-4 px-2">Dashboards</h2>
        
        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-sm">General</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-500 rounded-lg">
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M3 8L12 3L21 8M3 8V16L12 21M3 8L12 13M21 8V16L12 21M21 8L12 13M12 13V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium">Fila</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Folder className="w-5 h-5" />
            <span className="text-sm">Reportes</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Ajustes</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Dashboards</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Fila</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar"
                className="pl-9 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">⌘ /</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Sun className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manejo de la fila</h1>
            <p className="text-gray-500 text-lg">Control general de los turnos</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Turno Actual Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Turno Actual</h2>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-6">
                  {/* Couch Icon */}
                  <div className="w-24 h-24 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                    <div className="w-16 h-12 bg-teal-600 rounded-lg relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-6 bg-teal-700 rounded-t-lg flex items-center justify-center">
                        <div className="w-4 h-4">
                          <svg viewBox="0 0 24 24" fill="none" className="text-amber-100">
                            <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0 -left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
                      <div className="absolute bottom-0 -right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Turn Info */}
                  <div>
                    <h3 className="text-3xl font-bold text-blue-600 mb-1">Turno A-123</h3>
                    <p className="text-gray-600 mb-1">Motivo 1</p>
                    <p className="text-gray-700 font-medium">Paciente: Elio Lujan</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  <ArrowLeftRight className="w-5 h-5" />
                  Transferir Turno
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-100 border-2 border-red-200 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors">
                  <X className="w-5 h-5" />
                  Terminar Turno
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Call Next Button */}
              <button className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                <Megaphone className="w-6 h-6" />
                Llamar siguiente Turno
              </button>

              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Estado de atención</h3>
                
                <div className="bg-green-500 rounded-2xl p-6 flex items-center justify-between">
                  <span className="text-white font-bold text-2xl">Activo</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                      isActive 
                        ? 'bg-white text-orange-600 hover:bg-gray-50' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">⏸</span>
                      PAUSA
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
