# Catálogo Completo de Componentes UI

Documentación completa de los 25 componentes de LoyaltyVibes UI con props, ejemplos de uso y notas de accesibilidad.

---

## Índice

- [Fase 1 - Componentes Base](#fase-1---componentes-base)
- [Fase 2 - Formularios y Overlays](#fase-2---formularios-y-overlays)
- [Fase 3 - Navegación y Datos](#fase-3---navegación-y-datos)

---

## Fase 1 - Componentes Base

### Button

Componente de botón con múltiples variantes visuales y estados.

**Import:**
```tsx
import { Button } from '@/shared/components/ui/Button';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Variante visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Estado de carga con spinner |
| `fullWidth` | `boolean` | `false` | Ocupar todo el ancho disponible |
| `children` | `ReactNode` | - | Contenido del botón |
| `onClick` | `() => void` | - | Manejador de clic |
| `className` | `string` | `''` | Clases CSS adicionales |

**Variantes:**
- `primary` - Color esmeralda para acciones principales
- `secondary` - Color púrpura para acciones secundarias
- `outline` - Borde gris para acciones menos prominentes
- `ghost` - Transparente para acciones sutiles

**Ejemplo de Uso:**
```tsx
import { Button } from '@/shared/components/ui/Button';

function Example() {
  return (
    <div className="space-x-2">
      <Button variant="primary" onClick={() => console.log('Click')}>
        Primary
      </Button>

      <Button variant="secondary">
        Secondary
      </Button>

      <Button variant="outline" disabled>
        Disabled
      </Button>

      <Button variant="primary" loading>
        Loading...
      </Button>

      <Button variant="ghost" size="sm">
        Small
      </Button>

      <Button variant="primary" fullWidth>
        Full Width
      </Button>
    </div>
  );
}
```

**Accesibilidad:**
- Contraste de color WCAG 2.1 AA (≥4.5:1)
- Navegación completa por teclado (Tab, Enter, Space)
- Indicadores de foco visibles
- `aria-busy` para estado de carga
- Previene clic cuando está `disabled` o `loading`

**Mejores Prácticas:**
✓ Usa `variant="primary"` para la acción principal del formulario
✓ Usa `loading` durante operaciones asíncronas
✓ Proporciona texto descriptivo en el botón
✗ Evita botones sin texto o con iconos únicamente (usa aria-label si es necesario)

---

### Spinner

Indicador de carga animado.

**Import:**
```tsx
import { Spinner } from '@/shared/components/ui/Spinner';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md'` | `'md'` | Tamaño del spinner |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Spinner } from '@/shared/components/ui/Spinner';

function Example() {
  return (
    <div>
      <Spinner size="sm" />
      <Spinner size="md" />
    </div>
  );
}
```

**Accesibilidad:**
- `role="status"` para lectores de pantalla
- `aria-label="Loading"` para identificar el estado
- `aria-live="polite"` para anunciar cambios de estado

---

### Skeleton

Placeholder de carga con efecto shimmer para contenido que está cargando.

**Import:**
```tsx
import { Skeleton } from '@/shared/components/ui/Skeleton';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'card' \| 'text' \| 'avatar' \| 'custom'` | `'text'` | Variante de esqueleto |
| `width` | `string` | - | Ancho personalizado (solo para `custom`) |
| `height` | `string` | - | Alto personalizado (solo para `custom`) |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Skeleton } from '@/shared/components/ui/Skeleton';

function Example() {
  return (
    <div className="space-y-4">
      {/* Tarjeta de carga */}
      <Skeleton variant="card" />

      {/* Líneas de texto */}
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-2/3" />
      </div>

      {/* Avatar */}
      <Skeleton variant="avatar" />

      {/* Dimensiones personalizadas */}
      <Skeleton variant="custom" width="200px" height="100px" />
    </div>
  );
}
```

**Accesibilidad:**
- `role="status"` para lectores de pantalla
- `aria-label="Loading"` para identificar el estado
- `aria-live="polite"` para anunciar cambios

---

### EmptyState

Componente para mostrar estados vacíos con icono, título, descripción y acción opcional.

**Import:**
```tsx
import { EmptyState } from '@/shared/components/ui/EmptyState';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `icon` | `string` | - | Icono (emoji) para mostrar |
| `title` | `string` | - | Título del estado vacío |
| `description` | `string` | - | Descripción del estado vacío |
| `action` | `{ label: string; onClick: () => void }` | - | Botón de acción opcional |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { EmptyState } from '@/shared/components/ui/EmptyState';

function Example() {
  return (
    <EmptyState
      icon="📭"
      title="No hay mensajes"
      description="Aún no tienes mensajes en tu bandeja de entrada."
      action={{
        label: 'Crear primer mensaje',
        onClick: () => console.log('Crear mensaje'),
      }}
    />
  );
}
```

**Accesibilidad:**
- `role="status"` para lectores de pantalla
- `aria-live="polite"` para anunciar cambios
- Icono con `role="img"` y `aria-label`

**Iconos Comunes:**
- 📭 Sin mensajes
- 🔍 Sin resultados de búsqueda
- 📂 Sin archivos
- 👤 Sin usuarios
- 🛒 Carrito vacío

---

### Alert

Componente para mostrar mensajes de retroalimentación inline con variantes semánticas.

**Import:**
```tsx
import { Alert } from '@/shared/components/ui/Alert';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'error' \| 'info'` | `'info'` | Variante de alerta |
| `title` | `string` | - | Título de la alerta |
| `description` | `string` | - | Descripción de la alerta (requerido) |
| `className` | `string` | `''` | Clases CSS adicionales |

**Variantes:**
- `success` - Verde para éxitos
- `warning` - Amarillo para advertencias
- `error` - Rojo para errores
- `info` - Azul para información

**Ejemplo de Uso:**
```tsx
import { Alert } from '@/shared/components/ui/Alert';

function Example() {
  return (
    <div className="space-y-4">
      <Alert
        variant="success"
        title="¡Éxito!"
        description="Tu cambios han sido guardados correctamente."
      />

      <Alert
        variant="error"
        title="Error"
        description="No se pudo conectar con el servidor."
      />

      <Alert
        variant="warning"
        title="Advertencia"
        description="Tu sesión expirará en 5 minutos."
      />

      <Alert
        variant="info"
        description="Tienes 3 notificaciones sin leer."
      />
    </div>
  );
}
```

**Accesibilidad:**
- `role="alert"` para lectores de pantalla
- `aria-live="polite"` para anunciar mensajes
- Contraste de color WCAG 2.1 AA (≥4.5:1)
- Iconos decorativos con `aria-hidden="true"`

---

## Fase 2 - Formularios y Overlays

### TextField

Campo de entrada de texto con label, error y texto de ayuda. Compatible con React Hook Form.

**Import:**
```tsx
import { TextField } from '@/shared/components/ui/forms/TextField';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del campo |
| `error` | `string` | - | Mensaje de error |
| `helperText` | `string` | - | Texto de ayuda |
| `disabled` | `boolean` | `false` | Campo deshabilitado |
| `required` | `boolean` | `false` | Campo requerido |
| `fullWidth` | `boolean` | `false` | Ocupar todo el ancho |
| `id` | `string` | - | ID personalizado |
| `inputRef` | `Ref<HTMLInputElement>` | - | Referencia del input |
| `className` | `string` | `''` | Clases CSS adicionales |
| [HTML input props] | - | - | Todas las props de `<input>` |

**Ejemplo de Uso:**
```tsx
import { TextField } from '@/shared/components/ui/forms/TextField';

function Example() {
  return (
    <div className="space-y-4 max-w-md">
      <TextField
        label="Nombre completo"
        placeholder="Juan Pérez"
        helperText="Ingresa tu nombre completo"
        required
      />

      <TextField
        label="Email"
        type="email"
        placeholder="ejemplo@correo.com"
        error="Email inválido"
      />

      <TextField
        label="Teléfono"
        type="tel"
        placeholder="+52 55 1234 5678"
        disabled
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
      />
    </div>
  );
}
```

**Integración con React Hook Form:**
```tsx
import { useForm } from 'react-hook-form';
import { TextField } from '@/shared/components/ui/forms/TextField';

function FormExample() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <TextField
        label="Email"
        error={errors.email?.message}
        {...register('email', { required: 'Email requerido' })}
      />
    </form>
  );
}
```

**Accesibilidad:**
- `aria-invalid` para estado de error
- `aria-describedby` para texto de ayuda/error
- `aria-required` para campos requeridos
- Asociaciones label-input correctas
- Indicadores de foco visibles

---

### TextArea

Área de texto multilínea con contador de caracteres opcional. Compatible con React Hook Form.

**Import:**
```tsx
import { TextArea } from '@/shared/components/ui/forms/TextArea';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del campo |
| `error` | `string` | - | Mensaje de error |
| `helperText` | `string` | - | Texto de ayuda |
| `rows` | `number` | `4` | Número de filas visibles |
| `disabled` | `boolean` | `false` | Campo deshabilitado |
| `required` | `boolean` | `false` | Campo requerido |
| `fullWidth` | `boolean` | `false` | Ocupar todo el ancho |
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'vertical'` | Control de redimensionamiento |
| `showCount` | `boolean` | `false` | Mostrar contador de caracteres |
| `maxLength` | `number` | - | Longitud máxima |
| `className` | `string` | `''` | Clases CSS adicionales |
| [HTML textarea props] | - | - | Todas las props de `<textarea>` |

**Ejemplo de Uso:**
```tsx
import { TextArea } from '@/shared/components/ui/forms/TextArea';

function Example() {
  return (
    <div className="space-y-4 max-w-md">
      <TextArea
        label="Biografía"
        rows={4}
        placeholder="Cuéntanos sobre ti..."
        helperText="Máximo 500 caracteres"
        showCount
        maxLength={500}
      />

      <TextArea
        label="Descripción"
        rows={6}
        resize="vertical"
        required
      />

      <TextArea
        label="Comentarios"
        resize="none"
        disabled
      />
    </div>
  );
}
```

**Accesibilidad:**
- Mismos atributos ARIA que TextField
- Contador de caracteres anunciado a lectores de pantalla
- Redimensionamiento controlado para accesibilidad

---

### Select

Select desplegable con opción de limpiar selección. Compatible con React Hook Form.

**Import:**
```tsx
import { Select } from '@/shared/components/ui/forms/Select';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del campo |
| `error` | `string` | - | Mensaje de error |
| `helperText` | `string` | - | Texto de ayuda |
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | - | Opciones del select |
| `placeholder` | `string` | - | Texto del placeholder |
| `disabled` | `boolean` | `false` | Campo deshabilitado |
| `required` | `boolean` | `false` | Campo requerido |
| `fullWidth` | `boolean` | `false` | Ocupar todo el ancho |
| `clearable` | `boolean` | `false` | Mostrar botón para limpiar |
| `onClear` | `() => void` | - | Callback al limpiar selección |
| `className` | `string` | `''` | Clases CSS adicionales |
| [HTML select props] | - | - | Todas las props de `<select>` |

**Ejemplo de Uso:**
```tsx
import { Select } from '@/shared/components/ui/forms/Select';

function Example() {
  const options = [
    { value: 'tech', label: 'Tecnología' },
    { value: 'design', label: 'Diseño' },
    { value: 'business', label: 'Negocios' },
    { value: 'marketing', label: 'Marketing', disabled: true },
  ];

  return (
    <div className="space-y-4 max-w-md">
      <Select
        label="Categoría"
        options={options}
        placeholder="Selecciona una categoría"
        helperText="Elige la categoría que mejor describa tu contenido"
        required
      />

      <Select
        label="País"
        options={[
          { value: 'mx', label: 'México' },
          { value: 'es', label: 'España' },
          { value: 'ar', label: 'Argentina' },
        ]}
        clearable
      />
    </div>
  );
}
```

**Accesibilidad:**
- Mismos atributos ARIA que TextField
- Flecha personalizada visible
- Botón de limpiar con `aria-label`

---

### Checkbox

Casilla de verificación con soporte para estado indeterminado. Compatible con React Hook Form.

**Import:**
```tsx
import { Checkbox } from '@/shared/components/ui/forms/Checkbox';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del checkbox |
| `error` | `string` | - | Mensaje de error |
| `checked` | `boolean` | - | Estado controlado |
| `defaultChecked` | `boolean` | - | Estado inicial no controlado |
| `onChange` | `(checked: boolean) => void` | - | Callback al cambiar |
| `indeterminate` | `boolean` | `false` | Estado indeterminado |
| `disabled` | `boolean` | `false` | Checkbox deshabilitado |
| `required` | `boolean` | `false` | Checkbox requerido |
| `className` | `string` | `''` | Clases CSS adicionales |
| [HTML input props] | - | - | Todas las props de `<input type="checkbox">` |

**Ejemplo de Uso:**
```tsx
import { Checkbox } from '@/shared/components/ui/forms/Checkbox';
import { useState } from 'react';

function Example() {
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="space-y-4 max-w-md">
      <Checkbox
        label="Acepto los términos y condiciones"
        checked={terms}
        onChange={setTerms}
        required
      />

      <Checkbox
        label="Suscribirse al newsletter"
        checked={newsletter}
        onChange={setNewsletter}
      />

      <Checkbox
        label="Seleccionar todos"
        indeterminate
        disabled
      />

      <Checkbox
        label="Opción deshabilitada"
        disabled
      />
    </div>
  );
}
```

**Accesibilidad:**
- `aria-invalid` para estado de error
- `aria-describedby` para mensaje de error
- `aria-required` para checkboxes requeridos
- Estado indeterminado implementado correctamente
- Asociaciones label-checkbox correctas

---

### RadioGroup

Grupo de radio buttons para selección exclusiva. Compatible con React Hook Form.

**Import:**
```tsx
import { RadioGroup } from '@/shared/components/ui/forms/RadioGroup';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del grupo |
| `error` | `string` | - | Mensaje de error |
| `helperText` | `string` | - | Texto de ayuda |
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | - | Opciones del grupo |
| `name` | `string` | - | Nombre del grupo (requerido) |
| `value` | `string` | - | Valor seleccionado (controlado) |
| `defaultValue` | `string` | - | Valor inicial (no controlado) |
| `onChange` | `(value: string) => void` | - | Callback al cambiar |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Orientación de las opciones |
| `disabled` | `boolean` | `false` | Grupo deshabilitado |
| `required` | `boolean` | `false` | Grupo requerido |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { RadioGroup } from '@/shared/components/ui/forms/RadioGroup';
import { useState } from 'react';

function Example() {
  const [notification, setNotification] = useState('email');
  const [plan, setPlan] = useState('basic');

  return (
    <div className="space-y-6 max-w-md">
      <RadioGroup
        label="Preferencias de notificación"
        name="notification"
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'none', label: 'Ninguna' },
        ]}
        value={notification}
        onChange={setNotification}
        helperText="Elige cómo deseas recibir notificaciones"
        orientation="vertical"
      />

      <RadioGroup
        label="Plan seleccionado"
        name="plan"
        options={[
          { value: 'basic', label: 'Básico' },
          { value: 'pro', label: 'Profesional' },
          { value: 'enterprise', label: 'Enterprise' },
        ]}
        value={plan}
        onChange={setPlan}
        orientation="horizontal"
        required
      />
    </div>
  );
}
```

**Accesibilidad:**
- `role="radiogroup"` para el grupo
- `aria-required` para grupos requeridos
- `aria-invalid` para estado de error
- Navegación por flechas entre opciones
- `aria-describedby` para texto de ayuda/error

---

### FormField

Wrapper para envolver campos de formulario con label, error y helper text de manera consistente.

**Import:**
```tsx
import { FormField } from '@/shared/components/ui/forms/FormField';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | - | Etiqueta del campo |
| `error` | `string` | - | Mensaje de error |
| `helperText` | `string` | - | Texto de ayuda |
| `required` | `boolean` | `false` | Campo requerido |
| `children` | `ReactElement` | - | Campo de formulario a envolver |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { FormField } from '@/shared/components/ui/forms/FormField';

function Example() {
  return (
    <form className="space-y-4 max-w-md">
      <FormField
        label="Nombre"
        helperText="Tu nombre completo"
        required
      >
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
        />
      </FormField>

      <FormField
        label="Email"
        error="Email inválido"
      >
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border border-red-300 rounded-md"
        />
      </FormField>
    </form>
  );
}
```

**Accesibilidad:**
- Clona atributos ARIA al hijo (`aria-invalid`, `aria-describedby`, `aria-required`)
- Estructura consistente para todos los campos de formulario

---

### Toast

Notificación emergente con auto-dismiss opcional.

**Import:**
```tsx
import { Toast } from '@/shared/components/ui/overlays/Toast';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `id` | `string` | - | Identificador único del toast |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | - | Variante del toast |
| `title` | `string` | - | Título del toast |
| `message` | `string` | - | Mensaje del toast (requerido) |
| `duration` | `number` | `5000` | Duración en ms (0 para no auto-dismiss) |
| `onClose` | `() => void` | - | Callback al cerrar |

**Ejemplo de Uso:**
```tsx
import { Toast } from '@/shared/components/ui/overlays/Toast';

function Example() {
  return (
    <div className="fixed top-4 right-4 space-y-2">
      <Toast
        id="1"
        variant="success"
        title="¡Éxito!"
        message="Tu cambios han sido guardados"
        duration={5000}
        onClose={() => console.log('Cerrado')}
      />

      <Toast
        id="2"
        variant="error"
        title="Error"
        message="No se pudo conectar con el servidor"
        duration={0}
        onClose={() => console.log('Cerrado')}
      />
    </div>
  );
}
```

**Accesibilidad:**
- `role="alert"` para lectores de pantalla
- `aria-live="polite"` para anunciar mensajes
- `aria-atomic="true"` para anunciar contenido completo
- Botón de cerrar con `aria-label`

---

### useToast

Hook para gestionar notificaciones Toast de manera imperativa.

**Import:**
```tsx
import { useToast, ToastContainer } from '@/shared/components/ui/overlays/Toast/useToast';
```

**Retorno:**
```tsx
{
  showToast: (options: ShowToastOptions) => string;
  showSuccess: (message: string, title?: string) => string;
  showError: (message: string, title?: string) => string;
  showWarning: (message: string, title?: string) => string;
  showInfo: (message: string, title?: string) => string;
  closeToast: (id: string) => void;
  closeAllToasts: () => void;
  toasts: ToastData[];
}
```

**Ejemplo de Uso:**
```tsx
import { useToast, ToastContainer } from '@/shared/components/ui/overlays/Toast/useToast';

function App() {
  const { toasts, showSuccess, showError, closeToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Datos guardados correctamente');
    } catch (error) {
      showError('Error al guardar', 'No se pudo completar la operación');
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Guardar</button>

      <ToastContainer
        toasts={toasts}
        onClose={closeToast}
        position="bottom-right"
      />
    </div>
  );
}
```

**Accesibilidad:**
- `role="region"` con `aria-label="Notificaciones"`
- `aria-live="polite"` para anunciar nuevos toasts

---

### Modal

Diálogo modal con focus trap, scroll lock y navegación por teclado.

**Import:**
```tsx
import { Modal } from '@/shared/components/ui/overlays/Modal';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Si el modal está abierto |
| `onClose` | `() => void` | - | Callback al cerrar |
| `title` | `string` | - | Título del modal |
| `children` | `ReactNode` | - | Contenido del modal |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del modal |
| `showCloseButton` | `boolean` | `true` | Mostrar botón de cerrar |
| `hasBackdrop` | `boolean` | `true` | Mostrar fondo oscuro |
| `closeOnBackdropClick` | `boolean` | `true` | Cerrar al hacer clic en el backdrop |
| `closeOnEscape` | `boolean` | `true` | Cerrar con tecla Escape |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Modal } from '@/shared/components/ui/overlays/Modal';
import { useState } from 'react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Perfil"
        size="lg"
      >
        <div className="space-y-4">
          <p>Contenido del modal...</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsOpen(false)}>Cancelar</button>
            <button>Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

**Accesibilidad:**
- `role="dialog"` con `aria-modal="true"`
- Focus trap mantenido dentro del modal
- Restauración de foco al cerrar
- `Escape` para cerrar
- Bloqueo de scroll del body
- `aria-labelledby` para título

---

### ConfirmDialog

Diálogo de confirmación para acciones destructivas.

**Import:**
```tsx
import { ConfirmDialog } from '@/shared/components/ui/overlays/ConfirmDialog';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Si el diálogo está abierto |
| `onClose` | `() => void` | - | Callback al cerrar |
| `onConfirm` | `() => Promise<void> \| void` | - | Callback al confirmar |
| `title` | `string` | - | Título del diálogo |
| `message` | `string` | - | Mensaje del diálogo |
| `confirmLabel` | `string` | `'Confirmar'` | Texto del botón de confirmar |
| `cancelLabel` | `string` | `'Cancelar'` | Texto del botón de cancelar |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Variante visual |
| `disabled` | `boolean` | `false` | Deshabilitar acciones |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { ConfirmDialog } from '@/shared/components/ui/overlays/ConfirmDialog';
import { useState } from 'react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await deleteItem();
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Eliminar</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Eliminar elemento"
        message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
```

**Accesibilidad:**
- Hereda toda la accesibilidad de Modal
- Variantes semánticas con iconos apropiados
- Botón de cancelar con `autoFocus`

---

### Tooltip

Tooltip con posicionamiento automático y delay.

**Import:**
```tsx
import { Tooltip } from '@/shared/components/ui/overlays/Tooltip';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `ReactElement` | - | Elemento que activa el tooltip |
| `content` | `string` | - | Contenido del tooltip |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Posición del tooltip |
| `delay` | `number` | `200` | Retraso en ms antes de mostrar |
| `arrow` | `boolean` | `true` | Mostrar flecha |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Tooltip } from '@/shared/components/ui/overlays/Tooltip';

function Example() {
  return (
    <div className="space-x-4">
      <Tooltip content="Este es un tooltip">
        <button>Hover me</button>
      </Tooltip>

      <Tooltip
        content="Tooltip con flecha en posición inferior"
        placement="bottom"
        delay={100}
      >
        <span>Información</span>
      </Tooltip>

      <Tooltip
        content="Tooltip sin flecha"
        arrow={false}
        placement="right"
      >
        <i className="icon-help"></i>
      </Tooltip>
    </div>
  );
}
```

**Accesibilidad:**
- `role="tooltip"` para lectores de pantalla
- `aria-describedby` para asociar con trigger
- Activado por hover y focus
- Flecha decorativa con `aria-hidden="true"`

---

## Fase 3 - Navegación y Datos

### Tabs

Navegación por pestañas con soporte para orientación horizontal/vertical y navegación por teclado.

**Import:**
```tsx
import { Tabs } from '@/shared/components/ui/navigation/Tabs';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `tabs` | `Array<{ id: string; label: string; content: ReactNode; icon?: string; disabled?: boolean }>` | - | Pestañas a mostrar |
| `defaultTab` | `string` | - | ID de la pestaña activa por defecto |
| `onChange` | `(tabId: string) => void` | - | Callback al cambiar pestaña |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación de las pestañas |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Tabs } from '@/shared/components/ui/navigation/Tabs';

function Example() {
  const tabs = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: '👤',
      content: <div>Contenido del perfil...</div>,
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: '⚙️',
      content: <div>Contenido de configuración...</div>,
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: '🔒',
      disabled: true,
      content: <div>Contenido de seguridad...</div>,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      defaultTab="profile"
      onChange={(tabId) => console.log('Tab changed:', tabId)}
      orientation="horizontal"
    />
  );
}
```

**Accesibilidad:**
- `role="tablist"` y `role="tab"` para estructura semántica
- `aria-selected` para pestaña activa
- `aria-controls` y `aria-labelledby` para asociaciones
- Navegación por flechas, Home/End, Enter/Space
- `aria-orientation` para orientación
- Indicadores de foco visibles

**Atajos de Teclado:**
- `←/→` o `↑/↓` - Navegar entre pestañas
- `Home` - Ir a la primera pestaña
- `End` - Ir a la última pestaña
- `Enter` o `Space` - Activar pestaña

---

### Breadcrumb

Migas de pan para mostrar la ruta de navegación actual.

**Import:**
```tsx
import { Breadcrumb } from '@/shared/components/ui/navigation/Breadcrumb';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `items` | `Array<{ label: string; href?: string; icon?: string }>` | - | Items del breadcrumb |
| `separator` | `string` | `'/'` | Separador entre items |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Breadcrumb } from '@/shared/components/ui/navigation/Breadcrumb';

function Example() {
  const items = [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Productos', href: '/products' },
    { label: 'Categoría', href: '/products/tech' },
    { label: 'Detalle' }, // Item actual sin href
  ];

  return (
    <Breadcrumb
      items={items}
      separator=">"
    />
  );
}
```

**Accesibilidad:**
- `role="navigation"` con `aria-label="Breadcrumb"`
- Estructura `<nav><ol>` semántica
- `aria-current="page"` para página actual
- Separador decorativo con `aria-hidden="true"`
- Links con Next.js para navegación client-side

---

### Pagination

Controles de paginación con selector de tamaño de página opcional.

**Import:**
```tsx
import { Pagination } from '@/shared/components/ui/navigation/Pagination';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Página actual (1-indexed) |
| `totalPages` | `number` | - | Total de páginas |
| `onPageChange` | `(page: number) => void` | - | Callback al cambiar página |
| `pageSize` | `number` | - | Tamaño de página |
| `onPageSizeChange` | `(size: number) => void` | - | Callback al cambiar tamaño |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Opciones de tamaño |
| `showPageSizeSelector` | `boolean` | `false` | Mostrar selector de tamaño |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Pagination } from '@/shared/components/ui/navigation/Pagination';
import { useState } from 'react';

function Example() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[10, 25, 50, 100]}
      showPageSizeSelector
    />
  );
}
```

**Accesibilidad:**
- `role="navigation"` con `aria-label="Pagination"`
- `aria-current="page"` para página activa
- `aria-label` en botones de navegación
- Navegación completa por teclado
- Ellipsis con `aria-hidden="true"`

---

### Stepper

Indicador de progreso multi-paso con orientación configurable.

**Import:**
```tsx
import { Stepper } from '@/shared/components/ui/navigation/Stepper';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `steps` | `Array<{ id: string; label: string; description?: string; icon?: string; completed?: boolean }>` | - | Pasos a mostrar |
| `currentStep` | `number` | - | Paso actual (1-indexed) |
| `onStepClick` | `(stepId: string) => void` | - | Callback al hacer clic en un paso |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación del stepper |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Stepper } from '@/shared/components/ui/navigation/Stepper';
import { useState } from 'react';

function Example() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: '1', label: 'Registro', description: 'Crea tu cuenta', icon: '📝' },
    { id: '2', label: 'Verificación', description: 'Verifica tu email', icon: '✉️' },
    { id: '3', label: 'Perfil', description: 'Completa tu perfil', icon: '👤' },
    { id: '4', label: 'Confirmación', description: '¡Listo!', icon: '✅' },
  ];

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={(stepId) => {
        const stepNum = parseInt(stepId);
        if (stepNum <= currentStep) setCurrentStep(stepNum);
      }}
      orientation="horizontal"
    />
  );
}
```

**Accesibilidad:**
- `role="group"` con `aria-label="Progress stepper"`
- `aria-current="step"` para paso activo
- Pasos clickeables con `tabIndex={0}`
- Navegación por teclado (Enter/Space)
- Iconos decorativos con `aria-hidden="true"`

---

### Card

Tarjeta de contenido con header, body y footer opcionales.

**Import:**
```tsx
import { Card } from '@/shared/components/ui/data-display/Card';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | - | Título de la tarjeta |
| `description` | `string` | - | Descripción de la tarjeta |
| `footer` | `ReactNode` | - | Contenido del footer |
| `variant` | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Variante de estilo |
| `children` | `ReactNode` | - | Contenido principal |
| `className` | `string` | `''` | Clases CSS adicionales |

**Variantes:**
- `elevated` - Con sombra y hover effect
- `outlined` - Con borde y hover effect
- `flat` - Plano con borde gris

**Ejemplo de Uso:**
```tsx
import { Card } from '@/shared/components/ui/data-display/Card';
import { Button } from '@/shared/components/ui/Button';

function Example() {
  return (
    <div className="space-y-4 max-w-md">
      <Card
        title="Tarjeta Elevada"
        description="Esta es una tarjeta con sombra"
        variant="elevated"
      >
        <p>Contenido de la tarjeta...</p>
      </Card>

      <Card
        title="Tarjeta con Footer"
        variant="outlined"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Cancelar</Button>
            <Button variant="primary" size="sm">Guardar</Button>
          </div>
        }
      >
        <p>Contenido con acciones en el footer...</p>
      </Card>

      <Card variant="flat">
        <p>Tarjeta simple sin título ni footer...</p>
      </Card>
    </div>
  );
}
```

**Accesibilidad:**
- Estructura semántica con header, body y footer
- Hover states con transiciones suaves
- Variantes con suficiente contraste de color

---

### Table

Tabla de datos con ordenamiento y filas con efecto zebra.

**Import:**
```tsx
import { Table } from '@/shared/components/ui/data-display/Table';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `Array<{ id: string; label: string; key?: keyof T; render?: (value, row, index) => ReactNode; sortable?: boolean; cellClassName?: string }>` | - | Definición de columnas |
| `data` | `T[]` | - | Datos a mostrar |
| `sortable` | `boolean` | `false` | Si la tabla es ordenable |
| `onSort` | `(columnId: string, order: 'asc' \| 'desc' \| null) => void` | - | Callback al ordenar |
| `emptyMessage` | `string` | `'No data available'` | Mensaje cuando no hay datos |
| `zebraStripes` | `boolean` | `true` | Filas con efecto zebra |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Table } from '@/shared/components/ui/data-display/Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Example() {
  const columns = [
    { id: 'name', label: 'Nombre', key: 'name' as keyof User, sortable: true },
    { id: 'email', label: 'Email', key: 'email' as keyof User, sortable: true },
    {
      id: 'role',
      label: 'Rol',
      key: 'role' as keyof User,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {value}
        </span>
      ),
    },
  ];

  const data: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      sortable
      onSort={(columnId, order) => console.log('Sort:', columnId, order)}
      emptyMessage="No hay usuarios registrados"
    />
  );
}
```

**Accesibilidad:**
- Estructura `<table>` semántica con `<thead>` y `<tbody>`
- `<th>` con `scope="col"` para cabeceras
- `aria-sort` para columnas ordenables
- Filas con hover states
- Indicadores de ordenamiento visuales
- Scroll horizontal para tablas anchas

---

### Badge

Etiqueta pequeña con variantes semánticas.

**Import:**
```tsx
import { Badge } from '@/shared/components/ui/data-display/Badge';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Contenido del badge |
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` | `'neutral'` | Variante de color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del badge |
| `showDot` | `boolean` | `false` | Mostrar punto indicador |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Badge } from '@/shared/components/ui/data-display/Badge';

function Example() {
  return (
    <div className="space-x-2">
      <Badge variant="success">Activo</Badge>
      <Badge variant="warning">Pendiente</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>

      <Badge variant="success" showDot size="sm">
        Small
      </Badge>

      <Badge variant="info" size="lg">
        Large
      </Badge>
    </div>
  );
}
```

**Accesibilidad:**
- Contraste de color WCAG 2.1 AA (≥4.5:1)
- Punto decorativo con `aria-hidden="true"`
- Tamaños legibles para todos los usuarios

---

### Avatar

Imagen de usuario con fallback de iniciales y colores generados determinísticamente.

**Import:**
```tsx
import { Avatar } from '@/shared/components/ui/data-display/Avatar';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `src` | `string` | - | URL de la imagen |
| `alt` | `string` | `'Avatar'` | Texto alternativo |
| `fallback` | `string` | `'?'` | Texto de fallback (iniciales) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del avatar |
| `className` | `string` | `''` | Clases CSS adicionales |

**Tamaños:**
- `sm` - 32px (w-8 h-8)
- `md` - 40px (w-10 h-10)
- `lg` - 48px (w-12 h-12)
- `xl` - 64px (w-16 h-16)

**Ejemplo de Uso:**
```tsx
import { Avatar } from '@/shared/components/ui/data-display/Avtar';

function Example() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="Juan Pérez"
        size="md"
      />

      <Avatar
        fallback="JP"
        alt="Juan Pérez"
        size="lg"
      />

      <Avatar
        fallback="María García"
        alt="María García"
        size="xl"
      />

      <Avatar
        fallback="?"
        size="sm"
      />
    </div>
  );
}
```

**Características:**
- Colores de fondo generados determinísticamente basados en el string del fallback
- Carga diferida con `loading="lazy"`
- Manejo de errores de carga
- Iniciales generadas automáticamente (primeras letras de cada palabra, max 2 caracteres)

**Accesibilidad:**
- `alt` text obligatorio para identificación
- Fallback con colores de alto contraste
- Carga lazy para mejor performance

---

### StatCard

Tarjeta de estadísticas con valor, cambio porcentual y tendencia.

**Import:**
```tsx
import { StatCard } from '@/shared/components/ui/data-display/StatCard';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | - | Título de la estadística |
| `value` | `string \| number` | - | Valor principal |
| `change` | `number` | - | Cambio porcentual |
| `icon` | `string` | - | Icono (emoji) |
| `trend` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Dirección de la tendencia |
| `loading` | `boolean` | `false` | Estado de carga |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { StatCard } from '@/shared/components/ui/data-display/StatCard';

function Example() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Usuarios Activos"
        value="1,234"
        change={12.5}
        trend="up"
        icon="👥"
      />

      <StatCard
        title="Ingresos"
        value="$45,678"
        change={-5.2}
        trend="down"
        icon="💰"
      />

      <StatCard
        title="Conversiones"
        value="89"
        change={0}
        trend="neutral"
        icon="📈"
        loading
      />
    </div>
  );
}
```

**Características:**
- Skeleton loader cuando `loading={true}`
- Formateo automático de porcentajes con signo
- Colores semánticos según tendencia (verde=up, rojo=down)
- Hover effect con sombra

**Accesibilidad:**
- Estructura semántica con título y valor separados
- Colores de tendencia con alto contraste
- Iconos decorativos con `aria-hidden="true"`

---

### Divider

Separador visual con etiqueta opcional.

**Import:**
```tsx
import { Divider } from '@/shared/components/ui/data-display/Divider';
```

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación del divisor |
| `label` | `string` | - | Etiqueta de texto opcional |
| `thickness` | `number` | `1` | Grosor en pixels |
| `className` | `string` | `''` | Clases CSS adicionales |

**Ejemplo de Uso:**
```tsx
import { Divider } from '@/shared/components/ui/data-display/Divider';

function Example() {
  return (
    <div className="space-y-4">
      <div>Contenido anterior</div>

      <Divider />

      <div>Contenido posterior</div>

      <Divider label="Opciones" />

      <div className="flex h-32">
        <div className="flex-1">Panel izquierdo</div>
        <Divider orientation="vertical" thickness={2} />
        <div className="flex-1">Panel derecho</div>
      </div>
    </div>
  );
}
```

**Accesibilidad:**
- `role="separator"` para lectores de pantalla
- `aria-orientation` para orientación
- Grosor configurable para mejor visibilidad
- Etiqueta centrada cuando se proporciona

---

## Notas Generales de Accesibilidad

Todos los componentes comparten estos principios de accesibilidad:

1. **WCAG 2.1 AA** - Contraste de color mínimo 4.5:1 para texto normal
2. **Navegación por Teclado** - Todos los componentes interactivos son accesibles por teclado
3. **ARIA Labels** - Uso apropiado de atributos ARIA
4. **Focus Indicators** - Indicadores de foco visibles (`focus:ring-2`)
5. **Semántica HTML** - Uso correcto de elementos HTML semánticos
6. **Screen Reader Support** - Compatible con JAWS, NVDA, VoiceOver

## Testing

Todos los componentes tienen tests completos. Ejecuta:

```bash
npm test                    # Ejecutar todos los tests
npm run test:watch         # Modo watch
npm run test:coverage      # Cobertura de código
```

## Ejemplos de Integración

Consulta los archivos de ejemplo para integraciones completas:
- `/src/shared/components/ui/forms/EXAMPLE.usage.tsx` - Formularios con React Hook Form
- `/src/shared/components/ui/overlays/EXAMPLE.usage.tsx` - Overlays y modales
- `/src/shared/components/ui/navigation/EXAMPLE.usage.tsx` - Navegación
- `/src/shared/components/ui/data-display/EXAMPLE.usage.tsx` - Data display

---

**Última Actualización:** 2026-02-03
**Versión:** 1.0.0
