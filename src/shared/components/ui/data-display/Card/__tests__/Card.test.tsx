import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(<Card>Card Content</Card>);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<Card title="Card Title">Content</Card>);

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toHaveClass('text-lg');
    });

    it('should render description when provided', () => {
      render(<Card description="Card Description">Content</Card>);

      expect(screen.getByText('Card Description')).toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      render(
        <Card footer={<div>Footer Content</div>}>
          Content
        </Card>
      );

      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should render header with title and description', () => {
      render(
        <Card title="Title" description="Description">
          Content
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply elevated variant by default', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-md');
      expect(card).toHaveClass('bg-white');
    });

    it('should apply outlined variant', () => {
      const { container } = render(<Card variant="outlined">Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('border-gray-200');
    });

    it('should apply flat variant', () => {
      const { container } = render(<Card variant="flat">Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-gray-50');
    });
  });

  describe('Structure', () => {
    it('should have header section with title and description', () => {
      const { container } = render(
        <Card title="Title" description="Description">
          Content
        </Card>
      );

      const header = container.querySelector('.border-b');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Title');
      expect(header).toHaveTextContent('Description');
    });

    it('should have body section for children', () => {
      const { container } = render(<Card>Body Content</Card>);

      const body = container.querySelector('.px-6.py-4:not(.border-b):not(.border-t)');
      expect(body).toBeInTheDocument();
      expect(body).toHaveTextContent('Body Content');
    });

    it('should have footer section when footer is provided', () => {
      const { container } = render(
        <Card footer={<div>Footer</div>}>
          Content
        </Card>
      );

      const footer = container.querySelector('.border-t');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer');
    });

    it('should not render header when title and description are not provided', () => {
      const { container } = render(<Card>Content</Card>);

      const header = container.querySelector('.border-b');
      expect(header).not.toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      const { container } = render(<Card>Content</Card>);

      const footer = container.querySelector('.border-t');
      expect(footer).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('should have rounded corners', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have hover effects for elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-lg');
    });

    it('should have hover effects for outlined variant', () => {
      const { container } = render(<Card variant="outlined">Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:border-gray-300');
    });
  });

  describe('Accessibility', () => {
    it('should use heading for title', () => {
      render(<Card title="Card Title">Content</Card>);

      const title = screen.getByText('Card Title');
      expect(title.tagName).toBe('H3');
    });

    it('should have proper text hierarchy', () => {
      render(
        <Card title="Title" description="Description">
          Content
        </Card>
      );

      const title = screen.getByText('Title');
      const description = screen.getByText('Description');

      expect(title).toHaveClass('font-semibold');
      expect(description).toHaveClass('text-gray-600');
    });
  });

  describe('Content Rendering', () => {
    it('should render complex children', () => {
      render(
        <Card>
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        </Card>
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('should render React elements in footer', () => {
      render(
        <Card
          footer={
            <div>
              <button>Button 1</button>
              <button>Button 2</button>
            </div>
          }
        >
          Content
        </Card>
      );

      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
    });
  });
});
