import React, { useEffect } from 'react';
import { ToastProps, ToastVariant } from './Toast.types';

/**
 * Componente Toast para notificaciones emergentes
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  variant,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  // Auto-dismiss después de la duración especificada
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Mapeo de iconos por variante
  const icons: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  // Mapeo de estilos de contenedor por variante
  const containerStyles: Record<ToastVariant, string> = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  // Mapeo de estilos de icono por variante
  const iconStyles: Record<ToastVariant, string> = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-blue-100 text-blue-600',
  };

  // Clases base del contenedor
  const baseClasses =
    'flex items-start w-full max-w-sm p-4 rounded-lg border shadow-lg' +
    ' animate-slide-in transition-all duration-300';

  // Combinar clases
  const combinedClasses = `
    ${baseClasses}
    ${containerStyles[variant]}
  `.replace(/\s+/g, ' ').trim();

  // Clases del icono
  const iconClasses = `
    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
    ${iconStyles[variant]}
  `.replace(/\s+/g, ' ').trim();

  // Clases del botón de cerrar
  const closeButtonClasses =
    'ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black/10' +
    ' focus:outline-none focus:ring-2 focus:ring-black/20' +
    ' transition-colors duration-200';

  return (
    <div
      className={combinedClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icono */}
      <div className={iconClasses} aria-hidden="true">
        {icons[variant]}
      </div>

      {/* Contenido */}
      <div className="ml-3 flex-1">
        {title && (
          <h4 className="text-sm font-semibold mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm">
          {message}
        </p>
      </div>

      {/* Botón de cerrar */}
      <button
        type="button"
        onClick={onClose}
        className={closeButtonClasses}
        aria-label="Cerrar notificación"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

Toast.displayName = 'Toast';
