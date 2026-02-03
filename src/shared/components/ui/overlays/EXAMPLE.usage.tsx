/**
 * Ejemplo de uso de componentes de Overlays
 * Ejemplo de integración de Toast, Modal, ConfirmDialog y Tooltip
 */

import React, { useState } from 'react';
import {
  useToast,
  ToastContainer,
  Modal,
  ConfirmDialog,
  Tooltip,
  Button,
  Alert,
} from '@/shared/components/ui';

/**
 * Ejemplo de uso de Toast
 */
export function ToastExample() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Ejemplos de Toast</h2>

      <div className="flex gap-4 flex-wrap">
        <Button
          variant="primary"
          onClick={() => showSuccess('Operación completada con éxito')}
        >
          Mostrar Success
        </Button>

        <Button
          variant="primary"
          onClick={() => showError('Ha ocurrido un error')}
        >
          Mostrar Error
        </Button>

        <Button
          variant="primary"
          onClick={() => showWarning('Esta es una advertencia')}
        >
          Mostrar Warning
        </Button>

        <Button
          variant="primary"
          onClick={() => showInfo('Información importante')}
        >
          Mostrar Info
        </Button>
      </div>

      <ToastContainer
        toasts={[]}
        onClose={() => {}}
        position="bottom-right"
      />
    </div>
  );
}

/**
 * Ejemplo de uso de Modal
 */
export function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ejemplo de Modal</h2>

      <Button onClick={() => setIsModalOpen(true)}>
        Abrir Modal
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal de Ejemplo"
        size="md"
      >
        <div className="space-y-4">
          <p>
            Este es un modal de ejemplo con focus trap y manejo de foco.
            Puedes cerrarlo haciendo clic en el botón de cerrar,
            presionando Escape, o haciendo clic fuera del modal.
          </p>

          <Alert
            variant="info"
            description="El modal previene el scroll del body y mantiene el foco dentro del modal."
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/**
 * Ejemplo de uso de ConfirmDialog
 */
export function ConfirmDialogExample() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = async () => {
    // Simular acción destructiva
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Acción confirmada');
    setIsConfirmOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ejemplo de ConfirmDialog</h2>

      <Button
        variant="primary"
        onClick={() => setIsConfirmOpen(true)}
      >
        Eliminar Cuenta
      </Button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Eliminar cuenta"
        message="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}

/**
 * Ejemplo de uso de Tooltip
 */
export function TooltipExample() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-bold">Ejemplos de Tooltip</h2>

      <div className="flex gap-4 flex-wrap">
        <Tooltip content="Tooltip superior" placement="top">
          <Button>Tooltip Top</Button>
        </Tooltip>

        <Tooltip content="Tooltip inferior" placement="bottom">
          <Button>Tooltip Bottom</Button>
        </Tooltip>

        <Tooltip content="Tooltip izquierdo" placement="left">
          <Button>Tooltip Left</Button>
        </Tooltip>

        <Tooltip content="Tooltip derecho" placement="right">
          <Button>Tooltip Right</Button>
        </Tooltip>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Tooltip con delay</h3>
        <Tooltip content="Aparece después de 1 segundo" delay={1000}>
          <Button variant="outline">Hover con delay</Button>
        </Tooltip>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Tooltip sin flecha</h3>
        <Tooltip content="Sin flecha indicadora" arrow={false}>
          <Button variant="outline">Sin flecha</Button>
        </Tooltip>
      </div>
    </div>
  );
}

/**
 * Ejemplo completo integrando todos los overlays
 */
export function CompleteOverlayExample() {
  const { toasts, closeToast, showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleAction = async () => {
    setIsModalOpen(false);

    // Mostrar confirmación
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // Simular operación
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess('Operación completada exitosamente');
    } catch {
      showError('Error al completar la operación');
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ejemplo Completo de Overlays</h1>

      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => setIsModalOpen(true)}>
          Abrir Modal
        </Button>

        <Button
          variant="secondary"
          onClick={() => showSuccess('Toast de éxito')}
        >
          Mostrar Toast
        </Button>

        <Tooltip content="Haz clic para ver el ejemplo">
          <Button variant="outline">Con Tooltip</Button>
        </Tooltip>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ejemplo Completo"
        size="lg"
      >
        <div className="space-y-4">
          <p>
            Este ejemplo integra todos los componentes de overlays.
            Haz clic en el botón de acción para ver el flujo completo.
          </p>

          <Alert
            variant="info"
            description="El flujo incluye: Modal → ConfirmDialog → Toast"
          />

          <div className="flex justify-end">
            <Button onClick={handleAction}>
              Realizar Acción
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmar acción"
        message="¿Estás seguro de que deseas realizar esta acción?"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        variant="warning"
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onClose={closeToast}
        position="bottom-right"
      />
    </div>
  );
}
