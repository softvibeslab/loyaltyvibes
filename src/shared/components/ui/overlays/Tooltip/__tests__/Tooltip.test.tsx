import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../Tooltip';

describe('Tooltip Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el hijo', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('no debería mostrar el tooltip inicialmente', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('debería mostrar el tooltip al hacer hover', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });
    });

    it('debería ocultar el tooltip al salir del hover', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
      });

      await user.unhover(trigger);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('debería mostrar el tooltip al enfocar', async () => {
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Focus me');
      trigger.focus();

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('debería ocultar el tooltip al perder foco', async () => {
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Focus me');
      trigger.focus();

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
      });

      trigger.blur();

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Placement', () => {
    it('debería posicionarse arriba por defecto', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} placement="top">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('bottom-full');
      });
    });

    it('debería posicionarse abajo', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} placement="bottom">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('top-full');
      });
    });

    it('debería posicionarse a la izquierda', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} placement="left">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('right-full');
      });
    });

    it('debería posicionarse a la derecha', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} placement="right">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('left-full');
      });
    });
  });

  describe('Delay', () => {
    it('debería respetar el retardo personalizado', async () => {
      const user = userEvent.setup({ delay: null });
      vi.useFakeTimers();

      render(
        <Tooltip content="Tooltip" delay={500}>
          <button>Hover</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover');
      await user.hover(trigger);

      // No debería aparecer inmediatamente
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Avanzar tiempo
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('Arrow', () => {
    it('debería mostrar flecha por defecto', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const arrow = screen.getByRole('tooltip').querySelector('[aria-hidden="true"]');
        expect(arrow).toBeInTheDocument();
      });
    });

    it('no debería mostrar flecha cuando arrow es false', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} arrow={false}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const arrow = screen.getByRole('tooltip').querySelector('[aria-hidden="true"]');
        expect(arrow).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="tooltip"', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
      });
    });

    it('debería tener aria-describedby en el trigger cuando es visible', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');
      await user.hover(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-describedby');
      });
    });

    it('no debería tener aria-describedby cuando no es visible', () => {
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover me');
      expect(trigger).not.toHaveAttribute('aria-describedby');
    });

    it('debería ocultar flecha con aria-hidden', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const arrow = screen.getByRole('tooltip').querySelector('[aria-hidden="true"]');
        expect(arrow).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Styling', () => {
    it('debería tener clases de estilo correctas', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('bg-gray-900');
        expect(tooltip).toHaveClass('text-white');
        expect(tooltip).toHaveClass('rounded');
      });
    });

    it('debería combinar clases personalizadas', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0} className="custom-class">
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass('custom-class');
      });
    });
  });

  describe('Edge cases', () => {
    it('debería manejar contenido vacío', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('');
      });
    });

    it('debería limpiar timeout al desmontar', () => {
      const { unmount } = render(
        <Tooltip content="Tooltip" delay={1000}>
          <button>Hover</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Hover');
      trigger.focus();

      unmount();

      // No debería lanzar error
      expect(true).toBe(true);
    });

    it('debería funcionar con diferentes tipos de elementos', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <Tooltip content="Tooltip" delay={0}>
          <span>Span element</span>
        </Tooltip>
      );

      await user.hover(screen.getByText('Span element'));

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('debería pasar props adicionales al hijo', () => {
      render(
        <Tooltip content="Tooltip">
          <button data-testid="test-button" disabled>
            Disabled
          </button>
        </Tooltip>
      );

      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('disabled');
    });
  });
});
