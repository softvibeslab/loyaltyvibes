import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton Component', () => {
  describe('Rendering', () => {
    it('debería renderizar con variante text por defecto', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('h-4');
      expect(skeleton).toHaveClass('w-full');
    });

    it('debería renderizar con variante card', () => {
      render(<Skeleton variant="card" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-lg');
      expect(skeleton).toHaveClass('w-full');
      expect(skeleton).toHaveClass('h-32');
    });

    it('debería renderizar con variante text', () => {
      render(<Skeleton variant="text" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded');
      expect(skeleton).toHaveClass('h-4');
      expect(skeleton).toHaveClass('w-full');
    });

    it('debería renderizar con variante avatar', () => {
      render(<Skeleton variant="avatar" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');
      expect(skeleton).toHaveClass('w-12');
      expect(skeleton).toHaveClass('h-12');
    });
  });

  describe('Custom dimensions', () => {
    it('debería aceptar width y height personalizados en variante custom', () => {
      render(<Skeleton variant="custom" width="100px" height="50px" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '100px' });
      expect(skeleton).toHaveStyle({ height: '50px' });
    });

    it('debería usar valores por defecto si no se especifican dimensiones custom', () => {
      render(<Skeleton variant="custom" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '100%' });
      expect(skeleton).toHaveStyle({ height: '1rem' });
    });

    it('debería ignorar dimensiones custom en otras variantes', () => {
      render(<Skeleton variant="card" width="100px" height="50px" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-32');
      expect(skeleton).not.toHaveStyle({ height: '50px' });
    });
  });

  describe('Styling', () => {
    it('debería tener clase de animación shimmer', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('debería tener color de fondo gris', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('bg-gray-200');
    });

    it('debería aceptar className personalizado', () => {
      render(<Skeleton className="mt-4" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('mt-4');
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="status"', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('debería tener aria-label="Loading"', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading');
    });

    it('debería tener aria-live="polite"', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });

    it('debería tener texto oculto para lectores de pantalla', () => {
      render(<Skeleton />);
      const hiddenText = screen.getByText('Loading...');
      expect(hiddenText).toHaveClass('sr-only');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar className vacío', () => {
      render(<Skeleton className="" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('debería manejar dimensiones vacías en custom', () => {
      render(<Skeleton variant="custom" width="" height="" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Use cases', () => {
    it('debería renderizar múltiples skeletons para lista', () => {
      render(
        <div>
          <Skeleton variant="avatar" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="2/3" />
        </div>
      );
      const skeletons = screen.getAllByRole('status');
      expect(skeletons).toHaveLength(3);
    });

    it('debería renderizar skeleton de tarjeta completa', () => {
      render(
        <div className="space-y-3">
          <Skeleton variant="card" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      );
      const skeletons = screen.getAllByRole('status');
      expect(skeletons).toHaveLength(3);
    });
  });
});
