import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('debería renderizar el toast', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje de prueba"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('Mensaje de prueba')).toBeInTheDocument();
    });

    it('debería renderizar con título', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          title="Título"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Mensaje')).toBeInTheDocument();
    });

    it('debería tener role alert', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('debería renderizar variante success', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast
          id="1"
          variant="success"
          message="Éxito"
          onClose={handleClose}
        />
      );
      expect(container.firstChild).toHaveClass('bg-emerald-50');
      expect(container.firstChild).toHaveClass('border-emerald-200');
    });

    it('debería renderizar variante error', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast
          id="1"
          variant="error"
          message="Error"
          onClose={handleClose}
        />
      );
      expect(container.firstChild).toHaveClass('bg-red-50');
      expect(container.firstChild).toHaveClass('border-red-200');
    });

    it('debería renderizar variante warning', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast
          id="1"
          variant="warning"
          message="Advertencia"
          onClose={handleClose}
        />
      );
      expect(container.firstChild).toHaveClass('bg-amber-50');
      expect(container.firstChild).toHaveClass('border-amber-200');
    });

    it('debería renderizar variante info', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast
          id="1"
          variant="info"
          message="Info"
          onClose={handleClose}
        />
      );
      expect(container.firstChild).toHaveClass('bg-blue-50');
      expect(container.firstChild).toHaveClass('border-blue-200');
    });
  });

  describe('Auto-dismiss', () => {
    it('debería auto-descartarse después de la duración por defecto (5s)', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );

      vi.advanceTimersByTime(5000);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('debería auto-descartarse después de duración personalizada', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          duration={3000}
          onClose={handleClose}
        />
      );

      vi.advanceTimersByTime(3000);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('no debería auto-descartarse cuando duration es 0', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          duration={0}
          onClose={handleClose}
        />
      );

      vi.advanceTimersByTime(10000);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('debería limpiar timer al desmontar', () => {
      const handleClose = vi.fn();
      const { unmount } = render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          duration={5000}
          onClose={handleClose}
        />
      );

      unmount();
      vi.advanceTimersByTime(5000);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('debería llamar a onClose al hacer clic en cerrar', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByLabelText('Cerrar notificación');
      closeButton.click();

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-live="polite"', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('debería tener aria-atomic="true"', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('debería tener aria-label en botón de cerrar', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      const closeButton = screen.getByLabelText('Cerrar notificación');
      expect(closeButton).toBeInTheDocument();
    });

    it('debería ocultar icono con aria-hidden', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      const icon = screen.getByText('ℹ').parentElement;
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Icons', () => {
    it('debería mostrar icono de success (✓)', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="success"
          message="Éxito"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('debería mostrar icono de error (✕)', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="error"
          message="Error"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('debería mostrar icono de warning (⚠)', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="warning"
          message="Advertencia"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('debería mostrar icono de info (ℹ)', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Info"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('ℹ')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('debería renderizar sin título', () => {
      const handleClose = vi.fn();
      render(
        <Toast
          id="1"
          variant="info"
          message="Solo mensaje"
          onClose={handleClose}
        />
      );
      expect(screen.getByText('Solo mensaje')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('debería tener animación', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast
          id="1"
          variant="info"
          message="Mensaje"
          onClose={handleClose}
        />
      );
      expect(container.firstChild).toHaveClass('animate-slide-in');
    });
  });
});
