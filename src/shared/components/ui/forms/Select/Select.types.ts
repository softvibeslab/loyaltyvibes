import React from 'react';

/**
 * Opción del select
 */
export interface SelectOption {
  /** Valor de la opción */
  value: string;
  /** Etiqueta de la opción */
  label: string;
  /** Si la opción está deshabilitada */
  disabled?: boolean;
}

/**
 * Propiedades del componente Select
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Etiqueta del campo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Opciones del select */
  options: SelectOption[];
  /** Placeholder */
  placeholder?: string;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Si el campo debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Si muestra botón de limpiar */
  clearable?: boolean;
  /** Valor del select (controlado) */
  value?: string;
  /** Valor por defecto */
  defaultValue?: string;
  /** Callback al limpiar */
  onClear?: () => void;
}
