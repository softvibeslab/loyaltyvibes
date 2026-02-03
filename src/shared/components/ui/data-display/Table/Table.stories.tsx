import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table<UserData>>;

export default meta;
type Story = StoryObj<typeof meta<UserData>>;

const sampleData: UserData[] = [
  { id: 1, name: 'María García', email: 'maria@ejemplo.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Usuario', status: 'Activo' },
  { id: 3, name: 'Ana López', email: 'ana@ejemplo.com', role: 'Usuario', status: 'Inactivo' },
  { id: 4, name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', role: 'Editor', status: 'Activo' },
  { id: 5, name: 'Laura Martínez', email: 'laura@ejemplo.com', role: 'Usuario', status: 'Pendiente' },
];

const columns = [
  { id: 'name', label: 'Nombre', key: 'name' as keyof UserData },
  { id: 'email', label: 'Correo Electrónico', key: 'email' as keyof UserData },
  { id: 'role', label: 'Rol', key: 'role' as keyof UserData },
  { id: 'status', label: 'Estado', key: 'status' as keyof UserData },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleData,
  },
};

export const Sortable: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Nombre', key: 'name', sortable: true },
      { id: 'email', label: 'Correo Electrónico', key: 'email', sortable: true },
      { id: 'role', label: 'Rol', key: 'role', sortable: true },
      { id: 'status', label: 'Estado', key: 'status', sortable: true },
    ],
    data: sampleData,
    sortable: true,
  },
};

export const WithoutZebraStripes: Story = {
  args: {
    columns,
    data: sampleData,
    zebraStripes: false,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No hay usuarios registrados',
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: '🔍 No se encontraron resultados para tu búsqueda',
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Nombre', key: 'name' },
      { id: 'email', label: 'Correo Electrónico', key: 'email' },
      {
        id: 'role',
        label: 'Rol',
        render: (value: unknown) => {
          const role = String(value);
          const colors: Record<string, string> = {
            Administrador: 'bg-purple-100 text-purple-800',
            Editor: 'bg-blue-100 text-blue-800',
            Usuario: 'bg-gray-100 text-gray-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100'}`}>
              {role}
            </span>
          );
        },
      },
      {
        id: 'status',
        label: 'Estado',
        render: (value: unknown) => {
          const status = String(value);
          const colors: Record<string, string> = {
            Activo: 'bg-emerald-100 text-emerald-800',
            Inactivo: 'bg-red-100 text-red-800',
            Pendiente: 'bg-yellow-100 text-yellow-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
              {status}
            </span>
          );
        },
      },
    ],
    data: sampleData,
  },
};

export const LargeDataset: Story = {
  args: {
    columns,
    data: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Usuario ${i + 1}`,
      email: `usuario${i + 1}@ejemplo.com`,
      role: i % 3 === 0 ? 'Administrador' : i % 2 === 0 ? 'Editor' : 'Usuario',
      status: i % 4 === 0 ? 'Inactivo' : 'Activo',
    })),
    sortable: true,
  },
};

export const ProductTable: Story = {
  args: {
    columns: [
      {
        id: 'product',
        label: 'Producto',
        render: (_, row) => (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl mr-3">
              📦
            </div>
            <div>
              <div className="font-medium">{(row as any).name}</div>
              <div className="text-xs text-gray-500">SKU: {(row as any).sku}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'price',
        label: 'Precio',
        render: (value) => `$${Number(value).toFixed(2)}`,
        key: 'price',
      },
      {
        id: 'stock',
        label: 'Stock',
        render: (value) => {
          const stock = Number(value);
          const color = stock > 50 ? 'text-emerald-600' : stock > 10 ? 'text-yellow-600' : 'text-red-600';
          return <span className={`font-medium ${color}`}>{stock} unidades</span>;
        },
        key: 'stock',
      },
      {
        id: 'category',
        label: 'Categoría',
        key: 'category',
      },
    ],
    data: [
      { name: 'Laptop HP', sku: 'LAP-001', price: 899.99, stock: 45, category: 'Electrónica' },
      { name: 'Mouse Inalámbrico', sku: 'MOU-002', price: 29.99, stock: 120, category: 'Accesorios' },
      { name: 'Teclado Mecánico', sku: 'KEY-003', price: 149.99, stock: 8, category: 'Accesorios' },
      { name: 'Monitor 24"', sku: 'MON-004', price: 299.99, stock: 23, category: 'Electrónica' },
      { name: 'Silla Ergonómica', sku: 'CHA-005', price: 449.99, stock: 15, category: 'Muebles' },
    ],
    sortable: true,
  },
};
