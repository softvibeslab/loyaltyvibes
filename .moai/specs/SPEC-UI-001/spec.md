---
id: SPEC-UI-001
version: "1.0.0"
status: draft
created: "2026-02-03"
updated: "2026-02-03"
author: "MoAI-ADK"
priority: HIGH
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-03 | MoAI-ADK | Creación inicial SPEC - Sistema de Componentes UI |

---

# SPEC-UI-001: Sistema de Componentes UI y Design System

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-UI-001 |
| **Title** | Sistema de Componentes UI y Design System para LoyaltyVibes |
| **Priority** | HIGH (Experiencia de Usuario) |
| **Domain** | UI |
| **Lifecycle** | spec-anchored (Level 2) |
| **Dependencies** | SPEC-AUTH-001, SPEC-GAMIFICATION-002 |

## Description

Especificación completa del sistema de componentes UI reutilizables, design system consistente, y patrones de experiencia de usuario para LoyaltyVibes. Esta SPEC establece los estándares para todos los componentes de interfaz, garantizando coherencia visual, accesibilidad WCAG 2.1 AA, responsive design, y optimización para PWA. El sistema actual requiere expansión para cubrir gaps críticos en componentes de formularios, feedback visual, navegación, y estados de carga.

**Tipo de Especificación**: MEJORA + EXPANSIÓN (el sistema base existe, esta SPEC estandariza y expande)

---

## 1. Environment

### 1.1 Stack Tecnológico UI

| Layer | Technology | Versión | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 14+ (App Router) | Hybrid rendering |
| UI Library | React | 18.2+ | Componentes |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| Types | TypeScript | 5.3+ | Type safety |
| Icons | Emoji System | - | Iconografía ligera |
| State | React Context + Hooks | Latest | Estado local |
| Validation | Zod + React Hook Form | Latest | Formularios |

### 1.2 Estado Actual del Sistema UI

**Componentes Existentes** (Implementados):

| Componente | Ubicación | Estado | Calidad |
|------------|-----------|--------|---------|
| `TierBadge` | `/src/shared/components/ui/` | ✅ Completo | ALTA |
| `OfflineIndicator` | `/src/shared/components/ui/` | ✅ Completo | ALTA |
| `TierProgress` | `/src/features/wallet/components/` | ✅ Completo | MEDIA |
| `LevelProgress` | `/src/features/gamification/components/` | ✅ Completo | ALTA |
| `PointsDashboard` | `/src/features/wallet/components/` | ✅ Completo | MEDIA |
| `TransactionHistory` | `/src/features/transactions/components/` | ✅ Completo | ALTA |
| `AuthGuard` | `/src/features/auth/components/` | ✅ Completo | ALTA |

**Gaps Críticos Identificados**:

| Gap | Impacto | Prioridad | Complejidad |
|-----|---------|-----------|-------------|
| Sin componentes de formularios reutilizables | ALTO | ALTA | MEDIA |
| Sin sistema de notificaciones/toast | ALTO | ALTA | MEDIA |
| Sin modales genéricos | MEDIO | ALTA | BAJA |
| Sin componentes de loading consistentes | MEDIO | MEDIA | BAJA |
| Sin manejo de errores visual estandarizado | ALTO | ALTA | MEDIA |
| Sin skeletons para loading states | BAJO | MEDIA | BAJA |
| Sin sistema de tabs/navigation | MEDIO | MEDIA | MEDIA |
| Sin componentes de empty states | BAJO | BAJA | BAJA |
| Sin confirm dialogs | MEDIO | MEDIA | BAJA |
| Sin search input estandarizado | BAJO | BAJA | BAJA |

### 1.3 Design System Actual

**Colores Primarios** (Tailwind config):

| Uso | Color | Clase Tailwind |
|-----|-------|----------------|
| Primary (emerald) | #10b981 | `bg-emerald-500` |
| Secondary (purple) | #a855f7 | `bg-purple-500` |
| Accent (amber) | #f59e0b | `bg-amber-500` |
| Success | #10b981 | `bg-emerald-500` |
| Warning | #f59e0b | `bg-amber-500` |
| Error | #ef4444 | `bg-red-500` |
| Info | #3b82f6 | `bg-blue-500` |

**Tipografía**:

| Elemento | Tamaño | Weight |
|----------|--------|--------|
| H1 | 2.5rem (40px) | Bold (700) |
| H2 | 2rem (32px) | Bold (700) |
| H3 | 1.5rem (24px) | Semibold (600) |
| Body | 1rem (16px) | Normal (400) |
| Small | 0.875rem (14px) | Normal (400) |
| XSmall | 0.75rem (12px) | Normal (400) |

**Espaciado** (Scale Tailwind):

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 0.25rem (4px) | Micro espaciado |
| sm | 0.5rem (8px) | Elementos relacionados |
| md | 1rem (16px) | Espaciado estándar |
| lg | 1.5rem (24px) | Secciones |
| xl | 2rem (32px) | Contenedores grandes |
| 2xl | 3rem (48px) | Márgenes externos |

**Border Radius**:

| Tamaño | Valor | Uso |
|-------|-------|-----|
| sm | 0.25rem | Small elements |
| md | 0.375rem | Cards |
| lg | 0.5rem | Buttons |
| xl | 0.75rem | Large cards |
| 2xl | 1rem | Modals |
| full | 9999px | Pills, badges |

---

## 2. Assumptions

### 2.1 Suposiciones Técnicas

| ID | Suposición | Confianza |
|----|------------|-----------|
| A-01 | Tailwind CSS puede manejar todos los estilos necesarios | ALTA |
| A-02 | No se requiere librería de componentes externa (shadcn/ui, etc.) | MEDIA |
| A-03 | Los emojis son suficientes como sistema de iconos | ALTA |
| A-04 | El sistema debe soportar dark mode en el futuro | MEDIA |
| A-05 | Los componentes deben ser PWA-optimizados (mobile-first) | ALTA |

### 2.2 Suposiciones de Usuario

| ID | Suposición | Confianza |
|----|------------|-----------|
| U-01 | Los usuarios acceden principalmente desde dispositivos móviles | ALTA |
| U-02 | Los usuarios esperan feedback visual inmediato | ALTA |
| U-03 | Los usuarios toleran hasta 3 segundos de loading | MEDIA |
| U-04 | Los usuarios con accesibilidad necesitan WCAG 2.1 AA | ALTA |
| U-05 | Los usuarios prefieren interfaces simples y directas | ALTA |

### 2.3 Suposiciones de Negocio

| ID | Suposición | Confianza |
|----|------------|-----------|
| B-01 | La consistencia visual mejora la confianza del usuario | ALTA |
| B-02 | El sistema de componentes debe ser fácil de mantener | ALTA |
| B-03 | La accesibilidad es un requisito legal (México) | ALTA |
| B-04 | El rendimiento UI impacta directamente en conversión | ALTA |

---

## 3. Requirements (EARS Format)

### 3.1 Ubiquitous Requirements

| ID | Requirement |
|----|-------------|
| U-01 | El sistema **deberá** mantener consistencia visual en todos los componentes |
| U-02 | El sistema **deberá** cumplir con WCAG 2.1 AA para accesibilidad |
| U-03 | El sistema **deberá** ser responsive (mobile-first approach) |
| U-04 | El sistema **deberá** proporcionar feedback visual para todas las acciones |
| U-05 | El sistema **deberá** manejar estados de carga de manera consistente |
| U-06 | El sistema **deberá** manejar errores de manera clara y action-oriented |
| U-07 | El sistema **deberá** soportar tanto light como dark mode (preparación) |
| U-08 | El sistema **deberá** utilizar TypeScript para type safety |
| U-09 | El sistema **deberá** optimizar para PWA (bajo consumo de recursos) |
| U-10 | El sistema **deberá** proveer componentes keyboard-navegable |
| U-11 | El sistema **deberá** incluir ARIA labels apropiados |
| U-12 | El sistema **deberá** manejar estados vacíos (empty states) |
| U-13 | El sistema **deberá** incluir skeletons para contenido cargando |
| U-14 | El sistema **deberá** proveer tooltips para íconos/actions no obvios |
| U-15 | El sistema **deberá** mantener contraste de color mínimo 4.5:1 |

### 3.2 Event-Driven Requirements

| ID | Event | Action |
|----|-------|--------|
| E-01 | **CUANDO** usuario interactúa con un componente **ENTONCES** mostrar feedback visual inmediato (loading, success, error) |
| E-02 | **CUANDO** ocurre un error de validación **ENTONCES** mostrar mensaje inline con el campo específico |
| E-03 | **CUANDO** una acción async está en proceso **ENTONCES** mostrar loading indicator y deshabilitar trigger |
| E-04 | **CUANDO** una acción tiene éxito **ENTONCES** mostrar toast/notification de éxito (opcional para acciones rápidas) |
| E-05 | **CUANDO** una acción falla **ENTONCES** mostrar mensaje de error con acción de recuperación |
| E-06 | **CUANDO** dispositivo está offline **ENTONCES** mostrar indicador visual persistente |
| E-07 | **CUANDO** conexión se restaura **ENTONCES** mostrar notificación de "conexión restaurada" |
| E-08 | **CUANDO** usuario presiona Enter en form **ENTONCES** submit form |
| E-09 | **CUANDO** lista está vacía **ENTONCES** mostrar empty state con ilustración y call-to-action |
| E-10 | **CUANDO** contenido está cargando **ENTONCES** mostrar skeleton shimmer |
| E-11 | **CUANDO** modal se abre **ENTONCES** trap focus dentro del modal |
| E-12 | **CUANDO** usuario intenta cerrar modal con ESC **ENTONCES** cerrar modal |
| E-13 | **CUANDO** usuario selecciona tab **ENTONCES** mostrar contenido con fade-in animation |
| E-14 | **CUANDO** usuario escribe en search **ENTONCES** mostrar resultados con debounce 300ms |
| E-15 | **CUANDO** usuario confima acción destructiva **ENTONCES** requerir confirmación explícita |
| E-16 | **CUANDO** usuario alcanza nivel de tier **ENTONCES** mostrar confetti animation |
| E-17 | **CUANDO** formulario tiene errores **ENTONCES** scroll al primer error y focus |
| E-18 | **CUANDO** usuario navega con keyboard **ENTONCES** mantener focus visible |
| E-19 | **CUANDO** tooltip se muestra **ENTONCES** posicionarse inteligentemente (evitar overflow) |
| E-20 | **CUANDO** toast/notification aparece **ENTONCES** auto-dismiss después de 5s (configurable) |

### 3.3 State-Driven Requirements

| ID | Condition | Action |
|----|-----------|--------|
| S-01 | **SI** componente está disabled **ENTONCES** aplicar opacity 0.5 y cursor not-allowed |
| S-02 | **SI** componente está loading **ENTONCES** mostrar spinner o skeleton según contexto |
| S-03 | **SI** form tiene errores **ENTONCES** deshabilitar submit hasta que se corrijan |
| S-04 | **SI** dispositivo es mobile (<768px) **ENTONCES** usar stacked layouts |
| S-05 | **SI** dispositivo es desktop (>=768px) **ENTONCES** usar side-by-side layouts |
| S-06 | **SI** usuario tiene prefers-reduced-motion **ENTONCES** deshabilitar animaciones |
| S-07 | **SI** lista tiene items **ENTONCES** ocultar empty state |
| S-08 | **SI** modal está abierto **ENTONCES** prevenir scroll del body |
| S-09 | **SI** dark mode está activo **ENTONCES** usar variantes de color oscuras |
| S-10 | **SI** input es required **ENTONCES** mostrar asterisco rojo en label |
| S-11 | **SI** input tiene valor **ENTONCES** mostrar botón de clear |
| S-12 | **SI** toast es de error **ENTONCES** no auto-dismiss (requiere acción) |
| S-13 | **SI** toast es de success **ENTONCES** auto-dismiss después de 3s |
| S-14 | **SI** dropdown está abierto **ENTONCES** cerrar al hacer click fuera |
| S-15 | **SI** tooltip se muestra cerca del edge **ENTONCES** flip posición |

### 3.4 Optional Requirements

| ID | Feature |
|----|---------|
| O-01 | **DONDE** sea posible, permitir theme switcher (light/dark) |
| O-02 | **DONDE** sea posible, mostrar shortcuts de keyboard en tooltips |
| O-03 | **DONDE** sea posible, permitir customización de animaciones |
| O-04 | **DONDE** sea posible, incluir tour guide para first-time users |
| O-05 | **DONDE** sea posible, implementar skeleton screen para toda la página |
| O-06 | **DONDE** sea posible, permitir undo de acciones destructivas |
| O-07 | **DONDE** sea posible, mostrar progreso de carga en % para operaciones largas |
| O-08 | **DONDE** sea posible, incluir micro-interactions (hover, click feedback) |
| O-09 | **DONDE** sea posible, permitir agrupar múltiples toasts |
| O-10 | **DONDE** sea posible, implementar virtual scrolling para listas largas |

### 3.5 Unwanted Behavior Requirements

| ID | Prohibition |
|----|-------------|
| N-01 | El sistema **NO DEBERÁ** usar alert() nativos del browser |
| N-02 | El sistema **NO DEBERÁ** tener componentes sin ARIA labels |
| N-03 | El sistema **NO DEBERÁ** usar colores solo para diferenciar estados (requiere icono/texto) |
| N-04 | El sistema **NO DEBERÁ** bloquear el thread principal con animaciones |
| N-05 | El sistema **NO DEBERÁ** hacer scroll sin intención del usuario |
| N-06 | El sistema **NO DEBERÁ** cambiar estado sin feedback visual |
| N-07 | El sistema **NO DEBERÁ** usar !important en estilos (salvo excepciones justificadas) |
| N-08 | El sistema **NO DEBERÁ** tener hardcoded text (usar i18n ready) |
| N-09 | El sistema **NO DEBERÁ** asumir left-to-right (soportar RTL futuro) |
| N-10 | El sistema **NO DEBERÁ** usar timeouts arbitrarios para manejo de estados |
| N-11 | El sistema **NO DEBERÁ** confiar solo en color para indicar error (requieren icono) |
| N-12 | El system **NO DEBERÁ** tener focus traps no intencionales |

### 3.6 Complex Requirements

| ID | Requirement |
|----|-------------|
| C-01 | **MIENTRAS** formulario está siendo validado **Y CUANDO** hay campos inválidos **ENTONCES** mostrar error inline, scroll al primer error, focus en el campo, y deshabilitar submit |
| C-02 | **MIENTRAS** modal está abierto **Y CUANDO** usuario presiona Escape **ENTONCES** cerrar modal y retornar focus al elemento trigger |
| C-03 | **MIENTRAS** lista está siendo filtrada **Y CUANDO** búsqueda no tiene resultados **ENTONCES** mostrar empty state con mensaje personalizado y opción de limpiar filtros |
| C-04 | **MIENTRAS** componente está montado **Y CUANDO** dispositivo cambia de orientación **ENTONCES** reajustar layout sin perder scroll position |
| C-05 | **MIENTRAS** toast está visible **Y CUANDO** usuario hover sobre él **ENTONCES** pausar auto-dismiss timer |
| C-06 | **MIENTRAS** usuario navega con tabs **Y CUANDO** tab activo cambia **ENTONCES** actualizar URL param, mantener scroll position si es posible, y anunciar cambio via ARIA |
| C-07 | **MIENTRAS** skeleton está visible **Y CUANDO** contenido carga **ENTONCES** hacer fade-out del skeleton y fade-in del contenido |
| C-08 | **MIENTRAS** tooltip está visible **Y CUANDO** se muestra cerca del edge de viewport **ENTONCES** flip posición (top ↔ bottom, left ↔ right) |
| C-09 | **MIENTRAS** dropdown está abierto **Y CUANDO** usuario presiona Escape **ENTONCES** cerrar dropdown y retornar focus al trigger |
| C-10 | **MIENTRAS** usuario está en low-end device **Y CUANDO** se detecta lag **ENTONCES** reducir complejidad de animaciones automáticamente |

---

## 4. Component Library Specification

### 4.1 Estructura de Directorios

```
src/shared/components/
├── ui/                          # Componentes base reutilizables
│   ├── forms/                   # Componentes de formularios
│   │   ├── Input.tsx           # Input genérico
│   │   ├── TextArea.tsx        # Text area genérico
│   │   ├── Select.tsx          # Dropdown select
│   │   ├── Checkbox.tsx        # Checkbox con label
│   │   ├── RadioGroup.tsx      # Grupo de radio buttons
│   │   ├── FormField.tsx       # Wrapper con label + error
│   │   └── Form.tsx            # Form con validación integrada
│   ├── feedback/                # Componentes de feedback
│   │   ├── Alert.tsx           # Alertas inline
│   │   ├── Toast.tsx           # Notificaciones flotantes
│   │   ├── Spinner.tsx         # Loading spinner
│   │   ├── ProgressBar.tsx     # Barra de progreso
│   │   └── Skeleton.tsx        # Skeleton loading
│   ├── navigation/              # Componentes de navegación
│   │   ├── Tabs.tsx            # Tab navigation
│   │   ├── Breadcrumb.tsx      # Breadcrumb navigation
│   │   ├── Pagination.tsx      # Paginación
│   │   └── Stepper.tsx         # Stepper para multi-step forms
│   ├── overlays/                # Componentes superpuestos
│   │   ├── Modal.tsx           # Modal genérico
│   │   ├── ConfirmDialog.tsx   # Diálogo de confirmación
│   │   ├── Tooltip.tsx         # Tooltip
│   │   └── Popover.tsx         # Popover/Dropdown
│   ├── data-display/            # Visualización de datos
│   │   ├── Card.tsx            # Card container
│   │   ├── Table.tsx           # Tabla responsive
│   │   ├── Badge.tsx           # Badge genérico
│   │   ├── Avatar.tsx          # Avatar con iniciales
│   │   ├── EmptyState.tsx      # Empty state
│   │   └── StatCard.tsx        # Tarjeta de estadísticas
│   ├── buttons/                 # Componentes de botones
│   │   ├── Button.tsx          # Botón genérico
│   │   ├── IconButton.tsx      # Botón con icono
│   │   ├── ButtonGroup.tsx     # Grupo de botones
│   │   └── ToggleButton.tsx    # Toggle button
│   └── layout/                  # Componentes de layout
│       ├── Container.tsx       # Container con max-width
│       ├── Grid.tsx            # Grid responsive
│       ├── Stack.tsx           # Stack vertical/horizontal
│       └── Divider.tsx         # Divider/separator
├── shared/                      # Componentes compartidos específicos del dominio
│   ├── TierBadge.tsx           # [EXISTE] Badge de nivel
│   ├── OfflineIndicator.tsx    # [EXISTE] Indicador offline
│   └── QRCode.tsx              # Componente QR code
└── layouts/                     # Layouts de página
    ├── ClientLayout.tsx        # [EXISTE] Layout clientes
    ├── StaffLayout.tsx         # Layout staff
    └── AdminLayout.tsx         # Layout admin
```

### 4.2 Componentes Prioritarios (Fase 1)

#### 4.2.1 Button System

**Archivo**: `/src/shared/components/ui/buttons/Button.tsx`

```typescript
// Button System - Componente base de botones

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonState = 'default' | 'loading' | 'disabled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

**Requisitos**:
- ✅ Soportar 4 variantes (primary, secondary, ghost, danger)
- ✅ Soportar 3 tamaños (sm, md, lg)
- ✅ Estado de loading con spinner
- ✅ Deshabilitado cuando loading
- ✅ Iconos izquierdo/derecho opcionales
- ✅ fullWidth option
- ✅ Accesibilidad: focus visible, ARIA labels
- ✅ Keyboard navigation

#### 4.2.2 Input Field

**Archivo**: `/src/shared/components/ui/forms/Input.tsx`

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

// Uso:
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error={errors.email?.message}
  helperText="Usaremos tu email para enviarte promociones"
  required
/>
```

**Requisitos**:
- ✅ Label con indicador de required
- ✅ Mensaje de error inline (debajo del input)
- ✅ Helper text opcional
- ✅ Iconos izquierda/derecha
- ✅ Estados: default, focus, error, disabled
- ✅ Auto-clear button (opcional)
- ✅ Accesibilidad: aria-describedby, aria-invalid
- ✅ Contraste de color 4.5:1 mínimo

#### 4.2.3 FormField (Wrapper)

**Archivo**: `/src/shared/components/ui/forms/FormField.tsx`

```typescript
interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

// Wrapper consistente para todos los inputs del form
export function FormField({ label, error, helperText, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
```

#### 4.2.4 Alert/Inline Message

**Archivo**: `/src/shared/components/ui/feedback/Alert.tsx`

```typescript
type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const ALERT_STYLES: Record<AlertVariant, { bg: string; border: string; icon: string }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: '❌' },
};

// Uso:
<Alert variant="error" title="Error al cargar">
  No se pudo cargar la información. Por favor intenta nuevamente.
</Alert>
```

**Requisitos**:
- ✅ 4 variantes con colores accesibles
- ✅ Icono específico por variante
- ✅ Title opcional
- ✅ Botón de close (opcional)
- ✅ Role="alert" para screen readers
- ✅ Auto-announcement via ARIA live regions

#### 4.2.5 Toast Notification

**Archivo**: `/src/shared/components/ui/feedback/Toast.tsx`

```typescript
type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = no auto-dismiss
  onClose: () => void;
  actions?: Array<{ label: string; onClick: () => void }>;
}

// Sistema de toasts (container + manager)
interface ToastOptions {
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{ label: string; onClick: () => void }>;
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (options: ToastOptions) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, ...options }]);

    if (options.duration !== 0) {
      setTimeout(() => {
        dismiss(id);
      }, options.duration || 5000);
    }

    return id;
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, show, dismiss };
}
```

**Requisitos**:
- ✅ 4 variantes con iconos
- ✅ Auto-dismiss configurable (default 5s)
- ✅ Multiple toasts stacking
- ✅ Actions inline (opcional)
- ✅ Swipe to dismiss (mobile)
- ✅ Position: top-right, top-center, bottom-right
- ✅ ARIA live region
- ✅ Keyboard dismissible (ESC)

#### 4.2.6 Modal

**Archivo**: `/src/shared/components/ui/overlays/Modal.tsx`

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

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: ModalProps) {
  // Prevent body scroll when open
  // Trap focus inside modal
  // Return focus to trigger on close
  // ARIA: role="dialog", aria-modal="true"
}
```

**Requisitos**:
- ✅ Backdrop con overlay oscuro
- ✅ Focus trap dentro del modal
- ✅ Return focus al trigger al cerrar
- ✅ Cerrar con Escape (opcional)
- ✅ Cerrar al hacer click fuera (opcional)
- ✅ Prevenir scroll del body
- ✅ Animation: fade-in + scale-up
- ✅ Responsive: full-screen en mobile
- ✅ ARIA: role="dialog", aria-modal="true", aria-labelledby
- ✅ Anunciar apertura a screen readers

#### 4.2.7 ConfirmDialog

**Archivo**: `/src/shared/components/ui/overlays/ConfirmDialog.tsx`

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

// Hook para usar confirm dialogs
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

**Uso**:
```typescript
const { confirm } = useConfirmDialog();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Eliminar recompensa',
    message: '¿Estás seguro de que deseas eliminar esta recompensa? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    variant: 'danger',
  });

  if (confirmed) {
    await deleteReward();
  }
};
```

#### 4.2.8 Loading Spinner

**Archivo**: `/src/shared/components/ui/feedback/Spinner.tsx`

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'currentColor';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-transparent',
        SIZE_CLASSES[size],
        color === 'primary' && 'border-emerald-500',
        color === 'secondary' && 'border-purple-500',
        className
      )}
      role="status"
      aria-label="Cargando..."
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
```

#### 4.2.9 Skeleton Loading

**Archivo**: `/src/shared/components/ui/feedback/Skeleton.tsx`

```typescript
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200',
        animation === 'pulse' && 'animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="Cargando contenido..."
    />
  );
}
```

#### 4.2.10 Empty State

**Archivo**: `/src/shared/components/ui/data-display/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'no-data' | 'no-results' | 'error' | 'custom';
}

export function EmptyState({
  icon = '📋',
  title,
  description,
  action,
  illustration = 'no-data',
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

### 4.3 Componentes Fase 2 (Media Prioridad)

#### 4.3.1 Tabs

**Archivo**: `/src/shared/components/ui/navigation/Tabs.tsx`

```typescript
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}
```

#### 4.3.2 Select Dropdown

**Archivo**: `/src/shared/components/ui/forms/Select.tsx`

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

#### 4.3.3 Table

**Archivo**: `/src/shared/components/ui/data-display/Table.tsx`

```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}
```

### 4.4 Componentes Fase 3 (Baja Prioridad)

- Tooltip
- Breadcrumb
- Pagination
- Stepper
- Avatar
- Badge (genérico, reutilizar TierBadge como base)
- ProgressBar
- Card (genérico)
- Divider
- Container/Wrapper components

---

## 5. Accesibilidad (WCAG 2.1 AA)

### 5.1 Requisitos Generales

| Principio | Criterio | Implementación |
|-----------|----------|----------------|
| Perceptible | Contraste mínimo 4.5:1 | Todos los textos deben cumplir |
| Perceptible | Texto escalable hasta 200% | No romper layout con zoom |
| Perceptible | Alternativa textual para iconos | aria-label en todos los iconos decorativos |
| Operable | Keyboard navegable | Tab order lógico, focus visible |
| Operable | Sin traps de teclado | Verificar modals, dropdowns |
| Operable | Tiempo suficiente | Loading indicators con timeout |
| Entendible | Mensajes de error claros | No usar códigos de error técnicos |
| Entendible | Etiquetas consistentes | Mismos labels para mismos conceptos |
| Robusto | Compatible con AT | ARIA attributes correctos |

### 5.2 ARIA Attributes por Tipo de Componente

**Botones**:
```tsx
<Button aria-label="Cerrar modal" aria-describedby="close-description">
  <XIcon />
  <span id="close-description" className="sr-only">
    Cerrar esta ventana y retornar a la página anterior
  </span>
</Button>
```

**Inputs**:
```tsx
<Input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : 'email-helper'}
  error={error}
/>
{error && (
  <span id="email-error" role="alert" className="text-red-600">
    {error}
  </span>
)}
```

**Modals**:
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Eliminar Recompensa</h2>
  <p id="modal-description">Esta acción no se puede deshacer.</p>
</div>
```

**Toasts**:
```tsx
<div role="alert" aria-live="polite" aria-atomic="true">
  {message}
</div>
```

### 5.3 Keyboard Navigation

| Componente | Navegación | Shortcuts |
|------------|------------|-----------|
| Botones | Tab, Enter, Space | - |
| Inputs | Tab, Shift+Tab | Escape para clear |
| Dropdown | Alt+Down/Up, Esc | Flechas para navegar opciones |
| Modal | Trap inside | Esc para cerrar |
| Tabs | Flechas izquierda/derecha | Home/End para primero/último |
| Checkbox | Tab, Space | - |

### 5.4 Focus Management

```typescript
// Focus trap implementation
function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const focusableElements = containerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleTab);

    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive]);

  return containerRef;
}
```

---

## 6. Responsive Design Patterns

### 6.1 Breakpoints

```typescript
// Tailwind default breakpoints (usar estas)
const BREAKPOINTS = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;
```

### 6.2 Patrones de Layout

**Container Pattern**:
```tsx
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
```

**Grid Pattern**:
```tsx
export function Grid({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 | 3 | 4 }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[cols])}>
      {children}
    </div>
  );
}
```

**Stack Pattern**:
```tsx
interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  responsive?: boolean; // En mobile: siempre vertical
}

export function Stack({ children, direction = 'vertical', spacing = 'md', responsive = true }: StackProps) {
  const spacingClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={cn(
      'flex',
      directionClass,
      spacingClass[spacing],
      responsive && 'flex-col md:flex-row'
    )}>
      {children}
    </div>
  );
}
```

### 6.3 Mobile-First Patterns

**Touchable Areas**:
- Mínimo 44x44px para botones (iOS HIG)
- Mínimo 48x48px para targets táctiles (Material Design)

**Typography Scale**:
```tsx
// Text responsive: más grande en desktop
<Text className="text-base md:text-lg lg:text-xl">
  Este texto escala con el viewport
</Text>
```

---

## 7. Animations y Micro-interactions

### 7.1 Timing Functions

```typescript
// Tailwind animation utilities
const EASING = {
  ease: 'transition ease-in-out',
  in: 'transition ease-in',
  out: 'transition ease-out',
  bounce: 'transition-bounce',
} as const;

const DURATIONS = {
  fast: 'duration-150',   // 150ms
  normal: 'duration-300', // 300ms
  slow: 'duration-500',   // 500ms
} as const;
```

### 7.2 Animation Primitives

**Fade In/Out**:
```tsx
<div className="animate-fade-in">
  Contenido con fade-in
</div>

// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
}
```

**Scale Up/Down** (para modals):
```tsx
<div className="animate-scale-up">
  Contenido del modal
</div>

// keyframes
'scale-up': {
  '0%': { transform: 'scale(0.95)', opacity: '0' },
  '100%': { transform: 'scale(1)', opacity: '1' },
},
```

**Slide In** (para toasts/drawers):
```tsx
// Slide from right (toasts)
'slide-in-right': {
  '0%': { transform: 'translateX(100%)' },
  '100%': { transform: 'translateX(0)' },
},
```

**Shimmer** (para skeletons):
```tsx
<div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]">
  Skeleton shimmer
</div>

// keyframes
'shimmer': {
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-200% 0' },
},
```

### 7.3 Reduced Motion Support

```tsx
// Hook para detectar preferencia de reduced motion
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

// Uso en componentes
const prefersReducedMotion = useReducedMotion();

<div className={prefersReducedMotion ? '' : 'animate-fade-in'}>
  Contenido
</div>
```

---

## 8. Performance Optimization

### 8.1 Code Splitting

```typescript
// Lazy loading de componentes pesados
const RewardDetailModal = lazy(() => import('@/features/rewards/components/RewardDetailModal'));

function RewardCatalog() {
  return (
    <Suspense fallback={<Spinner />}>
      <RewardDetailModal />
    </Suspense>
  );
}
```

### 8.2 Virtual Scrolling (para listas largas)

```typescript
// Usar react-window para listas con 100+ items
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <TransactionItem transaction={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 8.3 Image Optimization

```tsx
// Next.js Image component para imágenes optimizadas
import Image from 'next/image';

<Image
  src="/rewards/coffee.jpg"
  alt="Café gratis"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should show spinner when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByLabelText('Cargando...')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 9.2 Accessibility Tests

```typescript
// Input.test.tsx - Accesibilidad
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input accessibility', () => {
  it('should have aria-invalid when error', () => {
    render(<Input error="Required field" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should associate error message with input', () => {
    render(<Input error="Required field" name="test" />);
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('Required field');
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
  });
});
```

### 9.3 Visual Regression Tests

```typescript
// Usar Percy o Chromatic para snapshots visuales
// Asegurar que cambios no rompan el diseño
```

---

## 10. Implementation Plan

### 10.1 Fase 1: Componentes Críticos (Semana 1-2)

| Componente | Prioridad | Complejidad | Estimado |
|------------|-----------|-------------|----------|
| Button | ALTA | BAJA | 2 horas |
| Input | ALTA | MEDIA | 4 horas |
| FormField | ALTA | BAJA | 2 horas |
| Alert | ALTA | BAJA | 2 horas |
| Toast | ALTA | MEDIA | 6 horas |
| Modal | ALTA | MEDIA | 6 horas |
| ConfirmDialog | ALTA | MEDIA | 4 horas |
| Spinner | ALTA | BAJA | 1 hora |
| Skeleton | ALTA | BAJA | 2 horas |
| EmptyState | ALTA | BAJA | 2 horas |

**Total Fase 1**: ~31 horas (~4 días)

### 10.2 Fase 2: Componentes de Navegación (Semana 3)

| Componente | Prioridad | Complejidad | Estimado |
|------------|-----------|-------------|----------|
| Tabs | MEDIA | MEDIA | 6 horas |
| Select | MEDIA | ALTA | 8 horas |
| Table | MEDIA | ALTA | 10 horas |
| Tooltip | MEDIA | MEDIA | 4 horas |
| Breadcrumb | BAJA | BAJA | 3 horas |

**Total Fase 2**: ~31 horas (~4 días)

### 10.3 Fase 3: Polish y Optimización (Semana 4)

| Tarea | Estimado |
|------|----------|
| Migrar páginas existentes a nuevos componentes | 12 horas |
| Testing completo de componentes | 8 horas |
| Documentación Storybook (opcional) | 8 horas |
| Optimización de performance | 4 horas |
| Accesibilidad audit | 4 horas |

**Total Fase 3**: ~36 horas (~5 días)

### 10.4 Entregables

**Semana 1-2**:
- ✅ 10 componentes base críticos
- ✅ Tests unitarios (85% coverage)
- ✅ Documentación de props con TypeScript
- ✅ Ejemplos de uso

**Semana 3**:
- ✅ 5 componentes de navegación
- ✅ Integración con React Hook Form
- ✅ Tests de accesibilidad (axe-core)

**Semana 4**:
- ✅ Migración de páginas existentes
- ✅ Performance audit
- ✅ Documentación completa
- ✅ Storybook (opcional)

---

## 11. Quality Gates (TRUST 5)

| Pillar | Target | Method |
|--------|--------|--------|
| **Tested** | >= 85% coverage | Vitest + React Testing Library |
| **Readable** | TypeScript strict + ESLint | `npm run lint` |
| **Unified** | Component structure consistency | Pattern review |
| **Secured** | XSS prevention + CSP | No dangerouslySetInnerHTML |
| **Trackable** | Component versioning | Changelog |

### Testing Checklist

**Unit Tests**:
- ✅ Todos los componentes tienen tests
- ✅ Tests cubren props variants
- ✅ Tests cubren interacciones (click, change, etc.)
- ✅ Tests cubren edge cases

**Accessibility Tests**:
- ✅ axe-core passing en todos los componentes
- ✅ Keyboard navigation funcional
- ✅ Screen reader compatibility (NVDA, JAWS)
- ✅ Color contrast >= 4.5:1
- ✅ Focus visible en todos los interactive elements

**Performance Tests**:
- ✅ No re-renders innecesarios (React.memo)
- ✅ Animaciones a 60fps
- ✅ Bundle size analysis (<50KB gzipped para UI library)

---

## 12. Risks

| Risk | Probabilidad | Impacto | Mitigación |
|------|-------------|---------|------------|
| Consistencia visual se rompe con ad-hoc components | ALTA | ALTA | Code review + Storybook documentation |
| Accesibilidad se degrada con custom components | MEDIA | ALTA | axe-core automated testing |
| Performance degrada con muchos componentes | MEDIA | MEDIA | Code splitting + lazy loading |
| Dificultad para mantener muchos componentes | BAJA | MEDIA | Storybook + good documentation |
| Incompatibilidad con React 19 futuro | BAJA | MEDIA | Usar APIs estables de React 18 |

---

## 13. Migration Strategy

### 13.1 Migración de Componentes Existentes

**Componentes a migrar**:
- `/src/shared/components/ui/TierBadge.tsx` ✅ (mantener, buen ejemplo)
- `/src/shared/components/ui/OfflineIndicator.tsx` ✅ (mantener)
- `/src/features/wallet/components/TierProgress.tsx` → Refactor a usar nuevos componentes
- `/src/features/wallet/components/PointsDashboard.tsx` → Refactor a usar Card, StatCard
- `/src/features/transactions/components/TransactionHistory.tsx` → Refactor a usar Table

### 13.2 Orden de Migración

1. **Crear nuevos componentes base** (no romper nada)
2. **Migrar páginas menos críticas primero** (profile, settings)
3. **Migrar páginas críticas después** (wallet, rewards)
4. **Eliminar old components** después de validación
5. **Update tests** para usar nuevos componentes

### 13.3 Backward Compatibility

```typescript
// Exportar alias para backward compatibility
// src/shared/components/ui/index.ts

export { TierBadge } from './TierBadge'; // Mantener existente
export { OfflineIndicator } from './OfflineIndicator'; // Mantener existente

// Nuevos componentes
export { Button } from './buttons/Button';
export { Input } from './forms/Input';
export { Alert } from './feedback/Alert';
// ... etc
```

---

## 14. Dependencies

### Externas

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| tailwindcss | ^3.4.0 | Styling |
| @radix-ui/react-dialog | Latest | Accessible modal primitive (opcional) |
| @radix-ui/react-select | Latest | Accessible select primitive (opcional) |
| react-hook-form | Latest | Form validation |
| zod | Latest | Schema validation |
| @headlessui/react | Latest | Accessible components (opcional, alternativa a Radix) |

### Internas

| Módulo | Dependencia |
|--------|-------------|
| forms | React Hook Form, Zod |
| modals | Focus trap hooks |
| toasts | State management (Zustand o Context) |
| layout | Tailwind breakpoints |

---

## 15. Traceability Matrix

| Requirement ID | Implementación |
|----------------|----------------|
| U-01 | Design tokens en `/src/shared/components/ui/` |
| U-02 | ARIA labels en todos los componentes |
| U-03 | Responsive breakpoints en todos los componentes |
| U-04 | Loading states en todos los async components |
| E-01 | Button con loading prop, Toast system |
| E-02 | Input con error display inline |
| E-03 | Spinner + Skeleton components |
| E-04 | Toast con variant success |
| E-05 | Alert component + Toast error variant |
| S-01 | Button disabled state |
| N-01 | Toast system (reemplaza alert()) |

---

## 16. Success Metrics

### Métricas de Usuario

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to Interactive (TTI) | < 3s | Lighthouse performance audit |
| First Input Delay (FID) | < 100ms | Lighthouse performance audit |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse performance audit |
| Accessibility Score | 100 | Lighthouse accessibility audit |

### Métricas de Desarrollo

| Metric | Target | Measurement |
|--------|--------|-------------|
| Component reusability | > 80% | % de páginas usando componentes compartidos |
| Test coverage | >= 85% | Vitest coverage report |
| Bundle size | < 50KB gzipped | webpack-bundle-analyzer |
| Number of components | 30+ | Component library size |

---

## 17. Appendix A: Tailwind Config Extend

**Archivo**: `/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'fade-out': 'fade-out 300ms ease-in',
        'scale-up': 'scale-up 200ms ease-out',
        'scale-down': 'scale-down 200ms ease-in',
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'slide-out-right': 'slide-out-right 300ms ease-in',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-down': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin para form styling
  ],
};

export default config;
```

---

## 18. Appendix B: Component Props Examples

**Uso completo de componentes**:

```tsx
// Ejemplo: Formulario de login con nuevos componentes
import { Button } from '@/shared/components/ui/buttons/Button';
import { Input } from '@/shared/components/ui/forms/Input';
import { FormField } from '@/shared/components/ui/forms/FormField';
import { Alert } from '@/shared/components/ui/feedback/Alert';

function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  return (
    <div className="max-w-md mx-auto p-4">
      {errors.root && (
        <Alert variant="error" title="Error de inicio de sesión">
          {errors.root.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          error={errors.email?.message}
          required
        >
          <Input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            leftIcon={<EmailIcon />}
          />
        </FormField>

        <FormField
          label="Contraseña"
          error={errors.password?.message}
          required
        >
          <Input
            {...register('password')}
            type="password"
            placeholder="********"
            leftIcon={<LockIcon />}
            rightIcon={<EyeIcon />}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />
        </FormField>

        <Button
          type="submit"
          loading={isSubmitting}
          fullWidth
        >
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
}
```

---

## 19. Appendix C: Migration Checklist

**Fase 1: Setup**
- [ ] Crear estructura de directorios `/src/shared/components/ui/`
- [ ] Configurar Tailwind extendido con animaciones y colores
- [ ] Instalar dependencias (si aplica): @headlessui/react o @radix-ui/*
- [ ] Configurar export barrel en `/src/shared/components/ui/index.ts`

**Fase 2: Componentes Base**
- [ ] Button (sm, md, lg, variants, loading state)
- [ ] Spinner (sm, md, lg, colors)
- [ ] Skeleton (text, circular, rectangular)
- [ ] EmptyState (icon, title, description, action)
- [ ] Alert (info, success, warning, error)

**Fase 3: Form Components**
- [ ] Input (label, error, helperText, icons)
- [ ] TextArea (label, error, helperText)
- [ ] FormField (wrapper)
- [ ] Checkbox (label, error, indeterminate)
- [ ] RadioGroup (label, error, options)

**Fase 4: Overlay Components**
- [ ] Modal (size, closeOnEscape, closeOnOutsideClick)
- [ ] ConfirmDialog (variant, onConfirm)
- [ ] Tooltip (position, trigger)
- [ ] Toast (variant, duration, actions)

**Fase 5: Advanced Components**
- [ ] Tabs (defaultValue, onValueChange)
- [ ] Select (options, searchable)
- [ ] Table (columns, data, pagination)

**Fase 6: Migration**
- [ ] Migrar `/app/(auth)/login/page.tsx` a usar Input, Button, Alert
- [ ] Migrar `/app/(client)/profile/page.tsx` a usar FormField, Input
- [ ] Migrar `/features/wallet/components/PointsDashboard.tsx` a usar StatCard
- [ ] Migrar `/features/transactions/components/TransactionHistory.tsx` a usar Table (Fase 5)

**Fase 7: Testing**
- [ ] Unit tests para todos los componentes (85% coverage)
- [ ] Accessibility tests con axe-core
- [ ] Visual regression tests (opcional)

**Fase 8: Documentation**
- [ ] Props TypeScript docs con JSDoc
- [ ] Ejemplos de uso en cada componente
- [ ] Storybook (opcional)

---

**FIN DEL DOCUMENTO SPEC-UI-001**

**Próximos Pasos**:
1. Revisar y aprobar SPEC
2. Ejecutar `/moai:1-plan SPEC-UI-001` para crear plan de implementación detallado
3. Ejecutar `/moai:2-run SPEC-UI-001` para iniciar desarrollo con DDD
4. Ejecutar `/moai:3-sync SPEC-UI-001` para generar documentación de usuario
