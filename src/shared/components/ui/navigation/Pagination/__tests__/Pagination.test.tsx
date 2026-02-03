import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render page numbers', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render previous and next buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('should render page information', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });

    it('should show ellipsis for large page counts', () => {
      render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should render page size selector when enabled', () => {
      render(
        <Pagination
          {...defaultProps}
          pageSize={10}
          showPageSizeSelector={true}
          onPageSizeChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Items per page:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call onPageChange when clicking a page number', () => {
      const handleChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={handleChange} />);

      fireEvent.click(screen.getByText('3'));

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when clicking next button', () => {
      const handleChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={handleChange} />);

      fireEvent.click(screen.getByLabelText('Next page'));

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when clicking previous button', () => {
      const handleChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={handleChange} />);

      fireEvent.click(screen.getByLabelText('Previous page'));

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('should not call onPageChange when clicking current page', () => {
      const handleChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={handleChange} />);

      fireEvent.click(screen.getByText('1', { selector: '[aria-current="page"]' }));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should disable previous button on first page', () => {
      render(<Pagination {...defaultProps} />);

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('should call onPageSizeChange when changing page size', () => {
      const handleSizeChange = vi.fn();
      render(
        <Pagination
          {...defaultProps}
          pageSize={10}
          showPageSizeSelector={true}
          onPageSizeChange={handleSizeChange}
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '25' } });

      expect(handleSizeChange).toHaveBeenCalledWith(25);
    });

    it('should clamp currentPage to totalPages', () => {
      render(<Pagination currentPage={10} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.getByText('Page 5 of 5')).toBeInTheDocument();
    });

    it('should clamp currentPage to 1', () => {
      render(<Pagination currentPage={-1} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });
  });

  describe('Page Calculations', () => {
    it('should show all pages when total is less than max visible', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

      expect(screen.queryAllByText('...')).toHaveLength(0);
    });

    it('should show first and last pages with ellipsis', () => {
      render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('should adjust visible pages around current page', () => {
      render(<Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />);

      // Should show pages around 10
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have nav role with aria-label', () => {
      const { container } = render(<Pagination {...defaultProps} />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('aria-label', 'Pagination');
    });

    it('should have aria-current on active page', () => {
      render(<Pagination {...defaultProps} />);

      const activePage = screen.getByText('1');
      expect(activePage).toHaveAttribute('aria-current', 'page');
    });

    it('should have aria-label on navigation buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('should have aria-label on page buttons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Pagination {...defaultProps} className="custom-class" />
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('custom-class');
    });

    it('should have active page styling', () => {
      render(<Pagination {...defaultProps} />);

      const activePage = screen.getByText('1');
      expect(activePage).toHaveClass('bg-emerald-600');
    });
  });
});
