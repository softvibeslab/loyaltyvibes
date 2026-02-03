import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar Component', () => {
  describe('Rendering with Image', () => {
    it('should render image when src is provided', async () => {
      const { container } = render(
        <Avatar src="/avatar.png" alt="User Avatar" />
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/avatar.png');
      expect(img).toHaveAttribute('alt', 'User Avatar');
    });

    it('should show fallback when image fails to load', async () => {
      const { container } = render(
        <Avatar src="/invalid.png" fallback="JD" />
      );

      const img = container.querySelector('img');

      // Simular error de carga
      if (img) {
        img.dispatchEvent(new Event('error'));
      }

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });

    it('should have lazy loading enabled', () => {
      const { container } = render(<Avatar src="/avatar.png" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Fallback Rendering', () => {
    it('should render fallback when no src provided', () => {
      render(<Avatar fallback="JD" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should use default fallback "?"', () => {
      render(<Avatar />);

      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('should generate initials from full name', () => {
      render(<Avatar fallback="John Doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should truncate to 2 characters', () => {
      render(<Avatar fallback="ABC" />);

      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('should uppercase fallback text', () => {
      render(<Avatar fallback="jd" />);

      const text = screen.getByText('JD');
      expect(text).toBeInTheDocument();
    });

    it('should have colored background for fallback', () => {
      const { container } = render(<Avatar fallback="JD" />);

      const avatar = container.firstChild as HTMLElement;
      // Should have one of the background colors
      const hasColor = Array.from(avatar.classList).some((cls) =>
        cls.startsWith('bg-') && cls.endsWith('-500')
      );
      expect(hasColor).toBe(true);
    });

    it('should have white text for fallback', () => {
      const { container } = render(<Avatar fallback="JD" />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('text-white');
    });
  });

  describe('Sizes', () => {
    it('should render small size (32px)', () => {
      const { container } = render(<Avatar size="sm" />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('w-8');
      expect(avatar).toHaveClass('h-8');
    });

    it('should render medium size (40px) by default', () => {
      const { container } = render(<Avatar />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('w-10');
      expect(avatar).toHaveClass('h-10');
    });

    it('should render large size (48px)', () => {
      const { container } = render(<Avatar size="lg" />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('w-12');
      expect(avatar).toHaveClass('h-12');
    });

    it('should render extra large size (64px)', () => {
      const { container } = render(<Avatar size="xl" />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('w-16');
      expect(avatar).toHaveClass('h-16');
    });

    it('should adjust font size based on avatar size', () => {
      const { container: smContainer } = render(<Avatar size="sm" />);
      const { container: mdContainer } = render(<Avatar size="md" />);
      const { container: lgContainer } = render(<Avatar size="lg" />);
      const { container: xlContainer } = render(<Avatar size="xl" />);

      expect(smContainer.firstChild).toHaveClass('text-xs');
      expect(mdContainer.firstChild).toHaveClass('text-sm');
      expect(lgContainer.firstChild).toHaveClass('text-base');
      expect(xlContainer.firstChild).toHaveClass('text-lg');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Avatar className="custom-class" />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('custom-class');
    });

    it('should have rounded-full shape', () => {
      const { container } = render(<Avatar />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('rounded-full');
    });

    it('should have inline-flex display', () => {
      const { container } = render(<Avatar />);

      const avatar = container.firstChild as HTMLElement;
      expect(avatar).toHaveClass('inline-flex');
    });

    it('should have object-cover for image', () => {
      const { container } = render(<Avatar src="/avatar.png" />);

      const img = container.querySelector('img');
      expect(img).toHaveClass('object-cover');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label with alt text', () => {
      const { container } = render(<Avatar alt="User Name" />);

      const avatar = container.querySelector('span');
      expect(avatar).toHaveAttribute('aria-label', 'User Name');
    });

    it('should have default aria-label', () => {
      const { container } = render(<Avatar />);

      const avatar = container.querySelector('span');
      expect(avatar).toHaveAttribute('aria-label', 'Avatar');
    });

    it('should pass alt to img element', () => {
      const { container } = render(
        <Avatar src="/avatar.png" alt="Profile Picture" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Profile Picture');
    });
  });

  describe('Background Colors', () => {
    it('should generate consistent colors for same string', () => {
      const { container: container1 } = render(<Avatar fallback="John" />);
      const { container: container2 } = render(<Avatar fallback="John" />);

      const avatar1 = container1.firstChild as HTMLElement;
      const avatar2 = container2.firstChild as HTMLElement;

      const color1 = Array.from(avatar1.classList).find((cls) =>
        cls.startsWith('bg-') && cls.endsWith('-500')
      );
      const color2 = Array.from(avatar2.classList).find((cls) =>
        cls.startsWith('bg-') && cls.endsWith('-500')
      );

      expect(color1).toBe(color2);
    });

    it('should generate different colors for different strings', () => {
      const { container: container1 } = render(<Avatar fallback="John" />);
      const { container: container2 } = render(<Avatar fallback="Jane" />);

      const avatar1 = container1.firstChild as HTMLElement;
      const avatar2 = container2.firstChild as HTMLElement;

      const color1 = Array.from(avatar1.classList).find((cls) =>
        cls.startsWith('bg-') && cls.endsWith('-500')
      );
      const color2 = Array.from(avatar2.classList).find((cls) =>
        cls.startsWith('bg-') && cls.endsWith('-500')
      );

      expect(color1).not.toBe(color2);
    });
  });

  describe('State Transitions', () => {
    it('should show fallback initially before image loads', () => {
      const { container } = render(
        <Avatar src="/avatar.png" fallback="JD" />
      );

      // Initially should show fallback
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should hide fallback when image loads', async () => {
      const { container } = render(
        <Avatar src="/avatar.png" fallback="JD" />
      );

      const img = container.querySelector('img');

      if (img) {
        // Simular carga exitosa
        img.dispatchEvent(new Event('load'));
      }

      await waitFor(() => {
        const imgElement = container.querySelector('img');
        expect(imgElement).toHaveClass('inline-block');
      });
    });
  });
});
