import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from '../Table';

interface TestData {
  id: number;
  name: string;
  email: string;
  role: string;
}

describe('Table Component', () => {
  const mockColumns = [
    { id: 'id', label: 'ID', key: 'id' as keyof TestData },
    { id: 'name', label: 'Name', key: 'name' as keyof TestData },
    { id: 'email', label: 'Email', key: 'email' as keyof TestData },
    { id: 'role', label: 'Role', key: 'role' as keyof TestData },
  ];

  const mockData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  describe('Rendering', () => {
    it('should render all columns', () => {
      render(<Table columns={mockColumns} data={mockData} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    it('should render all rows', () => {
      render(<Table columns={mockColumns} data={mockData} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should render empty message when no data', () => {
      render(<Table columns={mockColumns} data={[]} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should render custom empty message', () => {
      render(<Table columns={mockColumns} data={[]} emptyMessage="Custom empty message" />);

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('should use render function for custom cell content', () => {
      const columnsWithRender = [
        ...mockColumns,
        {
          id: 'actions',
          label: 'Actions',
          render: () => <button>Edit</button>,
        },
      ];

      render(<Table columns={columnsWithRender} data={mockData} />);

      const editButtons = screen.getAllByText('Edit');
      expect(editButtons).toHaveLength(3);
    });
  });

  describe('Sorting', () => {
    it('should show sort indicator when sortable', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const indicators = screen.getAllByText('↕');
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('should not show sort indicator when not sortable', () => {
      render(<Table columns={mockColumns} data={mockData} sortable={false} />);

      expect(screen.queryByText('↕')).not.toBeInTheDocument();
    });

    it('should sort ascending on first click', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Bob Johnson');
    });

    it('should sort descending on second click', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);

      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('John Doe');
    });

    it('should clear sort on third click', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);

      expect(screen.queryByText('↑')).not.toBeInTheDocument();
      expect(screen.queryByText('↓')).not.toBeInTheDocument();
    });

    it('should call onSort callback when sorting', () => {
      const handleSort = vi.fn();
      render(<Table columns={mockColumns} data={mockData} sortable onSort={handleSort} />);

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      expect(handleSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('should respect column sortable property', () => {
      const columns = [
        { id: 'id', label: 'ID', key: 'id' as keyof TestData, sortable: true },
        { id: 'name', label: 'Name', key: 'name' as keyof TestData, sortable: false },
      ];

      render(<Table columns={columns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name');
      const idHeader = screen.getByText('ID');

      expect(nameHeader.querySelector('.text-gray-400')).not.toBeInTheDocument();
      expect(idHeader.querySelector('.text-gray-400')).toBeInTheDocument();
    });

    it('should sort numeric columns correctly', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const idHeader = screen.getByText('ID');
      fireEvent.click(idHeader);

      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('1');
    });

    it('should maintain sort state on re-render', () => {
      const { rerender } = render(<Table columns={mockColumns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      rerender(<Table columns={mockColumns} data={mockData} sortable />);

      expect(screen.getByText('↑')).toBeInTheDocument();
    });
  });

  describe('Zebra Striping', () => {
    it('should apply zebra striping by default', () => {
      const { container } = render(<Table columns={mockColumns} data={mockData} />);

      const rows = container.querySelectorAll('tbody tr');
      expect(rows[0]).toHaveClass('bg-white');
      expect(rows[1]).toHaveClass('bg-gray-50');
      expect(rows[2]).toHaveClass('bg-white');
    });

    it('should not apply zebra striping when disabled', () => {
      const { container } = render(
        <Table columns={mockColumns} data={mockData} zebraStripes={false} />
      );

      const rows = container.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        expect(row).not.toHaveClass('bg-gray-50');
      });
    });
  });

  describe('Hover States', () => {
    it('should apply hover state to rows', () => {
      const { container } = render(<Table columns={mockColumns} data={mockData} />);

      const row = container.querySelector('tbody tr');
      expect(row).toHaveClass('hover:bg-gray-100');
    });
  });

  describe('Accessibility', () => {
    it('should have proper table semantics', () => {
      render(<Table columns={mockColumns} data={mockData} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have th elements with scope="col"', () => {
      render(<Table columns={mockColumns} data={mockData} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(4);
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('should have aria-sort on sortable columns', () => {
      render(<Table columns={mockColumns} data={mockData} sortable />);

      const nameHeader = screen.getByText('Name').closest('th');
      fireEvent.click(nameHeader!);

      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should announce empty state', () => {
      render(<Table columns={mockColumns} data={[]} />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
    });
  });

  describe('Responsive', () => {
    it('should have horizontal scroll container', () => {
      const { container } = render(<Table columns={mockColumns} data={mockData} />);

      const scrollContainer = container.querySelector('.overflow-x-auto');
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Table columns={mockColumns} data={mockData} className="custom-class" />
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('custom-class');
    });

    it('should apply custom cell className', () => {
      const columns = [
        {
          id: 'name',
          label: 'Name',
          key: 'name' as keyof TestData,
          cellClassName: 'custom-cell-class',
        },
      ];

      const { container } = render(<Table columns={columns} data={mockData} />);

      const cells = container.querySelectorAll('.custom-cell-class');
      expect(cells).toHaveLength(3);
    });
  });
});
