import React, { useState, useMemo, useEffect } from 'react';
import type { UserAccount, Turn } from '@/core/types';
import { Search } from 'lucide-react';

interface DoctorListSidebarProps {
    doctors: UserAccount[];
    activeTurns: Turn[];
    isDarkMode: boolean;
    onDoctorClick: (doctor: UserAccount) => void;
}

const DoctorListSidebar = ({
    doctors,
    activeTurns,
    isDarkMode,
    onDoctorClick,
}: DoctorListSidebarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const filteredDoctors = useMemo(() => {
        if (!searchQuery.trim()) return doctors;
        const query = searchQuery.toLowerCase();
        return doctors.filter((doctor) => {
            const fullName = `${doctor.name} ${doctor.lastName || ''}`.toLowerCase();
            return fullName.includes(query);
        });
    }, [doctors, searchQuery]);

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Generate avatar color based on doctor name
    const getAvatarColor = (name: string) => {
        const colors = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-green-400 to-green-600',
            'from-orange-400 to-orange-600',
            'from-teal-400 to-teal-600',
            'from-indigo-400 to-indigo-600',
            'from-rose-400 to-rose-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (doctor: UserAccount) => {
        const firstInitial = doctor.name.charAt(0).toUpperCase();
        const lastInitial = doctor.lastName?.charAt(0).toUpperCase() || '';
        return firstInitial + lastInitial;
    };

    return (
        <section
            className={`flex h-full min-h-[calc(100vh-180px)] w-80 flex-col rounded-[34px] px-6 py-7 shadow-[0_30px_60px_rgba(142,172,255,0.25)] ${isDarkMode
                ? 'border border-white/10 bg-white/5 backdrop-blur-xl'
                : 'border border-[#d6e6ff] bg-white/80 backdrop-blur-sm'
                }`}
        >
            {/* Header */}
            <div className="mb-6">
                <h2
                    className={`text-sm font-semibold uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-300' : 'text-slate-400'
                        }`}
                >
                    Doctores
                </h2>
                <p
                    className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-400'
                        }`}
                >
                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctores'}
                </p>
            </div>

            {/* Search bar */}
            <div className="relative group mb-5">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDarkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
                    }`} />
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar doctor o especialidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-16 py-3 border rounded-xl text-sm outline-none focus:ring-2 transition-all ${isDarkMode
                        ? 'bg-slate-700 border-slate-600 focus:ring-blue-500/30 focus:bg-slate-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-100 focus:ring-blue-100 focus:bg-white'
                        }`}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border ${isDarkMode
                    ? 'bg-slate-600 text-gray-300 border-slate-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                    }`}>
                    {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K'}
                </div>
            </div>

            {/* Doctor list */}
            <div className="flex-1 space-y-3 overflow-y-auto px-2 -mx-2 pt-2 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/50 dark:scrollbar-thumb-slate-700/50">
                {filteredDoctors.length === 0 ? (
                    <div
                        className={`flex flex-col items-center justify-center rounded-[22px] border px-6 py-12 ${isDarkMode
                            ? 'border-white/10 bg-white/5'
                            : 'border-slate-200 bg-slate-50'
                            }`}
                    >
                        <p
                            className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}
                        >
                            {searchQuery ? 'No se encontraron doctores' : 'No hay doctores disponibles'}
                        </p>
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => {
                        const fullName = `${doctor.name}${doctor.lastName ? ' ' + doctor.lastName : ''}`;
                        const initials = getInitials(doctor);
                        const avatarColor = getAvatarColor(doctor.name);

                        // Find active turn for this doctor
                        const activeTurn = activeTurns.find(turn => turn.userName === fullName);
                        const hasActiveTurn = !!activeTurn;

                        return (
                            <button
                                key={doctor.id}
                                onClick={() => onDoctorClick(doctor)}
                                className={`group flex w-full items-center gap-4 rounded-[22px] border px-4 py-3.5 text-left transition-all hover:scale-[1.02] ${isDarkMode
                                    ? `border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] ${hasActiveTurn ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-900'}`
                                    : `border-[#e6ecff] shadow-[0_8px_20px_rgba(162,186,255,0.15)] hover:shadow-[0_12px_30px_rgba(162,186,255,0.25)] ${hasActiveTurn ? 'bg-white hover:border-[#15C4E9]/30 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50' : 'bg-slate-200 border-slate-300'}`
                                    } ${!hasActiveTurn ? 'opacity-80 grayscale-[0.3]' : ''}`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-sm font-bold text-white shadow-lg`}
                                >
                                    {initials}
                                </div>

                                {/* Doctor info */}
                                <div className="flex-1 overflow-hidden">
                                    <p
                                        className={`truncate text-sm font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-700'
                                            }`}
                                    >
                                        {fullName}
                                    </p>
                                    <p
                                        className={`truncate text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                            }`}
                                    >
                                        {hasActiveTurn ? (
                                            <span className="text-blue-500 font-medium">
                                                Atendiendo: {activeTurn.turn}
                                            </span>
                                        ) : (
                                            'Sin turno activo'
                                        )}
                                    </p>
                                </div>

                                {/* Status indicator */}
                                {hasActiveTurn && (
                                    <div
                                        className={`h-2 w-2 flex-shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]`}
                                    />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default DoctorListSidebar;
