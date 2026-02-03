import React from 'react';

/**
 * Opción de radio
 */
export interface RadioOption {
  /** Valor de la opción */
  value: string;
  /** Etiqueta de la opción */
  label: string;
  /** Si la opción está deshabilitada */
  disabled?: boolean;
}

/**
 * Orientación del grupo de radios
 */
export type RadioGroupOrientation = 'horizontal' | 'vertical';

/**
 * Propiedades del componente RadioGroup
 */
export interface RadioGroupProps {
  /** Etiqueta del grupo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Opciones del grupo */
  options: RadioOption[];
  /** Nombre del grupo (required) */
  name: string;
  /** Valor seleccionado (controlado) */
  value?: string;
  /** Valor por defecto */
  defaultValue?: string;
  /** Callback al cambiar selección */
  onChange?: (value: string) => void;
  /** Orientación de las opciones */
  orientation?: RadioGroupOrientation;
  /** Si el grupo está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
