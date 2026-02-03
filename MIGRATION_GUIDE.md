# Guía de Migración

Guía para migrar desde componentes antiguos a la nueva biblioteca de componentes LoyaltyVibes UI.

---

## Índice

- [Introducción](#introducción)
- [Mapeo de Componentes](#mapeo-de-componentes)
- [Ejemplos de Migración Paso a Paso](#ejemplos-de-migración-paso-a-paso)
- [Cambios Importantes](#cambios-importantes)
- [Deprecaciones](#deprecaciones)

---

## Introducción

Esta guía te ayuda a migrar desde componentes UI antiguos o genéricos a la biblioteca estandarizada de LoyaltyVibes UI.

### Beneficios de la Migración

- ✅ **Consistencia** - Todos los componentes comparten el mismo sistema de diseño
- ✅ **Accesibilidad** - Cumplimiento WCAG 2.1 AA en todos los componentes
- ✅ **TypeScript** - Tipado completo y autocomplete en IDE
- ✅ **Testing** - Componentes probados con 85%+ cobertura
- ✅ **Mantenibilidad** - Código centralizado y fácil de mantener

---

## Mapeo de Componentes

### Botones

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| `<button>` nativo | `<Button>` | Variants, loading state, fullWidth |
| `<input type="submit">` | `<Button type="submit">` | Mismo comportamiento, más estilos |
| `<Button className="btn-primary">` | `<Button variant="primary">` | Props semánticas en lugar de className |
| `<button className="loading">` | `<Button loading>` | Prop dedicada para estado de carga |

### Formularios

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| `<input className="form-input">` | `<TextField>` | Label, error, helperText integrados |
| `<textarea>` | `<TextArea>` | Contador de caracteres, resize control |
| `<select>` | `<Select>` | Options array, clearable, custom arrow |
| `<input type="checkbox">` | `<Checkbox>` | Estado indeterminado, error states |
| Radio inputs manuales | `<RadioGroup>` | Orientación, group label, error states |
| `<div className="form-group">` | `<FormField>` | Wrapper con ARIA attributes |

### Alertas y Notificaciones

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| `alert()` nativo | `<Toast>` + `useToast` | No bloqueante, auto-dismiss |
| `<div className="alert">` | `<Alert>` | Variantes semánticas, iconos |
| Toasts manuales | `<ToastContainer>` | Contenedor con posicionamiento |

### Overlays

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| Modales manuales | `<Modal>` | Focus trap, scroll lock, backdrop |
| `window.confirm()` | `<ConfirmDialog>` | No bloqueante, async confirm |
| Title attributes | `<Tooltip>` | Posicionamiento, delay, arrow |

### Navegación

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| Tabs manuales | `<Tabs>` | Keyboard nav, orientación |
| Breadcrumbs manuales | `<Breadcrumb>` | Semántica automática, separator |
| Paginación manual | `<Pagination>` | Page size selector, ellipsis |
| Progress steps | `<Stepper>` | Orientación, clickable steps |

### Data Display

| Componente Antiguo | Componente Nuevo | Cambios Clave |
|-------------------|------------------|---------------|
| `<div className="card">` | `<Card>` | Variantes, footer, hover effects |
| `<table>` nativo | `<Table>` | Sorting, zebra stripes, render props |
| `<span className="badge">` | `<Badge>` | Variantes, tamaños, dot indicator |
| `<img>` manual | `<Avatar>` | Fallback con iniciales, colores |
| Stats manuales | `<StatCard>` | Tendencia, skeleton loader |
| `<hr>` | `<Divider>` | Orientación, label, thickness |

---

## Ejemplos de Migración Paso a Paso

### Ejemplo 1: Migrar un Botón Simple

**Antes (HTML nativo):**
```tsx
<button
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  onClick={handleClick}
>
  Guardar
</button>
```

**Después (Button Component):**
```tsx
import { Button } from '@/shared/components/ui/Button';

<Button
  variant="primary"
  onClick={handleClick}
>
  Guardar
</Button>
```

**Beneficios:**
- ✅ Variantes consistentes
- ✅ Estados de carga integrados
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ Menos código CSS personalizado

---

### Ejemplo 2: Migrar un Campo de Formulario

**Antes (input con estilos manuales):**
```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">
    Email
    <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    className={`w-full px-3 py-2 border rounded-md ${
      errors.email ? 'border-red-500' : 'border-gray-300'
    }`}
    {...register('email')}
  />
  {errors.email && (
    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
  )}
</div>
```

**Después (TextField Component):**
```tsx
import { TextField } from '@/shared/components/ui/forms/TextField';

<TextField
  label="Email"
  type="email"
  error={errors.email?.message}
  required
  {...register('email')}
/>
```

**Beneficios:**
- ✅ 50% menos código
- ✅ Estado de error automático
- ✅ ARIA attributes incluidos
- ✅ Validación con React Hook Form

---

### Ejemplo 3: Migrar un Modal Manual

**Antes (modal implementado manualmente):**
```tsx
const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [isOpen]);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Abrir</button>

    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center"
        onClick={() => setIsOpen(false)}
      >
        <div className="bg-white rounded-lg p-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Título</h2>
          <div className="mb-4">Contenido...</div>
          <button onClick={() => setIsOpen(false)}>Cerrar</button>
        </div>
      </div>
    )}
  </>
);
```

**Después (Modal Component):**
```tsx
import { Modal } from '@/shared/components/ui/overlays/Modal';

const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Abrir</button>

    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Título"
    >
      Contenido...
    </Modal>
  </>
);
```

**Beneficios:**
- ✅ Focus trap automático
- ✅ Scroll lock del body
- ✅ Cierre con Escape
- ✅ Cierre al hacer clic en backdrop
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ 70% menos código

---

### Ejemplo 4: Migrar una Tabla Básica

**Antes (tabla HTML nativo):**
```tsx
<table className="min-w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Nombre
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Email
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {users.map((user, index) => (
      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Después (Table Component):**
```tsx
import { Table } from '@/shared/components/ui/data-display/Table';

const columns = [
  { id: 'name', label: 'Nombre', key: 'name' as keyof User, sortable: true },
  { id: 'email', label: 'Email', key: 'email' as keyof User, sortable: true },
];

<Table
  columns={columns}
  data={users}
  sortable
  onSort={(columnId, order) => console.log('Sort:', columnId, order)}
  zebraStripes
/>
```

**Beneficios:**
- ✅ Ordenamiento integrado
- ✅ Zebra stripes automáticas
- ✅ Render props personalizado
- ✅ Empty state incluido
- ✅ Accesibilidad con `aria-sort`

---

### Ejemplo 5: Migrar Notificaciones Manuales

**Antes (notificaciones en estado):**
```tsx
const [notification, setNotification] = useState<{
  message: string;
  type: 'success' | 'error';
} | null>(null);

const showNotification = (message: string, type: 'success' | 'error') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 5000);
};

return (
  <>
    {notification && (
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${
        notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {notification.message}
      </div>
    )}
  </>
);
```

**Después (useToast Hook):**
```tsx
import { useToast, ToastContainer } from '@/shared/components/ui/overlays/Toast/useToast';

function App() {
  const { toasts, showSuccess, showError, closeToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Datos guardados');
    } catch {
      showError('Error al guardar');
    }
  };

  return (
    <>
      <button onClick={handleSave}>Guardar</button>
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </>
  );
}
```

**Beneficios:**
- ✅ Hook imperativo simple
- ✅ Auto-dismiss automático
- ✅ Múltiples toasts simultáneos
- ✅ Variantes semánticas
- ✅ Accesibilidad con `aria-live`

---

## Cambios Importantes

### 1. Props Semánticas vs className

**Antes:**
```tsx
<button className="btn btn-primary btn-lg">Click</button>
```

**Después:**
```tsx
<Button variant="primary" size="lg">Click</Button>
```

**Por qué:** Props semánticas son más type-safe y previsibles.

---

### 2. Estados de Error en Formularios

**Antes:**
```tsx
<input className={errors.email ? 'border-red-500' : 'border-gray-300'} />
{errors.email && <span className="text-red-600">{errors.email}</span>}
```

**Después:**
```tsx
<TextField error={errors.email?.message} />
```

**Por qué:** El componente maneja visualización y ARIA attributes automáticamente.

---

### 3. Modales y Overlays

**Antes:**
```tsx
const [isOpen, setIsOpen] = useState(false);
// Manejo manual de scroll, foco, escape...
```

**Después:**
```tsx
const [isOpen, setIsOpen] = useState(false);
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

**Por qué:** El componente maneja focus trap, scroll lock, keyboard events.

---

### 4. Tabs Navegación

**Antes:**
```tsx
const [activeTab, setActiveTab] = useState(0);
// Manejo manual de teclas flecha, aria-selected, etc.
```

**Después:**
```tsx
<Tabs
  tabs={tabs}
  defaultTab="tab1"
  onChange={(tabId) => console.log(tabId)}
/>
```

**Por qué:** El componente maneja navegación por teclado y ARIA automáticamente.

---

## Deprecaciones

### Componentes/Patterns Deprecated

Los siguientes patterns están **deprecados** y no deben usarse en código nuevo:

#### ❌ Deprecated: className-based Button Variants

```tsx
// NO USAR
<Button className="btn-primary">Guardar</Button>
<Button className="btn-secondary">Cancelar</Button>

// USAR ESTE
<Button variant="primary">Guardar</Button>
<Button variant="secondary">Cancelar</Button>
```

**Motivo:** Props semánticas son más type-safe y mantenibles.

---

#### ❌ Deprecated: Form Fields Manuales

```tsx
// NO USAR
<div className="form-group">
  <label>Email</label>
  <input type="email" className="form-input" />
</div>

// USAR ESTE
<TextField label="Email" type="email" />
```

**Motivo:** Los componentes de formulario incluyen ARIA y estados de error automáticamente.

---

#### ❌ Deprecated: window.confirm() y window.alert()

```tsx
// NO USAR
if (window.confirm('¿Estás seguro?')) {
  deleteItem();
}

// USAR ESTE
<ConfirmDialog
  isOpen={isOpen}
  onConfirm={deleteItem}
  message="¿Estás seguro?"
/>
```

**Motivo:** Bloquean el hilo principal y no son personalizables.

---

#### ❌ Deprecated: Modales Implementados Manualmente

```tsx
// NO USAR
{isOpen && (
  <div className="fixed inset-0 bg-black/50">
    <div className="bg-white p-6">...</div>
  </div>
)}

// USAR ESTE
<Modal isOpen={isOpen} onClose={handleClose}>
  ...
</Modal>
```

**Motivo:** El componente Modal incluye focus trap, scroll lock, y accesibilidad.

---

#### ❌ Deprecated: Tooltip con title Attribute

```tsx
// NO USAR
<button title="Este es un tooltip">Hover me</button>

// USAR ESTE
<Tooltip content="Este es un tooltip">
  <button>Hover me</button>
</Tooltip>
```

**Motivo:** Los tooltips nativos no son personalizables ni consistentes.

---

## Checklist de Migración

Antes de considerar una migración completa, verifica:

### Fase 1: Preparación
- [ ] Revisa todos los componentes UI usados en el proyecto
- [ ] Identifica patrones repetitivos que pueden reemplazarse
- [ ] Instala las dependencias necesarias (si aplica)
- [ ] Lee [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) para entender la API

### Fase 2: Migración Incremental
- [ ] Comienza con componentes simples (Button, Alert)
- [ ] Continúa con formularios (TextField, Select, etc.)
- [ ] Migra overlays y modales
- [ ] Finaliza con navegación y data display

### Fase 3: Validación
- [ ] Ejecuta tests para asegurar que nada se rompió
- [ ] Verifica accesibilidad con Lighthouse o axe DevTools
- [ ] Prueba navegación por teclado en todos los componentes
- [ ] Valida contraste de colores con WCAG Contrast Checker

### Fase 4: Limpieza
- [ ] Elimina CSS/estilos manuales ya no necesarios
- [ ] Remueve código duplicado
- [ ] Actualiza documentación interna del equipo
- [ ] Entrena al equipo en el uso de nuevos componentes

---

## Estrategias de Migración

### 1. Migración Incremental

Migra componente por componente sin reescribir toda la aplicación:

```tsx
// Antes: Todo en un archivo
function Form() {
  return (
    <form>
      <input className="old-input" />
      <button className="old-button">Enviar</button>
    </form>
  );
}

// Después: Migrar solo el botón primero
function Form() {
  return (
    <form>
      <input className="old-input" />
      <Button variant="primary">Enviar</Button> {/* Migrado */}
    </form>
  );
}
```

### 2. Migración por Feature

Migra una feature completa a la vez:

```tsx
// Feature: Authentication
// Migrar: TextField, Button, Alert en LoginForm
// Migrar: Modal en PasswordRecovery
// Migrar: Toast en notificaciones de éxito/error
```

### 3. Migración por Página

Migra página por página:

```tsx
// Página 1: /login - 100% migrada
// Página 2: /register - 100% migrada
// Página 3: /dashboard - En progreso
// Página 4: /settings - Pendiente
```

---

## Recursos Útiles

- [Documentación Completa de Componentes](./COMPONENT_LIBRARY.md)
- [Guía para Desarrolladores](./DEVELOPER_GUIDE.md)
- [Ejemplos de Uso](../src/shared/components/ui/*/EXAMPLE.usage.tsx)
- [Tests de Componentes](../src/shared/components/ui/*/__tests__/)

---

## Soporte

Si encuentras problemas durante la migración:

1. Revisa los ejemplos en `EXAMPLE.usage.tsx`
2. Consulta los tests en `__tests__` para ver uso correcto
3. Verifica la documentación del componente específico
4. Abre un issue en el repositorio del proyecto

---

**Última Actualización:** 2026-02-03
**Versión:** 1.0.0
