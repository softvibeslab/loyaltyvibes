import React from 'react';

/**
 * Variantes de notificación Toast
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Posiciones del Toast
 */
export type ToastPosition = 'top-right' | 'bottom-right';

/**
 * Datos de una notificación Toast
 */
export interface ToastData {
  /** ID único de la notificación */
  id: string;
  /** Variante de la notificación */
  variant: ToastVariant;
  /** Título de la notificación */
  title?: string;
  /** Mensaje de la notificación */
  message: string;
  /** Duración en ms (0 = no auto-dismiss) */
  duration?: number;
}

/**
 * Propiedades del componente Toast
 */
export interface ToastProps extends ToastData {
  /** Callback al cerrar la notificación */
  onClose: () => void;
}
