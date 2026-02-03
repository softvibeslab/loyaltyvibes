import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from '../Divider';

describe('Divider Component', () => {
  describe('Rendering', () => {
    it('should render horizontal divider by default', () => {
      const { container } = render(<Divider />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('border-t');
      expect(divider).toHaveClass('w-full');
    });

    it('should render vertical divider when orientation is vertical', () => {
      const { container } = render(<Divider orientation="vertical" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('border-l');
      expect(divider).toHaveClass('h-full');
    });

    it('should render label when provided', () => {
      render(<Divider label="Section 1" />);

      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    it('should not render label when not provided', () => {
      const { container } = render(<Divider />);

      expect(container.querySelector('span')).not.toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('should have aria-orientation for horizontal', () => {
      const { container } = render(<Divider orientation="horizontal" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should have aria-orientation for vertical', () => {
      const { container } = render(<Divider orientation="vertical" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should apply correct border class for horizontal', () => {
      const { container } = render(<Divider orientation="horizontal" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('border-t');
    });

    it('should apply correct border class for vertical', () => {
      const { container } = render(<Divider orientation="vertical" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('border-l');
    });
  });

  describe('Label', () => {
    it('should render label centered between lines', () => {
      const { container } = render(<Divider label="Label" />);

      const label = screen.getByText('Label');
      expect(label).toBeInTheDocument();

      const lines = container.querySelectorAll('.border-t');
      expect(lines.length).toBe(2);
    });

    it('should have proper spacing for label', () => {
      const label = screen.getByText('Label');
      expect(label).toHaveClass('px-4');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('text-gray-500');
    });

    it('should have aria-hidden on divider lines with label', () => {
      const { container } = render(<Divider label="Label" />);

      const lines = container.querySelectorAll('[aria-hidden="true"]');
      expect(lines.length).toBe(2);
    });
  });

  describe('Thickness', () => {
    it('should apply default thickness of 1px', () => {
      const { container } = render(<Divider />);

      const divider = container.firstChild as HTMLElement;
      expect(divider.style.borderWidth).toBe('1px');
    });

    it('should apply custom thickness', () => {
      const { container } = render(<Divider thickness={2} />);

      const divider = container.firstChild as HTMLElement;
      expect(divider.style.borderWidth).toBe('2px');
    });

    it('should apply custom thickness to labeled divider', () => {
      const { container } = render(<Divider label="Label" thickness={3} />);

      const lines = container.querySelectorAll('[aria-hidden="true"]');
      lines.forEach((line) => {
        expect((line as HTMLElement).style.borderWidth).toBe('3px');
      });
    });
  });

  describe('Styling', () => {
    it('should have gray color', () => {
      const { container } = render(<Divider />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('border-gray-300');
    });

    it('should apply custom className', () => {
      const { container } = render(<Divider className="custom-class" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('custom-class');
    });

    it('should have margin for labeled divider', () => {
      const { container } = render(<Divider label="Label" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('my-4');
    });
  });

  describe('Accessibility', () => {
    it('should have role separator', () => {
      const { container } = render(<Divider />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('role', 'separator');
    });

    it('should have aria-orientation attribute', () => {
      const { container } = render(<Divider orientation="vertical" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should have aria-hidden on decorative lines', () => {
      const { container } = render(<Divider label="Label" />);

      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Variations', () => {
    it('should use flex layout for labeled divider', () => {
      const { container } = render(<Divider label="Label" />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('flex');
      expect(divider).toHaveClass('items-center');
    });

    it('should use flex column for vertical labeled divider', () => {
      const { container } = render(
        <Divider label="Label" orientation="vertical" />
      );

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass('flex-col');
      expect(divider).toHaveClass('items-center');
    });

    it('should split space evenly with label', () => {
      const { container } = render(<Divider label="Label" />);

      const lines = container.querySelectorAll('.flex-1');
      expect(lines.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label string', () => {
      const { container } = render(<Divider label="" />);

      const label = container.querySelector('span');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('');
    });

    it('should handle very long label', () => {
      render(<Divider label="This is a very long label text" />);

      expect(screen.getByText('This is a very long label text')).toBeInTheDocument();
    });

    it('should handle zero thickness', () => {
      const { container } = render(<Divider thickness={0} />);

      const divider = container.firstChild as HTMLElement;
      expect(divider.style.borderWidth).toBe('0px');
    });
  });
});
