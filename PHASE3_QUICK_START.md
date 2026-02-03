# Phase 3 Components - Quick Start Guide

## Import Examples

### Individual Component Imports

```typescript
// Navigation Components
import { Tabs, Breadcrumb, Pagination, Stepper } from '@/shared/components/ui/navigation';

// Data Display Components
import { Card, Table, Badge, Avatar, StatCard, Divider } from '@/shared/components/ui/data-display';
```

### Type Imports

```typescript
// For type safety
import type {
  Tab, TabsProps, TabsOrientation,
  BreadcrumbItem, BreadcrumbProps,
  PaginationProps,
  Step, StepperProps, StepperOrientation
} from '@/shared/components/ui/navigation';

import type {
  CardProps, CardVariant,
  TableColumn, TableProps, SortOrder,
  BadgeProps, BadgeVariant, BadgeSize,
  AvatarProps, AvatarSize,
  StatCardProps, TrendDirection,
  DividerProps, DividerOrientation
} from '@/shared/components/ui/data-display';
```

## Usage Examples

### 1. Tabs - Navigation by Categories

```typescript
import { Tabs } from '@/shared/components/ui/navigation';

function RewardsCatalog() {
  const tabs = [
    {
      id: 'all',
      label: 'Todas',
      icon: '🎁',
      content: <div>All rewards here</div>
    },
    {
      id: 'products',
      label: 'Productos',
      icon: '📦',
      content: <div>Products here</div>
    },
    {
      id: 'experiences',
      label: 'Experiencias',
      icon: '⭐',
      content: <div>Experiences here</div>
    }
  ];

  return <Tabs tabs={tabs} defaultTab="all" />;
}
```

### 2. Breadcrumb - Navigation Trail

```typescript
import { Breadcrumb } from '@/shared/components/ui/navigation';

function ProductPage() {
  const items = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Rewards', href: '/rewards' },
    { label: 'Product', href: '/rewards/product' },
    { label: 'Current Product' } // Current page
  ];

  return <Breadcrumb items={items} separator=">" />;
}
```

### 3. Pagination - Data List Navigation

```typescript
import { Pagination } from '@/shared/components/ui/navigation';
import { useState } from 'react';

function UserList() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
      pageSize={20}
      showPageSizeSelector={true}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}
```

### 4. Stepper - Multi-Step Process

```typescript
import { Stepper } from '@/shared/components/ui/navigation';

function CheckoutFlow() {
  const steps = [
    { id: 'cart', label: 'Carrito', description: 'Revisa tus productos' },
    { id: 'shipping', label: 'Envío', description: 'Datos de envío' },
    { id: 'payment', label: 'Pago', description: 'Método de pago' },
    { id: 'confirm', label: 'Confirmación', description: 'Revisa tu pedido' }
  ];

  return <Stepper steps={steps} currentStep={2} />;
}
```

### 5. Card - Content Container

```typescript
import { Card } from '@/shared/components/ui/data-display';

function RewardCard() {
  return (
    <Card
      title="Descuento 10%"
      description="En tu próxima compra"
      variant="elevated"
      footer={
        <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded">
          Canjear 500 pts
        </button>
      }
    >
      <div className="text-center py-4">
        <span className="text-2xl">🎁</span>
      </div>
    </Card>
  );
}
```

### 6. Table - Sortable Data Table

```typescript
import { Table } from '@/shared/components/ui/data-display';

interface User {
  id: number;
  name: string;
  email: string;
  points: number;
}

function UsersTable({ users }: { users: User[] }) {
  const columns = [
    { id: 'id', label: 'ID', key: 'id' as keyof User, sortable: true },
    { id: 'name', label: 'Nombre', key: 'name' as keyof User, sortable: true },
    {
      id: 'points',
      label: 'Puntos',
      key: 'points' as keyof User,
      sortable: true,
      render: (value: unknown) => (
        <span className="font-bold text-emerald-600">{value as string}</span>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={users}
      sortable={true}
      onSort={(col, order) => console.log(`Sort ${col} ${order}`)}
      emptyMessage="No hay usuarios"
    />
  );
}
```

### 7. Badge - Status Indicators

```typescript
import { Badge } from '@/shared/components/ui/data-display';

function UserStatus() {
  return (
    <div className="flex gap-2">
      <Badge variant="success" showDot>Activo</Badge>
      <Badge variant="warning">Pendiente</Badge>
      <Badge variant="error" size="sm">Error</Badge>
      <Badge variant="info" size="lg">Info</Badge>
    </div>
  );
}
```

### 8. Avatar - User Images

```typescript
import { Avatar } from '@/shared/components/ui/data-display';

function UserProfile() {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        src="/avatar.jpg"
        alt="María García"
        fallback="María García"
        size="lg"
      />
      <div>
        <h4 className="font-semibold">María García</h4>
        <p className="text-sm text-gray-600">maria@example.com</p>
      </div>
    </div>
  );
}
```

### 9. StatCard - Dashboard Metrics

```typescript
import { StatCard } from '@/shared/components/ui/data-display';

function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Usuarios"
        value="12,456"
        change={12.5}
        trend="up"
        icon="👥"
      />
      <StatCard
        title="Puntos"
        value="45,678"
        change={-3.2}
        trend="down"
        icon="💰"
      />
      <StatCard
        title="Recompensas"
        value="234"
        change={8.1}
        trend="up"
        icon="🎁"
      />
      <StatCard
        title="Retención"
        value="78.5%"
        change={0}
        trend="neutral"
        icon="📊"
      />
    </div>
  );
}
```

### 10. Divider - Visual Separation

```typescript
import { Divider } from '@/shared/components/ui/data-display';

function SectionedContent() {
  return (
    <div>
      <h2>Section 1</h2>
      <p>Content here</p>

      <Divider label="Divider with label" />

      <h2>Section 2</h2>
      <p>More content</p>

      <Divider thickness={2} />

      <h2>Section 3</h2>
    </div>
  );
}
```

## Complete Example: Dashboard Page

```typescript
import { useState } from 'react';
import {
  Breadcrumb, Pagination
} from '@/shared/components/ui/navigation';
import {
  Card, Table, Badge, Avatar, StatCard, Divider
} from '@/shared/components/ui/data-display';

interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  status: 'active' | 'inactive';
}

function Dashboard() {
  const [page, setPage] = useState(1);
  const users: User[] = []; // Your data here

  const columns = [
    { id: 'name', label: 'Nombre', key: 'name' as keyof User },
    { id: 'email', label: 'Email', key: 'email' as keyof User },
    {
      id: 'status',
      label: 'Estado',
      key: 'status' as keyof User,
      render: (value: unknown) => (
        <Badge
          variant={value === 'active' ? 'success' : 'error'}
          showDot
        >
          {value as string}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' }
        ]}
      />

      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Usuarios" value="1,234" change={12} trend="up" icon="👥" />
        <StatCard title="Puntos" value="56,789" change={-5} trend="down" icon="💰" />
        <StatCard title="Recompensas" value="456" change={8} trend="up" icon="🎁" />
        <StatCard title="Tasa" value="92%" change={0} trend="neutral" icon="📊" />
      </div>

      <Divider label="Usuarios Recientes" />

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={users}
          sortable={true}
          emptyMessage="No hay usuarios"
        />
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Dashboard;
```

## Component Props Reference

### Tabs
- `tabs`: Tab[] - Array of tab definitions
- `defaultTab`: string - Initial active tab
- `onChange`: (tabId: string) => void - Change handler
- `orientation`: 'horizontal' | 'vertical' - Layout direction

### Breadcrumb
- `items`: BreadcrumbItem[] - Navigation items
- `separator`: string - Separator character (default: '/')

### Pagination
- `currentPage`: number - Active page (1-indexed)
- `totalPages`: number - Total number of pages
- `onPageChange`: (page: number) => void - Change handler
- `pageSize`: number - Items per page (optional)
- `showPageSizeSelector`: boolean - Show page size dropdown

### Stepper
- `steps`: Step[] - Step definitions
- `currentStep`: number - Active step (1-indexed)
- `onStepClick`: (stepId: string) => void - Click handler
- `orientation`: 'horizontal' | 'vertical' - Layout direction

### Card
- `title`: string - Card title
- `description`: string - Card description
- `footer`: ReactNode - Footer content
- `variant`: 'elevated' | 'outlined' | 'flat' - Visual style
- `children`: ReactNode - Card content

### Table
- `columns`: TableColumn[] - Column definitions
- `data`: T[] - Table data
- `sortable`: boolean - Enable sorting
- `onSort`: (columnId, order) => void - Sort handler
- `emptyMessage`: string - Message when no data
- `zebraStripes`: boolean - Alternating row colors

### Badge
- `children`: ReactNode - Badge content
- `variant`: 'success' | 'warning' | 'error' | 'info' | 'neutral'
- `size`: 'sm' | 'md' | 'lg'
- `showDot`: boolean - Show colored dot

### Avatar
- `src`: string - Image URL
- `alt`: string - Alt text
- `fallback`: string - Fallback initials
- `size`: 'sm' | 'md' | 'lg' | 'xl'

### StatCard
- `title`: string - Metric title
- `value`: string | number - Metric value
- `change`: number - Percentage change
- `trend`: 'up' | 'down' | 'neutral'
- `icon`: string - Emoji icon
- `loading`: boolean - Show skeleton

### Divider
- `orientation`: 'horizontal' | 'vertical'
- `label`: string - Optional label text
- `thickness`: number - Border thickness in pixels

## Accessibility Notes

All components include:
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Proper semantic HTML
- ✅ Color contrast (WCAG 2.1 AA)

## Styling

All components use Tailwind CSS and can be customized with:
- `className` prop - Add custom classes
- Variant props - Pre-defined styles
- Tailwind utilities - Direct styling

---

**Need more examples?** See `/src/shared/components/ui/navigation/EXAMPLE.usage.tsx` and `/src/shared/components/ui/data-display/EXAMPLE.usage.tsx`
