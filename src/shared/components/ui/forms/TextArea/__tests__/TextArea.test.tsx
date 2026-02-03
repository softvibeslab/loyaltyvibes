import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from '../TextArea';

describe('TextArea Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el textarea sin etiqueta', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('debería renderizar con etiqueta', () => {
      render(<TextArea label="Descripción" />);
      expect(screen.getByText('Descripción')).toBeInTheDocument();
      expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    });

    it('debería renderizar con texto de ayuda', () => {
      render(<TextArea helperText="Describe el producto" />);
      expect(screen.getByText('Describe el producto')).toBeInTheDocument();
    });

    it('debería renderizar con mensaje de error', () => {
      render(<TextArea error="Este campo es requerido" />);
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('debería tener 4 filas por defecto', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('debería tener filas personalizadas', () => {
      render(<TextArea rows={8} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '8');
    });
  });

  describe('Character Counter', () => {
    it('debería mostrar contador de caracteres cuando showCount es true', () => {
      render(<TextArea showCount value="Hola" />);
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('debería mostrar contador con maxLength', () => {
      render(<TextArea showCount maxLength={100} value="Hola" />);
      expect(screen.getByText('4 / 100')).toBeInTheDocument();
    });

    it('debería actualizar contador al escribir', async () => {
      const user = userEvent.setup();
      render(<TextArea showCount />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('debería mostrar contador en rojo cuando excede maxLength', async () => {
      const user = userEvent.setup();
      render(<TextArea showCount maxLength={5} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, '123456');
      const counter = screen.getByText('6 / 5');
      expect(counter).toHaveClass('text-red-600');
    });
  });

  describe('Resize Behavior', () => {
    it('debería permitir redimensionamiento vertical por defecto', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-y');
    });

    it('debería no permitir redimensionamiento cuando resize es none', () => {
      render(<TextArea resize="none" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });

    it('debería permitir redimensionamiento en ambas direcciones', () => {
      render(<TextArea resize="both" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize');
    });

    it('debería permitir redimensionamiento horizontal', () => {
      render(<TextArea resize="horizontal" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-x');
    });
  });

  describe('Styling', () => {
    it('debería tener clases de error cuando hay error', () => {
      render(<TextArea error="Error" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-300');
      expect(textarea).toHaveClass('focus:ring-red-500');
    });

    it('debería tener clases normales cuando no hay error', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-gray-300');
      expect(textarea).toHaveClass('focus:ring-emerald-500');
    });

    it('debería ocupar todo el ancho cuando fullWidth es true', () => {
      const { container } = render(<TextArea fullWidth />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });

    it('debería combinar clases personalizadas', () => {
      render(<TextArea className="mt-4" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('mt-4');
    });
  });

  describe('Interactions', () => {
    it('debería permitir ingresar texto multilínea', async () => {
      const user = userEvent.setup();
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Línea 1{Enter}Línea 2');
      expect(textarea).toHaveValue('Línea 1\nLínea 2');
    });

    it('debería llamar a onChange al escribir', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextArea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('debería respetar maxLength', async () => {
      const user = userEvent.setup();
      render(<TextArea maxLength={5} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, '123456');
      expect(textarea).toHaveValue('12345');
    });

    it('no debería permitir entrada cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<TextArea disabled />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');
      expect(textarea).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-invalid cuando hay error', () => {
      render(<TextArea error="Error" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-required cuando es requerido', () => {
      render(<TextArea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    it('debería asociar etiqueta con textarea usando htmlFor', () => {
      render(<TextArea label="Descripción" />);
      const textarea = screen.getByLabelText('Descripción');
      expect(textarea).toBeInTheDocument();
    });

    it('debería tener aria-describedby cuando hay helperText', () => {
      render(<TextArea helperText="Ayuda" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby');
    });

    it('debería tener navegación por teclado', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('focus:outline-none');
      expect(textarea).toHaveClass('focus:ring-2');
    });
  });

  describe('React Hook Form Integration', () => {
    it('debería aceptar ref', () => {
      const ref = { current: null as HTMLTextAreaElement | null };
      render(<TextArea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('debería aceptar valor controlado', () => {
      render(<TextArea value="valor controlado" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('valor controlado');
    });

    it('debería aceptar defaultValue', () => {
      render(<TextArea defaultValue="valor por defecto" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('valor por defecto');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar id personalizado', () => {
      render(<TextArea id="custom-id" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('id', 'custom-id');
    });

    it('debería priorizar error sobre helperText', () => {
      render(<TextArea error="Error" helperText="Ayuda" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    });

    it('debería mostrar indicador de requerido', () => {
      render(<TextArea label="Descripción" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });
  });
});
