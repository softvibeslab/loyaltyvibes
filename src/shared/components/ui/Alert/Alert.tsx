import React from 'react';

/**
 * Tipos de variantes disponibles para el componente Alert
 * - success: Color verde para indicar éxito
 * - warning: Color amarillo para advertencias
 * - error: Color rojo para errores
 * - info: Color azul para información
 */
export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

/**
 * Propiedades del componente Alert
 */
export interface AlertProps {
  /** Variante de alerta */
  variant?: AlertVariant;
  /** Título de la alerta */
  title?: string;
  /** Descripción de la alerta */
  description: string;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Alert para mostrar mensajes de retroalimentación inline
 * Implementa accesibilidad WCAG 2.1 AA con contraste de color >= 4.5:1
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, description, className = '' }, ref) => {
    // Mapeo de iconos por variante (emoji)
    const icons: Record<AlertVariant, string> = {
      success: '✓',
      warning: '⚠',
      error: '✕',
      info: 'ℹ',
    };

    // Mapeo de estilos de contenedor por variante
    const containerStyles: Record<AlertVariant, string> = {
      success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      warning: 'bg-amber-50 border-amber-200 text-amber-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    // Mapeo de estilos de icono por variante
    const iconStyles: Record<AlertVariant, string> = {
      success: 'bg-emerald-100 text-emerald-600',
      warning: 'bg-amber-100 text-amber-600',
      error: 'bg-red-100 text-red-600',
      info: 'bg-blue-100 text-blue-600',
    };

    // Clases base
    const baseClasses =
      'flex items-start p-4 rounded-lg border';

    // Combinar clases
    const combinedClasses = `
      ${baseClasses}
      ${containerStyles[variant]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    const iconClasses = `
      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
      ${iconStyles[variant]}
    `.replace(/\s+/g, ' ').trim();

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role="alert"
        aria-live="polite"
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
            {description}
          </p>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
