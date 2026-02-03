# LoyaltyVibes UI Component Library

Biblioteca de componentes UI de React diseñada para proporcionar una experiencia de usuario consistente, accesible y visualmente atractiva para aplicaciones web modernas.

## Características

- **25 Componentes Reutilizables** - Cubriendo todas las necesidades UI comunes
- **Accesibilidad WCAG 2.1 AA** - Todos los componentes cumplen con estándares de accesibilidad
- **TypeScript** - Tipado completo para una experiencia de desarrollo segura
- **React Hook Form Compatible** - Integración perfecta con formularios
- **Diseño Responsive** - Componentes que se adaptan a cualquier tamaño de pantalla
- **Tailwind CSS** - Estilizado consistente y personalizable
- **Testing Ready** - Componentes preparados para testing con Vitest y React Testing Library

## Instalación

La biblioteca de componentes está incluida en el proyecto LoyaltyVibes. No requiere instalación adicional.

```bash
# Los componentes están disponibles en:
# /config/workspace/loyaltyvibes/src/shared/components/ui
```

## Uso Rápido

```tsx
import { Button, Alert, TextField } from '@/shared/components/ui';

function MyApp() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Click!')}>
        Click Me
      </Button>

      <Alert variant="success" title="Éxito" message="Operación completada" />

      <TextField
        label="Email"
        type="email"
        placeholder="ejemplo@correo.com"
      />
    </div>
  );
}
```

## Estructura de Componentes

Los componentes están organizados en 3 fases por categoría:

### Fase 1 - Componentes Base (5 componentes)
- **Button** - Botones con múltiples variantes y estados
- **Spinner** - Indicadores de carga
- **Skeleton** - Placeholders de contenido
- **EmptyState** - Estados vacíos
- **Alert** - Alertas y notificaciones inline

### Fase 2 - Formularios y Overlays (10 componentes)
- **TextField** - Campos de texto
- **TextArea** - Áreas de texto multilínea
- **Select** - Selects desplegables
- **Checkbox** - Casillas de verificación
- **RadioGroup** - Grupos de radio buttons
- **FormField** - Wrapper para campos de formulario
- **Toast** - Notificaciones emergentes
- **useToast** - Hook para gestionar toasts
- **Modal** - Diálogos modales
- **ConfirmDialog** - Diálogos de confirmación
- **Tooltip** - Tooltips informativos

### Fase 3 - Navegación y Datos (10 componentes)
- **Tabs** - Navegación por pestañas
- **Breadcrumb** - Migas de pan
- **Pagination** - Controles de paginación
- **Stepper** - Indicadores de progreso multi-paso
- **Card** - Tarjetas de contenido
- **Table** - Tablas de datos
- **Badge** - Etiquetas pequeñas
- **Avatar** - Imágenes de usuario
- **StatCard** - Tarjetas de estadísticas
- **Divider** - Separadores visuales

## Documentación Completa

Para documentación detallada de cada componente, consulta:

- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Catálogo completo de componentes con props, ejemplos y accesibilidad
- **[STORYBOOK.md](./STORYBOOK.md)** - Guía de configuración de Storybook (opcional)
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guía de migración desde componentes antiguos
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Guía para desarrolladores

## Sistema de Diseño

### Colores

La biblioteca utiliza una paleta de colores consistente basada en Tailwind CSS:

#### Colores Principales
- **Emerald (Primario)** - `bg-emerald-600`, `text-emerald-600`, `border-emerald-600`
  - #059669 (RGB: 5, 150, 105)
  - Usado para acciones principales, elementos activos

- **Purple (Secundario)** - `bg-purple-600`, `text-purple-600`
  - #9333EA (RGB: 147, 51, 234)
  - Usado para acciones secundarias

#### Colores Semánticos
- **Success (Verde)** - `bg-emerald-50/100/600`
- **Warning (Amarillo)** - `bg-amber-50/100/600`
- **Error (Rojo)** - `bg-red-50/100/600`
- **Info (Azul)** - `bg-blue-50/100/600`

#### Colores Neutros
- **Gray** - Escala de grises (`gray-50` a `gray-900`)
- **Text** - `text-gray-900` (primario), `text-gray-600` (secundario), `text-gray-500` (terciario)

### Tipografía

#### Tamaños de Fuente
```tsx
text-xs     // 0.75rem (12px)
text-sm     // 0.875rem (14px)
text-base   // 1rem (16px) - default
text-lg     // 1.125rem (18px)
text-xl     // 1.25rem (20px)
text-2xl    // 1.5rem (24px)
text-3xl    // 1.875rem (30px)
```

#### Pesos de Fuente
```tsx
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

### Espaciado

La escala de espaciado sigue los valores de Tailwind CSS:

```tsx
p-1    // 0.25rem (4px)
p-2    // 0.5rem (8px)
p-3    // 0.75rem (12px)
p-4    // 1rem (16px)
p-6    // 1.5rem (24px)
p-8    // 2rem (32px)
```

### Border Radius

```tsx
rounded-md     // 0.375rem (6px) - default para inputs
rounded-lg     // 0.5rem (8px) - default para cards
rounded-xl     // 0.75rem (12px)
rounded-full   // 9999px - círculos completos
```

### Sombras

```tsx
shadow-sm      // Sombra pequeña
shadow-md      // Sombra media (default para cards)
shadow-lg      // Sombra grande
shadow-xl      // Sombra extra grande
```

### Animaciones

#### Duraciones
```tsx
duration-150   // 150ms - transiciones rápidas
duration-200   // 200ms - default para hover
duration-300   // 300ms - transiciones lentas
```

#### Funciones de Easing
- Por defecto: `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`
- Todas las transiciones usan la curva de bezier estándar de Tailwind

## Accesibilidad

Todos los componentes de LoyaltyVibes UI cumplen con los estándares WCAG 2.1 AA:

- **Contraste de Color** - Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Navegación por Teclado** - Todos los componentes interactivos son accesibles por teclado
- **ARIA Labels** - Uso apropiado de atributos ARIA para lectores de pantalla
- **Focus Indicators** - Indicadores de foco visibles en todos los elementos interactivos
- **Semántica HTML** - Uso correcto de elementos HTML semánticos

### Soporte de Teclado

- **Tab** - Navegar entre elementos interactivos
- **Shift+Tab** - Navegar en reversa
- **Enter/Space** - Activar botones y elementos seleccionables
- **Escape** - Cerrar modales y overlays
- **Flechas** - Navegar dentro de componentes (tabs, steppers, etc.)

## Testing

Los componentes incluyen tests completos usando Vitest y React Testing Library:

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:coverage
```

### Ejemplo de Test

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## React Hook Form Integration

Todos los componentes de formulario son compatibles con React Hook Form:

```tsx
import { useForm } from 'react-hook-form';
import { TextField, Select, Checkbox } from '@/shared/components/ui/forms';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Nombre"
        error={errors.name?.message}
        {...register('name', { required: 'Nombre requerido' })}
      />

      <Select
        label="Categoría"
        options={[{ value: 'tech', label: 'Tecnología' }]}
        {...register('category')}
      />

      <Checkbox
        label="Acepto términos"
        {...register('terms')}
      />

      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

## Contribución

Para contribuir a la biblioteca de componentes:

1. Lee [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
2. Sigue las guías de estilo y mejores prácticas
3. Asegura que todos los tests pasen
4. Mantén la cobertura de código acima del 85%
5. Documenta nuevos componentes y props

## Licencia

Esta biblioteca es parte del proyecto LoyaltyVibes.

## Soporte

Para preguntas, problemas o sugerencias:
- Revisa la documentación en [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)
- Consulta ejemplos de uso en `/src/shared/components/ui/*/EXAMPLE.usage.tsx`
- Revisa tests en `/src/shared/components/ui/*/__tests__/`

---

**Versión:** 1.0.0
**Última Actualización:** 2026-02-03
**Mantenimiento:** Activo
