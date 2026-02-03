import React, { useEffect, useRef } from 'react';
import { CheckboxProps } from './Checkbox.types';

/**
 * Componente Checkbox con etiqueta y estado indeterminado
 * Compatible con React Hook Form
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
      disabled = false,
      required = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Referencia interna para manejar estado indeterminado
    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref || internalRef) as React.RefObject<HTMLInputElement>;

    // Aplicar estado indeterminado
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, checkboxRef]);

    // Generar ID único si no se proporciona
    const checkboxId = id || `checkbox-${React.useId()}`;

    // Manejar cambio de estado
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    // Estilos base del checkbox
    const baseCheckboxClasses =
      'h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500' +
      ' focus:ring-2 focus:ring-offset-2 transition-colors duration-200' +
      ' disabled:opacity-50 disabled:cursor-not-allowed';

    // Combinar clases
    const checkboxClasses = `
      ${baseCheckboxClasses}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos del contenedor
    const containerClasses = 'flex items-start';

    // Estilos de la etiqueta
    const labelClasses = `
      ml-2 text-sm
      ${disabled ? 'text-gray-400' : 'text-gray-700'}
      ${error ? 'text-red-600' : ''}
    `;

    // Estilos del texto de error
    const errorClasses = 'ml-6 mt-1 text-xs text-red-600';

    return (
      <div>
        <div className={containerClasses}>
          <input
            ref={checkboxRef}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            aria-required={required}
            required={required}
            onChange={handleChange}
            className={checkboxClasses}
            {...props}
          />

          {label && (
            <label
              htmlFor={checkboxId}
              className={labelClasses}
            >
              {label}
              {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
            </label>
          )}
        </div>

        {error && (
          <p id={`${checkboxId}-error`} className={errorClasses}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
