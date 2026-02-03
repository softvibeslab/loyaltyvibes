import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from '../Stepper';

describe('Stepper Component', () => {
  const mockSteps = [
    { id: 'step1', label: 'Step 1' },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' },
    { id: 'step4', label: 'Step 4' },
  ];

  describe('Rendering', () => {
    it('should render all steps', () => {
      render(<Stepper steps={mockSteps} currentStep={1} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('Step 4')).toBeInTheDocument();
    });

    it('should render step numbers', () => {
      render(<Stepper steps={mockSteps} currentStep={1} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render checkmarks for completed steps', () => {
      render(<Stepper steps={mockSteps} currentStep={3} />);

      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('should render icons when provided', () => {
      const stepsWithIcon = [
        { id: 'step1', label: 'Step 1', icon: '🏠' },
        { id: 'step2', label: 'Step 2', icon: '📦' },
      ];

      render(<Stepper steps={stepsWithIcon} currentStep={1} />);

      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('📦')).toBeInTheDocument();
    });

    it('should render descriptions when provided', () => {
      const stepsWithDesc = [
        { id: 'step1', label: 'Step 1', description: 'First step description' },
      ];

      render(<Stepper steps={stepsWithDesc} currentStep={1} />);

      expect(screen.getByText('First step description')).toBeInTheDocument();
    });

    it('should render horizontal orientation by default', () => {
      const { container } = render(<Stepper steps={mockSteps} currentStep={1} />);

      const stepper = container.firstChild as HTMLElement;
      expect(stepper).toHaveClass('items-center');
    });

    it('should render vertical orientation when specified', () => {
      const { container } = render(
        <Stepper steps={mockSteps} currentStep={1} orientation="vertical" />
      );

      const stepper = container.firstChild as HTMLElement;
      expect(stepper).toHaveClass('flex-col');
    });
  });

  describe('Step Status', () => {
    it('should mark current step as active', () => {
      render(<Stepper steps={mockSteps} currentStep={2} />);

      const step2 = screen.getByText('Step 2').closest('div');
      expect(step2?.parentElement).toHaveAttribute('aria-current', 'step');
    });

    it('should mark previous steps as completed', () => {
      render(<Stepper steps={mockSteps} currentStep={3} />);

      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('should mark next steps as pending', () => {
      render(<Stepper steps={mockSteps} currentStep={2} />);

      const step3 = screen.getByText('3');
      expect(step3).toHaveClass('bg-gray-200');
    });

    it('should show checkmark for explicitly completed steps', () => {
      const stepsWithCompleted = [
        { id: 'step1', label: 'Step 1', completed: true },
        { id: 'step2', label: 'Step 2' },
      ];

      render(<Stepper steps={stepsWithCompleted} currentStep={2} />);

      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  describe('Interactivity', () => {
    it('should call onStepClick when clicking a completed step', () => {
      const handleClick = vi.fn();
      render(<Stepper steps={mockSteps} currentStep={3} onStepClick={handleClick} />);

      const step1 = screen.getByText('Step 1').closest('div');
      fireEvent.click(step1!);

      expect(handleClick).toHaveBeenCalledWith('step1');
    });

    it('should call onStepClick when clicking active step', () => {
      const handleClick = vi.fn();
      render(<Stepper steps={mockSteps} currentStep={2} onStepClick={handleClick} />);

      const step2 = screen.getByText('Step 2').closest('div');
      fireEvent.click(step2!);

      expect(handleClick).toHaveBeenCalledWith('step2');
    });

    it('should not call onStepClick when clicking pending step', () => {
      const handleClick = vi.fn();
      render(<Stepper steps={mockSteps} currentStep={2} onStepClick={handleClick} />);

      const step3 = screen.getByText('Step 3').closest('div');
      fireEvent.click(step3!);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard navigation with Enter key', () => {
      const handleClick = vi.fn();
      render(<Stepper steps={mockSteps} currentStep={3} onStepClick={handleClick} />);

      const step1 = screen.getByText('Step 1').closest('div');
      fireEvent.keyDown(step1!, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledWith('step1');
    });

    it('should handle keyboard navigation with Space key', () => {
      const handleClick = vi.fn();
      render(<Stepper steps={mockSteps} currentStep={3} onStepClick={handleClick} />);

      const step1 = screen.getByText('Step 1').closest('div');
      fireEvent.keyDown(step1!, { key: ' ' });

      expect(handleClick).toHaveBeenCalledWith('step1');
    });
  });

  describe('Boundary Cases', () => {
    it('should clamp currentStep to 1 when below minimum', () => {
      render(<Stepper steps={mockSteps} currentStep={-1} />);

      const step1 = screen.getByText('Step 1');
      expect(step1.parentElement).toHaveAttribute('aria-current', 'step');
    });

    it('should clamp currentStep to steps length when above maximum', () => {
      render(<Stepper steps={mockSteps} currentStep={10} />);

      const step4 = screen.getByText('Step 4');
      expect(step4.parentElement).toHaveAttribute('aria-current', 'step');
    });
  });

  describe('Accessibility', () => {
    it('should have role group with aria-label', () => {
      const { container } = render(<Stepper steps={mockSteps} currentStep={1} />);

      const stepper = container.querySelector('[role="group"]');
      expect(stepper).toHaveAttribute('aria-label', 'Progress stepper');
    });

    it('should have aria-current on active step', () => {
      render(<Stepper steps={mockSteps} currentStep={2} />);

      const activeStep = screen.getByText('Step 2');
      expect(activeStep.parentElement).toHaveAttribute('aria-current', 'step');
    });

    it('should have appropriate tabIndex for clickable steps', () => {
      render(<Stepper steps={mockSteps} currentStep={3} />);

      const step1 = screen.getByText('Step 1').closest('[role="button"]');
      expect(step1).toHaveAttribute('tabIndex', '0');

      const step4 = screen.getByText('Step 4').closest('[role="button"]');
      expect(step4).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Stepper steps={mockSteps} currentStep={1} className="custom-class" />
      );

      const stepper = container.firstChild as HTMLElement;
      expect(stepper).toHaveClass('custom-class');
    });

    it('should apply ring to active step', () => {
      render(<Stepper steps={mockSteps} currentStep={2} />);

      const step2Circle = screen.getByText('2').parentElement;
      expect(step2Circle).toHaveClass('ring-4');
    });
  });
});
