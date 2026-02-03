import { ToastVariant } from './Toast.types';

/**
 * Opciones para mostrar un toast
 */
export interface ShowToastOptions {
  /** Variante de la notificación */
  variant: ToastVariant;
  /** Título de la notificación */
  title?: string;
  /** Mensaje de la notificación */
  message: string;
  /** Duración en ms (0 = no auto-dismiss) */
  duration?: number;
}

/**
 * Valor de retorno del hook useToast
 */
export interface UseToastReturn {
  /** Mostrar una notificación */
  showToast: (options: ShowToastOptions) => string;
  /** Mostrar notificación de éxito */
  showSuccess: (message: string, title?: string) => string;
  /** Mostrar notificación de error */
  showError: (message: string, title?: string) => string;
  /** Mostrar notificación de advertencia */
  showWarning: (message: string, title?: string) => string;
  /** Mostrar notificación de información */
  showInfo: (message: string, title?: string) => string;
  /** Cerrar una notificación específica */
  closeToast: (id: string) => void;
  /** Cerrar todas las notificaciones */
  closeAllToasts: () => void;
  /** Lista de notificaciones activas */
  toasts: Array<{
    id: string;
    variant: ToastVariant;
    title?: string;
    message: string;
    duration?: number;
  }>;
}
