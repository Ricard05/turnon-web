import { useState, useEffect, useCallback } from 'react';
import SmileUpLogo from '@/assets/smileup 1.png';
import { fetchActiveAndCompletedTurns } from '@/features/turns';
import type { Turn } from '@/core/types';

const TurnosPublicScreen = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [allTurns, setAllTurns] = useState<Turn[]>([]);

  const refetchTurns = useCallback(async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    try {
      const turns = await fetchActiveAndCompletedTurns(today, 5);
      setAllTurns(turns);
    } catch (error) {
      // Error silencioso en pantalla pública
      setAllTurns([]);
    }
  }, []);

  useEffect(() => {
    refetchTurns();
  }, [refetchTurns]);

  // Actualizar fecha y hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Escuchar cambios en turnos a través de BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('turnos-updates');

    channel.onmessage = (event) => {
      if (event.data.type === 'turnos-updated') {
        // Actualizar turnos inmediatamente cuando se notifica un cambio
        refetchTurns();
      }
    };

    return () => {
      channel.close();
    };
  }, [refetchTurns]);

  // Actualización periódica de respaldo cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetchTurns();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchTurns]);

  // Formatear fecha y hora en español
  const formatDateTime = (date: Date) => {
    const time = date.toLocaleString('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace('a. m.', 'AM').replace('p. m.', 'PM');

    const dayName = date.toLocaleString('es-MX', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('es-MX', { month: 'long' });
    const year = date.getFullYear();

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return `${time} -${capitalizedDayName}, ${day} de ${capitalizedMonth}, ${year}`;
  };

  // Filtrar turnos activos (ACTIVE o IN_CONSULTATION) y ordenar por startTime (más reciente primero)
  const activeTurnsOnly = allTurns.filter(turn =>
    turn.status === 'ACTIVE' || turn.status === 'IN_CONSULTATION'
  );

  const sortedActiveTurns = [...activeTurnsOnly].sort((a, b) => {
    const timeA = new Date(a.startTime).getTime();
    const timeB = new Date(b.startTime).getTime();
    return timeB - timeA; // Orden descendente (más reciente primero)
  });

  // Obtener el último turno activo llamado (el más reciente activo)
  const currentTurn = sortedActiveTurns[0];

  const currentTurnNumber = currentTurn?.turn;
  const currentSpace = currentTurn?.officeRoom;

  // Obtener todos los demás turnos (activos y completados) excluyendo el actual
  const otherTurns = allTurns
    .filter(turn => turn.id !== currentTurn?.id) // Excluir el turno actual
    .sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeB - timeA; // Orden descendente
    })
    .slice(0, 4) // Limitar a 4 turnos
    .map((turn) => ({
      number: turn.turn,
      space: turn.officeRoom,
      status: turn.status, // Para diferenciar visualmente
    }));

  const displayUpcomingTurns = otherTurns;

  // Asegurar que el body no tenga márgenes cuando se muestra esta pantalla
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-b from-purple-200/30 via-purple-100/50 to-purple-200/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-8 py-6 flex-shrink-0">
        {/* Logo */}
        <div>
          <img
            src={SmileUpLogo}
            alt="Smile.Up"
            className="h-16 object-contain"
            draggable={false}
          />
        </div>

        {/* Fecha y hora */}
        <div className="text-lg font-semibold text-gray-700">
          {formatDateTime(currentDateTime)}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex gap-10 px-12 pb-12 items-center justify-center overflow-hidden">
        {/* Panel izquierdo - Turno actual */}
        <div className="flex-1 rounded-3xl bg-gradient-to-br from-[#15C4E9] to-[#0092D8] p-8 flex flex-col text-white shadow-2xl min-h-[80vh] relative">
          {/* Título en esquina superior */}
          <div className="absolute top-8 left-8">
            <p className="text-3xl font-bold tracking-wide opacity-90">
              Último turno llamado
            </p>
          </div>

          {/* Contenido centrado */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <p className="text-4xl font-semibold mb-12 tracking-wide uppercase">
              AHORA SIGUE
            </p>
            <p className="text-[240px] font-bold mb-12 leading-none">
              {currentTurnNumber}
            </p>
            <p className="text-4xl font-semibold">
              Favor de pasar a {currentSpace}
            </p>
          </div>
        </div>

        {/* Panel derecho - Próximos turnos */}
        <div className="w-[500px] rounded-3xl bg-gradient-to-br from-[#15C4E9] to-[#0092D8] p-8 flex flex-col shadow-2xl min-h-[80vh] relative">
          {/* Título en esquina superior */}
          <div className="absolute top-8 left-8">
            <h2 className="text-3xl font-bold text-white tracking-wide opacity-90">
              Otros turnos llamados
            </h2>
          </div>

          {/* Contenido centrado */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            {displayUpcomingTurns.map((turn, index) => (
              <div key={`${turn.number}-${index}`}>
                <div className="flex justify-between items-center py-8">
                  <span className="text-5xl font-bold text-white">
                    {turn.number}
                  </span>
                  <span className="text-3xl font-semibold text-white">
                    {turn.space}
                  </span>
                </div>
                {index < displayUpcomingTurns.length - 1 && (
                  <div className="border-t border-white/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnosPublicScreen;

