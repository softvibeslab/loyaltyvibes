---
id: SPEC-UI-001
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
---

# Plan de Implementación - SPEC-UI-001

## Overview

Este documento describe el plan detallado de implementación para el Sistema de Componentes UI y Design System de LoyaltyVibes.

---

## 1. Estrategia de Desarrollo

### 1.1 Enfoque

**Metodología**: DDD (Domain-Driven Development) con ANALYZE-PRESERVE-IMPROVE

**Principios**:
1. **Preservar comportamiento existente**: No romper funcionalidad actual
2. **Mejora incremental**: Agregar nuevos componentes sin migración forzada
3. **Coexistencia temporal**: Nuevos y viejos componentes conviven durante transición
4. **Tests primero**: Caracterización de componentes existentes antes de modificarlos
5. **Accesibilidad desde el inicio**: WCAG 2.1 AA como requisito, no como afterthought

### 1.2 Orden de Implementación

**Fase 1: Componentes Base Críticos** (Semana 1-2)
- Objetivo: Crear bloque de construcción fundamental
- Prioridad: Alta
- Riesgo: Bajo

**Fase 2: Componentes de Feedback y Overlays** (Semana 2-3)
- Objetivo: Sistema completo de feedback al usuario
- Prioridad: Alta
- Riesgo: Medio

**Fase 3: Componentes de Formularios** (Semana 3-4)
- Objetivo: Estandarizar inputs y validación
- Prioridad: Alta
- Riesgo: Medio

**Fase 4: Componentes de Navegación** (Semana 4-5)
- Objetivo: Mejorar navegación y organización
- Prioridad: Media
- Riesgo: Medio

**Fase 5: Migración y Cleanup** (Semana 5-6)
- Objetivo: Migrar páginas existentes a nuevos componentes
- Prioridad: Alta
- Riesgo: Alto

---

## 2. Fase 1: Componentes Base Críticos

### 2.1 Objetivos

- [x] Crear estructura de directorios para componentes UI
- [ ] Implementar Button system (4 variantes, 3 tamaños, loading state)
- [ ] Implementar Spinner (loading indicator)
- [ ] Implementar Skeleton (loading placeholder)
- [ ] Implementar EmptyState (no data state)
- [ ] Implementar Alert (inline feedback)
- [ ] Configurar Tailwind extendido con animaciones y colores

### 2.2 Archivos a Crear

```
src/shared/components/ui/
├── buttons/
│   ├── Button.tsx
│   └── __tests__/
│       └── Button.test.tsx
├── feedback/
│   ├── Spinner.tsx
│   ├── Skeleton.tsx
│   ├── EmptyState.tsx
│   ├── Alert.tsx
│   └── __tests__/
│       ├── Spinner.test.tsx
│       ├── Skeleton.test.tsx
│       ├── EmptyState.test.tsx
│       └── Alert.test.tsx
└── index.ts (export barrel)
```

### 2.3 Detalle de Implementación

#### 2.3.1 Button Component

**Archivo**: `src/shared/components/ui/buttons/Button.tsx`

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Estilos**:
- Primary: `bg-emerald-600 hover:bg-emerald-700 text-white`
- Secondary: `bg-purple-600 hover:bg-purple-700 text-white`
- Ghost: `bg-transparent hover:bg-gray-100 text-gray-700`
- Danger: `bg-red-600 hover:bg-red-700 text-white`

**Tests requeridos**:
- Render children correctly
- Show spinner when loading
- Be disabled when loading
- Call onClick when clicked
- Support leftIcon and rightIcon
- Be keyboard accessible (Tab, Enter, Space)
- Have visible focus state

**Estimado**: 2 horas

#### 2.3.2 Spinner Component

**Archivo**: `src/shared/components/ui/feedback/Spinner.tsx`

**Props**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'currentColor';
  className?: string;
}
```

**Tests requeridos**:
- Render with correct size
- Render with correct color
- Have aria-label="Cargando..."
- Be animated (spin)

**Estimado**: 1 hora

#### 2.3.3 Skeleton Component

**Archivo**: `src/shared/components/ui/feedback/Skeleton.tsx`

**Props**:
```typescript
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}
```

**Tests requeridos**:
- Render with correct variant
- Have aria-label="Cargando contenido..."
- Be animated when animation != 'none'

**Estimado**: 2 horas

#### 2.3.4 EmptyState Component

**Archivo**: `src/shared/components/ui/feedback/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Tests requeridos**:
- Render icon, title, description
- Render action button when provided
- Be accessible (ARIA landmarks)

**Estimado**: 2 horas

#### 2.3.5 Alert Component

**Archivo**: `src/shared/components/ui/feedback/Alert.tsx`

**Props**:
```typescript
interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}
```

**Tests requeridos**:
- Render with correct variant styling
- Have role="alert"
- Have aria-live="polite" for non-error alerts
- Have aria-live="assertive" for error alerts
- Call onClose when close button clicked

**Estimado**: 2 horas

### 2.4 Configuración Tailwind

**Archivo**: `tailwind.config.ts`

**Cambios**:
- Agregar colores extendidos (success, warning, error)
- Agregar animaciones (fade-in, fade-out, scale-up, scale-down, shimmer)
- Agregar keyframes para animaciones
- Agregar espaciados custom (18, 88, 128)
- Agregar border-radius custom (4xl)

**Estimado**: 1 hora

### 2.5 Tests de Fase 1

**Coverage target**: >= 85%

**Tests unitarios**:
- Button.test.tsx (10 tests)
- Spinner.test.tsx (5 tests)
- Skeleton.test.tsx (5 tests)
- EmptyState.test.tsx (5 tests)
- Alert.test.tsx (8 tests)

**Tests de accesibilidad**:
- axe-core passing para todos los componentes
- Keyboard navigation test para Button
- Color contrast test para Alert

**Estimado**: 4 horas

### 2.6 Entregables Fase 1

- [ ] 5 componentes base implementados
- [ ] Tests unitarios con >= 85% coverage
- [ ] Configuración Tailwind actualizada
- [ ] Export barrel en `index.ts`
- [ ] Documentación de props con JSDoc

**Total Fase 1**: ~16 horas (~2 días)

---

## 3. Fase 2: Componentes de Feedback y Overlays

### 3.1 Objetivos

- [ ] Implementar Toast system (notification manager + component)
- [ ] Implementar Modal (dialog con focus trap)
- [ ] Implementar ConfirmDialog (modal de confirmación)
- [ ] Implementar Tooltip (posicionamiento inteligente)
- [ ] Hooks personalizados (useToast, useModal, useConfirmDialog)

### 3.2 Archivos a Crear

```
src/shared/components/ui/
├── feedback/
│   ├── Toast.tsx
│   ├── ToastContainer.tsx
│   ├── useToast.ts
│   └── __tests__/
│       ├── Toast.test.tsx
│       └── useToast.test.tsx
├── overlays/
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   ├── Tooltip.tsx
│   ├── useModal.ts
│   ├── useConfirmDialog.ts
│   ├── useFocusTrap.ts
│   └── __tests__/
│       ├── Modal.test.tsx
│       ├── ConfirmDialog.test.tsx
│       ├── Tooltip.test.tsx
│       └── useFocusTrap.test.tsx
└── index.ts (update exports)
```

### 3.3 Detalle de Implementación

#### 3.3.1 Toast System

**Archivo**: `src/shared/components/ui/feedback/Toast.tsx`

**Props**:
```typescript
interface ToastProps {
  variant: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // 0 = no auto-dismiss
  onClose: () => void;
  actions?: Array<{ label: string; onClick: () => void }>;
}
```

**Hook**:
```typescript
// useToast.ts
interface ToastOptions {
  variant: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{ label: string; onClick: () => void }>;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (options: ToastOptions) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, ...options }]);
    // Auto-dismiss logic
    return id;
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, show, dismiss };
}
```

**Tests requeridos**:
- Show toast with correct variant
- Auto-dismiss after duration
- Not auto-dismiss when duration = 0
- Show actions when provided
- Call onClose when close button clicked
- Support multiple toasts stacking
- Have role="alert" and aria-live

**Estimado**: 6 horas

#### 3.3.2 Modal

**Archivo**: `src/shared/components/ui/overlays/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}
```

**Features**:
- Backdrop con overlay oscuro
- Focus trap dentro del modal
- Return focus al trigger al cerrar
- Cerrar con Escape (opcional)
- Cerrar al hacer click fuera (opcional)
- Prevenir scroll del body
- Animation: fade-in + scale-up
- Responsive: full-screen en mobile

**Tests requeridos**:
- Render when isOpen = true
- Not render when isOpen = false
- Call onClose when backdrop clicked (if closeOnOutsideClick)
- Call onClose when Escape pressed (if closeOnEscape)
- Trap focus inside modal
- Return focus to trigger on close
- Prevent body scroll when open
- Have role="dialog" and aria-modal="true"

**Estimado**: 6 horas

#### 3.3.3 ConfirmDialog

**Archivo**: `src/shared/components/ui/overlays/ConfirmDialog.tsx`

**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}
```

**Hook**:
```typescript
// useConfirmDialog.ts
export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogProps | null>(null);

  const confirm = (options: Omit<ConfirmDialogProps, 'isOpen' | 'onClose'>) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        ...options,
        isOpen: true,
        onClose: () => {
          setDialog(null);
          resolve(false);
        },
        onConfirm: async () => {
          await options.onConfirm();
          setDialog(null);
          resolve(true);
        },
      });
    });
  };

  return { dialog, confirm };
}
```

**Tests requeridos**:
- Render with correct variant styling
- Call onConfirm when confirm button clicked
- Call onClose when cancel button clicked
- Resolve promise with true when confirmed
- Resolve promise with false when cancelled

**Estimado**: 4 horas

#### 3.3.4 Tooltip

**Archivo**: `src/shared/components/ui/overlays/Tooltip.tsx`

**Props**:
```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // ms
}
```

**Features**:
- Posicionamiento inteligente (flip si cerca del edge)
- Delay before show
- Hide al hacer click fuera
- ARIA: role="tooltip", aria-describedby

**Tests requeridos**:
- Show tooltip on hover after delay
- Hide tooltip on mouse leave
- Flip position if near edge
- Have role="tooltip"
- Associate with trigger via aria-describedby

**Estimado**: 4 horas

### 3.4 Tests de Fase 2

**Coverage target**: >= 85%

**Tests unitarios**:
- Toast + useToast (12 tests)
- Modal (10 tests)
- ConfirmDialog + useConfirmDialog (8 tests)
- Tooltip (6 tests)
- useFocusTrap (5 tests)

**Tests de accesibilidad**:
- Focus trap test para Modal
- ARIA live region test para Toast
- Keyboard navigation test para Modal y ConfirmDialog

**Estimado**: 6 horas

### 3.5 Entregables Fase 2

- [ ] Toast system implementado
- [ ] Modal con focus trap
- [ ] ConfirmDialog con hook
- [ ] Tooltip con posicionamiento inteligente
- [ ] Hooks personalizados (useToast, useModal, useConfirmDialog, useFocusTrap)
- [ ] Tests unitarios con >= 85% coverage

**Total Fase 2**: ~26 horas (~3.5 días)

---

## 4. Fase 3: Componentes de Formularios

### 4.1 Objetivos

- [ ] Implementar Input (text, email, password, etc.)
- [ ] Implementar TextArea
- [ ] Implementar Select (dropdown)
- [ ] Implementar Checkbox
- [ ] Implementar RadioGroup
- [ ] Implementar FormField (wrapper)
- [ ] Integración con React Hook Form

### 4.2 Archivos a Crear

```
src/shared/components/ui/
├── forms/
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── RadioGroup.tsx
│   ├── FormField.tsx
│   └── __tests__/
│       ├── Input.test.tsx
│       ├── TextArea.test.tsx
│       ├── Select.test.tsx
│       ├── Checkbox.test.tsx
│       └── RadioGroup.test.tsx
└── index.ts (update exports)
```

### 4.3 Detalle de Implementación

#### 4.3.1 Input

**Archivo**: `src/shared/components/ui/forms/Input.tsx`

**Props**:
```typescript
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
```

**Features**:
- Label con indicador de required
- Mensaje de error inline
- Helper text opcional
- Iconos izquierda/derecha
- Estados: default, focus, error, disabled
- Auto-clear button (opcional)
- ARIA: aria-describedby, aria-invalid

**Tests requeridos**:
- Render with label
- Show error message when error prop provided
- Show helper text when helperText prop provided
- Have aria-invalid when error
- Associate error message via aria-describedby
- Call onRightIconClick when right icon clicked
- Be keyboard accessible

**Estimado**: 4 horas

#### 4.3.2 Select

**Archivo**: `src/shared/components/ui/forms/Select.tsx`

**Props**:
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
}
```

**Features**:
- Dropdown con opciones
- Searchable (opcional)
- Placeholder
- Error state
- Disabled state
- ARIA: role="combobox", aria-expanded

**Tests requeridos**:
- Show options when opened
- Filter options when searchable
- Call onChange when option selected
- Show placeholder when no value
- Be disabled when disabled prop true
- Have aria-expanded
- Be keyboard navigable (Arrow keys, Enter, Escape)

**Estimado**: 8 horas

### 4.4 Integración con React Hook Form

**Archivo**: `src/shared/components/ui/forms/Form.tsx`

```typescript
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormProps<T> {
  schema: z.ZodSchema;
  defaultValues: T;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function Form<T extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children(methods)}
      </form>
    </FormProvider>
  );
}
```

**Estimado**: 3 horas

### 4.5 Tests de Fase 3

**Coverage target**: >= 85%

**Tests unitarios**:
- Input (8 tests)
- TextArea (6 tests)
- Select (12 tests)
- Checkbox (5 tests)
- RadioGroup (6 tests)
- FormField (5 tests)
- Form integration (8 tests)

**Tests de integración**:
- React Hook Form integration
- Zod validation
- Form submission

**Estimado**: 8 horas

### 4.6 Entregables Fase 3

- [ ] 6 componentes de formularios
- [ ] Integración con React Hook Form
- [ ] Integración con Zod validation
- [ ] Tests unitarios con >= 85% coverage

**Total Fase 3**: ~31 horas (~4 días)

---

## 5. Fase 4: Componentes de Navegación

### 5.1 Objetivos

- [ ] Implementar Tabs
- [ ] Implementar Table
- [ ] Implementar Breadcrumb
- [ ] Implementar Pagination

### 5.2 Archivos a Crear

```
src/shared/components/ui/
├── navigation/
│   ├── Tabs.tsx
│   ├── Breadcrumb.tsx
│   ├── Pagination.tsx
│   └── __tests__/
│       ├── Tabs.test.tsx
│       ├── Breadcrumb.test.tsx
│       └── Pagination.test.tsx
├── data-display/
│   ├── Table.tsx
│   └── __tests__/
│       └── Table.test.tsx
└── index.ts (update exports)
```

### 5.3 Detalle de Implementación

#### 5.3.1 Tabs

**Estimado**: 6 horas

#### 5.3.2 Table

**Estimado**: 10 horas

#### 5.3.3 Breadcrumb

**Estimado**: 3 horas

#### 5.3.4 Pagination

**Estimado**: 4 horas

### 5.4 Tests de Fase 4

**Estimado**: 6 horas

### 5.5 Entregables Fase 4

- [ ] 4 componentes de navegación
- [ ] Tests unitarios con >= 85% coverage

**Total Fase 4**: ~29 horas (~4 días)

---

## 6. Fase 5: Migración y Cleanup

### 6.1 Objetivos

- [ ] Migrar `/app/(auth)/login/page.tsx` a nuevos componentes
- [ ] Migrar `/app/(auth)/register/page.tsx` a nuevos componentes
- [ ] Migrar `/app/(client)/profile/page.tsx` a nuevos componentes
- [ ] Migrar `/app/(client)/wallet/page.tsx` a nuevos componentes
- [ ] Migrar `/features/wallet/components/PointsDashboard.tsx` a nuevos componentes
- [ ] Migrar `/features/transactions/components/TransactionHistory.tsx` a nuevos componentes
- [ ] Eliminar old components (si existen)
- [ ] Update tests

### 6.2 Orden de Migración

**Semana 5, Día 1-2**:
1. `/app/(auth)/login/page.tsx` → Input, Button, Alert
2. `/app/(auth)/register/page.tsx` → Input, Button, Alert

**Semana 5, Día 3-4**:
3. `/app/(client)/profile/page.tsx` → FormField, Input, Button
4. `/app/(client)/wallet/page.tsx` → StatCard (nuevo), Button

**Semana 5, Día 5**:
5. `/features/wallet/components/PointsDashboard.tsx` → StatCard, Card
6. `/features/transactions/components/TransactionHistory.tsx` → Table (Fase 4)

**Semana 6, Día 1-2**:
7. Testing completo de migración
8. Performance audit
9. Accessibility audit
10. Cleanup de old components

### 6.3 Entregables Fase 5

- [ ] 6 páginas migradas a nuevos componentes
- [ ] Tests actualizados
- [ ] Performance audit passing
- [ ] Accessibility audit passing
- [ ] Old components eliminados

**Total Fase 5**: ~40 horas (~5 días)

---

## 7. Resumen de Tiempos

| Fase | Duración | Entregables |
|------|----------|-------------|
| Fase 1: Componentes Base | ~16 horas (~2 días) | 5 componentes base + config Tailwind |
| Fase 2: Feedback y Overlays | ~26 horas (~3.5 días) | Toast, Modal, ConfirmDialog, Tooltip + hooks |
| Fase 3: Formularios | ~31 horas (~4 días) | 6 componentes de formularios + RHF integration |
| Fase 4: Navegación | ~29 horas (~4 días) | Tabs, Table, Breadcrumb, Pagination |
| Fase 5: Migración | ~40 horas (~5 días) | 6 páginas migradas + cleanup |
| **TOTAL** | **~142 horas (~18.5 días)** | **30+ componentes UI** |

---

## 8. Dependencias

### 8.1 Externas

| Paquete | Versión | Para qué |
|---------|---------|----------|
| @headlessui/react | ^1.7.0 | Accesible modal/dialog (opcional) |
| @radix-ui/react-dialog | Latest | Accesible dialog (alternativa) |
| react-hook-form | Latest | Form validation |
| @hookform/resolvers | Latest | Zod integration |
| zod | Latest | Schema validation |

### 8.2 Internas

| Componente | Depende de |
|------------|------------|
| FormField | Input, TextArea, Select, etc. |
| ConfirmDialog | Modal |
| useToast | Toast, ToastContainer |
| useModal | Modal |
| useFocusTrap | Modal, ConfirmDialog |

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)

**Target**: >= 85% coverage

**Framework**: Vitest + React Testing Library

**Patrón**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### 9.2 Accessibility Tests

**Tool**: axe-core

**Comando**: `npm run test:a11y`

**Target**: 0 violations

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 9.3 Integration Tests

**Framework**: React Testing Library

**Escenarios**:
- Form submission con validación
- Modal open/close con focus trap
- Toast show/dismiss
- Select dropdown keyboard navigation

---

## 10. Quality Gates

### 10.1 Pre-Commit

- [ ] ESLint passing (`npm run lint`)
- [ ] TypeScript passing (`npm run type-check`)
- [ ] Unit tests passing (`npm run test`)
- [ ] Coverage >= 85% (`npm run test:coverage`)

### 10.2 Pre-Merge

- [ ] Todos los checks de pre-commit
- [ ] Accessibility audit passing (`npm run test:a11y`)
- [ ] Performance audit passing (Lighthouse score >= 90)
- [ ] Manual review aprobado

### 10.3 Pre-Production

- [ ] Todos los checks de pre-merge
- [ ] E2E tests passing (Playwright)
- [ ] Visual regression tests passing (Percy/Chromatic - opcional)
- [ ] Documentation completa

---

## 11. Rollback Plan

Si surge un problema crítico en producción:

1. **Revertir migrations de componentes** (git revert)
2. **Restaurar versiones anteriores de páginas**
3. **Investigar causa raíz**
4. **Aplicar fix en branch separado**
5. **Re-desplegar después de validación**

**Time to rollback**: < 30 minutos

---

## 12. Communication Plan

### 12.1 Daily Standups

**Formato**: Async (written en Slack o Discord)

**Template**:
```
## Progress
- What I did yesterday
- What I'll do today

## Blockers
- Any blockers I'm facing

## Metrics
- Time spent vs estimated
- Test coverage
```

### 12.2 Weekly Review

**Participantes**: Team completo

**Agenda**:
1. Review de progreso de la semana
2. Demo de nuevos componentes
3. Discussion de blockers
4. Plan para siguiente semana

---

## 13. Success Criteria

**Fase 1 es exitosa si**:
- [ ] 5 componentes base implementados
- [ ] Tests passing con >= 85% coverage
- [ ] No regresiones en funcionalidad existente

**Fase 2 es exitosa si**:
- [ ] Toast, Modal, ConfirmDialog implementados
- [ ] Focus trap funcionando correctamente
- [ ] Accessibility audit passing

**Fase 3 es exitosa si**:
- [ ] 6 componentes de formularios implementados
- [ ] React Hook Form integration funcionando
- [ ] Form validation con Zod funcionando

**Fase 4 es exitosa si**:
- [ ] 4 componentes de navegación implementados
- [ ] Table con sorting y pagination funcionando

**Fase 5 es exitosa si**:
- [ ] 6 páginas migradas sin regresiones
- [ ] Performance audit passing
- [ ] Accessibility audit passing
- [ ] Old components eliminados

---

**FIN DEL PLAN DE IMPLEMENTACIÓN**
