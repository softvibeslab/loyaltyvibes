import React from 'react';
import { ConfirmDialogProps } from './ConfirmDialog.types';
import { Modal } from '@/shared/components/ui/overlays/Modal';
import { Button } from '@/shared/components/ui/Button';

/**
 * Componente ConfirmDialog para acciones destructivas
 * Retorna Promise<boolean> para manejo asíncrono
 * Implementa WCAG 2.1 AA
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  disabled = false,
  className = '',
}) => {
  // Manejar confirmación
  const handleConfirm = async () => {
    await onConfirm();
    // onClose se llama después de onConfirm (deja que onConfirm decida si cerrar)
  };

  // Mapeo de variantes de botón de confirmar
  const confirmButtonVariant = variant === 'danger' ? 'primary' : variant;

  // Mapeo de estilos según variante
  const variantStyles: Record<typeof variant, { icon: string; colorClass: string }> = {
    danger: {
      icon: '⚠',
      colorClass: 'text-red-600 bg-red-100',
    },
    warning: {
      icon: '⚠',
      colorClass: 'text-amber-600 bg-amber-100',
    },
    info: {
      icon: 'ℹ',
      colorClass: 'text-blue-600 bg-blue-100',
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={!disabled}
      closeOnEscape={!disabled}
      closeOnBackdropClick={!disabled}
      size="sm"
      className={className}
    >
      <div className="space-y-4">
        {/* Icono y mensaje */}
        <div className="flex items-start space-x-3">
          <div
            className={`
              flex-shrink-0 w-10 h-10 rounded-full
              flex items-center justify-center text-lg
              ${style.colorClass}
            `}
            aria-hidden="true"
          >
            {style.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              {message}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={disabled}
            autoFocus
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={disabled}
            loading={disabled}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
