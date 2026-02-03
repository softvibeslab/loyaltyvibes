import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState Component', () => {
  const defaultProps = {
    icon: '📭',
    title: 'No messages',
    description: 'You have no messages yet.',
  };

  describe('Rendering', () => {
    it('debería renderizar el icono', () => {
      render(<EmptyState {...defaultProps} />);
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('📭');
    });

    it('debería renderizar el título', () => {
      render(<EmptyState {...defaultProps} />);
      const title = screen.getByText('No messages');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });

    it('debería renderizar la descripción', () => {
      render(<EmptyState {...defaultProps} />);
      const description = screen.getByText('You have no messages yet.');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('debería renderizar sin botón de acción cuando no se proporciona', () => {
      render(<EmptyState {...defaultProps} />);
      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });

    it('debería renderizar con botón de acción cuando se proporciona', () => {
      render(
        <EmptyState
          {...defaultProps}
          action={{ label: 'Create Message', onClick: vi.fn() }}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Create Message');
    });
  });

  describe('Styling', () => {
    it('debería tener clases de diseño centrado', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('flex-col');
      expect(container).toHaveClass('items-center');
      expect(container).toHaveClass('justify-center');
    });

    it('debería tener ancho máximo', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('max-w-md');
    });

    it('debería aceptar className personalizado', () => {
      render(<EmptyState {...defaultProps} className="mt-8" />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('mt-8');
    });

    it('debería aplicar estilos de color al título', () => {
      render(<EmptyState {...defaultProps} />);
      const title = screen.getByText('No messages');
      expect(title).toHaveClass('text-gray-900');
      expect(title).toHaveClass('font-semibold');
    });

    it('debería aplicar estilos de color a la descripción', () => {
      render(<EmptyState {...defaultProps} />);
      const description = screen.getByText('You have no messages yet.');
      expect(description).toHaveClass('text-gray-600');
    });
  });

  describe('Interactions', () => {
    it('debería llamar a onClick del botón de acción', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <EmptyState
          {...defaultProps}
          action={{ label: 'Create Message', onClick: handleClick }}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('debería tener role="status"', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByRole('status');
      expect(container).toBeInTheDocument();
    });

    it('debería tener aria-live="polite"', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('debería tener aria-label en el icono con el título', () => {
      render(<EmptyState {...defaultProps} />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'No messages');
    });
  });

  describe('Layout', () => {
    it('debería tener espaciado apropiado entre elementos', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('p-6');
    });

    it('debería tener espaciado entre icono y título', () => {
      render(<EmptyState {...defaultProps} />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveClass('mb-4');
    });

    it('debería tener espaciado entre título y descripción', () => {
      render(<EmptyState {...defaultProps} />);
      const title = screen.getByText('No messages');
      expect(title).toHaveClass('mb-2');
    });

    it('debería tener espaciado entre descripción y botón', () => {
      render(
        <EmptyState
          {...defaultProps}
          action={{ label: 'Create Message', onClick: vi.fn() }}
        />
      );
      const description = screen.getByText('You have no messages yet.');
      expect(description).toHaveClass('mb-6');
    });
  });

  describe('Edge cases', () => {
    it('debería manejar icono vacío', () => {
      render(<EmptyState {...defaultProps} icon="" />);
      const icon = screen.queryByRole('img');
      expect(icon).not.toBeInTheDocument();
    });

    it('debería manejar descripción larga', () => {
      const longDescription = 'This is a very long description that spans multiple lines and should still display correctly in the empty state component without breaking the layout.';
      render(<EmptyState {...defaultProps} description={longDescription} />);
      const description = screen.getByText(longDescription);
      expect(description).toBeInTheDocument();
    });

    it('debería manejar título largo', () => {
      const longTitle = 'This is a very long title that should still display correctly';
      render(<EmptyState {...defaultProps} title={longTitle} />);
      const title = screen.getByText(longTitle);
      expect(title).toBeInTheDocument();
    });
  });

  describe('Common use cases', () => {
    it('debería mostrar estado de "no resultados"', () => {
      render(
        <EmptyState
          icon="🔍"
          title="No results found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      );
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument();
    });

    it('debería mostrar estado de "no datos"', () => {
      render(
        <EmptyState
          icon="📊"
          title="No data available"
          description="There is no data to display at the moment."
          action={{ label: 'Refresh', onClick: vi.fn() }}
        />
      );
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Refresh');
    });
  });
});
