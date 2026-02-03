import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb Component', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Product Detail' },
  ];

  describe('Rendering', () => {
    it('should render all breadcrumb items', () => {
      render(<Breadcrumb items={mockItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Product Detail')).toBeInTheDocument();
    });

    it('should render separators between items', () => {
      render(<Breadcrumb items={mockItems} />);

      const separators = screen.getAllByText('/');
      expect(separators).toHaveLength(3);
    });

    it('should render custom separator', () => {
      render(<Breadcrumb items={mockItems} separator=">" />);

      expect(screen.getAllByText('>')).toHaveLength(3);
    });

    it('should not render separator before first item', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);

      const firstItem = container.querySelector('li:first-child');
      const separator = firstItem?.querySelector('[aria-hidden="true"]');

      expect(separator).not.toBeInTheDocument();
    });

    it('should render icons when provided', () => {
      const itemsWithIcon = [
        { label: 'Home', href: '/', icon: '🏠' },
        { label: 'Products', href: '/products', icon: '📦' },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('📦')).toBeInTheDocument();
    });

    it('should return null for empty items array', () => {
      const { container } = render(<Breadcrumb items={[]} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Navigation Behavior', () => {
    it('should mark last item as current page', () => {
      render(<Breadcrumb items={mockItems} />);

      const currentItem = screen.getByText('Product Detail');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('should render clickable items with href as links', () => {
      render(<Breadcrumb items={mockItems} />);

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render last item as non-clickable span', () => {
      render(<Breadcrumb items={mockItems} />);

      const lastItem = screen.getByText('Product Detail');
      expect(lastItem.tagName).toBe('SPAN');
    });

    it('should render items without href as non-clickable spans', () => {
      const itemsWithoutHref = [
        { label: 'Home' },
        { label: 'Products', href: '/products' },
      ];

      render(<Breadcrumb items={itemsWithoutHref} />);

      const homeItem = screen.getByText('Home');
      expect(homeItem.tagName).toBe('SPAN');
    });
  });

  describe('Accessibility', () => {
    it('should have nav role with aria-label', () => {
      render(<Breadcrumb items={mockItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('should have aria-hidden on separators', () => {
      render(<Breadcrumb items={mockItems} />);

      const separators = screen.getAllByText('/');
      separators.forEach(separator => {
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should have aria-hidden on icons', () => {
      const itemsWithIcon = [
        { label: 'Home', href: '/', icon: '🏠' },
      ];

      render(<Breadcrumb items={itemsWithIcon} />);

      const icon = screen.getByText('🏠');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Breadcrumb items={mockItems} className="custom-class" />
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav).toHaveClass('custom-class');
    });

    it('should have proper hover states for clickable items', () => {
      render(<Breadcrumb items={mockItems} />);

      const link = screen.getByText('Home').closest('a');
      expect(link).toHaveClass('hover:text-emerald-600');
    });
  });
});
