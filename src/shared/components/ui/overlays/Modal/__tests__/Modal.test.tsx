import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('no debería renderizar cuando isOpen es false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('debería renderizar cuando isOpen es true', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('debería renderizar con título', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Título del Modal">
          <p>Contenido</p>
        </Modal>
      );
      expect(screen.getByText('Título del Modal')).toBeInTheDocument();
    });

    it('debería renderizar contenido', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido del modal</p>
        </Modal>
      );
      expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
    });

    it('debería renderizar botón de cerrar por defecto', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );
      const closeButton = screen.getByLabelText('Cerrar modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('no debería renderizar botón de cerrar cuando showCloseButton es false', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
          <p>Contenido</p>
        </Modal>
      );
      expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('debería tener tamaño sm', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="sm">
          <p>Contenido</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-md');
    });

    it('debería tener tamaño md por defecto', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="md">
          <p>Contenido</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-lg');
    });

    it('debería tener tamaño lg', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} size="lg">
          <p>Contenido</p>
        </Modal>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-2xl');
    });
  });

  describe('Interactions', () => {
    it('debería llamar a onClose al hacer clic en el botón de cerrar', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Contenido</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar modal');
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a onClose al hacer clic en el backdrop', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={true}>
          <p>Contenido</p>
        </Modal>
      );

      // Hacer clic en el backdrop (contenedor fijo)
      const backdrop = container.firstChild as HTMLElement;
      await user.click(backdrop);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar a onClose al hacer clic en el contenido del modal', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={true}>
          <p>Contenido del modal</p>
        </Modal>
      );

      const content = screen.getByText('Contenido del modal');
      await user.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('no debería cerrar al hacer clic en el backdrop cuando closeOnBackdropClick es false', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false}>
          <p>Contenido</p>
        </Modal>
      );

      const backdrop = container.firstChild as HTMLElement;
      await user.click(backdrop);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('debería llamar a onClose al presionar Escape', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
          <p>Contenido</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('no debería cerrar al presionar Escape cuando closeOnEscape es false', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
          <p>Contenido</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('debería enfocar el modal al abrir', async () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveFocus();
      });
    });

    it('debería tener tabindex=-1 para focus trap', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('debería tener aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('debería tener aria-labelledby cuando tiene título', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Título">
          <p>Contenido</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('debería tener ID en el título para aria-labelledby', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Título">
          <p>Contenido</p>
        </Modal>
      );

      const title = screen.getByText('Título');
      expect(title).toHaveAttribute('id', 'modal-title');
    });

    it('debería tener botón de cerrar con aria-label', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Backdrop', () => {
    it('debería tener backdrop por defecto', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      const backdrop = container.firstChild as HTMLElement;
      expect(backdrop).toHaveClass('bg-black/50');
    });

    it('no debería tener backdrop cuando hasBackdrop es false', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} hasBackdrop={false}>
          <p>Contenido</p>
        </Modal>
      );

      const backdrop = container.firstChild as HTMLElement;
      expect(backdrop).not.toHaveClass('bg-black/50');
    });
  });

  describe('Body Scroll', () => {
    it('debería prevenir scroll del body cuando está abierto', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('debería restaurar scroll del body cuando se cierra', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Contenido</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('debería combinar clases personalizadas', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} className="custom-class">
          <p>Contenido</p>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-class');
    });

    it('debería renderizar sin título ni botón de cerrar', () => {
      render(
        <Modal
          isOpen={true}
          onClose={vi.fn()}
          title={undefined}
          showCloseButton={false}
        >
          <p>Contenido</p>
        </Modal>
      );

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
    });

    it('debería renderizar con título pero sin botón de cerrar', () => {
      render(
        <Modal
          isOpen={true}
          onClose={vi.fn()}
          title="Solo título"
          showCloseButton={false}
        >
          <p>Contenido</p>
        </Modal>
      );

      expect(screen.getByText('Solo título')).toBeInTheDocument();
      expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument();
    });

    it('debería renderizar children complejos', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <form data-testid="test-form">
            <input type="text" placeholder="Nombre" />
            <button type="submit">Enviar</button>
          </form>
        </Modal>
      );

      expect(screen.getByTestId('test-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Enviar')).toBeInTheDocument();
    });
  });
});
