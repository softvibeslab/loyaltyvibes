import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';

const mockOptions = [
  { value: 'option1', label: 'Opción 1' },
  { value: 'option2', label: 'Opción 2' },
  { value: 'option3', label: 'Opción 3', disabled: true },
];

describe('Select Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el select sin etiqueta', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('debería renderizar con etiqueta', () => {
      render(<Select label="Categoría" options={mockOptions} />);
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    });

    it('debería renderizar todas las opciones', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('debería renderizar con placeholder', () => {
      render(<Select options={mockOptions} placeholder="Selecciona una opción" />);
      expect(screen.getByText('Selecciona una opción')).toBeInTheDocument();
    });

    it('debería deshabilitar opciones individuales', () => {
      render(<Select options={mockOptions} />);
      const option3 = screen.getByRole('option', { name: 'Opción 3' });
      expect(option3).toBeDisabled();
    });
  });

  describe('Clearable Feature', () => {
    it('no debería mostrar botón de limpiar por defecto', () => {
      render(<Select options={mockOptions} clearable={false} />);
      expect(screen.queryByLabelText('Limpiar selección')).not.toBeInTheDocument();
    });

    it('debería mostrar botón de limpiar cuando hay valor y clearable es true', () => {
      render(<Select options={mockOptions} clearable value="option1" />);
      expect(screen.getByLabelText('Limpiar selección')).toBeInTheDocument();
    });

    it('debería llamar a onClear al hacer clic en el botón', async () => {
      const handleClear = vi.fn();
      const user = userEvent.setup();
      render(
        <Select options={mockOptions} clearable value="option1" onClear={handleClear} />
      );

      const clearButton = screen.getByLabelText('Limpiar selección');
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('no debería mostrar botón de limpiar cuando no hay valor', () => {
      render(<Select options={mockOptions} clearable value="" />);
      expect(screen.queryByLabelText('Limpiar selección')).not.toBeInTheDocument();
    });

    it('debería mostrar botón de limpiar con defaultValue', () => {
      render(<Select options={mockOptions} clearable defaultValue="option1" />);
      expect(screen.getByLabelText('Limpiar selección')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('debería tener clases de error cuando hay error', () => {
      render(<Select options={mockOptions} error="Error" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-red-300');
      expect(select).toHaveClass('focus:ring-red-500');
    });

    it('debería tener clases normales cuando no hay error', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-gray-300');
      expect(select).toHaveClass('focus:ring-emerald-500');
    });

    it('debería ocupar todo el ancho cuando fullWidth es true', () => {
      const { container } = render(<Select options={mockOptions} fullWidth />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('w-full');
    });

    it('debería combinar clases personalizadas', () => {
      render(<Select options={mockOptions} className="mt-4" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('mt-4');
    });
  });

  describe('Interactions', () => {
    it('debería permitir seleccionar una opción', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option1');

      expect(handleChange).toHaveBeenCalled();
      expect(select).toHaveValue('option1');
    });

    it('debería no permitir selección cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('debería limpiar selección al hacer clic en el botón de limpiar', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select options={mockOptions} clearable value="option1" onChange={handleChange} />
      );

      const clearButton = screen.getByLabelText('Limpiar selección');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-invalid cuando hay error', () => {
      render(<Select options={mockOptions} error="Error" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-required cuando es requerido', () => {
      render(<Select options={mockOptions} required />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-required', 'true');
    });

    it('debería asociar etiqueta con select usando htmlFor', () => {
      render(<Select label="Categoría" options={mockOptions} />);
      const select = screen.getByLabelText('Categoría');
      expect(select).toBeInTheDocument();
    });

    it('debería tener aria-describedby cuando hay helperText', () => {
      render(<Select options={mockOptions} helperText="Ayuda" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby');
    });

    it('debería tener navegación por teclado', () => {
      render(<Select options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('focus:outline-none');
      expect(select).toHaveClass('focus:ring-2');
    });
  });

  describe('React Hook Form Integration', () => {
    it('debería aceptar ref', () => {
      const ref = { current: null as HTMLSelectElement | null };
      render(<Select options={mockOptions} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it('debería aceptar valor controlado', () => {
      render(<Select options={mockOptions} value="option1" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('option1');
    });

    it('debería aceptar defaultValue', () => {
      render(<Select options={mockOptions} defaultValue="option2" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('option2');
    });

    it('debería pasar props adicionales al select', () => {
      render(<Select options={mockOptions} data-testid="custom-select" name="test" />);
      const select = screen.getByTestId('custom-select');
      expect(select).toHaveAttribute('name', 'test');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar id personalizado', () => {
      render(<Select options={mockOptions} id="custom-id" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'custom-id');
    });

    it('debería priorizar error sobre helperText', () => {
      render(<Select options={mockOptions} error="Error" helperText="Ayuda" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    });

    it('debería mostrar indicador de requerido', () => {
      render(<Select label="Categoría" options={mockOptions} required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('debería deshabilitar placeholder cuando es requerido', () => {
      render(
        <Select options={mockOptions} placeholder="Selecciona" required />
      );
      const placeholder = screen.getByRole('option', { name: 'Selecciona' });
      expect(placeholder).toBeDisabled();
    });

    it('debería manejar opciones vacías', () => {
      render(<Select options={[]} />);
      const select = screen.getByRole('combobox');
      const options = screen.queryAllByRole('option');
      expect(options).toHaveLength(0);
    });
  });
});
