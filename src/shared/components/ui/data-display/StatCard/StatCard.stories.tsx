import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Ventas Totales',
    value: '$45,231',
    icon: '💰',
  },
};

export const WithPositiveTrend: Story = {
  args: {
    title: 'Ventas Totales',
    value: '$45,231',
    change: 12.5,
    trend: 'up',
    icon: '💰',
  },
};

export const WithNegativeTrend: Story = {
  args: {
    title: 'Tasa de Rebote',
    value: '42.8%',
    change: 3.2,
    trend: 'down',
    icon: '📉',
  },
};

export const WithNeutralTrend: Story = {
  args: {
    title: 'Usuarios Activos',
    value: '2,543',
    change: 0.5,
    trend: 'neutral',
    icon: '👥',
  },
};

export const Loading: Story = {
  args: {
    title: 'Cargando...',
    value: '---',
    loading: true,
  },
};

export const WithoutChange: Story = {
  args: {
    title: 'Nuevos Usuarios',
    value: '1,234',
    icon: '👤',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard
        title="Ventas Totales"
        value="$45,231"
        change={12.5}
        trend="up"
        icon="💰"
      />
      <StatCard
        title="Pedidos"
        value="356"
        change={8.2}
        trend="up"
        icon="📦"
      />
      <StatCard
        title="Tasa de Rebote"
        value="42.8%"
        change={3.2}
        trend="down"
        icon="📉"
      />
      <StatCard
        title="Usuarios Activos"
        value="2,543"
        change={0.5}
        trend="neutral"
        icon="👥"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const DashboardGrid: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard de Ventas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos del Mes"
          value="$124,563"
          change={18.2}
          trend="up"
          icon="💵"
        />
        <StatCard
          title="Pedidos Nuevos"
          value="1,245"
          change={12.5}
          trend="up"
          icon="🛒"
        />
        <StatCard
          title="Clientes Activos"
          value="892"
          change={5.3}
          trend="up"
          icon="👥"
        />
        <StatCard
          title="Devoluciones"
          value="23"
          change={-8.7}
          trend="up"
          icon="↩️"
        />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">Métricas de Satisfacción</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="NPS Score"
          value="72"
          change={4.1}
          trend="up"
          icon="⭐"
        />
        <StatCard
          title="Satisfacción CSAT"
          value="4.7/5"
          change={2.3}
          trend="up"
          icon="😊"
        />
        <StatCard
          title="Tiempo de Respuesta"
          value="2.3h"
          change={-15.2}
          trend="up"
          icon="⏱️"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <StatCard
        title="Cargando métrica 1"
        value="---"
        loading
      />
      <StatCard
        title="Cargando métrica 2"
        value="---"
        loading
      />
      <StatCard
        title="Cargando métrica 3"
        value="---"
        loading
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const DifferentIcons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <StatCard
        title="Ventas"
        value="$12,345"
        change={15.3}
        trend="up"
        icon="💰"
      />
      <StatCard
        title="Usuarios"
        value="5,678"
        change={8.7}
        trend="up"
        icon="👥"
      />
      <StatCard
        title="Tasa de Conversión"
        value="3.2%"
        change={-1.2}
        trend="down"
        icon="📊"
      />
      <StatCard
        title="Tickets de Soporte"
        value="234"
        change={-12.5}
        trend="up"
        icon="🎫"
      />
      <StatCard
        title="Proyectos Activos"
        value="45"
        change={5.8}
        trend="up"
        icon="🚀"
      />
      <StatCard
        title="Tasa de Retención"
        value="87%"
        change={2.1}
        trend="up"
        icon="💎"
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
