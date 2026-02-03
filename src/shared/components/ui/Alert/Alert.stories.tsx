import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Éxito',
    description: 'La operación se completó correctamente.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Advertencia',
    description: 'Tenga cuidado al continuar con esta acción.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'Ocurrió un error al procesar su solicitud.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Información',
    description: 'Tenga en cuenta esta información importante.',
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    description: 'Esta es una alerta sin título.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Alert variant="success" title="Éxito" description="Operación completada con éxito." />
      <Alert variant="warning" title="Advertencia" description="Verifique los datos antes de continuar." />
      <Alert variant="error" title="Error" description="No se pudo completar la operación." />
      <Alert variant="info" title="Info" description="Información adicional importante." />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
