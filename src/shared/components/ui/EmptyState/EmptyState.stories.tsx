import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: '📭',
    title: 'No hay mensajes',
    description: 'Aún no tienes mensajes en tu bandeja de entrada.',
  },
};

export const WithAction: Story = {
  args: {
    icon: '📝',
    title: 'Sin registros',
    description: 'Comienza creando tu primer registro.',
    action: {
      label: 'Crear Registro',
      onClick: () => alert('Acción ejecutada'),
    },
  },
};

export const NoData: Story = {
  args: {
    icon: '🔍',
    title: 'Sin resultados',
    description: 'No se encontraron resultados para tu búsqueda.',
  },
};

export const NoFavorites: Story = {
  args: {
    icon: '⭐',
    title: 'Sin favoritos',
    description: 'Aún no has agregado ningún elemento a favoritos.',
    action: {
      label: 'Explorar',
      onClick: () => alert('Explorando...'),
    },
  },
};

export const NoNetwork: Story = {
  args: {
    icon: '📡',
    title: 'Sin conexión',
    description: 'Verifica tu conexión a internet e intenta nuevamente.',
    action: {
      label: 'Reintentar',
      onClick: () => alert('Reintentando...'),
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <EmptyState
        icon="📭"
        title="No hay mensajes"
        description="Aún no tienes mensajes en tu bandeja de entrada."
      />
      <EmptyState
        icon="📝"
        title="Sin registros"
        description="Comienza creando tu primer registro."
        action={{
          label: 'Crear Registro',
          onClick: () => alert('Acción ejecutada'),
        }}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
