import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../Button';
import { Toast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="success-1"
        variant="success"
        title="Éxito"
        message="La operación se completó correctamente."
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const Error: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="error-1"
        variant="error"
        title="Error"
        message="Ocurrió un error al procesar la solicitud."
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="warning-1"
        variant="warning"
        title="Advertencia"
        message="Verifique la información antes de continuar."
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const Info: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="info-1"
        variant="info"
        title="Información"
        message="Tiene 3 notificaciones pendientes."
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const WithoutTitle: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="no-title-1"
        variant="info"
        message="Este es un toast sin título."
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const CustomDuration: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="custom-duration-1"
        variant="success"
        title="Auto-cierre en 10 segundos"
        message="Este toast se cerrará automáticamente después de 10 segundos."
        duration={10000}
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const NoAutoDismiss: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return <Button onClick={() => setIsVisible(true)}>Mostrar Toast</Button>;

    return (
      <Toast
        id="no-dismiss-1"
        variant="info"
        title="No se cierra automáticamente"
        message="Debes cerrar este toast manualmente."
        duration={0}
        onClose={() => setIsVisible(false)}
      />
    );
  },
};

export const ToastContainer: Story = {
  render: () => {
    const [toasts, setToasts] = useState([
      { id: '1', variant: 'success' as const, title: 'Éxito', message: 'Operación completada.' },
      { id: '2', variant: 'error' as const, title: 'Error', message: 'Algo salió mal.' },
      { id: '3', variant: 'warning' as const, title: 'Advertencia', message: 'Verifique sus datos.' },
    ]);

    const removeToast = (id: string) => {
      setToasts(toasts.filter(t => t.id !== id));
    };

    if (toasts.length === 0) {
      return <Button onClick={() => window.location.reload()}>Restaurar Toasts</Button>;
    }

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllVariants: Story = {
  render: () => {
    const [activeVariant, setActiveVariant] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const variants: Array<{ key: 'success' | 'error' | 'warning' | 'info'; label: string }> = [
      { key: 'success', label: 'Éxito' },
      { key: 'error', label: 'Error' },
      { key: 'warning', label: 'Advertencia' },
      { key: 'info', label: 'Info' },
    ];

    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {variants.map((variant) => (
            <Button
              key={variant.key}
              variant={activeVariant === variant.key ? 'primary' : 'outline'}
              onClick={() => setActiveVariant(variant.key)}
            >
              {variant.label}
            </Button>
          ))}
        </div>
        <div className="fixed top-4 right-4 z-50">
          <Toast
            id="variant-demo"
            variant={activeVariant}
            title={variants.find(v => v.key === activeVariant)!.label}
            message={`Este es un ejemplo de toast de tipo ${activeVariant}.`}
            onClose={() => {}}
            duration={0}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
