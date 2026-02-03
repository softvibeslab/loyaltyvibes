import React from 'react';

/**
 * Propiedades del componente TextField
 */
export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Etiqueta del campo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Si el campo debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Referencia al elemento input */
  inputRef?: React.RefObject<HTMLInputElement>;
}
