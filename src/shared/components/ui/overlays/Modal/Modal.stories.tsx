import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../Button';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal de Ejemplo"
        >
          <p>Este es el contenido del modal.</p>
        </Modal>
      </div>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal Pequeño</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Pequeño"
          size="sm"
        >
          <p>Este es un modal de tamaño pequeño.</p>
        </Modal>
      </div>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal Grande</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Grande"
          size="lg"
        >
          <div className="space-y-4">
            <p>Este es un modal de tamaño grande con más contenido.</p>
            <p>Puedes agregar más información aquí.</p>
            <ul className="list-disc pl-5">
              <li>Elemento de lista 1</li>
              <li>Elemento de lista 2</li>
              <li>Elemento de lista 3</li>
            </ul>
          </div>
        </Modal>
      </div>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal sin Botón de Cerrar"
          showCloseButton={false}
        >
          <p>Este modal no tiene el botón X en la esquina.</p>
          <p>Puedes cerrarlo presionando Escape o haciendo clic fuera.</p>
        </Modal>
      </div>
    );
  },
};

export const WithoutBackdrop: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal sin Fondo Oscuro"
          hasBackdrop={false}
        >
          <p>Este modal no tiene el fondo oscuro semitransparente.</p>
        </Modal>
      </div>
    );
  },
};

export const WithoutTitle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <p>Este modal no tiene título.</p>
        </Modal>
      </div>
    );
  },
};

export const ConfirmationDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button variant="error" onClick={() => setIsOpen(true)}>
          Eliminar Elemento
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const FormModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir Formulario</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Nuevo Usuario"
          size="lg"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ingrese el nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  },
};
