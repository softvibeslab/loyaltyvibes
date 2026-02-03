import React from 'react';

/**
 * Variantes de color y estilo del Badge
 */
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/**
 * Tamaños del Badge
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Propiedades del componente Badge
 */
export interface BadgeProps {
  /** Contenido del badge */
  children: React.ReactNode;
  /** Variante de color */
  variant?: BadgeVariant;
  /** Tamaño del badge */
  size?: BadgeSize;
  /** Mostrar indicador de punto */
  showDot?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Badge para mostrar etiquetas pequeñas con estilos semánticos
 * Implementa accesibilidad WCAG 2.1 AA con contraste de color >= 4.5:1
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'neutral',
      size = 'md',
      showDot = false,
      className = '',
    },
    ref
  ) => {
    // Estilos según la variante
    const variantStyles: Record<BadgeVariant, string> = {
      success:
        'bg-emerald-100 text-emerald-800 border-emerald-200',
      warning:
        'bg-amber-100 text-amber-800 border-amber-200',
      error:
        'bg-red-100 text-red-800 border-red-200',
      info:
        'bg-blue-100 text-blue-800 border-blue-200',
      neutral:
        'bg-gray-100 text-gray-800 border-gray-200',
    };

    // Estilos según el tamaño
    const sizeStyles: Record<BadgeSize, string> = {
      sm: 'px-2 py-0.5 text-xs font-medium',
      md: 'px-2.5 py-1 text-sm font-medium',
      lg: 'px-3 py-1.5 text-base font-medium',
    };

    const combinedClasses = `
      inline-flex items-center rounded-full border
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <span ref={ref} className={combinedClasses}>
        {showDot && (
          <span
            className="mr-1.5 h-2 w-2 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
