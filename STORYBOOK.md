# Storybook Setup Guide

Guía opcional para configurar Storybook con la biblioteca de componentes LoyaltyVibes UI.

---

## ¿Por qué Storybook?

Storybook es una herramienta para desarrollar componentes UI de manera aislada. Permite:
- Desarrollar componentes sin dependencias de la aplicación
- Documentar componentes con ejemplos interactivos
- Probar componentes en diferentes estados y variantes
- Compartir componentes con el equipo de diseño
- Realizar testing visual y regresión

---

## Instalación

```bash
# Instalar Storybook en el proyecto
npx storybook@latest init

# Responder "Yes" a la instalación automática
# Storybook detectará que es un proyecto +Vite con TypeScript
```

Durante la instalación, Storybook:
1. Instalará las dependencias necesarias
2. Creará la carpeta `.storybook` con la configuración
3. Creará la carpeta `src/stories` con ejemplos
4. Agregará scripts a `package.json`

---

## Configuración

### 1. Archivo `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // Accesibilidad
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true;
      },
    },
  },
};

export default config;
```

### 2. Archivo `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/index.css'; // Importar Tailwind CSS

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
```

---

## Stories de Componentes

### Story para Button

Crea el archivo `src/shared/components/ui/Button/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variante Primaria
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Variante Secundaria
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Variante Outline
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// Variante Ghost
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// Todos los Tamaños
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Estados
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Todos los Variantes
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
```

### Story para TextField

Crea el archivo `src/shared/components/ui/forms/TextField/TextField.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Components/Forms/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Básico
export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'ejemplo@correo.com',
  },
};

// Con Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Nombre',
    helperText: 'Ingresa tu nombre completo',
    placeholder: 'Juan Pérez',
  },
};

// Con Error
export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Email inválido',
    placeholder: 'ejemplo@correo.com',
  },
};

// Requerido
export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: '••••••••',
  },
};

// Deshabilitado
export const Disabled: Story = {
  args: {
    label: 'Teléfono',
    type: 'tel',
    disabled: true,
    placeholder: '+52 55 1234 5678',
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: 'Dirección',
    fullWidth: true,
    placeholder: 'Calle, número, colonia...',
  },
};

// Estados de Validación
export const ValidationStates: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <TextField
        label="Nombre"
        helperText="Campo válido"
        placeholder="Juan Pérez"
      />
      <TextField
        label="Email"
        error="Email inválido"
        placeholder="ejemplo@correo.com"
      />
    </div>
  ),
};
```

### Story para Modal

Crea el archivo `src/shared/components/ui/overlays/Modal/Modal.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../../Button/Button';

const meta = {
  title: 'Components/Overlays/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showCloseButton: {
      control: 'boolean',
    },
    hasBackdrop: {
      control: 'boolean',
    },
    closeOnBackdropClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Modal Controlado
export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Controlado"
        >
          <div className="space-y-4">
            <p>Este es un modal controlado por estado.</p>
            <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
          </div>
        </Modal>
      </>
    );
  },
};

// Tamaños
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <div className="flex gap-2">
          <Button onClick={() => { setSize('sm'); setIsOpen(true); }}>
            Small
          </Button>
          <Button onClick={() => { setSize('md'); setIsOpen(true); }}>
            Medium
          </Button>
          <Button onClick={() => { setSize('lg'); setIsOpen(true); }}>
            Large
          </Button>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Modal ${size.toUpperCase()}`}
          size={size}
        >
          <p>Contenido del modal {size}...</p>
        </Modal>
      </>
    );
  },
};

// Sin Botón de Cerrar
export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Sin Botón de Cerrar"
          showCloseButton={false}
        >
          <div className="space-y-4">
            <p>Este modal no tiene botón de cerrar.</p>
            <p>Debes cerrarlo con ESC o haciendo clic fuera.</p>
          </div>
        </Modal>
      </>
    );
  },
};

// Sin Backdrop
export const WithoutBackdrop: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir</Button>
        <div className="relative">
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Sin Backdrop"
            hasBackdrop={false}
          >
            <p>Este modal no tiene fondo oscuro.</p>
          </Modal>
        </div>
      </>
    );
  },
};

// Contenido Complejo
export const ComplexContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Formulario</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Editar Usuario"
          size="lg"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="juan@example.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button>Guardar</Button>
            </div>
          </form>
        </Modal>
      </>
    );
  },
};
```

### Story para Alert

Crea el archivo `src/shared/components/ui/Alert/Alert.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Todas las Variantes
export const AllVariants: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Alert
        variant="success"
        title="¡Éxito!"
        description="Tu cambios han sido guardados correctamente."
      />
      <Alert
        variant="warning"
        title="Advertencia"
        description="Tu sesión expirará en 5 minutos."
      />
      <Alert
        variant="error"
        title="Error"
        description="No se pudo conectar con el servidor."
      />
      <Alert
        variant="info"
        description="Tienes 3 notificaciones sin leer."
      />
    </div>
  ),
};

// Solo Success
export const Success: Story = {
  args: {
    variant: 'success',
    title: '¡Éxito!',
    description: 'Operación completada exitosamente.',
  },
};

// Solo Warning
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Precaución',
    description: 'Esta acción puede tener consecuencias.',
  },
};

// Solo Error
export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'Algo salió mal. Inténtalo de nuevo.',
  },
};

// Solo Info
export const Info: Story = {
  args: {
    variant: 'info',
    description: 'Información adicional importante.',
  },
};

// Sin Título
export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    description: 'Este mensaje no tiene título.',
  },
};
```

---

## Decorators

### Decorator para Tailwind CSS

Crea `.storybook/decorators.tsx`:

```tsx
import type { Decorator } from '@storybook/react';
import '../src/index.css';

export const withTailwind: Decorator = (Story) => {
  return (
    <div className="p-4">
      <Story />
    </div>
  );
};
```

### Decorator para React Query

```tsx
import type { Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const withQuery: Decorator = (Story) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
```

---

## Addons Recomendados

Instalar addons esenciales:

```bash
npm install -D @storybook/addon-a11y @storybook/addon-themes @storybook/addon-interactions
```

### Configuración de Addons

En `.storybook/main.ts`:

```typescript
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-a11y',        // Accesibilidad
  '@storybook/addon-themes',       // Temas
],
```

---

## Ejecutar Storybook

```bash
# Modo desarrollo
npm run storybook

# Build para producción
npm run build-storybook

# Ejecutar build de producción
npx storybook build
```

Accede a Storybook en `http://localhost:6006`

---

## Script de Package.json

Asegúrate de tener estos scripts en `package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Documentación Automática

Storybook genera documentación automáticamente con `@storybook/addon-essentials`:

- **Controls Panel** - Para modificar props en tiempo real
- **Actions Panel** - Para ver eventos disparados
- **Docs Page** - Documentación autogenerada con `tags: ['autodocs']`
- **Accessibility Panel** - Para verificar problemas de accesibilidad

---

## Testing Visual

Para testing visual, integra Chromatic o Percy:

```bash
npm install -D chromatic
```

```bash
# Ejecutar Chromatic
npx chromatic --project-token=YOUR_TOKEN
```

---

## Tips y Mejores Prácticas

### 1. Organiza Stories por Jerarquía

```
Components/
├── Button/
│   ├── Basic.stories.tsx
│   ├── Variants.stories.tsx
│   └── States.stories.tsx
├── Forms/
│   ├── TextField.stories.tsx
│   └── Select.stories.tsx
└── Overlays/
    └── Modal.stories.tsx
```

### 2. Usa Auto-Docs

```tsx
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'], // Genera documentación automáticamente
} satisfies Meta<typeof Button>;
```

### 3. Documenta Todos los Estados

```tsx
export const States: Story = {
  render: () => (
    <div>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

### 4. Usa Parameters para Layout

```tsx
export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: {
    layout: 'padded', // o 'centered', 'fullscreen'
  },
};
```

### 5. Agrega Snippets de Código

```tsx
export const Usage: Story = {
  render: () => <Button variant="primary">Click me</Button>,
  parameters: {
    docs: {
      source: {
        code: `
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
        `,
      },
    },
  },
};
```

---

## Recursos

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- [Addon Essentials](https://storybook.js.org/docs/essentials/introduction)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)

---

**Última Actualización:** 2026-02-03
**Versión de Storybook Compatible:** 8.x
