/**
 * Componentes de superposición (overlays)
 * Exportación unificada de todos los componentes de overlays
 */

export { Toast } from './Toast/Toast';
export type { ToastProps, ToastData, ToastVariant, ToastPosition } from './Toast/Toast.types';

export { useToast, ToastContainer } from './Toast/useToast';
export type { ShowToastOptions, UseToastReturn } from './Toast/useToast.types';

export { Modal } from './Modal/Modal';
export type { ModalProps, ModalSize } from './Modal/Modal.types';

export { ConfirmDialog } from './ConfirmDialog/ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog/ConfirmDialog.types';

export { Tooltip } from './Tooltip/Tooltip';
export type { TooltipProps, TooltipPlacement } from './Tooltip/Tooltip.types';
