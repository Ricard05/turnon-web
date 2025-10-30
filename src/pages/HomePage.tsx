import React, { useState } from 'react';
import QueueManagement from './QueueManagement';

const LoginScreen = () => {
  const [logged, setLogged] = useState(false);

  if (logged) return <QueueManagement />;

  return (
    <div className="flex w-full h-screen overflow-x-hidden bg-gray-100">
      {/* Sección Izquierda - Gradiente Azul */}
      <div className="hidden lg:flex basis-1/2 grow bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-300 p-10 flex-col justify-between min-h-screen rounded-tl-[70px] rounded-bl-[70px]">
        <div className="flex items-center mb-6">
          {/* Logo asterisco alineado a la izquierda */}
          <span className="text-4xl text-blue-200 font-extrabold">*</span>
        </div>
        <div className="text-white flex flex-col items-start mb-[18vh]">
          <p className="text-2xl">Fácilmente puedes</p>
          <h1 className="text-5xl font-bold leading-tight">Acceder a tu sistema de gestión de turnos</h1>
        </div>
      </div>

      {/* Sección Derecha - Formulario Login */}
      <div className="w-full lg:basis-1/2 bg-white p-6 sm:p-10 md:p-16 flex flex-col justify-center shadow-lg min-h-screen">
        <div className="flex flex-col items-start mb-8 lg:mb-12">
          {/* Logo sustituido por un asterisco */}
          <span className="text-4xl text-blue-600 font-sans mb-3">*</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Iniciar sesión</h2>
        <p className="text-gray-600 mb-8 text-2xl font-sans">Accede a tu cuenta para gestionar turnos y tareas del equipo.</p>

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
            Tu Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-base"
            placeholder="TurnOn@gmail.com"
            value="TurnOn@gmail.com" // Pre-filled value
            readOnly // Make it read-only for demo purposes
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 pr-10 text-base"
              placeholder="**********"
              value="**********" // Pre-filled value
              readOnly // Make it read-only for demo purposes
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLogged(true)}
          className="w-full bg-blue-600 text-white py-4 text-lg rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-2xl drop-shadow-2xl border border-blue-900/30"
          style={{boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.30), 0 2px 4px 0 rgba(0,0,0,0.15)'}}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
