import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog Component', () => {
  describe('Rendering', () => {
    it('no debería renderizar cuando isOpen es false', () => {
      render(
        <ConfirmDialog
          isOpen={false}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('debería renderizar cuando isOpen es true', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('debería renderizar con título', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Eliminar elemento"
          message="¿Estás seguro?"
        />
      );
      expect(screen.getByText('Eliminar elemento')).toBeInTheDocument();
    });

    it('debería renderizar con mensaje', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="Esta acción no se puede deshacer"
        />
      );
      expect(screen.getByText('Esta acción no se puede deshacer')).toBeInTheDocument();
    });

    it('debería renderizar botón de cancelar con etiqueta por defecto', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('debería renderizar botón de confirmar con etiqueta por defecto', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );
      expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });

    it('debería renderizar con etiquetas personalizadas', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          confirmLabel="Sí, eliminar"
          cancelLabel="No, conservar"
        />
      );
      expect(screen.getByText('Sí, eliminar')).toBeInTheDocument();
      expect(screen.getByText('No, conservar')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('debería renderizar variante danger', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          variant="danger"
        />
      );
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('debería renderizar variante warning', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          variant="warning"
        />
      );
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('debería renderizar variante info', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          variant="info"
        />
      );
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('debería llamar a onClose al hacer clic en cancelar', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const cancelButton = screen.getByText('Cancelar');
      await user.click(cancelButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('debería llamar a onConfirm al hacer clic en confirmar', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const confirmButton = screen.getByText('Confirmar');
      await user.click(confirmButton);

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a onConfirm asíncrono', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn(() => Promise.resolve());
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const confirmButton = screen.getByText('Confirmar');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(handleConfirm).toHaveBeenCalledTimes(1);
      });
    });

    it('no debería cerrar al hacer clic en el backdrop', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const backdrop = container.firstChild?.firstChild as HTMLElement;
      await user.click(backdrop);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('no debería cerrar al presionar Escape', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      await user.keyboard('{Escape}');

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('debería deshabilitar botones cuando disabled es true', async () => {
      const handleClose = vi.fn();
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
          disabled={true}
        />
      );

      const cancelButton = screen.getByText('Cancelar');
      const confirmButton = screen.getByText('Confirmar');

      expect(cancelButton).toBeDisabled();
      expect(confirmButton).toBeDisabled();

      await user.click(confirmButton);
      expect(handleConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('debería enfocar el botón de cancelar por defecto', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      await waitFor(() => {
        const cancelButton = screen.getByText('Cancelar');
        expect(cancelButton).toHaveFocus();
      });
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="dialog"', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('debería tener aria-modal="true"', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('debería ocultar icono con aria-hidden', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const icon = screen.getByText('⚠').parentElement;
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge cases', () => {
    it('debería combinar clases personalizadas', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          className="custom-class"
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-class');
    });

    it('debería manejar onConfirm que retorna void', async () => {
      const handleConfirm = vi.fn();
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={handleConfirm}
          title="Confirmar"
          message="¿Estás seguro?"
        />
      );

      const confirmButton = screen.getByText('Confirmar');
      await user.click(confirmButton);

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar botón de confirmar con estado loading', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title="Confirmar"
          message="¿Estás seguro?"
          disabled={true}
        />
      );

      const confirmButton = screen.getByText('Confirmar');
      expect(confirmButton).toHaveAttribute('aria-busy', 'true');
    });
  });
});
