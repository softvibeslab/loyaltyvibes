import React from 'react';
import { Button } from '../Button';

/**
 * Propiedades del componente EmptyState
 */
export interface EmptyStateProps {
  /** Icono (emoji) para mostrar */
  icon: string;
  /** Título del estado vacío */
  title: string;
  /** Descripción del estado vacío */
  description: string;
  /** Botón de acción opcional */
  action?: {
    /** Texto del botón */
    label: string;
    /** Manejador de clic del botón */
    onClick: () => void;
  };
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente EmptyState para mostrar estados sin datos
 * Implementa diseño centrado vertical y accesibilidad WCAG 2.1 AA
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className = '' }, ref) => {
    const baseClasses = 'flex flex-col items-center justify-center text-center max-w-md mx-auto p-6';
    const combinedClasses = `${baseClasses} ${className}`.replace(/\s+/g, ' ').trim();

    return (
      <div ref={ref} className={combinedClasses} role="status" aria-live="polite">
        {/* Icono */}
        {icon && (
          <div
            className="text-6xl mb-4"
            role="img"
            aria-label={title}
          >
            {icon}
          </div>
        )}

        {/* Título */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 mb-6 max-w-sm">
          {description}
        </p>

        {/* Botón de acción opcional */}
        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
