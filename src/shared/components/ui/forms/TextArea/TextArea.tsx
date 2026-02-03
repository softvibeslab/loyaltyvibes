import React, { useState } from 'react';
import { TextAreaProps, TextAreaResize } from './TextArea.types';

/**
 * Componente TextArea para entrada de texto multilínea
 * Compatible con React Hook Form
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      disabled = false,
      required = false,
      fullWidth = false,
      resize = 'vertical',
      showCount = false,
      maxLength,
      className = '',
      id,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    // Estado para el contador de caracteres
    const [internalValue, setInternalValue] = useState(
      (value !== undefined ? value : defaultValue) as string || ''
    );

    // Generar ID único si no se proporciona
    const textareaId = id || `textarea-${React.useId()}`;

    // Manejar cambio de valor
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };

    // Calcular longitud actual
    const currentLength = value !== undefined
      ? String(value).length
      : internalValue.length;

    // Estilos base del textarea
    const baseTextareaClasses =
      'w-full px-3 py-2 text-sm rounded-md border transition-colors duration-200' +
      ' focus:outline-none focus:ring-2 focus:ring-offset-1' +
      ' disabled:opacity-50 disabled:cursor-not-allowed';

    // Estilos según estado de error
    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500';

    // Estilos de redimensionamiento
    const resizeClasses: Record<TextAreaResize, string> = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y',
    };

    // Combinar clases del textarea
    const textareaClasses = `
      ${baseTextareaClasses}
      ${errorClasses}
      ${resizeClasses[resize]}
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

    // Estilos del contador
    const counterClasses = `
      mt-1 text-xs text-gray-400 text-right
      ${maxLength && currentLength > maxLength ? 'text-red-600' : ''}
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={textareaId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${textareaId}-description` : undefined
          }
          aria-required={required}
          required={required}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={textareaClasses}
          {...props}
        />

        {(error || helperText) && (
          <p id={`${textareaId}-description`} className={textClasses}>
            {error || helperText}
          </p>
        )}

        {showCount && (
          <div className={counterClasses}>
            {currentLength}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
