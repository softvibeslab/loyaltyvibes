import { useState, useCallback } from 'react';
import { ToastData, ToastVariant } from './Toast.types';
import { ShowToastOptions, UseToastReturn } from './useToast.types';

/**
 * Hook para gestionar notificaciones Toast
 * Proporciona funciones imperativas para mostrar, cerrar y gestionar notificaciones
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Generar ID único para cada toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Mostrar un toast
  const showToast = useCallback((options: ShowToastOptions): string => {
    const id = generateId();
    const newToast: ToastData = {
      id,
      variant: options.variant,
      title: options.title,
      message: options.message,
      duration: options.duration,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, [generateId]);

  // Mostrar toast de éxito
  const showSuccess = useCallback((message: string, title?: string): string => {
    return showToast({
      variant: 'success',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  // Mostrar toast de error
  const showError = useCallback((message: string, title?: string): string => {
    return showToast({
      variant: 'error',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  // Mostrar toast de advertencia
  const showWarning = useCallback((message: string, title?: string): string => {
    return showToast({
      variant: 'warning',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  // Mostrar toast de información
  const showInfo = useCallback((message: string, title?: string): string => {
    return showToast({
      variant: 'info',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  // Cerrar un toast específico
  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Cerrar todos los toasts
  const closeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeToast,
    closeAllToasts,
    toasts,
  };
}

/**
 * Componente ToastContainer para renderizar todas las notificaciones activas
 */
import React from 'react';
import { Toast } from './Toast';

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'bottom-right';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'bottom-right',
}) => {
  const positionClasses: Record<typeof position, string> = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2`}
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};
