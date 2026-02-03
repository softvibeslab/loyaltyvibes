import React from 'react';

/**
 * Tamaños disponibles para el componente Spinner
 */
export type SpinnerSize = 'sm' | 'md';

/**
 * Propiedades del componente Spinner
 */
export interface SpinnerProps {
  /** Tamaño del spinner */
  size?: SpinnerSize;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Spinner para indicar estado de carga
 * Implementa animación de rotación y accesibilidad WCAG 2.1 AA
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', className = '' }, ref) => {
    // Mapeo de estilos de tamaño
    const sizeStyles: Record<SpinnerSize, string> = {
      sm: 'w-4 h-4 border-2',
      md: 'w-6 h-6 border-3',
    };

    // Clases base con animación
    const baseClasses =
      'inline-block rounded-full border-emerald-500 border-t-transparent animate-spin';

    // Combinar clases
    const combinedClasses = `
      ${baseClasses}
      ${sizeStyles[size]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role="status"
        aria-label="Loading"
        aria-live="polite"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
