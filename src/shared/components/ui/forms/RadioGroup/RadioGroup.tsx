import React from 'react';
import { RadioGroupProps, RadioGroupOrientation } from './RadioGroup.types';

/**
 * Componente RadioGroup para selección exclusiva
 * Compatible con React Hook Form
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      name,
      value,
      defaultValue,
      onChange,
      orientation = 'vertical',
      disabled = false,
      required = false,
      className = '',
    },
    ref
  ) => {
    // Generar ID único para el grupo
    const groupId = `radiogroup-${React.useId()}`;

    // Manejar cambio de selección
    const handleChange = (selectedValue: string) => {
      onChange?.(selectedValue);
    };

    // Estilos base del radio
    const baseRadioClasses =
      'h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500' +
      ' focus:ring-2 focus:ring-offset-2 transition-colors duration-200' +
      ' disabled:opacity-50 disabled:cursor-not-allowed';

    // Estilos de contenedor del grupo
    const containerClasses = `
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos de la etiqueta del grupo
    const groupLabelClasses = `
      block text-sm font-medium mb-2
      ${disabled ? 'text-gray-400' : 'text-gray-700'}
    `;

    // Estilos de las opciones según orientación
    const optionsContainerClasses: Record<RadioGroupOrientation, string> = {
      vertical: 'space-y-2',
      horizontal: 'flex flex-wrap gap-6',
    };

    // Estilos de contenedor de cada opción
    const optionContainerClasses = 'flex items-center';

    // Estilos de la etiqueta de cada opción
    const optionLabelClasses = `
      ml-2 text-sm
      ${disabled ? 'text-gray-400' : 'text-gray-700'}
    `;

    // Estilos del texto de ayuda/error
    const textClasses = `
      mt-1 text-xs
      ${error ? 'text-red-600' : 'text-gray-500'}
    `;

    return (
      <div ref={ref} className={containerClasses} role="group" aria-labelledby={`${groupId}-label`}>
        {label && (
          <label id={`${groupId}-label`} className={groupLabelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        <div
          role="radiogroup"
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${groupId}-description` : undefined
          }
        >
          <div className={optionsContainerClasses[orientation]}>
            {options.map((option) => (
              <div key={option.value} className={optionContainerClasses}>
                <input
                  type="radio"
                  id={`${groupId}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  defaultChecked={defaultValue === option.value}
                  disabled={disabled || option.disabled}
                  aria-invalid={error ? 'true' : 'false'}
                  onChange={() => handleChange(option.value)}
                  className={baseRadioClasses}
                />

                <label
                  htmlFor={`${groupId}-${option.value}`}
                  className={optionLabelClasses}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {(error || helperText) && (
          <p id={`${groupId}-description`} className={textClasses}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
