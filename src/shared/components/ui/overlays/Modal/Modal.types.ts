import React from 'react';

/**
 * Tamaños disponibles para el Modal
 */
export type ModalSize = 'sm' | 'md' | 'lg';

/**
 * Propiedades del componente Modal
 */
export interface ModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Callback al cerrar el modal */
  onClose: () => void;
  /** Título del modal */
  title?: string;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Tamaño del modal */
  size?: ModalSize;
  /** Si muestra botón de cerrar */
  showCloseButton?: boolean;
  /** Si el modal tiene backdrop */
  hasBackdrop?: boolean;
  /** Si cierra al hacer clic en el backdrop */
  closeOnBackdropClick?: boolean;
  /** Si cierra al presionar Escape */
  closeOnEscape?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
