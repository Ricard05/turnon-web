/**
 * Date and time formatting utilities
 */

/**
 * Formats a date-time string to a relative time format
 * @param iso - ISO date string
 * @returns Formatted string like "En 15 min", "En 2h 30m", "En curso"
 * @example
 * formatRelativeTime('2024-01-15T14:30:00') // "En 15 min"
 * formatRelativeTime('2024-01-15T10:00:00') // "En curso" (if already passed)
 */
export function formatRelativeTime(iso?: string): string {
  if (!iso) return 'Sin horario';

  const start = new Date(iso);
  if (Number.isNaN(start.getTime())) return 'Sin horario';

  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 0) return 'En curso';
  if (diffMinutes < 60) return `En ${diffMinutes} min`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `En ${hours}h ${minutes}m`;
}

/**
 * Formats a date-time string to a schedule format (day month time)
 * @param iso - ISO date string
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted string like "14 noviembre 12:00pm"
 * @example
 * formatSchedule('2024-01-15T14:30:00') // "15 enero 2:30pm"
 */
export function formatSchedule(iso?: string, fallback = 'Sin horario'): string {
  if (!iso) return fallback;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fallback;

  const day = date.getDate();
  const month = date.toLocaleString('es-MX', { month: 'long' });
  const time = date
    .toLocaleString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace('a. m.', 'am')
    .replace('p. m.', 'pm')
    .replace(' a. m.', 'am')
    .replace(' p. m.', 'pm');

  return `${day} ${month} ${time}`;
}

/**
 * Formats a date-time string to time only
 * @param iso - ISO date string
 * @returns Formatted time string like "2:30pm"
 */
export function formatTime(iso?: string): string {
  if (!iso) return 'Sin horario';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Sin horario';

  return date
    .toLocaleString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace('a. m.', 'am')
    .replace('p. m.', 'pm')
    .replace(' a. m.', 'am')
    .replace(' p. m.', 'pm');
}
