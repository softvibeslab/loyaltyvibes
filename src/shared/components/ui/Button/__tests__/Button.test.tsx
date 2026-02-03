import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el botón con children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('debería aplicar la variante primary por defecto', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-emerald-600');
    });

    it('debería renderizar con variante secondary', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-purple-600');
    });

    it('debería renderizar con variante outline', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveClass('border-gray-300');
    });

    it('debería renderizar con variante ghost', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
      expect(button).toHaveClass('border-transparent');
    });
  });

  describe('Sizes', () => {
    it('debería renderizar con tamaño sm', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-1');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('text-sm');
    });

    it('debería renderizar con tamaño md por defecto', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-2');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('text-base');
    });

    it('debería renderizar con tamaño lg', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('text-lg');
    });
  });

  describe('States', () => {
    it('debería estar deshabilitado cuando disabled es true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('debería mostrar spinner cuando loading es true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      // Verificar que el spinner está presente
      const spinner = button.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('debería ocupar todo el ancho cuando fullWidth es true', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Interactions', () => {
    it('debería llamar a onClick al hacer clic', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar a onClick cuando está deshabilitado', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('no debería llamar a onClick cuando está en loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick} loading>Loading</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('debería tener atributos aria apropiados en loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('debería ser navegable por teclado', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('debería tener atributos focus-visible', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Custom className', () => {
    it('debería combinar clases personalizadas con las base', () => {
      render(<Button className="mt-4">Custom Class</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mt-4');
      expect(button).toHaveClass('bg-emerald-600');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar children vacío', () => {
      render(<Button>{''}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('debería manejar children con componentes anidados', () => {
      render(
        <Button>
          <span>Nested</span>
          <strong>Text</strong>
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toContainHTML('<span>Nested</span>');
      expect(button).toContainHTML('<strong>Text</strong>');
    });

    it('debería pasar props adicionales al elemento button', () => {
      render(<Button data-testid="custom-button" name="test">Props</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('name', 'test');
    });
  });
});
