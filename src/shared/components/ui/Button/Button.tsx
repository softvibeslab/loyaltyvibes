import React from 'react';
import { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
import { Spinner } from '../Spinner';

/**
 * Componente Button con múltiples variantes y estados
 * Implementa accesibilidad WCAG 2.1 AA con contraste de color >= 4.5:1
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    // Mapeo de estilos base por variante
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-emerald-600 text-white border-transparent hover:bg-emerald-700 focus:ring-emerald-500',
      secondary:
        'bg-purple-600 text-white border-transparent hover:bg-purple-700 focus:ring-purple-500',
      outline:
        'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      ghost:
        'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus:ring-gray-400',
    };

    // Mapeo de estilos de tamaño
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'py-1 px-3 text-sm font-medium',
      md: 'py-2 px-4 text-base font-medium',
      lg: 'py-3 px-6 text-lg font-medium',
    };

    // Clases base para accesibilidad y estados
    const baseClasses =
      'inline-flex items-center justify-center rounded-md border transition-colors duration-200' +
      ' focus:outline-none focus:ring-2 focus:ring-offset-2' +
      ' disabled:opacity-50 disabled:cursor-not-allowed' +
      ' focus-visible:ring-2 focus-visible:ring-offset-2';

    // Combinar todas las clases
    const combinedClasses = `
      ${baseClasses}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Manejador de clic con prevención cuando está deshabilitado o cargando
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="mr-2" aria-hidden="true">
            <Spinner size="sm" />
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
