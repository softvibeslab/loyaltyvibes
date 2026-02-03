import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from '../RadioGroup';

const mockOptions = [
  { value: 'option1', label: 'Opción 1' },
  { value: 'option2', label: 'Opción 2' },
  { value: 'option3', label: 'Opción 3', disabled: true },
];

describe('RadioGroup Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el grupo de radios sin etiqueta', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('debería renderizar con etiqueta de grupo', () => {
      render(<RadioGroup name="test" label="Categoría" options={mockOptions} />);
      expect(screen.getByText('Categoría')).toBeInTheDocument();
    });

    it('debería renderizar todas las opciones', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      expect(screen.getByText('Opción 1')).toBeInTheDocument();
      expect(screen.getByText('Opción 2')).toBeInTheDocument();
      expect(screen.getByText('Opción 3')).toBeInTheDocument();
    });

    it('debería deshabilitar opciones individuales', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const option3 = screen.getByLabelText('Opción 3');
      expect(option3).toBeDisabled();
    });

    it('debería mostrar indicador de requerido', () => {
      render(<RadioGroup name="test" label="Categoría" options={mockOptions} required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });
  });

  describe('Orientation', () => {
    it('debería mostrar orientación vertical por defecto', () => {
      const { container } = render(<RadioGroup name="test" options={mockOptions} />);
      const optionsContainer = container.querySelector('.space-y-2');
      expect(optionsContainer).toBeInTheDocument();
    });

    it('debería mostrar orientación horizontal cuando se especifica', () => {
      const { container } = render(
        <RadioGroup name="test" options={mockOptions} orientation="horizontal" />
      );
      const optionsContainer = container.querySelector('.flex');
      expect(optionsContainer).toBeInTheDocument();
    });

    it('debería mostrar orientación vertical cuando se especifica', () => {
      const { container } = render(
        <RadioGroup name="test" options={mockOptions} orientation="vertical" />
      );
      const optionsContainer = container.querySelector('.space-y-2');
      expect(optionsContainer).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('debería tener opción seleccionada con value', () => {
      render(<RadioGroup name="test" options={mockOptions} value="option1" />);
      const option1 = screen.getByLabelText('Opción 1');
      expect(option1).toBeChecked();
    });

    it('debería tener opción seleccionada con defaultValue', () => {
      render(<RadioGroup name="test" options={mockOptions} defaultValue="option2" />);
      const option2 = screen.getByLabelText('Opción 2');
      expect(option2).toBeChecked();
    });

    it('no debería tener selección cuando no hay valor', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const option1 = screen.getByLabelText('Opción 1');
      const option2 = screen.getByLabelText('Opción 2');
      expect(option1).not.toBeChecked();
      expect(option2).not.toBeChecked();
    });
  });

  describe('Interactions', () => {
    it('debería seleccionar opción al hacer clic', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} onChange={handleChange} />);

      const option1 = screen.getByLabelText('Opción 1');
      await user.click(option1);

      expect(option1).toBeChecked();
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('debería cambiar selección al hacer clic en otra opción', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} onChange={handleChange} />);

      const option1 = screen.getByLabelText('Opción 1');
      const option2 = screen.getByLabelText('Opción 2');

      await user.click(option1);
      await user.click(option2);

      expect(option2).toBeChecked();
      expect(option1).not.toBeChecked();
      expect(handleChange).toHaveBeenLastCalledWith('option2');
    });

    it('debería actualizar valor controlado', () => {
      const { rerender } = render(
        <RadioGroup name="test" options={mockOptions} value="option1" />
      );
      expect(screen.getByLabelText('Opción 1')).toBeChecked();

      rerender(<RadioGroup name="test" options={mockOptions} value="option2" />);
      expect(screen.getByLabelText('Opción 2')).toBeChecked();
      expect(screen.getByLabelText('Opción 1')).not.toBeChecked();
    });

    it('no debería permitir selección cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} disabled />);

      const option1 = screen.getByLabelText('Opción 1');
      expect(option1).toBeDisabled();
    });

    it('no debería permitir selección en opción deshabilitada individualmente', async () => {
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} />);

      const option3 = screen.getByLabelText('Opción 3');
      expect(option3).toBeDisabled();

      await user.click(option3);
      expect(option3).not.toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('debería navegar entre opciones con flechas', async () => {
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} />);

      const option1 = screen.getByLabelText('Opción 1');
      const option2 = screen.getByLabelText('Opción 2');

      option1.focus();
      expect(option1).toHaveFocus();

      await user.keyboard('[ArrowDown]');
      expect(option2).toHaveFocus();
    });

    it('debería seleccionar con tecla Espacio', async () => {
      const user = userEvent.setup();
      render(<RadioGroup name="test" options={mockOptions} />);

      const option1 = screen.getByLabelText('Opción 1');
      option1.focus();

      await user.keyboard('[Space]');
      expect(option1).toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('debería tener aria-invalid cuando hay error', () => {
      render(<RadioGroup name="test" options={mockOptions} error="Error" />);
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería tener aria-required cuando es requerido', () => {
      render(<RadioGroup name="test" options={mockOptions} required />);
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-required', 'true');
    });

    it('debería tener role radiogroup', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const group = screen.getByRole('radiogroup');
      expect(group).toBeInTheDocument();
    });

    it('debería tener aria-describedby cuando hay helperText', () => {
      render(<RadioGroup name="test" options={mockOptions} helperText="Ayuda" />);
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-describedby');
    });

    it('debería asociar etiqueta con opción usando htmlFor', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const option1 = screen.getByLabelText('Opción 1');
      expect(option1).toBeInTheDocument();
    });

    it('debería tener navegación por teclado', () => {
      render(<RadioGroup name="test" options={mockOptions} />);
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveClass('focus:ring-2');
      });
    });
  });

  describe('Edge cases', () => {
    it('debería combinar clases personalizadas', () => {
      const { container } = render(
        <RadioGroup name="test" options={mockOptions} className="mt-4" />
      );
      expect(container.firstChild).toHaveClass('mt-4');
    });

    it('debería priorizar error sobre helperText', () => {
      render(<RadioGroup name="test" options={mockOptions} error="Error" helperText="Ayuda" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    });

    it('debería mostrar etiqueta en gris cuando está deshabilitado', () => {
      render(<RadioGroup name="test" label="Categoría" options={mockOptions} disabled />);
      const label = screen.getByText('Categoría');
      expect(label).toHaveClass('text-gray-400');
    });

    it('debería manejar opciones vacías', () => {
      render(<RadioGroup name="test" options={[]} />);
      const radios = screen.queryAllByRole('radio');
      expect(radios).toHaveLength(0);
    });

    it('debería pasar props adicionales al contenedor', () => {
      const { container } = render(
        <RadioGroup name="test" options={mockOptions} data-testid="custom-group" />
      );
      expect(container.firstChild).toHaveAttribute('data-testid', 'custom-group');
    });
  });
});
