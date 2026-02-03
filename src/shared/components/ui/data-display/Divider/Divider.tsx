import React from 'react';

/**
 * Orientación del Divider
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Propiedades del componente Divider
 */
export interface DividerProps {
  /** Orientación del divisor */
  orientation?: DividerOrientation;
  /** Etiqueta de texto opcional */
  label?: string;
  /** Grosor del divisor (en pixels) */
  thickness?: number;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Divider para separación visual con etiqueta opcional
 * Implementa accesibilidad WCAG 2.1 AA con role separator
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      label,
      thickness = 1,
      className = '',
    },
    ref
  ) => {
    // Estilos según la orientación
    const orientationStyles: Record<DividerOrientation, string> = {
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l',
    };

    // Estilo de grosor
    const thicknessStyle = {
      borderWidth: `${thickness}px`,
    };

    const combinedClasses = `
      ${orientationStyles[orientation]}
      border-gray-300
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Sin etiqueta
    if (!label) {
      return (
        <div
          ref={ref}
          className={combinedClasses}
          role="separator"
          aria-orientation={orientation}
          style={thicknessStyle}
        />
      );
    }

    // Con etiqueta - horizontal
    if (orientation === 'horizontal') {
      return (
        <div
          ref={ref}
          className={`
            flex items-center w-full my-4
            ${className}
          `}
          role="separator"
          aria-orientation="horizontal"
        >
          <div
            className="flex-1 border-t border-gray-300"
            style={thicknessStyle}
            aria-hidden="true"
          />
          <span className="px-4 text-sm text-gray-500 font-medium">
            {label}
          </span>
          <div
            className="flex-1 border-t border-gray-300"
            style={thicknessStyle}
            aria-hidden="true"
          />
        </div>
      );
    }

    // Con etiqueta - vertical
    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center h-full mx-4
          ${className}
        `}
        role="separator"
        aria-orientation="vertical"
      >
        <div
          className="flex-1 border-l border-gray-300"
          style={thicknessStyle}
          aria-hidden="true"
        />
        <span className="py-4 text-sm text-gray-500 font-medium writing-mode-vertical">
          {label}
        </span>
        <div
          className="flex-1 border-l border-gray-300"
          style={thicknessStyle}
          aria-hidden="true"
        />
      </div>
    );
  }
);

Divider.displayName = 'Divider';
