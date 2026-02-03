import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(<Badge>Badge Text</Badge>);

      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('should render dot indicator when showDot is true', () => {
      const { container } = render(<Badge showDot>Badge</Badge>);

      const dot = container.querySelector('.rounded-full.bg-current');
      expect(dot).toBeInTheDocument();
    });

    it('should not render dot indicator when showDot is false', () => {
      const { container } = render(<Badge showDot={false}>Badge</Badge>);

      const dot = container.querySelector('.rounded-full.bg-current');
      expect(dot).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply success variant styles', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-emerald-100');
      expect(badge).toHaveClass('text-emerald-800');
      expect(badge).toHaveClass('border-emerald-200');
    });

    it('should apply warning variant styles', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-amber-100');
      expect(badge).toHaveClass('text-amber-800');
      expect(badge).toHaveClass('border-amber-200');
    });

    it('should apply error variant styles', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
      expect(badge).toHaveClass('border-red-200');
    });

    it('should apply info variant styles', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-blue-100');
      expect(badge).toHaveClass('text-blue-800');
      expect(badge).toHaveClass('border-blue-200');
    });

    it('should apply neutral variant by default', () => {
      const { container } = render(<Badge>Neutral</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-gray-100');
      expect(badge).toHaveClass('text-gray-800');
      expect(badge).toHaveClass('border-gray-200');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      const { container } = render(<Badge size="sm">Small</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('text-xs');
    });

    it('should apply medium size by default', () => {
      const { container } = render(<Badge>Medium</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
    });

    it('should apply large size styles', () => {
      const { container } = render(<Badge size="lg">Large</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1.5');
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Badge className="custom-class">Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('custom-class');
    });

    it('should have rounded-full shape', () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have border', () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('border');
    });

    it('should have inline-flex display', () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('inline-flex');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on dot indicator', () => {
      const { container } = render(<Badge showDot>Badge</Badge>);

      const dot = container.querySelector('.rounded-full');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render as span element', () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render text content', () => {
      render(<Badge>Text Badge</Badge>);

      expect(screen.getByText('Text Badge')).toBeInTheDocument();
    });

    it('should render React node content', () => {
      render(
        <Badge>
          <span data-testid="custom-content">Custom</span>
        </Badge>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should render number content', () => {
      render(<Badge>{42}</Badge>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('should combine variant and size correctly', () => {
      const { container } = render(
        <Badge variant="success" size="lg">
          Large Success
        </Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-emerald-100');
      expect(badge).toHaveClass('text-base');
      expect(badge).toHaveClass('px-3');
    });

    it('should combine showDot with variant', () => {
      const { container } = render(
        <Badge variant="error" showDot>
          Error with Dot
        </Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('bg-red-100');
      const dot = container.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    });
  });
});
