import React from 'react';

/**
 * Variantes de estilo del componente Card
 */
export type CardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * Propiedades del componente Card
 */
export interface CardProps {
  /** Título de la tarjeta */
  title?: string;
  /** Descripción de la tarjeta */
  description?: string;
  /** Contenido del footer */
  footer?: React.ReactNode;
  /** Variante de estilo */
  variant?: CardVariant;
  /** Contenido principal de la tarjeta */
  children: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Card para contenido con diferentes variantes visuales
 * Implementa accesibilidad WCAG 2.1 AA con estructura semántica
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      description,
      footer,
      variant = 'elevated',
      children,
      className = '',
    },
    ref
  ) => {
    // Estilos según la variante
    const variantStyles: Record<CardVariant, string> = {
      elevated:
        'bg-white shadow-md hover:shadow-lg transition-shadow duration-200',
      outlined:
        'bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200',
      flat: 'bg-gray-50 border border-gray-100',
    };

    const combinedClasses = `
      rounded-lg overflow-hidden
      ${variantStyles[variant]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <div ref={ref} className={combinedClasses}>
        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
