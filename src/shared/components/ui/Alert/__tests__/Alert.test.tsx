import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  const defaultProps = {
    description: 'This is an alert message',
  };

  describe('Rendering', () => {
    it('debería renderizar la descripción', () => {
      render(<Alert {...defaultProps} />);
      const description = screen.getByText('This is an alert message');
      expect(description).toBeInTheDocument();
    });

    it('debería renderizar con variante info por defecto', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-blue-50');
      expect(alert).toHaveClass('border-blue-200');
    });

    it('debería renderizar con variante success', () => {
      render(<Alert {...defaultProps} variant="success" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-emerald-50');
      expect(alert).toHaveClass('border-emerald-200');
      expect(alert).toHaveClass('text-emerald-800');
    });

    it('debería renderizar con variante warning', () => {
      render(<Alert {...defaultProps} variant="warning" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-amber-50');
      expect(alert).toHaveClass('border-amber-200');
      expect(alert).toHaveClass('text-amber-800');
    });

    it('debería renderizar con variante error', () => {
      render(<Alert {...defaultProps} variant="error" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-50');
      expect(alert).toHaveClass('border-red-200');
      expect(alert).toHaveClass('text-red-800');
    });

    it('debería renderizar el título cuando se proporciona', () => {
      render(<Alert {...defaultProps} title="Success" />);
      const title = screen.getByText('Success');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H4');
    });

    it('no debería renderizar título cuando no se proporciona', () => {
      render(<Alert {...defaultProps} />);
      const title = screen.queryByRole('heading');
      expect(title).not.toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('debería mostrar el icono correcto para variante success', () => {
      render(<Alert {...defaultProps} variant="success" />);
      const icon = screen.getByText('✓');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('debería mostrar el icono correcto para variante warning', () => {
      render(<Alert {...defaultProps} variant="warning" />);
      const icon = screen.getByText('⚠');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('debería mostrar el icono correcto para variante error', () => {
      render(<Alert {...defaultProps} variant="error" />);
      const icon = screen.getByText('✕');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('debería mostrar el icono correcto para variante info', () => {
      render(<Alert {...defaultProps} variant="info" />);
      const icon = screen.getByText('ℹ');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('debería tener estilos de icono correctos para success', () => {
      render(<Alert {...defaultProps} variant="success" />);
      const icon = screen.getByText('✓').parentElement;
      expect(icon).toHaveClass('bg-emerald-100');
      expect(icon).toHaveClass('text-emerald-600');
      expect(icon).toHaveClass('rounded-full');
    });

    it('debería tener estilos de icono correctos para warning', () => {
      render(<Alert {...defaultProps} variant="warning" />);
      const icon = screen.getByText('⚠').parentElement;
      expect(icon).toHaveClass('bg-amber-100');
      expect(icon).toHaveClass('text-amber-600');
    });

    it('debería tener estilos de icono correctos para error', () => {
      render(<Alert {...defaultProps} variant="error" />);
      const icon = screen.getByText('✕').parentElement;
      expect(icon).toHaveClass('bg-red-100');
      expect(icon).toHaveClass('text-red-600');
    });

    it('debería tener estilos de icono correctos para info', () => {
      render(<Alert {...defaultProps} variant="info" />);
      const icon = screen.getByText('ℹ').parentElement;
      expect(icon).toHaveClass('bg-blue-100');
      expect(icon).toHaveClass('text-blue-600');
    });
  });

  describe('Styling', () => {
    it('debería tener clases de layout horizontal', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('flex');
      expect(alert).toHaveClass('items-start');
    });

    it('debería tener clases de borde y redondeado', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border');
      expect(alert).toHaveClass('rounded-lg');
    });

    it('debería tener padding', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('p-4');
    });

    it('debería aceptar className personalizado', () => {
      render(<Alert {...defaultProps} className="mt-4" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('mt-4');
    });

    it('debería tener espaciado entre icono y contenido', () => {
      render(<Alert {...defaultProps} />);
      const content = screen.getByText('This is an alert message').parentElement;
      expect(content).toHaveClass('ml-3');
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="alert"', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('debería tener aria-live="polite"', () => {
      render(<Alert {...defaultProps} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });

    it('debería tener aria-hidden="true" en el icono', () => {
      render(<Alert {...defaultProps} variant="success" />);
      const icon = screen.getByText('✓');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Layout', () => {
    it('debería tener icono con dimensiones fijas', () => {
      render(<Alert {...defaultProps} />);
      const icon = screen.getByText('ℹ').parentElement;
      expect(icon).toHaveClass('w-10');
      expect(icon).toHaveClass('h-10');
    });

    it('debería tener el contenido con flex-1', () => {
      render(<Alert {...defaultProps} />);
      const content = screen.getByText('This is an alert message').parentElement;
      expect(content).toHaveClass('flex-1');
    });

    it('debería tener espaciado entre título y descripción', () => {
      render(<Alert {...defaultProps} title="Title" />);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('mb-1');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar descripción vacía', () => {
      render(<Alert description="" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('debería manejar descripción larga', () => {
      const longDescription = 'This is a very long alert message that spans multiple lines and should still display correctly in the alert component without breaking the layout or causing any overflow issues.';
      render(<Alert description={longDescription} />);
      const description = screen.getByText(longDescription);
      expect(description).toBeInTheDocument();
    });

    it('debería manejar título largo', () => {
      const longTitle = 'This is a very long title that should still display correctly in the alert';
      render(<Alert {...defaultProps} title={longTitle} />);
      const title = screen.getByText(longTitle);
      expect(title).toBeInTheDocument();
    });

    it('debería manejar className vacío', () => {
      render(<Alert {...defaultProps} className="" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Common use cases', () => {
    it('debería mostrar alerta de éxito con título', () => {
      render(
        <Alert
          variant="success"
          title="Success!"
          description="Your changes have been saved successfully."
        />
      );
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your changes have been saved successfully.')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('debería mostrar alerta de advertencia', () => {
      render(
        <Alert
          variant="warning"
          title="Warning"
          description="Your account is about to expire."
        />
      );
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('debería mostrar alerta de error', () => {
      render(
        <Alert
          variant="error"
          title="Error"
          description="Failed to save your changes. Please try again."
        />
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('debería mostrar alerta informativa sin título', () => {
      render(
        <Alert
          variant="info"
          description="New features are available! Check out the latest updates."
        />
      );
      expect(screen.getByText(/New features are available/)).toBeInTheDocument();
      expect(screen.getByText('ℹ')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });
});
