import React from 'react';

/**
 * Dirección de la tendencia
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Propiedades del componente StatCard
 */
export interface StatCardProps {
  /** Título de la estadística */
  title: string;
  /** Valor principal de la estadística */
  value: string | number;
  /** Cambio porcentual (opcional) */
  change?: number;
  /** Icono (emoji) */
  icon?: string;
  /** Dirección de la tendencia */
  trend?: TrendDirection;
  /** Si está en estado de carga */
  loading?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente StatCard para mostrar métricas y KPIs
 * Implementa accesibilidad WCAG 2.1 AA con estructura semántica
 */
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      change,
      icon,
      trend = 'neutral',
      loading = false,
      className = '',
    },
    ref
  ) => {
    // Estado de carga
    if (loading) {
      return (
        <div
          ref={ref}
          className={`
            bg-white rounded-lg shadow-md p-6
            ${className}
          `}
        >
          {/* Skeleton Loader */}
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      );
    }

    // Determinar colores según la tendencia
    const getTrendStyles = () => {
      switch (trend) {
        case 'up':
          return 'text-emerald-600 bg-emerald-50';
        case 'down':
          return 'text-red-600 bg-red-50';
        default:
          return 'text-gray-600 bg-gray-50';
      }
    };

    // Determinar icono de tendencia
    const getTrendIcon = () => {
      switch (trend) {
        case 'up':
          return '↑';
        case 'down':
          return '↓';
        default:
          return '→';
      }
    };

    // Formatear el cambio con signo
    const formatChange = (value: number) => {
      const formatted = Math.abs(value).toFixed(1);
      if (value > 0) return `+${formatted}%`;
      if (value < 0) return `-${formatted}%`;
      return `${formatted}%`;
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg shadow-md p-6
          hover:shadow-lg transition-shadow duration-200
          ${className}
        `}
      >
        <div className="flex items-start justify-between">
          {/* Contenido principal */}
          <div className="flex-1">
            {/* Título */}
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

            {/* Valor */}
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

            {/* Cambio y tendencia */}
            {change !== undefined && (
              <div className="flex items-center">
                <span
                  className={`
                    inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold
                    ${getTrendStyles()}
                  `}
                >
                  <span className="mr-1" aria-hidden="true">
                    {getTrendIcon()}
                  </span>
                  {formatChange(change)}
                </span>
                <span className="ml-2 text-xs text-gray-500">vs. mes anterior</span>
              </div>
            )}
          </div>

          {/* Icono */}
          {icon && (
            <div
              className={`
                flex items-center justify-center w-12 h-12 rounded-full
                bg-gray-100 text-2xl
              `}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
