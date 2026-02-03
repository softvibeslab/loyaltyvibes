import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from '../FormField';

describe('FormField Component', () => {
  describe('Rendering', () => {
    it('debería renderizar sin etiqueta', () => {
      render(
        <FormField>
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('debería renderizar con etiqueta', () => {
      render(
        <FormField label="Nombre">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    it('debería renderizar con texto de ayuda', () => {
      render(
        <FormField helperText="Ingresa tu nombre completo">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument();
    });

    it('debería renderizar con mensaje de error', () => {
      render(
        <FormField error="Este campo es requerido">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('debería mostrar indicador de requerido', () => {
      render(
        <FormField label="Email" required>
          <input type="text" />
        </FormField>
      );
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('debería renderizar múltiples hijos', () => {
      render(
        <FormField label="Selecciona">
          <input type="radio" value="1" />
          <input type="radio" value="2" />
        </FormField>
      );
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });
  });

  describe('Accessibility Props Injection', () => {
    it('debería inyectar aria-invalid cuando hay error', () => {
      render(
        <FormField error="Error">
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('debería inyectar aria-required cuando es requerido', () => {
      render(
        <FormField required>
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-required', 'true');
    });

    it('debería inyectar aria-describedby cuando hay helperText', () => {
      render(
        <FormField helperText="Ayuda">
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-describedby');
    });

    it('debería inyectar aria-describedby cuando hay error', () => {
      render(
        <FormField error="Error">
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute('aria-describedby');
    });

    it('no debería inyectar aria-describedby cuando no hay helperText ni error', () => {
      render(
        <FormField>
          <input type="text" data-testid="test-input" />
        </FormField>
      );
      expect(screen.getByTestId('test-input')).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Styling', () => {
    it('debería combinar clases personalizadas', () => {
      const { container } = render(
        <FormField className="mt-4">
          <input type="text" />
        </FormField>
      );
      expect(container.firstChild).toHaveClass('mt-4');
    });

    it('debería aplicar estilos de error al texto de descripción', () => {
      render(
        <FormField error="Error message">
          <input type="text" />
        </FormField>
      );
      const errorText = screen.getByText('Error message');
      expect(errorText).toHaveClass('text-red-600');
    });

    it('debería aplicar estilos normales al texto de ayuda', () => {
      render(
        <FormField helperText="Helper text">
          <input type="text" />
        </FormField>
      );
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('text-gray-500');
    });
  });

  describe('Children Handling', () => {
    it('debería renderizar input como hijo', () => {
      render(
        <FormField>
          <input type="text" data-testid="input" />
        </FormField>
      );
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('debería renderizar select como hijo', () => {
      render(
        <FormField>
          <select data-testid="select">
            <option>Option 1</option>
          </select>
        </FormField>
      );
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('debería renderizar textarea como hijo', () => {
      render(
        <FormField>
          <textarea data-testid="textarea" />
        </FormField>
      );
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
    });

    it('debería renderizar checkbox como hijo', () => {
      render(
        <FormField>
          <input type="checkbox" data-testid="checkbox" />
        </FormField>
      );
      expect(screen.getByTestId('checkbox')).toBeInTheDocument();
    });

    it('debería renderizar elementos personalizados', () => {
      render(
        <FormField>
          <div data-testid="custom-div">Custom Element</div>
        </FormField>
      );
      expect(screen.getByTestId('custom-div')).toBeInTheDocument();
      expect(screen.getByText('Custom Element')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('debería priorizar error sobre helperText', () => {
      render(
        <FormField error="Error" helperText="Ayuda">
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
    });

    it('debería manejar hijo sin props válidas', () => {
      render(
        <FormField>
          <span>Plain text</span>
        </FormField>
      );
      expect(screen.getByText('Plain text')).toBeInTheDocument();
    });

    it('debería manejar múltiples hijos con diferentes tipos', () => {
      render(
        <FormField>
          <input type="text" data-testid="input1" />
          <select data-testid="select1">
            <option>Option</option>
          </select>
          <span>Extra text</span>
        </FormField>
      );
      expect(screen.getByTestId('input1')).toBeInTheDocument();
      expect(screen.getByTestId('select1')).toBeInTheDocument();
      expect(screen.getByText('Extra text')).toBeInTheDocument();
    });

    it('debería generar IDs únicos para múltiples instancias', () => {
      render(
        <>
          <FormField helperText="Help 1">
            <input type="text" data-testid="input1" />
          </FormField>
          <FormField helperText="Help 2">
            <input type="text" data-testid="input2" />
          </FormField>
        </>
      );

      const input1 = screen.getByTestId('input1');
      const input2 = screen.getByTestId('input2');

      expect(input1.getAttribute('aria-describedby')).not.toBe(
        input2.getAttribute('aria-describedby')
      );
    });

    it('debería manejar label con React nodes', () => {
      render(
        <FormField label={<strong>Bold Label</strong>}>
          <input type="text" />
        </FormField>
      );
      expect(screen.getByText('Bold Label')).toBeInTheDocument();
    });

    it('debería mantener props existentes del hijo', () => {
      render(
        <FormField error="Error">
          <input
            type="text"
            data-testid="input"
            className="original-class"
            placeholder="Original placeholder"
          />
        </FormField>
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('original-class');
      expect(input).toHaveAttribute('placeholder', 'Original placeholder');
    });
  });
});
