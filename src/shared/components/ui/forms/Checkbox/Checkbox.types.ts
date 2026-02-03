import React from 'react';

/**
 * Propiedades del componente Checkbox
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Etiqueta del checkbox */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Si está marcado (controlado) */
  checked?: boolean;
  /** Si está marcado por defecto */
  defaultChecked?: boolean;
  /** Callback al cambiar estado */
  onChange?: (checked: boolean) => void;
  /** Estado indeterminado */
  indeterminate?: boolean;
  /** Si el checkbox está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
}
