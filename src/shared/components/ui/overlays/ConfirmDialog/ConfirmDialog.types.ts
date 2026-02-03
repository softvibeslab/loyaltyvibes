import React from 'react';

/**
 * Propiedades del componente ConfirmDialog
 */
export interface ConfirmDialogProps {
  /** Si el diálogo está abierto */
  isOpen: boolean;
  /** Callback al cerrar sin confirmar */
  onClose: () => void;
  /** Callback al confirmar */
  onConfirm: () => void | Promise<void>;
  /** Título del diálogo */
  title: string;
  /** Mensaje del diálogo */
  message: string;
  /** Etiqueta del botón de confirmar */
  confirmLabel?: string;
  /** Etiqueta del botón de cancelar */
  cancelLabel?: string;
  /** Variante del botón de confirmar */
  variant?: 'danger' | 'warning' | 'info';
  /** Si está deshabilitado (durante confirmación asíncrona) */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
}
