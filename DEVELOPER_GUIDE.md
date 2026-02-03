# Guía para Desarrolladores

Guía completa para crear, mantener y extender la biblioteca de componentes LoyaltyVibes UI.

---

## Índice

- [Filosofía del Sistema de Diseño](#filosofía-del-sistema-de-diseño)
- [Guías de Creación de Componentes](#guías-de-creación-de-componentes)
- [Patrones de Testing](#patrones-de-testing)
- [Estilo de Código](#estilo-de-código)
- [Checklist de Review](#checklist-de-review)
- [Publicación y Versionado](#publicación-y-versionado)

---

## Filosofía del Sistema de Diseño

### Principios Fundamentales

1. **Accesibilidad Primero (Accessibility First)**
   - Todos los componentes deben cumplir WCAG 2.1 AA
   - Contraste de color mínimo 4.5:1
   - Navegación completa por teclado
   - ARIA attributes apropiados

2. **Composición sobre Configuración**
   - Los componentes deben ser componibles, no altamente configurables
   - Props semánticas sobre props genéricas
   - Comportamiento predecible por defecto

3. **Consistencia Visual**
   - Sistema de diseño unificado (colores, tipografía, espaciado)
   - Patrones repetibles reconocibles
   - Estados interactivos consistentes

4. **Performance**
   - Lazy loading de imágenes (Avatar)
   - Optimización de re-renders (React.memo cuando necesario)
   - Tamaños de bundle razonables

5. **Developer Experience (DX)**
   - TypeScript con tipado completo
   - Autocomplete en IDE
   - Mensajes de error claros
   - Documentación inline útil

---

## Guías de Creación de Componentes

### 1. Estructura de Archivos

Cada componente sigue esta estructura:

```
ComponentName/
├── ComponentName.tsx          # Implementación principal
├── ComponentName.types.ts     # Definiciones de TypeScript
├── ComponentName.test.tsx     # Tests unitarios
├── EXAMPLE.usage.tsx          # Ejemplos de uso (opcional)
└── __tests__/
    └── ComponentName.test.tsx # Tests adicionales si es necesario
```

### 2. Template de Componente

```tsx
import React from 'react';
import { ComponentNameProps } from './ComponentName.types';

/**
 * Descripción breve del componente
 *
 * Detalles adicionales sobre el comportamiento del componente.
 * Implementa accesibilidad WCAG 2.1 AA.
 */
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      prop1,
      prop2 = defaultValue,
      className = '',
      ...props
    },
    ref
  ) => {
    // Implementación del componente

    return (
      <div
        ref={ref}
        className={`base-classes ${className}`.replace(/\s+/g, ' ').trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### 3. Definición de Types

```tsx
/**
 * Tipos de variantes disponibles
 * Descripción de cada variante
 */
export type ComponentVariant = 'variant1' | 'variant2' | 'variant3';

/**
 * Propiedades del componente ComponentName
 */
export interface ComponentNameProps extends React.HTMLAttributes<HTMLElement> {
  /** Descripción de prop1 */
  prop1: string;
  /** Descripción de prop2 */
  prop2?: number;
  /** Variante visual del componente */
  variant?: ComponentVariant;
  /** Clases CSS adicionales */
  className?: string;
  /** Hijos del componente */
  children?: React.ReactNode;
}
```

### 4. Reglas de Implementación

#### 4.1. Usar forwardRef

Siempre exporta el componente con `forwardRef` para permitir refs:

```tsx
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  (props, ref) => {
    return <div ref={ref}>...</div>;
  }
);
```

#### 4.2. DisplayName

Siempre define `displayName` para debugging:

```tsx
ComponentName.displayName = 'ComponentName';
```

#### 4.3. Props con Defaults

Usa valores por defecto sensatos:

```tsx
const {
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
} = props;
```

#### 4.4. Clases CSS

Combina clases de manera consistente:

```tsx
const combinedClasses = `
  ${baseClasses}
  ${variantClasses[variant]}
  ${sizeClasses[size]}
  ${className}
`.replace(/\s+/g, ' ').trim();
```

#### 4.5. Event Handlers

Previene comportamiento cuando está disabled:

```tsx
const handleClick = (e: React.MouseEvent) => {
  if (disabled) {
    e.preventDefault();
    return;
  }
  onClick?.(e);
};
```

---

## Accesibilidad Obligatoria

Todos los componentes DEBEN incluir:

### 1. Roles ARIA Apropiados

```tsx
// Botones
<button role="button" aria-busy={loading}>

// Alertas
<div role="alert" aria-live="polite">

// Dialogos
<div role="dialog" aria-modal="true" aria-labelledby="title">

// Tabs
<div role="tablist">
<button role="tab" aria-selected={isSelected}>
```

### 2. Estados ARIA

```tsx
// Error
aria-invalid={hasError}

// Required
aria-required={required}

// Disabled
aria-disabled={disabled}

// Expanded/Collapsed
aria-expanded={isExpanded}
```

### 3. Asociaciones

```tsx
// Label asociado a input
<label htmlFor={inputId}>
<input id={inputId} aria-describedby={`${inputId}-description`} />

// Descripción
<p id={`${inputId}-description`}>Texto de ayuda</p>
```

### 4. Navegación por Teclado

```tsx
// Manejar teclas comunes
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleClose();
      break;
  }
};
```

### 5. Indicadores de Foco

```tsx
className="focus:outline-none focus:ring-2 focus:ring-emerald-500"
```

---

## Patrones de Testing

### 1. Estructura de Test

```tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Test 1: Renderizado básico
  it('renders correctly', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  // Test 2: Props
  it('renders with custom className', () => {
    render(<ComponentName className="custom-class">Content</ComponentName>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

  // Test 3: Interacciones
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick}>Click me</ComponentName>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 4: Estados
  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} disabled>Click</ComponentName>);

    screen.getByRole('button').click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 5: Accesibilidad
  it('has proper ARIA attributes', () => {
    render(<ComponentName aria-label="Component" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Component');
  });
});
```

### 2. Tests de Formularios

```tsx
describe('TextField', () => {
  it('renders label and input', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TextField label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('associates label with input', () => {
    render(<TextField label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleName('Email');
  });
});
```

### 3. Tests de Interactividad

```tsx
describe('Tabs', () => {
  it('changes active tab on click', () => {
    const handleChange = vi.fn();
    const tabs = [
      { id: '1', label: 'Tab 1', content: <div>Content 1</div> },
      { id: '2', label: 'Tab 2', content: <div>Content 2</div> },
    ];

    render(<Tabs tabs={tabs} onChange={handleChange} />);

    screen.getByRole('tab', { name: 'Tab 2' }).click();
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('navigates with arrow keys', () => {
    render(<Tabs tabs={tabs} />);

    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });
    firstTab.focus();

    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
  });
});
```

### 4. Cobertura de Tests

Apunta a:

- **85%+ cobertura** para componentes nuevos
- **100% cobertura** para rutas críticas (onClick, onChange)
- **Tests de accesibilidad** para componentes interactivos
- **Tests de edge cases** (estados límite)

```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Revisar reporte en coverage/index.html
```

---

## Estilo de Código

### 1. Reglas Generales

```tsx
// ✅ BUENO: Nombres descriptivos
const getUserData = async (userId: string) => { ... }

// ❌ MALO: Nombres ambiguos
const getData = async (id: string) => { ... }

// ✅ BUENO: Componentes funcionales
export const Button = () => { ... }

// ❌ MALO: Componentes de clase (evitar)
export class Button extends React.Component { ... }

// ✅ BUENO: Hooks al inicio del componente
export const Component = () => {
  const [state, setState] = useState();
  useEffect(() => { ... }, []);

  return <div>...</div>;
}

// ❌ MALO: Hooks intercalados con lógica
export const Component = () => {
  const handleClick = () => { ... };
  const [state, setState] = useState();
  return <div>...</div>;
};
```

### 2. Naming Conventions

```tsx
// Componentes: PascalCase
export const TextField = () => { ... }
export const ModalDialog = () => { ... }

// Types/Interfaces: PascalCase
export interface TextFieldProps { ... }
export type ButtonVariant = 'primary' | 'secondary';

// Variables/Funciones: camelCase
const handleSubmit = () => { ... }
const errorMessage = 'Error';

// Constants: UPPER_SNAKE_CASE
const MAX_LENGTH = 100;
const DEFAULT_TIMEOUT = 5000;

// CSS Classes: kebab-case (Tailwind)
className="bg-blue-500 text-white px-4"
```

### 3. Orden de Imports

```tsx
// 1. React y core
import React, { useState, useEffect } from 'react';
import { NextRouter } from 'next/router';

// 2. Librerías de terceros
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 3. Componentes del proyecto (alias @/)
import { Button } from '@/shared/components/ui/Button';
import { TextField } from '@/shared/components/ui/forms/TextField';

// 4. Types
import type { User } from '@/shared/types';

// 5. Utilidades y helpers
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/date';
```

### 4. Comentarios y Documentación

```tsx
/**
 * Componente Button con múltiples variantes visuales
 *
 * Este componente implementa un botón accesible con estados de carga
 * y diferentes variantes de estilo para distintos casos de uso.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Guardar
 * </Button>
 * ```
 */
export const Button = () => { ... }

// Comentarios inline solo para lógica compleja
// Generar colores basados en hash del string
const getBackgroundColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
```

### 5. TypeScript Best Practices

```tsx
// ✅ BUENO: Tipos explícitos para props
export interface ComponentProps {
  title: string;
  count: number;
  disabled?: boolean;
}

// ✅ BUENO: Tipos genéricos reutilizables
export interface TableProps<T = unknown> {
  data: T[];
  columns: Column<T>[];
}

// ❌ EVITAR: Any
const data: any = fetchData();

// ✅ BUENO: Unknown o tipo específico
const data: unknown = fetchData();
const user: User = data as User;

// ✅ BUENO: Utility types
type PartialProps = Partial<ComponentProps>;
type RequiredProps = Required<ComponentProps>;
type ReadonlyProps = Readonly<ComponentProps>;
```

---

## Checklist de Review

Antes de mergear un PR de componente nuevo o modificado, verifica:

### Funcionalidad

- [ ] El componente funciona según las especificaciones
- [ ] Todos los props están documentados con JSDoc
- [ ] El componente tiene ejemplos de uso
- [ ] Edge cases están manejados (empty states, loading, error)

### Accesibilidad

- [ ] Contraste de color WCAG 2.1 AA (≥4.5:1)
- [ ] Navegación completa por teclado
- [ ] Indicadores de foco visibles
- [ ] Roles ARIA correctos
- [ ] Estados ARIA apropiados (aria-invalid, aria-required, etc.)
- [ ] Labels asociados correctamente
- [ ] Testing con Lighthouse pasa con 90+ score

### Código

- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Sin `any` types (salvo casos excepcionales)
- [ ] Componente usa `forwardRef`
- [ ] `displayName` definido
- [ ] Props sensatas con defaults apropiados

### Tests

- [ ] Tests unitarios pasan
- [ ] Cobertura ≥85%
- [ ] Tests de accesibilidad incluidos
- [ ] Tests de interacción (click, keydown, etc.)
- [ ] Tests de edge cases

### Estilo

- [ ] Consistente con otros componentes
- [ ] Usa Tailwind CSS (no estilos inline)
- [ ] Clases CSS organizadas y legibles
- [ ] No código duplicado
- [ ] Sin comentarios obsoletos

### Documentación

- [ ] Props documentadas en types
- [ ] Comentario JSDoc en componente
- [ ] Ejemplo de uso en EXAMPLE.usage.tsx (si aplica)
- [ ] README.md actualizado (si es componente nuevo)

---

## Patrones Comunes

### 1. Componentes con Estados

```tsx
export const Toggle = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isOn}
      className={isOn ? 'bg-emerald-500' : 'bg-gray-300'}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
};
```

### 2. Componentes Controlados

```tsx
export const Input = ({ value, onChange }: InputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="px-3 py-2 border rounded"
    />
  );
};
```

### 3. Componentes con Render Props

```tsx
export interface TableProps<T> {
  data: T[];
  render: (item: T, index: number) => React.ReactNode;
}

export const Table = <T,>({ data, render }: TableProps<T>) => {
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{render(item, index)}</li>
      ))}
    </ul>
  );
};
```

### 4. Componentes con Contexto

```tsx
const FormContext = createContext<FormContextValue>(null);

export const Form = ({ children }: FormProps) => {
  const methods = useForm();

  return (
    <FormContext.Provider value={methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const useFormField = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormField must be used within Form');
  }
  return context;
};
```

---

## Performance

### 1. Optimización de Re-renders

```tsx
import { memo } from 'react';

export const ExpensiveComponent = memo(({ data }: Props) => {
  // Solo re-renderiza si `data` cambia
  return <div>{/* rendering costoso */}</div>;
});
```

### 2. Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const Modal = lazy(() => import('./Modal'));

export const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Modal />
    </Suspense>
  );
};
```

### 3. useCallback y useMemo

```tsx
export const Component = () => {
  // Memorizar callbacks
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Solo recrea si deps cambian

  // Memorizar valores calculados
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.id - b.id);
  }, [data]); // Solo recalcula si data cambia

  return <div>...</div>;
};
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Ref no funciona

**Problema:** `ref` es undefined en el componente.

**Solución:** Asegúrate de usar `forwardRef`:

```tsx
// ❌ MALO
export const Component = ({ className }) => <div className={className} />;

// ✅ BUENO
export const Component = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => <div ref={ref} className={className} />
);
```

#### 2. Tipos de Eventos

**Problema:** Error de TypeScript con eventos.

**Solución:** Usa los tipos correctos de React:

```tsx
// Click event
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }

// Change event
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }

// Keyboard event
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { ... }

// Form event
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... }
```

#### 3. Types genéricos

**Problema:** Error al usar generics en componentes.

**Solución:** Declara el tipo genérico explícitamente:

```tsx
export interface TableProps<T> {
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

export const Table = <T,>({ data, renderRow }: TableProps<T>) => {
  return <div>{data.map(renderRow)}</div>;
};
```

---

## Recursos

### Herramientas

- **TypeScript:** [Documentation](https://www.typescriptlang.org/docs/)
- **React:** [Documentation](https://react.dev/)
- **Vitest:** [Documentation](https://vitest.dev/)
- **Testing Library:** [Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- **Tailwind CSS:** [Documentation](https://tailwindcss.com/docs)
- **ARIA:** [Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- **WCAG:** [Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Extensiones de VS Code Recomendadas

- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- Error Lens
- Import Cost

---

## Publicación y Versionado

### Semántica de Versionado

- **Major (X.0.0)** - Cambios breaking
- **Minor (0.X.0)** - Nuevas features, backward compatible
- **Patch (0.0.X)** - Bug fixes, backward compatible

### Changelog

Mantén un `CHANGELOG.md` con el formato:

```markdown
## [1.2.0] - 2026-02-03

### Added
- New feature 1
- New feature 2

### Changed
- Improved performance of ComponentX
- Updated dependencies

### Fixed
- Bug fix 1
- Bug fix 2

### Breaking Changes
- ComponentX prop renamed (migration guide)
```

---

**Última Actualización:** 2026-02-03
**Versión:** 1.0.0
**Mantenimiento:** Activo
