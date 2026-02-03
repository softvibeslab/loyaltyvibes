import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      {
        id: 'tab1',
        label: 'Inicio',
        content: <div className="p-4">Contenido de la pestaña Inicio</div>,
      },
      {
        id: 'tab2',
        label: 'Perfil',
        content: <div className="p-4">Contenido de la pestaña Perfil</div>,
      },
      {
        id: 'tab3',
        label: 'Configuración',
        content: <div className="p-4">Contenido de la pestaña Configuración</div>,
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      {
        id: 'home',
        label: 'Inicio',
        icon: '🏠',
        content: <div className="p-4">Bienvenido a la página de inicio</div>,
      },
      {
        id: 'messages',
        label: 'Mensajes',
        icon: '💬',
        content: <div className="p-4">Tus mensajes y notificaciones</div>,
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: '⚙️',
        content: <div className="p-4">Ajustes y preferencias</div>,
      },
    ],
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        id: 'tab1',
        label: 'Activas',
        content: <div className="p-4">Tareas activas y pendientes</div>,
      },
      {
        id: 'tab2',
        label: 'Completadas',
        content: <div className="p-4">Tareas finalizadas</div>,
      },
      {
        id: 'tab3',
        label: 'Archivadas',
        content: <div className="p-4">Tareas archivadas</div>,
        disabled: true,
      },
    ],
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    tabs: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
            <p>Vista general de métricas y estadísticas.</p>
          </div>
        ),
      },
      {
        id: 'analytics',
        label: 'Analíticas',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Analíticas</h3>
            <p>Análisis detallado de datos y tendencias.</p>
          </div>
        ),
      },
      {
        id: 'reports',
        label: 'Reportes',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Reportes</h3>
            <p>Reportes generados y exportaciones.</p>
          </div>
        ),
      },
    ],
  },
};

export const WithDefaultTab: Story = {
  args: {
    defaultTab: 'tab2',
    tabs: [
      {
        id: 'tab1',
        label: 'Primera',
        content: <div className="p-4">Este no es el tab por defecto</div>,
      },
      {
        id: 'tab2',
        label: 'Segunda (Por Defecto)',
        content: <div className="p-4">Este es el tab que se muestra al inicio</div>,
      },
      {
        id: 'tab3',
        label: 'Tercera',
        content: <div className="p-4">Este tampoco es el tab por defecto</div>,
      },
    ],
  },
};

export const WithRichContent: Story = {
  args: {
    tabs: [
      {
        id: 'features',
        label: 'Características',
        content: (
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Características del Producto</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Interfaz intuitiva y fácil de usar</li>
              <li>Alto rendimiento y velocidad</li>
              <li>Compatible con múltiples dispositivos</li>
              <li>Soporte 24/7</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'pricing',
        label: 'Precios',
        content: (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Planes y Precios</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Básico</h4>
                <p className="text-2xl font-bold">$9/mes</p>
              </div>
              <div className="p-4 border rounded-lg border-emerald-500">
                <h4 className="font-semibold">Pro</h4>
                <p className="text-2xl font-bold">$29/mes</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Enterprise</h4>
                <p className="text-2xl font-bold">$99/mes</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'contact',
        label: 'Contacto',
        content: (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <p className="mb-2">📧 Email: soporte@ejemplo.com</p>
            <p className="mb-2">📞 Teléfono: +1 234 567 8900</p>
            <p>📍 Dirección: Calle Principal 123</p>
          </div>
        ),
      },
    ],
  },
};

export const ProductDetails: Story = {
  args: {
    tabs: [
      {
        id: 'description',
        label: 'Descripción',
        icon: '📝',
        content: (
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">Descripción del Producto</h3>
            <p>Este producto ofrece una solución completa para tus necesidades. Fabricado con materiales de alta calidad y diseñado para durar.</p>
            <p>Incluye características avanzadas como sincronización en la nube, modo offline y soporte multiplataforma.</p>
          </div>
        ),
      },
      {
        id: 'specs',
        label: 'Especificaciones',
        icon: '⚙️',
        content: (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Especificaciones Técnicas</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Material</td>
                  <td className="py-2">Aluminio de grado aeroespacial</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Dimensiones</td>
                  <td className="py-2">25 x 15 x 5 cm</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Peso</td>
                  <td className="py-2">450g</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Garantía</td>
                  <td className="py-2">2 años</td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: 'reviews',
        label: 'Reseñas',
        icon: '⭐',
        content: (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-lg">Reseñas de Clientes</h3>
            <div className="border-b pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">María García</span>
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600">Excelente producto, llegó rápido y en perfectas condiciones.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Juan Pérez</span>
                <span className="text-yellow-500">★★★★☆</span>
              </div>
              <p className="text-sm text-gray-600">Muy bueno, solo le daría 5 estrellas si tuviera más colores.</p>
            </div>
          </div>
        ),
      },
    ],
  },
};
