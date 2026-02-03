import React from 'react';

/**
 * Posiciones del Tooltip
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Propiedades del componente Tooltip
 */
export interface TooltipProps {
  /** Elemento que activa el tooltip */
  children: React.ReactElement;
  /** Contenido del tooltip */
  content: string;
  /** Posición del tooltip */
  placement?: TooltipPlacement;
  /** Retardo en ms antes de mostrar */
  delay?: number;
  /** Si tiene flecha indicadora */
  arrow?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
