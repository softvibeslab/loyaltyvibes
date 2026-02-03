---
id: SPEC-UI-001
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
---

# Criterios de Aceptación - SPEC-UI-001

## Overview

Este documento define los criterios de aceptación detallados para validar que el Sistema de Componentes UI y Design System cumple con todos los requerimientos especificados.

---

## 1. Criterios Generales

### 1.1 Calidad de Código

| Criterio | Especificación | Método de Verificación |
|----------|----------------|----------------------|
| **TypeScript Strict** | Todos los archivos TypeScript compilan sin errores con `strict: true` | `npm run type-check` |
| **ESLint Clean** | Cero errores de ESLint, máximo 5 warnings (todos justificados) | `npm run lint` |
| **Test Coverage** | Cobertura >= 85% para todos los componentes | `npm run test:coverage` |
| **Bundle Size** | UI library <= 50KB gzipped | webpack-bundle-analyzer |
| **No console.logs** | Cero console.log en código de producción | Manual review + linter rule |
| **No any types** | Cero usos de `any` tipo (salvo excepciones justificadas) | TypeScript strict check |

### 1.2 Accesibilidad (WCAG 2.1 AA)

| Criterio | Especificación | Método de Verificación |
|----------|----------------|----------------------|
| **Color Contrast** | Contraste mínimo 4.5:1 para todo texto normal | axe-core + Lighthouse |
| **Icon Accessibility** | Todos los iconos decorativos tienen `aria-hidden="true"` | axe-core |
| **Form Labels** | Todos los inputs tienen labels asociados visualmente y vía ARIA | axe-core + manual |
| **Focus Visible** | Todos los interactive elements tienen estado de focus visible | Manual keyboard test |
| **Keyboard Navigation** | Todas las funcionalidades son accesibles vía teclado | Manual keyboard test |
| **ARIA Attributes** | Todos los componentes tienen ARIA attributes correctos | axe-core + Storybook a11y addon |
| **Screen Reader Compatible** | Compatible con NVDA (Windows) y VoiceOver (macOS) | Manual test con screen readers |
| **No Keyboard Traps** | Cero traps de teclado en modals, dropdowns, etc. | Manual keyboard test |

### 1.3 Performance

| Criterio | Especificación | Método de Verificación |
|----------|----------------|----------------------|
| **Lighthouse Score** | Performance >= 90, Accessibility = 100 | Lighthouse CI |
| **First Contentful Paint** | FCP <= 1.5s | Lighthouse |
| **Largest Contentful Paint** | LCP <= 2.5s | Lighthouse |
| **Time to Interactive** | TTI <= 3.0s | Lighthouse |
| **Cumulative Layout Shift** | CLS <= 0.1 | Lighthouse |
| **First Input Delay** | FID <= 100ms | Lighthouse |
| **Bundle Size** | UI library <= 50KB gzipped | webpack-bundle-analyzer |
| **Runtime Performance** | Animaciones a 60fps (16.67ms por frame) | Chrome DevTools Performance |

### 1.4 Responsive Design

| Criterio | Especificación | Método de Verificación |
|----------|----------------|----------------------|
| **Mobile (< 768px)** | Layout usable en smartphones | Manual test en iPhone SE (375px) |
| **Tablet (768px - 1024px)** | Layout optimizado para tablets | Manual test en iPad |
| **Desktop (> 1024px)** | Layout optimizado para desktop | Manual test en 1920x1080 |
| **Orientation Changes** | No romper layout al cambiar orientación | Manual test en mobile |
| **Text Scaling** | Layout no rompe con zoom 200% | Manual test |

---

## 2. Criterios por Componente

### 2.1 Button

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| BTN-001 | Renderizado | Componente renderiza children correctamente |
| BTN-002 | Variantes | Soporta 4 variantes: primary, secondary, ghost, danger |
| BTN-003 | Tamaños | Soporta 3 tamaños: sm, md, lg |
| BTN-004 | Loading State | Muestra spinner y se deshabilita cuando `loading={true}` |
| BTN-005 | Iconos | Soporta leftIcon y rightIcon |
| BTN-006 | Full Width | Se expande al 100% cuando `fullWidth={true}` |
| BTN-007 | Disabled State | Aplica opacity 0.5 y cursor not-allowed cuando disabled |
| BTN-008 | Click Handler | Llama onClick al hacer click (una vez) |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| BTN-A11Y-001 | Role Button | Tiene `type="button"` por defecto (no submit en form) |
| BTN-A11Y-002 | Focus Visible | Estado de focus visible al navegar con Tab |
| BTN-A11Y-003 | Keyboard Navigation | Activable con Enter y Space |
| BTN-A11Y-004 | Disabled ARIA | Tiene `aria-disabled` cuando está disabled |
| BTN-A11Y-005 | Loading ARIA | Tiene `aria-busy="true"` cuando loading |
| BTN-A11Y-006 | Icon Label | Iconos decorativos tienen `aria-hidden="true"` |

#### Tests

```typescript
describe('Button', () => {
  it('BTN-001: should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('BTN-004: should show spinner when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByLabelText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('BTN-008: should call onClick once', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('BTN-A11Y-003: should be keyboard accessible', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

### 2.2 Input

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| INP-001 | Label | Muestra label cuando se proporciona |
| INP-002 | Required Indicator | Muestra asterisco rojo (*) cuando `required={true}` |
| INP-003 | Error Message | Muestra mensaje de error debajo del input |
| INP-004 | Helper Text | Muestra helper text cuando no hay error |
| INP-005 | Left Icon | Muestra icono a la izquierda del input |
| INP-006 | Right Icon | Muestra icono a la derecha del input |
| INP-007 | Right Icon Click | Llama onRightIconClick al hacer click en right icon |
| INP-008 | Value Change | Llama onChange al cambiar el valor |
| INP-009 | Focus State | Aplica estilos de focus correctos |
| INP-010 | Error State | Aplica estilos de error cuando hay error |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| INP-A11Y-001 | Label Association | Label está asociado via `htmlFor` |
| INP-A11Y-002 | Error ARIA | Tiene `aria-invalid="true"` cuando hay error |
| INP-A11Y-003 | Error Description | Mensaje de error asociado via `aria-describedby` |
| INP-A11Y-004 | Required ARIA | Tiene `aria-required` cuando `required={true}` |
| INP-A11Y-005 | Helper Text ARIA | Helper text asociado via `aria-describedby` |
| INP-A11Y-006 | Keyboard Navigation | Navegable via Tab |
| INP-A11Y-007 | Auto-complete | Tiene atributo `autoComplete` apropiado |

#### Tests

```typescript
describe('Input', () => {
  it('INP-001: should show label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('INP-002: should show required asterisk', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('INP-003: should show error message', () => {
    render(<Input error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('INP-A11Y-002: should have aria-invalid when error', () => {
    render(<Input error="Email is required" name="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('INP-A11Y-003: should associate error message', () => {
    render(<Input error="Email is required" name="email" />);
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('Email is required');
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
  });
});
```

---

### 2.3 Alert

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| ALT-001 | Variantes | Soporta 4 variantes: info, success, warning, error |
| ALT-002 | Icono | Muestra icono apropiado para cada variante |
| ALT-003 | Title | Muestra title cuando se proporciona |
| ALT-004 | Children | Renderiza children (message) |
| ALT-005 | Close Button | Muestra botón de close cuando `onClose` proporcionado |
| ALT-006 | Close Action | Llama onClose al hacer click en botón close |
| ALT-007 | Auto-dismiss | No auto-dismiss por default (requiere interacción) |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| ALT-A11Y-001 | Role Alert | Tiene `role="alert"` |
| ALT-A11Y-002 | Live Region | Tiene `aria-live="polite"` para no-error, `aria-live="assertive"` para error |
| ALT-A11Y-003 | Icon ARIA | Icono decorativo tiene `aria-hidden="true"` |
| ALT-A11Y-004 | Close Button Label | Botón close tiene `aria-label="Cerrar alerta"` |

#### Tests

```typescript
describe('Alert', () => {
  it('ALT-001: should support 4 variants', () => {
    const { rerender } = render(<Alert variant="info">Info message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');

    rerender(<Alert variant="success">Success message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-emerald-50');

    rerender(<Alert variant="warning">Warning message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-amber-50');

    rerender(<Alert variant="error">Error message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  it('ALT-A11Y-001: should have role="alert"', () => {
    render(<Alert variant="info">Info message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('ALT-A11Y-002: should have aria-live="assertive" for error', () => {
    render(<Alert variant="error">Error message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});
```

---

### 2.4 Toast

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| TST-001 | Variantes | Soporta 4 variantes: success, error, info, warning |
| TST-002 | Title | Muestra title |
| TST-003 | Message | Muestra message (opcional) |
| TST-004 | Auto-dismiss | Auto-desaparece después de duration (default 5s) |
| TST-005 | No Auto-dismiss | No se auto-desaparece cuando `duration={0}` |
| TST-006 | Manual Dismiss | Se puede cerrar manualmente con botón close |
| TST-007 | Multiple Toasts | Soporta múltiples toasts simultáneos |
| TST-008 | Actions | Muestra botones de action cuando se proporcionan |
| TST-009 | Action Click | Lama action.onClick al hacer click en action |
| TST-010 | Pause on Hover | Pausa auto-dismiss timer al hacer hover |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| TST-A11Y-001 | Role Alert | Tiene `role="alert"` |
| TST-A11Y-002 | Live Region | Tiene `aria-live="polite"` o `aria-live="assertive"` según variante |
| TST-A11Y-003 | Close Button Label | Botón close tiene `aria-label="Cerrar notificación"` |
| TST-A11Y-004 | Action Button | Botones de action tienen labels accesibles |

#### Tests

```typescript
describe('Toast', () => {
  it('TST-004: should auto-dismiss after duration', async () => {
    const onClose = vi.fn();
    render(
      <Toast variant="success" title="Success" onClose={onClose} duration={3000} />
    );

    expect(screen.getByText('Success')).toBeInTheDocument();

    await waitFor(
      () => expect(onClose).toHaveBeenCalled(),
      { timeout: 3500 }
    );
  });

  it('TST-005: should not auto-dismiss when duration=0', async () => {
    const onClose = vi.fn();
    render(
      <Toast variant="success" title="Success" onClose={onClose} duration={0} />
    );

    await waitFor(
      () => expect(onClose).not.toHaveBeenCalled(),
      { timeout: 3000 }
    );
  });

  it('TST-007: should support multiple toasts', () => {
    const { container } = render(
      <>
        <Toast variant="success" title="Success 1" />
        <Toast variant="error" title="Error 1" />
      </>
    );

    expect(screen.getByText('Success 1')).toBeInTheDocument();
    expect(screen.getByText('Error 1')).toBeInTheDocument();
  });
});
```

---

### 2.5 Modal

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| MOD-001 | Render Condition | Solo renderiza cuando `isOpen={true}` |
| MOD-002 | Backdrop | Muestra backdrop oscuro |
| MOD-003 | Close on Escape | Cierra al presionar Escape cuando `closeOnEscape={true}` |
| MOD-004 | Close on Outside Click | Cierra al hacer click en backdrop cuando `closeOnOutsideClick={true}` |
| MOD-005 | Close Button | Muestra botón de close cuando `showCloseButton={true}` |
| MOD-006 | Prevent Body Scroll | Previene scroll del body cuando está abierto |
| MOD-007 | Size Classes | Soporta 5 tamaños: sm, md, lg, xl, full |
| MOD-008 | Animation | Tiene animación de fade-in + scale-up |
| MOD-009 | Responsive | Full-screen en mobile (< 768px) |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| MOD-A11Y-001 | Role Dialog | Tiene `role="dialog"` |
| MOD-A11Y-002 | ARIA Modal | Tiene `aria-modal="true"` |
| MOD-A11Y-003 | ARIA LabelledBy | Tiene `aria-labelledby` apuntando al title |
| MOD-A11Y-004 | Focus Trap | Trap focus dentro del modal |
| MOD-A11Y-005 | Return Focus | Retorna focus al trigger al cerrar |
| MOD-A11Y-006 | Initial Focus | Focus en primer elemento interactivo al abrir |
| MOD-A11Y-007 | Escape Key | Cierra con Escape (si closeOnEscape) |
| MOD-A11Y-008 | Close Button Label | Botón close tiene `aria-label="Cerrar modal"` |

#### Tests

```typescript
describe('Modal', () => {
  it('MOD-001: should only render when isOpen', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('MOD-003: should close on Escape', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('MOD-A11Y-004: should trap focus', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <button>First button</button>
        <button>Second button</button>
      </Modal>
    );

    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const lastButton = buttons[1];

    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Tab should move to second button
    fireEvent.keyDown(firstButton, { key: 'Tab' });
    expect(document.activeElement).toBe(lastButton);

    // Tab again should wrap to first button (focus trap)
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    expect(document.activeElement).toBe(firstButton);
  });

  it('MOD-A11Y-001: should have role="dialog"', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

---

### 2.6 FormField (Wrapper)

#### Funcionalidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| FRM-001 | Label | Renderiza label cuando se proporciona |
| FRM-002 | Required Indicator | Muestra asterisco rojo (*) cuando `required={true}` |
| FRM-003 | Error Display | Muestra mensaje de error cuando hay error |
| FRM-004 | Helper Text | Muestra helper text cuando no hay error |
| FRM-005 | Error Priority | Error tiene prioridad sobre helper text |
| FRM-006 | Children Render | Renderiza children (input component) |

#### Accesibilidad

| ID | Criterio | Especificación |
|----|----------|----------------|
| FRM-A11Y-001 | Label Association | Label asociado con children via `htmlFor` |
| FRM-A11Y-002 | Error Association | Error asociado con children via `aria-describedby` |
| FRM-A11Y-003 | Required Indication | Asterisco tiene `aria-hidden="true"` (decorativo) |
| FRM-A11Y-004 | Error Role | Mensaje de error tiene `role="alert"` |

#### Tests

```typescript
describe('FormField', () => {
  it('FRM-001: should show label', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('FRM-002: should show required asterisk', () => {
    render(
      <FormField label="Email" required>
        <input type="email" />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('FRM-003: should show error message', () => {
    render(
      <FormField label="Email" error="Email is required">
        <input type="email" />
      </FormField>
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('FRM-004: should show helper text when no error', () => {
    render(
      <FormField label="Email" helperText="We'll send you promotions">
        <input type="email" />
      </FormField>
    );
    expect(screen.getByText("We'll send you promotions")).toBeInTheDocument();
  });

  it('FRM-005: error should take priority over helper text', () => {
    render(
      <FormField
        label="Email"
        error="Email is required"
        helperText="We'll send you promotions"
      >
        <input type="email" />
      </FormField>
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.queryByText("We'll send you promotions")).not.toBeInTheDocument();
  });
});
```

---

## 3. Integración con React Hook Form

### 3.1 Form Component

| ID | Criterio | Especificación |
|----|----------|----------------|
| RHF-001 | Schema Validation | Valida con Zod schema |
| RHF-002 | Default Values | Aplica default values del formulario |
| RHF-003 | OnSubmit | Llama onSubmit con datos validados |
| RHF-004 | Error Display | Muestra errores de validación inline |
| RHF-005 | Submit on Enter | Submit form al presionar Enter en cualquier input |
| RHF-006 | Disable Submit | Deshabilita submit cuando hay errores |
| RHF-007 | Loading State | Muestra loading en submit button durante submit |
| RHF-008 | Success Message | Muestra mensaje de éxito después de submit exitoso |

#### Tests

```typescript
describe('Form integration with React Hook Form', () => {
  it('RHF-001: should validate with Zod schema', async () => {
    const schema = z.object({
      email: z.string().email('Email inválido'),
      password: z.string().min(8, 'Mínimo 8 caracteres'),
    });

    const onSubmit = vi.fn();
    render(
      <Form schema={schema} defaultValues={{}} onSubmit={onSubmit}>
        {(methods) => (
          <>
            <Input {...methods.register('email')} label="Email" />
            <Input {...methods.register('password')} label="Password" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('RHF-003: should call onSubmit with valid data', async () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const onSubmit = vi.fn();
    render(
      <Form schema={schema} defaultValues={{}} onSubmit={onSubmit}>
        {(methods) => (
          <>
            <Input {...methods.register('email')} label="Email" />
            <Input {...methods.register('password')} label="Password" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

---

## 4. Criterios de Migración

### 4.1 Páginas a Migrar

| ID | Página | Componentes a Usar | Criterio de Éxito |
|----|--------|-------------------|------------------|
| MIG-001 | `/app/(auth)/login/page.tsx` | Input, Button, Alert | Login funcional con nuevos componentes, no regresiones |
| MIG-002 | `/app/(auth)/register/page.tsx` | Input, Button, Alert | Registro funcional con nuevos componentes, no regresiones |
| MIG-003 | `/app/(client)/profile/page.tsx` | FormField, Input, Button | Profile edit funcional, no regresiones |
| MIG-004 | `/app/(client)/wallet/page.tsx` | StatCard, Button, Modal | Wallet funcional, no regresiones |
| MIG-005 | `/features/wallet/components/PointsDashboard.tsx` | StatCard, Card | Dashboard funcional, no regresiones |
| MIG-006 | `/features/transactions/components/TransactionHistory.tsx` | Table, Skeleton | Historial funcional, no regresiones |

### 4.2 Validación de Migración

| ID | Criterio | Especificación |
|----|----------|----------------|
| MIG-VAL-001 | Sin Regresiones Funcionales | Todas las funcionalidades existentes funcionan igual |
| MIG-VAL-002 | Tests Pasando | Todos los tests existentes pasan |
| MIG-VAL-003 | Performance Igual o Mejor | Lighthouse score no disminuye |
| MIG-VAL-004 | Accesibilidad Mantenida | No se introducen violaciones de accesibilidad |
| MIG-VAL-005 | Bundle Size No Aumenta | Bundle size no aumenta más de 10KB |

---

## 5. Testing Checklist

### 5.1 Unit Tests

**Framework**: Vitest + React Testing Library

**Coverage Target**: >= 85%

**Checklist**:

- [ ] Todos los componentes tienen tests
- [ ] Tests cubren props variants
- [ ] Tests cubren user interactions (click, change, etc.)
- [ ] Tests cubren edge cases (null props, empty arrays, etc.)
- [ ] Tests cubren estados (loading, error, success, disabled)
- [ ] Tests usan `screen.getByRole` en lugar de `screen.getByText` cuando es posible
- [ ] Tests no dependen del DOM structure (queries flexibles)
- [ ] Tests tienen descripciones claras y descriptivas

### 5.2 Accessibility Tests

**Tool**: axe-core

**Target**: 0 violations

**Checklist**:

- [ ] axe-core passing para todos los componentes
- [ ] Color contrast >= 4.5:1 para todo texto
- [ ] Todos los interactive elements son keyboard accesibles
- [ ] Todos los form fields tienen labels asociados
- [ ] Todos los iconos decorativos tienen `aria-hidden="true"`
- [ ] Modals tienen focus trap
- [ ] Alerts tienen `role="alert"` y `aria-live`
- [ ] Focus visible en todos los interactive elements

### 5.3 Integration Tests

**Framework**: Playwright o Cypress

**Checklist**:

- [ ] Login flow funciona end-to-end
- [ ] Register flow funciona end-to-end
- [ ] Profile edit flow funciona end-to-end
- [ ] Form validation funciona correctamente
- [ ] Toast notifications aparecen y desaparecen correctamente
- [ ] Modales abren y cierran correctamente
- [ ] Keyboard navigation funciona en toda la app

### 5.4 Performance Tests

**Tool**: Lighthouse CI

**Target**:
- Performance >= 90
- Accessibility = 100
- Best Practices >= 90
- SEO >= 90

**Checklist**:

- [ ] Lighthouse score >= 90 en todas las páginas
- [ ] FCP <= 1.5s
- [ ] LCP <= 2.5s
- [ ] TTI <= 3.0s
- [ ] CLS <= 0.1
- [ ] FID <= 100ms
- [ ] Animaciones a 60fps

---

## 6. Documentación

### 6.1 Props Documentation

**Requisito**: Todos los componentes tienen JSDoc comments

```typescript
/**
 * Button component with support for variants, sizes, loading state, and icons.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" loading={isLoading}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';

  /**
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show loading spinner and disable button
   * @default false
   */
  loading?: boolean;

  /**
   * Expand button to full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display on the left side of children
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display on the right side of children
   */
  rightIcon?: React.ReactNode;

  /**
   * Content to display inside the button
   */
  children: React.ReactNode;
}
```

### 6.2 Usage Examples

**Requisito**: Cada componente tiene al menos 3 ejemplos de uso

**Archivo**: `src/shared/components/ui/Button.examples.tsx`

```tsx
// Example 1: Basic usage
<Button>Click me</Button>

// Example 2: With icons
<Button leftIcon={<PlusIcon />} rightIcon={<ArrowIcon />}>
  Add Item
</Button>

// Example 3: Loading state
<Button loading>Submitting...</Button>

// Example 4: All props
<Button
  variant="danger"
  size="lg"
  fullWidth
  leftIcon={<DeleteIcon />}
  onClick={handleDelete}
>
  Delete Account
</Button>
```

### 6.3 Storybook (Opcional)

**Requisito**: Si se implementa Storybook, cada componente tiene:

- [ ] Story para cada variante
- [ ] Story para cada tamaño
- [ ] Story para estados (loading, error, disabled)
- [ ] Story para ejemplos de uso
- [ ] Docs page con descripción y ejemplos

---

## 7. Sign-off

### 7.1 Pre-Production Checklist

- [ ] Todos los unit tests pasan (>= 85% coverage)
- [ ] Todos los accessibility tests pasan (0 violations)
- [ ] Todos los performance tests pasan (Lighthouse >= 90)
- [ ] Todas las migraciones completadas sin regresiones
- [ ] Documentación completa (JSDoc + ejemplos)
- [ ] Bundle size aceptable (<= 50KB gzipped)
- [ ] Code review aprobado
- [ ] Manual QA completado
- [ ] E2E tests pasando

### 7.2 Approval Signatures

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Frontend Developer | | | |
| UI/UX Designer | | | |
| QA Engineer | | | |
| Tech Lead | | | |

---

**FIN DE CRITERIOS DE ACEPTACIÓN**
