import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '../TextField';

describe('TextField Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el input sin etiqueta', () => {
      render(<TextField />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('debería renderizar con etiqueta', () => {
      render(<TextField label="Nombre" />);
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    });

    it('debería renderizar con texto de ayuda', () => {
      render(<TextField helperText="Ingresa tu nombre completo" />);
      expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument();
    });

    it('debería renderizar con mensaje de error', () => {
      render(<TextField error="Este campo es requerido" />);
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('debería mostrar indicador de requerido', () => {
      render(<TextField label="Email" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('debería estar deshabilitado cuando disabled es true', () => {
      render(<TextField disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('debería tener clases de error cuando hay error', () => {
      render(<TextField error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300');
      expect(input).toHaveClass('focus:ring-red-500');
    });

    it('debería tener clases normales cuando no hay error', () => {
      render(<TextField />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');
      expect(input).toHaveClass('focus:ring-emerald-500');
    });

    it('debería ocupar todo el ancho cuando fullWidth es true', () => {
      const { container } = render(<TextField fullWidth />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });

    it('debería combinar clases personalizadas', () => {
      render(<TextField className="mt-4" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('mt-4');
    });
  });

  describe('Interactions', () => {
    it('debería permitir ingresar texto', async () => {
      const user = userEvent.setup();
      render(<TextField />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Hola Mundo');
      expect(input).toHaveValue('Hola Mundo');
    });

    it('debería llamar a onChange al escribir', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextField onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('no debería permitir entrada cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<TextField disabled />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-invalid cuando hay error', () => {
      render(<TextField error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-required cuando es requerido', () => {
      render(<TextField required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('debería asociar etiqueta con input usando htmlFor', () => {
      render(<TextField label="Nombre" />);
      const input = screen.getByLabelText('Nombre');
      expect(input).toBeInTheDocument();
    });

    it('debería tener aria-describedby cuando hay helperText', () => {
      render(<TextField helperText="Ayuda" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('debería tener aria-describedby cuando hay error', () => {
      render(<TextField error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('debería tener navegación por teclado', () => {
      render(<TextField />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
    });
  });

  describe('React Hook Form Integration', () => {
    it('debería aceptar ref', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<TextField inputRef={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('debería pasar props adicionales al input', () => {
      render(<TextField data-testid="custom-input" name="test" placeholder="Test" />);
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveAttribute('name', 'test');
      expect(input).toHaveAttribute('placeholder', 'Test');
    });

    it('debería aceptar value y defaultValue', () => {
      const { rerender } = render(<TextField defaultValue="default" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default');

      rerender(<TextField value="controlled" />);
      expect(input).toHaveValue('controlled');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar id personalizado', () => {
      render(<TextField id="custom-id" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('debería generar ID único automáticamente', () => {
      render(<TextField label="Campo 1" />);
      render(<TextField label="Campo 2" />);
      const input1 = screen.getByLabelText('Campo 1');
      const input2 = screen.getByLabelText('Campo 2');
      expect(input1.id).not.toBe(input2.id);
    });

    it('debería priorizar error sobre helperText', () => {
      render(<TextField error="Error" helperText="Ayuda" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    });
  });
});
