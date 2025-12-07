import { useMemo, useState } from "react";
import IconEnCola from "@/assets/en cola.png";
import IconAtendiendo from "@/assets/atendiendo.png";
import IconEspera from "@/assets/espera promedio.png";
import DoctorRestingImage from "@/assets/doctor_resting.png";
import type { QueueStat, UpcomingTurn, Turn, UserAccount } from "@/core/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDoctors } from "@/features/users";
import DoctorListSidebar from "./DoctorListSidebar";
import DoctorDialog from "./DoctorDialog";

type DashboardQueueProps = {
  stats: QueueStat[];
  upcoming: UpcomingTurn[];
  activeTurns: Turn[];
  isDarkMode: boolean;
  isLoading?: boolean;
  error?: string | null;
  onRefetchActiveTurns?: () => void;
  onRefetchPendingTurns?: () => void;
};

const DashboardQueue = ({
  stats,
  upcoming,
  activeTurns,
  isDarkMode,
  error = null,
  onRefetchActiveTurns,
  onRefetchPendingTurns,
}: DashboardQueueProps) => {
  // Fetch doctors from API
  const { doctors } = useDoctors();

  const upcomingList = upcoming;
  const [selectedDoctor, setSelectedDoctor] = useState<UserAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDoctorClick = (doctor: UserAccount) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  // Find active turn for selected doctor
  // Find active turn for selected doctor
  const selectedDoctorFullName = selectedDoctor
    ? `${selectedDoctor.name}${selectedDoctor.lastName ? ' ' + selectedDoctor.lastName : ''}`
    : null;

  const activeTurnForSelectedDoctor = activeTurns.find(
    (turn) => turn.userName === selectedDoctorFullName
  );

  const statsSummary = useMemo(() => {
    const getValue = (label: string, fallback: string) =>
      stats.find((item) => item.label.toLowerCase().includes(label))?.value ??
      fallback;

    return [
      {
        label: "En cola",
        value: getValue("cola", "3"),
        icon: IconEnCola,
        iconBg: "bg-[#eff5ff]",
        accent: "text-[#2563eb]",
      },
      {
        label: "Atendiendo",
        value: getValue("atend", "1"),
        icon: IconAtendiendo,
        iconBg: "bg-[#fff5eb]",
        accent: "text-[#f97316]",
      },
      {
        label: "Espera promedio",
        value: getValue("espera", "7 min"),
        icon: IconEspera,
        iconBg: "bg-[#edfdf5]",
        accent: "text-[#10b981]",
      },
    ];
  }, [stats]);

  const formatSchedule = (iso?: string, fallback?: string) => {
    if (!iso) return fallback ?? "Sin horario";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return fallback ?? "Sin horario";
    const day = date.getDate();
    const month = date.toLocaleString("es-MX", { month: "long" });
    const time = date
      .toLocaleString("es-MX", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace("a. m.", "am")
      .replace("p. m.", "pm")
      .replace(" a. m.", "am")
      .replace(" p. m.", "pm");
    return `${day} ${month} ${time}`;
  };

  const upcomingDisplay = upcomingList.map((turn) => ({
    position: turn.position,
    name: turn.name,
    schedule: formatSchedule(turn.startTime),
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 min-h-[calc(100vh-180px)]">
      {/* Left Column: Stats + Queue */}
      <div className="flex flex-col gap-6 min-h-full">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statsSummary.map((stat) => (
            <div
              key={stat.label}
              className={`group flex items-center gap-4 rounded-[26px] border px-6 py-6 shadow-[0_16px_32px_rgba(166,190,255,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(166,190,255,0.35)] ${isDarkMode
                ? "border-white/10 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10"
                : "border-[#e6ecff] bg-gradient-to-r from-white to-blue-50/30 hover:border-[#15C4E9]/20"
                }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${isDarkMode ? "bg-white/10" : stat.iconBg
                  }`}
              >
                <img
                  src={stat.icon}
                  alt={stat.label}
                  className="h-7 w-7 object-contain"
                />
              </span>
              <div className="flex-1">
                <p
                  className={`text-2xl font-bold ${isDarkMode ? "text-slate-100" : stat.accent
                    }`}
                >
                  {stat.value}
                </p>
                <span
                  className={`text-sm font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                >
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Queue Section - Takes remaining height */}
        <section
          className={`flex-1 flex flex-col rounded-[34px] px-10 py-9 shadow-[0_30px_60px_rgba(142,172,255,0.25)] min-h-[600px] ${isDarkMode
            ? "border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl"
            : "border border-[#d6e6ff] bg-gradient-to-br from-white/90 via-white/75 to-white/90 backdrop-blur-sm"
            }`}
        >
          <div>
            <h2
              className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDarkMode ? "text-slate-300" : "text-slate-400"
                }`}
            >
              Próximos en espera
            </h2>
            <p
              className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-400"
                }`}
            >
              Turnos en cola
            </p>
          </div>

          <div className="mt-7 flex-1 flex flex-col overflow-hidden">
            {error && (
              <div
                className={`flex items-center justify-center rounded-[22px] border px-6 py-6 text-sm font-semibold ${isDarkMode
                  ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                  : "border-rose-200 bg-rose-50 text-rose-500"
                  }`}
              >
                {error}
              </div>
            )}

            {!error && upcomingDisplay.length === 0 && (
              <div
                className={`flex flex-col items-center justify-center rounded-[22px] border px-6 py-8 text-sm flex-1 ${isDarkMode
                  ? "border-white/10 bg-white/5 text-slate-300"
                  : "border-[#e6ecff] bg-white text-slate-500"
                  }`}
              >
                <p>No hay turnos pendientes</p>
                <img
                  src={DoctorRestingImage}
                  alt="No hay turnos"
                  className="w-60 mt-10 object-contain"
                />
              </div>
            )}

            {!error && upcomingDisplay.length > 0 && (
              <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/50 dark:scrollbar-thumb-slate-700/50">
                {upcomingDisplay.map((item, idx) => (
                  <article
                    key={`${item.position}-${idx}-${item.name}`}
                    className={`group flex items-center justify-between gap-4 rounded-[26px] border px-6 py-4 shadow-[0_18px_35px_rgba(162,186,255,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(162,186,255,0.35)] ${isDarkMode
                      ? "border-white/10 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10"
                      : "border-[#e6ecff] bg-gradient-to-r from-white to-blue-50/50 hover:border-[#15C4E9]/30"
                      }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`flex h-12 min-w-12 items-center justify-center rounded-[22px] border px-3 text-lg font-bold ${isDarkMode
                          ? "border-white/20 bg-white/10 text-[#15C4E9]"
                          : "border-[#ffd9ff] bg-gradient-to-r from-[#15C4E9] to-[#0092D8] text-[#ffffff]"
                          }`}
                      >
                        {item.position}
                      </span>
                      <div>
                        <p
                          className={`text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-700"
                            }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`mt-1 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-400"
                            }`}
                        >
                          {item.schedule}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition ${isDarkMode
                        ? "bg-white/10 text-rose-200 hover:bg-white/20"
                        : "bg-[#ffe9ee] text-rose-400 hover:bg-[#ffd7e0]"
                        }`}
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Column: Doctor List (Full Height) */}
      <DoctorListSidebar
        doctors={doctors}
        activeTurns={activeTurns}
        isDarkMode={isDarkMode}
        onDoctorClick={handleDoctorClick}
      />

      {/* Doctor dialog */}
      <DoctorDialog
        doctor={selectedDoctor}
        activeTurn={activeTurnForSelectedDoctor ?? null}
        isDarkMode={isDarkMode}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onRefetchActiveTurns={onRefetchActiveTurns}
        onRefetchPendingTurns={onRefetchPendingTurns}
      />
    </div>
  );
};

export default DashboardQueue;