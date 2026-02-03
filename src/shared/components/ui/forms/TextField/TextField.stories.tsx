import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Ingrese su nombre',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Correo Electrónico',
    type: 'email',
    placeholder: 'usuario@ejemplo.com',
    helperText: 'Usaremos este correo para enviarle notificaciones.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Ingrese su contraseña',
    error: 'La contraseña debe tener al menos 8 caracteres.',
  },
};

export const Required: Story = {
  args: {
    label: 'Apellido',
    placeholder: 'Ingrese su apellido',
    required: true,
    helperText: 'Campo obligatorio',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Documento de Identidad',
    placeholder: 'Ingrese su DNI',
    disabled: true,
    helperText: 'Este campo está deshabilitado.',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Dirección',
    placeholder: 'Ingrese su dirección completa',
    fullWidth: true,
    helperText: 'Incluya calle, número y código postal.',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md p-4">
      <TextField
        label="Nombre"
        placeholder="Ingrese su nombre"
        helperText="Estado normal"
      />
      <TextField
        label="Correo Electrónico"
        type="email"
        placeholder="usuario@ejemplo.com"
        required
        helperText="Campo requerido"
      />
      <TextField
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
        error="La contraseña es muy corta"
      />
      <TextField
        label="Teléfono"
        placeholder="+1 234 567 8900"
        disabled
        helperText="Campo deshabilitado"
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="max-w-md p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Registro de Usuario</h2>
      <TextField
        label="Nombre Completo"
        placeholder="Juan Pérez"
        required
      />
      <TextField
        label="Correo Electrónico"
        type="email"
        placeholder="juan@ejemplo.com"
        required
        helperText="Te enviaremos un correo de confirmación"
      />
      <TextField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        required
      />
      <button
        type="submit"
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Registrarse
      </button>
    </form>
  ),
  parameters: {
    layout: 'centered',
  },
};
