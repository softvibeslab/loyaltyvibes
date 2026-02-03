import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner Component', () => {
  describe('Rendering', () => {
    it('debería renderizar el spinner con tamaño md por defecto', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-6');
      expect(spinner).toHaveClass('h-6');
    });

    it('debería renderizar con tamaño sm', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4');
      expect(spinner).toHaveClass('h-4');
    });

    it('debería renderizar con tamaño md', () => {
      render(<Spinner size="md" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-6');
      expect(spinner).toHaveClass('h-6');
    });
  });

  describe('Styling', () => {
    it('debería tener clases de animación', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('animate-spin');
      expect(spinner).toHaveClass('border-emerald-500');
      expect(spinner).toHaveClass('border-t-transparent');
    });

    it('debería ser redondeado', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('rounded-full');
    });

    it('debería aceptar className personalizado', () => {
      render(<Spinner className="custom-class" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="status"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('debería tener aria-label="Loading"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('debería tener aria-live="polite"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('debería tener texto oculto para lectores de pantalla', () => {
      render(<Spinner />);
      const hiddenText = screen.getByText('Loading...');
      expect(hiddenText).toHaveClass('sr-only');
    });
  });

  describe('Border sizes', () => {
    it('debería tener border-2 en tamaño sm', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('border-2');
    });

    it('debería tener border-3 en tamaño md', () => {
      render(<Spinner size="md" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('border-3');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar className vacío', () => {
      render(<Spinner className="" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });
  });
});
