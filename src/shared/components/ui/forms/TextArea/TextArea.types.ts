import React from 'react';

/**
 * Opciones de redimensionamiento del TextArea
 */
export type TextAreaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * Propiedades del componente TextArea
 */
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Etiqueta del campo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Número de filas (default: 4) */
  rows?: number;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Si el campo debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Si permite redimensionamiento */
  resize?: TextAreaResize;
  /** Si muestra contador de caracteres */
  showCount?: boolean;
  /** Longitud máxima de caracteres */
  maxLength?: number;
}
