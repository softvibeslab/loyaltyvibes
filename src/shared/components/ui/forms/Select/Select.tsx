import React from 'react';
import { SelectProps } from './Select.types';

/**
 * Componente Select para selección desplegable
 * Compatible con React Hook Form
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      disabled = false,
      required = false,
      fullWidth = false,
      clearable = false,
      className = '',
      id,
      value,
      defaultValue,
      onClear,
      onChange,
      ...props
    },
    ref
  ) => {
    // Generar ID único si no se proporciona
    const selectId = id || `select-${React.useId()}`;

    // Estilos base del select
    const baseSelectClasses =
      'w-full px-3 py-2 text-sm rounded-md border transition-colors duration-200' +
      ' focus:outline-none focus:ring-2 focus:ring-offset-1' +
      ' disabled:opacity-50 disabled:cursor-not-allowed' +
      ' pr-8 appearance-none bg-no-repeat bg-right';

    // Estilos según estado de error
    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500';

    // Combinar clases del select
    const selectClasses = `
      ${baseSelectClasses}
      ${errorClasses}
      ${clearable && value ? 'pr-16' : ''}
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

    // Estilos del wrapper relativo
    const wrapperClasses = 'relative';

    // Manejar cambio de valor
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
    };

    // Manejar limpiar
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear?.();

      // Disparar evento de cambio con valor vacío
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: { value: '', name: props.name },
      });
      onChange?.(event as any);
    };

    // Verificar si hay valor seleccionado
    const hasValue = value !== undefined && value !== '';
    const hasDefaultValue = defaultValue !== undefined && defaultValue !== '';

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={selectId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        <div className={wrapperClasses}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error || helperText ? `${selectId}-description` : undefined
            }
            aria-required={required}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={selectClasses}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {clearable && (hasValue || hasDefaultValue) && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Limpiar selección"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {(error || helperText) && (
          <p id={`${selectId}-description`} className={textClasses}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
