import React from 'react';
import { FormFieldProps } from './FormField.types';

/**
 * Componente FormField para envolver campos de formulario de manera consistente
 * Proporciona estructura uniforme para labels, errores y textos de ayuda
 * Implementa accesibilidad WCAG 2.1 AA
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      children,
      className = '',
    },
    ref
  ) => {
    // Generar ID único para descripciones
    const descriptionId = `formfield-${React.useId()}-description`;

    // Estilos del contenedor
    const containerClasses = `
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos de la etiqueta
    const labelClasses = 'block text-sm font-medium mb-1 text-gray-700';

    // Estilos del texto de ayuda/error
    const textClasses = `
      mt-1 text-xs
      ${error ? 'text-red-600' : 'text-gray-500'}
    `;

    // Clonar el hijo para pasar props de accesibilidad
    const childWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': error || helperText ? descriptionId : undefined,
          'aria-required': required,
        } as React.HTMLAttributes<HTMLElement>);
      }
      return child;
    });

    return (
      <div ref={ref} className={containerClasses}>
        {label && (
          <label className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        {childWithProps}

        {(error || helperText) && (
          <p id={descriptionId} className={textClasses}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
