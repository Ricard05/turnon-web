import toast from 'react-hot-toast';

/**
 * Utilidades para mostrar notificaciones con react-hot-toast
 */

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'top-center',
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-center',
    icon: 'ℹ️',
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 3500,
    position: 'top-center',
    icon: '⚠️',
  });
};

/**
 * Ejemplos de uso:
 *
 * // Éxito
 * showSuccessToast('Usuario registrado correctamente');
 * showSuccessToast('Sesión iniciada correctamente');
 *
 * // Error
 * showErrorToast('El campo email es requerido');
 * showErrorToast('Error al iniciar sesión');
 *
 * // Loading
 * const toastId = showLoadingToast('Procesando...');
 * // ... después de completar la operación
 * dismissToast(toastId);
 * showSuccessToast('Operación completada');
 *
 * // Info
 * showInfoToast('Verifica tu correo electrónico');
 *
 * // Warning
 * showWarningToast('La sesión expirará en 5 minutos');
 */
