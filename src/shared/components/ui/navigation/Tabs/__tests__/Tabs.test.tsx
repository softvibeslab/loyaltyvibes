import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../Tabs';

describe('Tabs Component', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content 1</div>,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content 2</div>,
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      content: <div>Content 3</div>,
    },
  ];

  describe('Rendering', () => {
    it('should render all tabs', () => {
      render(<Tabs tabs={mockTabs} />);

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
    });

    it('should render active tab content', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab2" />);

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should render icons when provided', () => {
      const tabsWithIcon = [
        ...mockTabs,
        { id: 'tab4', label: 'Tab 4', content: <div>Content 4</div>, icon: '🔥' },
      ];

      render(<Tabs tabs={tabsWithIcon} />);

      expect(screen.getByText('🔥')).toBeInTheDocument();
    });

    it('should apply orientation classes correctly', () => {
      const { container: horizontalContainer } = render(
        <Tabs tabs={mockTabs} orientation="horizontal" />
      );
      expect(horizontalContainer.querySelector('[role="tablist"]')).toHaveClass('flex-row');

      const { container: verticalContainer } = render(
        <Tabs tabs={mockTabs} orientation="vertical" />
      );
      expect(verticalContainer.querySelector('[role="tablist"]')).toHaveClass('flex-col');
    });
  });

  describe('Functionality', () => {
    it('should switch tabs when clicked', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      fireEvent.click(tab2);

      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should call onChange callback when tab changes', () => {
      const handleChange = vi.fn();

      render(<Tabs tabs={mockTabs} onChange={handleChange} />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      fireEvent.click(tab2);

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('should not switch to disabled tab', () => {
      const tabsWithDisabled = [
        ...mockTabs,
        {
          id: 'tab4',
          label: 'Disabled Tab',
          content: <div>Content 4</div>,
          disabled: true,
        },
      ];

      render(<Tabs tabs={tabsWithDisabled} defaultTab="tab1" />);

      const disabledTab = screen.getByRole('tab', { name: 'Disabled Tab' });
      fireEvent.click(disabledTab);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 4')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next tab with ArrowRight', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should navigate to previous tab with ArrowLeft', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab2" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      fireEvent.keyDown(tab2, { key: 'ArrowLeft' });

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should go to first tab with Home key', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab3" />);

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      tab3.focus();

      fireEvent.keyDown(tab3, { key: 'Home' });

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should go to last tab with End key', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'End' });

      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus();
    });

    it('should activate tab with Enter key', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      fireEvent.keyDown(tab2, { key: 'Enter' });

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should activate tab with Space key', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      fireEvent.keyDown(tab2, { key: ' ' });

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should skip disabled tabs when navigating', () => {
      const tabsWithDisabled = [
        { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
        { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div>, disabled: true },
        { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
      ];

      render(<Tabs tabs={tabsWithDisabled} defaultTab="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<Tabs tabs={mockTabs} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should have aria-selected for active tab', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab2" />);

      const activeTab = screen.getByRole('tab', { name: 'Tab 2' });
      const inactiveTab = screen.getByRole('tab', { name: 'Tab 1' });

      expect(activeTab).toHaveAttribute('aria-selected', 'true');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });

    it('should have aria-orientation', () => {
      const { container } = render(<Tabs tabs={mockTabs} orientation="vertical" />);

      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should have aria-disabled for disabled tabs', () => {
      const tabsWithDisabled = [
        ...mockTabs,
        {
          id: 'tab4',
          label: 'Disabled Tab',
          content: <div>Content 4</div>,
          disabled: true,
        },
      ];

      render(<Tabs tabs={tabsWithDisabled} />);

      const disabledTab = screen.getByRole('tab', { name: 'Disabled Tab' });
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have proper aria-controls and aria-labelledby', () => {
      render(<Tabs tabs={mockTabs} defaultTab="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const panel = screen.getByRole('tabpanel');

      expect(tab1).toHaveAttribute('aria-controls', 'panel-tab1');
      expect(panel).toHaveAttribute('aria-labelledby', 'tab-tab1');
    });
  });
});
