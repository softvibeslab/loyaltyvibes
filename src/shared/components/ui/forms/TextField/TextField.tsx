import React from 'react';
import { TextFieldProps } from './TextField.types';

/**
 * Componente TextField para entrada de texto con etiqueta, error y texto de ayuda
 * Compatible con React Hook Form
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      fullWidth = false,
      className = '',
      id,
      inputRef,
      ...props
    },
    ref
  ) => {
    // Generar ID único si no se proporciona
    const inputId = id || `textfield-${React.useId()}`;

    // Estilos base del input
    const baseInputClasses =
      'w-full px-3 py-2 text-sm rounded-md border transition-colors duration-200' +
      ' focus:outline-none focus:ring-2 focus:ring-offset-1' +
      ' disabled:opacity-50 disabled:cursor-not-allowed';

    // Estilos según estado de error
    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500';

    // Combinar clases del input
    const inputClasses = `
      ${baseInputClasses}
      ${errorClasses}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos del contenedor
    const containerClasses = fullWidth ? 'w-full' : '';

    // Estilos de la etiqueta
    const labelClasses = `
      block text-sm font-medium mb-1
      ${disabled ? 'text-gray-400' : 'text-gray-700'}
    `;

    // Estilos del texto de ayuda/error
    const textClasses = `
      mt-1 text-xs
      ${error ? 'text-red-600' : 'text-gray-500'}
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        <input
          ref={inputRef || ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${inputId}-description` : undefined
          }
          aria-required={required}
          required={required}
          className={inputClasses}
          {...props}
        />

        {(error || helperText) && (
          <p id={`${inputId}-description`} className={textClasses}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
