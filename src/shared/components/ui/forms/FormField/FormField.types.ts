import React from 'react';

/**
 * Propiedades del componente FormField
 */
export interface FormFieldProps {
  /** Etiqueta del campo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Si el campo es requerido */
  required?: boolean;
  /** Contenido del campo (input, select, etc.) */
  children: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}
