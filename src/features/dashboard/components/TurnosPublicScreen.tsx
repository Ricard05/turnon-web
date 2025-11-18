import { useState, useEffect } from 'react';
import SmileUpLogo from '@/assets/smileup 1.png';
import { usePendingTurns, useActiveTurns } from '@/features/turns';

const TurnosPublicScreen = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { turns: pendingTurns, refetch: refetchPending } = usePendingTurns();
  const { turns: activeTurns, refetch: refetchActive } = useActiveTurns();

  // Actualizar fecha y hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Actualizar turnos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetchPending();
      refetchActive();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchPending, refetchActive]);

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

  // Obtener el turno actual (el primero en la lista de activos o pendientes)
  const currentTurn = activeTurns[0] || pendingTurns[0];
  const currentTurnNumber = currentTurn?.turn || 'A23';
  const currentSpace = currentTurn?.officeRoom || 'Espacio 2';

  // Obtener los próximos turnos (excluyendo el actual)
  const upcomingTurns = pendingTurns
    .filter((turn) => turn.turn !== currentTurnNumber)
    .slice(0, 4)
    .map((turn) => ({
      number: turn.turn || 'A24',
      space: turn.officeRoom || 'Espacio 1',
    }));

  // Si no hay turnos reales, usar datos de ejemplo
  const displayUpcomingTurns = upcomingTurns.length > 0 
    ? upcomingTurns 
    : [
        { number: 'A24', space: 'Espacio 1' },
        { number: 'A25', space: 'Espacio 1' },
        { number: 'A26', space: 'Espacio 1' },
        { number: 'A27', space: 'Espacio 1' },
      ];

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
        <div className="flex-1 rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-20 flex flex-col justify-center items-center text-white shadow-2xl min-h-[80vh]">
          <div className="text-center">
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
        <div className="w-[500px] rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-12 flex flex-col shadow-2xl min-h-[80vh]">
          <div className="flex-1 flex flex-col justify-center">
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

