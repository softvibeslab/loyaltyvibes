import React from 'react';

/**
 * Tipos de variantes disponibles para el componente Skeleton
 * - card: Caja redondeada para tarjetas
 * - text: Línea de texto
 * - avatar: Círculo para avatares
 * - custom: Permite dimensiones personalizadas
 */
export type SkeletonVariant = 'card' | 'text' | 'avatar' | 'custom';

/**
 * Propiedades del componente Skeleton
 */
export interface SkeletonProps {
  /** Variante de esqueleto */
  variant?: SkeletonVariant;
  /** Ancho personalizado (solo para custom) */
  width?: string;
  /** Alto personalizado (solo para custom) */
  height?: string;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Skeleton para mostrar placeholders de carga
 * Implementa efecto shimmer y accesibilidad WCAG 2.1 AA
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, className = '' }, ref) => {
    // Mapeo de estilos por variante
    const variantStyles: Record<SkeletonVariant, string> = {
      card: 'rounded-lg w-full h-32',
      text: 'rounded h-4 w-full',
      avatar: 'rounded-full w-12 h-12',
      custom: '',
    };

    // Clases base con animación shimmer
    const baseClasses =
      'bg-gray-200 animate-pulse';

    // Determinar estilos dimensionales
    let dimensionalClasses = variantStyles[variant];
    let customStyles: React.CSSProperties = {};

    if (variant === 'custom') {
      customStyles = {
        width: width || '100%',
        height: height || '1rem',
      };
    }

    // Combinar clases
    const combinedClasses = variant === 'custom'
      ? `${baseClasses} rounded ${className}`.replace(/\s+/g, ' ').trim()
      : `${baseClasses} ${dimensionalClasses} ${className}`.replace(/\s+/g, ' ').trim();

    return (
      <div
        ref={ref}
        className={combinedClasses}
        style={customStyles}
        role="status"
        aria-label="Loading"
        aria-live="polite"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';
