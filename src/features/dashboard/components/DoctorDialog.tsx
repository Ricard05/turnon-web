import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { UserAccount, Turn } from '@/core/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { completeTurn, cancelTurn } from '@/features/turns';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface DoctorDialogProps {
    doctor: UserAccount | null;
    activeTurn: Turn | null;
    isDarkMode: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRefetchActiveTurns?: () => void;
    onRefetchPendingTurns?: () => void;
}

const DoctorDialog = ({
    doctor,
    activeTurn,
    isDarkMode,
    open,
    onOpenChange,
    onRefetchActiveTurns,
    onRefetchPendingTurns,
}: DoctorDialogProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const doctorFullName = doctor
        ? `${doctor.name}${doctor.lastName ? ' ' + doctor.lastName : ''}`
        : 'Doctor';

    const handleCompleteTurn = async () => {
        if (!activeTurn || isProcessing) return;

        setIsProcessing(true);
        try {
            await completeTurn(activeTurn.id);
            onRefetchActiveTurns?.();
            onRefetchPendingTurns?.();

            const channel = new BroadcastChannel('turnos-updates');
            channel.postMessage({ type: 'turnos-updated' });
            channel.close();

            showSuccessToast('Turno completado correctamente');
            onOpenChange(false);
        } catch (error) {
            showErrorToast('No se pudo completar el turno. Por favor, intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelTurn = async () => {
        if (!activeTurn || isProcessing) return;

        setIsProcessing(true);
        try {
            await cancelTurn(activeTurn.id);
            onRefetchActiveTurns?.();
            onRefetchPendingTurns?.();

            const channel = new BroadcastChannel('turnos-updates');
            channel.postMessage({ type: 'turnos-updated' });
            channel.close();

            showSuccessToast('Turno cancelado correctamente');
            onOpenChange(false);
        } catch (error) {
            showErrorToast('No se pudo cancelar el turno. Por favor, intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatSchedule = (iso?: string) => {
        if (!iso) return 'Sin horario';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return 'Sin horario';
        const day = date.getDate();
        const month = date.toLocaleString('es-MX', { month: 'long' });
        const time = date
            .toLocaleString('es-MX', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })
            .replace('a. m.', 'am')
            .replace('p. m.', 'pm')
            .replace(' a. m.', 'am')
            .replace(' p. m.', 'pm');
        return `${day} ${month} ${time}`;
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'
                        } backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`}
                />
                <Dialog.Content
                    className={`fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-[32px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.3)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ${isDarkMode
                        ? 'border border-white/10 bg-slate-900/95 backdrop-blur-xl'
                        : 'border border-blue-100 bg-white/95 backdrop-blur-xl'
                        }`}
                >
                    {/* Close button */}
                    <Dialog.Close
                        className={`absolute right-6 top-6 rounded-full p-2 transition-all hover:scale-110 ${isDarkMode
                            ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                            }`}
                    >
                        <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                    </Dialog.Close>

                    {/* Dialog content */}
                    <div className="space-y-6">
                        <div>
                            <Dialog.Title
                                className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'
                                    }`}
                            >
                                {doctorFullName}
                            </Dialog.Title>
                            <Dialog.Description
                                className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}
                            >
                                {doctor?.email || 'Sin información de contacto'}
                            </Dialog.Description>
                        </div>

                        {/* Active turn info */}
                        <div
                            className={`rounded-[24px] border p-6 ${isDarkMode
                                ? 'border-white/10 bg-slate-800/60'
                                : 'border-slate-200 bg-slate-50'
                                }`}
                        >
                            <h3
                                className={`mb-4 text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                    }`}
                            >
                                Turno Actual
                            </h3>

                            {activeTurn ? (
                                <div className="space-y-3">
                                    <div
                                        className={`text-center text-5xl font-bold ${isDarkMode ? 'text-[#4fd4ff]' : 'text-[#1cc0ff]'
                                            }`}
                                    >
                                        {activeTurn.turn}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span
                                                className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                                            >
                                                Paciente
                                            </span>
                                            <span
                                                className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'
                                                    }`}
                                            >
                                                {activeTurn.patientName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span
                                                className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                                            >
                                                Consultorio
                                            </span>
                                            <span
                                                className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'
                                                    }`}
                                            >
                                                {activeTurn.officeRoom ?? 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span
                                                className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                                            >
                                                Tiempo
                                            </span>
                                            <span
                                                className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'
                                                    }`}
                                            >
                                                {formatSchedule(activeTurn.startTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <p
                                        className={`mb-4 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                            }`}
                                    >
                                        El doctor está disponible
                                    </p>
                                    <button
                                        onClick={() => {
                                            // TODO: Implement call next turn logic
                                            showSuccessToast('Llamando al siguiente turno...');
                                            onOpenChange(false);
                                        }}
                                        className="w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(16,185,129,0.45)]"
                                    >
                                        Llamar siguiente turno
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleCompleteTurn}
                                disabled={!activeTurn || isProcessing}
                                className="w-full rounded-full bg-gradient-to-r from-[#15C4E9] to-[#0092D8] py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(37,99,235,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                            >
                                {isProcessing ? 'Procesando...' : 'Completar'}
                            </button>
                            <button
                                onClick={handleCancelTurn}
                                disabled={!activeTurn || isProcessing}
                                className="w-full rounded-full bg-gradient-to-r from-red-400 to-red-600 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,93,112,0.35)] transition-all hover:shadow-[0_16px_36px_rgba(255,93,112,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                            >
                                {isProcessing ? 'Procesando...' : 'Cancelar'}
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement Ausente logic
                                    handleCancelTurn();
                                }}
                                disabled={!activeTurn || isProcessing}
                                className={`w-full rounded-full py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode
                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {isProcessing ? 'Procesando...' : 'Ausente'}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DoctorDialog;
