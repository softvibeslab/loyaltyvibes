import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

describe('Checkbox Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el checkbox sin etiqueta', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('debería renderizar con etiqueta', () => {
      render(<Checkbox label="Acepto términos" />);
      expect(screen.getByText('Acepto términos')).toBeInTheDocument();
      expect(screen.getByLabelText('Acepto términos')).toBeInTheDocument();
    });

    it('debería renderizar con mensaje de error', () => {
      render(<Checkbox error="Debes aceptar los términos" />);
      expect(screen.getByText('Debes aceptar los términos')).toBeInTheDocument();
    });

    it('debería mostrar indicador de requerido', () => {
      render(<Checkbox label="Acepto" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('debería estar deshabilitado cuando disabled es true', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });

  describe('States', () => {
    it('debería estar desmarcado por defecto', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('debería estar marcado cuando checked es true', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('debería estar marcado con defaultChecked', () => {
      render(<Checkbox defaultChecked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('debería tener estado indeterminado', () => {
      render(<Checkbox indeterminate={true} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('debería cambiar estado indeterminado dinámicamente', () => {
      const { rerender } = render(<Checkbox indeterminate={false} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox indeterminate={true} />);
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Interactions', () => {
    it('debería marcar al hacer clic', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('debería desmarcar al hacer clic si está marcado', async () => {
      const user = userEvent.setup();
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('debería llamar a onChange al cambiar estado', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('debería llamar a onChange con false al desmarcar', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox checked={true} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('no debería cambiar estado cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('debería marcar al hacer clic en la etiqueta', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Acepto términos" />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(screen.getByText('Acepto términos'));
      expect(checkbox).toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('debería alternar estado con tecla Espacio', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard('[Space]');

      expect(checkbox).toBeChecked();
    });

    it('debería ser navegable por teclado', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('focus:ring-2');
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-invalid cuando hay error', () => {
      render(<Checkbox error="Error" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-required cuando es requerido', () => {
      render(<Checkbox required />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('debería asociar etiqueta con checkbox usando htmlFor', () => {
      render(<Checkbox label="Acepto términos" />);
      const checkbox = screen.getByLabelText('Acepto términos');
      expect(checkbox).toBeInTheDocument();
    });

    it('debería tener aria-describedby cuando hay error', () => {
      render(<Checkbox error="Error" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby');
    });
  });

  describe('React Hook Form Integration', () => {
    it('debería aceptar ref', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('debería aceptar valor controlado', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('debería aceptar defaultValue', () => {
      render(<Checkbox defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('debería pasar props adicionales al checkbox', () => {
      render(<Checkbox data-testid="custom-checkbox" name="test" value="test" />);
      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toHaveAttribute('name', 'test');
      expect(checkbox).toHaveAttribute('value', 'test');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar id personalizado', () => {
      render(<Checkbox id="custom-id" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });

    it('debería combinar clases personalizadas', () => {
      render(<Checkbox className="mt-4" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('mt-4');
    });

    it('debería mantener estado indeterminado en actualizaciones', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox indeterminate={true} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      await user.click(checkbox);

      // El checkbox debería seguir siendo indeterminado visualmente
      expect(checkbox.indeterminate).toBe(true);
    });

    it('debería mostrar error con color rojo en la etiqueta', () => {
      render(<Checkbox label="Acepto" error="Error requerido" />);
      const label = screen.getByText('Acepto');
      expect(label).toHaveClass('text-red-600');
    });

    it('debería mostrar etiqueta en gris cuando está deshabilitado', () => {
      render(<Checkbox label="Acepto" disabled />);
      const label = screen.getByText('Acepto');
      expect(label).toHaveClass('text-gray-400');
    });
  });
});
