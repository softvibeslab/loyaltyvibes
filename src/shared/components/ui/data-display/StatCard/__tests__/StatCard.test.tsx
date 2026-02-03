import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

describe('StatCard Component', () => {
  describe('Rendering', () => {
    it('should render title', () => {
      render(<StatCard title="Total Users" value="1,234" />);

      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('should render value', () => {
      render(<StatCard title="Total Users" value="1,234" />);

      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      render(<StatCard title="Users" value="1,234" icon="👥" />);

      expect(screen.getByText('👥')).toBeInTheDocument();
    });

    it('should render change percentage', () => {
      render(<StatCard title="Users" value="1,234" change={12.5} />);

      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('should render comparison text', () => {
      render(<StatCard title="Users" value="1,234" change={12.5} />);

      expect(screen.getByText('vs. mes anterior')).toBeInTheDocument();
    });

    it('should render string value', () => {
      render(<StatCard title="Status" value="Active" />);

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render number value', () => {
      render(<StatCard title="Count" value={42} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton loader when loading', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" loading={true} />
      );

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should not show content when loading', () => {
      render(<StatCard title="Users" value="1,234" loading={true} />);

      expect(screen.queryByText('1,234')).not.toBeInTheDocument();
      expect(screen.queryByText('Total Users')).not.toBeInTheDocument();
    });

    it('should render skeleton elements', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" loading={true} />
      );

      const skeletons = container.querySelectorAll('.bg-gray-200');
      expect(skeletons.length).toBe(3);
    });
  });

  describe('Trend Indicators', () => {
    it('should show up trend with green color', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" change={12.5} trend="up" />
      );

      const trend = container.querySelector('.text-emerald-600');
      expect(trend).toBeInTheDocument();
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('should show down trend with red color', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" change={-12.5} trend="down" />
      );

      const trend = container.querySelector('.text-red-600');
      expect(trend).toBeInTheDocument();
      expect(screen.getByText('↓')).toBeInTheDocument();
    });

    it('should show neutral trend with gray color', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" change={0} trend="neutral" />
      );

      const trend = container.querySelector('.text-gray-600');
      expect(trend).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('should format positive change with + sign', () => {
      render(<StatCard title="Users" value="1,234" change={12.5} />);

      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('should format negative change', () => {
      render(<StatCard title="Users" value="1,234" change={-12.5} />);

      expect(screen.getByText('-12.5%')).toBeInTheDocument();
    });

    it('should format zero change', () => {
      render(<StatCard title="Users" value="1,234" change={0} />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('should have shadow on hover', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-lg');
    });

    it('should have rounded corners', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have white background', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white');
    });

    it('should have icon container with proper styling', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" icon="👥" />
      );

      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('bg-gray-100');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on icon', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" icon="👥" />
      );

      const icon = container.querySelector('.rounded-full');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden on trend icon', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" change={12.5} />
      );

      const trendIcon = container.querySelector('[aria-hidden="true"]');
      expect(trendIcon).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<StatCard title="Total Users" value="1,234" />);

      const title = screen.getByText('Total Users');
      expect(title.tagName).toBe('P');
      expect(title).toHaveClass('text-sm');
    });

    it('should have large font size for value', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const value = screen.getByText('1,234');
      expect(value).toHaveClass('text-3xl');
    });
  });

  describe('Layout', () => {
    it('should align content properly', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const wrapper = container.querySelector('.flex.items-start.justify-between');
      expect(wrapper).toBeInTheDocument();
    });

    it('should position icon on the right', () => {
      const { container } = render(
        <StatCard title="Users" value="1,234" icon="👥" />
      );

      const icon = container.querySelector('.rounded-full');
      const content = container.querySelector('.flex-1');

      expect(content).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should not render change section when change is undefined', () => {
      render(<StatCard title="Users" value="1,234" />);

      expect(screen.queryByText('%')).not.toBeInTheDocument();
      expect(screen.queryByText('vs. mes anterior')).not.toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      const { container } = render(<StatCard title="Users" value="1,234" />);

      const icon = container.querySelector('.rounded-full');
      expect(icon).not.toBeInTheDocument();
    });

    it('should handle large values', () => {
      render(<StatCard title="Revenue" value="$1,234,567" />);

      expect(screen.getByText('$1,234,567')).toBeInTheDocument();
    });
  });
});
