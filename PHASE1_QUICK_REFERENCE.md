# Phase 1 UI Components - Quick Reference Guide

## Import Statement

```typescript
// Import individual components
import { Button, Spinner, Skeleton, EmptyState, Alert } from '@/shared/components/ui';

// Or import specific types
import type { ButtonProps, ButtonVariant } from '@/shared/components/ui';
```

## Button Component

### Basic Usage
```tsx
<Button onClick={() => console.log('clicked')}>Click Me</Button>
```

### All Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### All Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### States
```tsx
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button fullWidth>Full Width</Button>
```

### Full Example
```tsx
<Button
  variant="primary"
  size="lg"
  loading={isLoading}
  fullWidth
  onClick={handleSubmit}
>
  Submit Form
</Button>
```

---

## Spinner Component

### Basic Usage
```tsx
<Spinner />
```

### Sizes
```tsx
<Spinner size="sm" />
<Spinner size="md" />
```

### With Custom Class
```tsx
<Spinner className="mr-2" />
```

### In Button Loading State
```tsx
<Button loading>
  <Spinner size="sm" /> Loading...
</Button>
```

---

## Skeleton Component

### Predefined Variants
```tsx
<Skeleton variant="card" />
<Skeleton variant="text" />
<Skeleton variant="avatar" />
```

### Custom Dimensions
```tsx
<Skeleton variant="custom" width="200px" height="100px" />
<Skeleton variant="custom" width="100%" height="1rem" />
```

### Loading Card Pattern
```tsx
<div className="space-y-3">
  <Skeleton variant="card" />
  <Skeleton variant="text" />
  <Skeleton variant="text" />
  <Skeleton variant="text" width="2/3" />
</div>
```

### User List Pattern
```tsx
<div className="flex items-center space-x-3">
  <Skeleton variant="avatar" />
  <div className="flex-1 space-y-2">
    <Skeleton variant="text" />
    <Skeleton variant="text" width="1/2" />
  </div>
</div>
```

---

## EmptyState Component

### Basic Usage
```tsx
<EmptyState
  icon="📭"
  title="No messages"
  description="You have no messages yet."
/>
```

### With Action Button
```tsx
<EmptyState
  icon="📭"
  title="No messages"
  description="You have no messages yet. Start a conversation!"
  action={{
    label: 'Send Message',
    onClick: () => router.push('/messages/new')
  }}
/>
```

### Common Patterns

#### No Search Results
```tsx
<EmptyState
  icon="🔍"
  title="No results found"
  description="Try adjusting your search or filter to find what you're looking for."
/>
```

#### No Data
```tsx
<EmptyState
  icon="📊"
  title="No data available"
  description="There is no data to display at the moment."
  action={{
    label: 'Refresh',
    onClick: () => refetch()
  }}
/>
```

#### Empty List
```tsx
<EmptyState
  icon="📝"
  title="No items yet"
  description="Create your first item to get started."
  action={{
    label: 'Create Item',
    onClick: () => setOpenCreateDialog(true)
  }}
/>
```

---

## Alert Component

### Basic Usage
```tsx
<Alert description="This is an alert message" />
```

### With Title
```tsx
<Alert
  title="Success!"
  description="Your changes have been saved successfully."
/>
```

### All Variants
```tsx
<Alert variant="success" description="Operation completed successfully" />
<Alert variant="warning" description="Please review before continuing" />
<Alert variant="error" description="An error has occurred" />
<Alert variant="info" description="New features are available" />
```

### Common Patterns

#### Success Message
```tsx
<Alert
  variant="success"
  title="Changes Saved"
  description="Your profile has been updated successfully."
/>
```

#### Warning Message
```tsx
<Alert
  variant="warning"
  title="Account Expiring"
  description="Your account will expire in 3 days. Renew now to continue."
/>
```

#### Error Message
```tsx
<Alert
  variant="error"
  title="Upload Failed"
  description="Failed to upload file. Please check the file size and try again."
/>
```

#### Info Message
```tsx
<Alert
  variant="info"
  title="New Features"
  description="Check out our latest features in the updates section."
/>
```

---

## Color Scheme Reference

### Primary (Emerald)
- bg-emerald-600 (hover: bg-emerald-700)
- text-emerald-800
- border-emerald-200
- bg-emerald-50

### Secondary (Purple)
- bg-purple-600 (hover: bg-purple-700)
- Used for secondary actions

### Semantic Colors
- Success: Emerald
- Warning: Amber (bg-amber-50, text-amber-800, border-amber-200)
- Error: Red (bg-red-50, text-red-800, border-red-200)
- Info: Blue (bg-blue-50, text-blue-800, border-blue-200)

### Neutral Colors
- Gray-50, Gray-100, Gray-200, Gray-300, Gray-400, Gray-600, Gray-700, Gray-900

---

## TypeScript Props Reference

### ButtonProps
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

### SpinnerProps
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}
```

### SkeletonProps
```typescript
interface SkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'custom';
  width?: string;
  height?: string;
  className?: string;
}
```

### EmptyStateProps
```typescript
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}
```

### AlertProps
```typescript
interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description: string;
  className?: string;
}
```

---

## Accessibility Features

All components include:
- Proper ARIA attributes (role, aria-label, aria-live)
- Keyboard navigation support
- Focus visible indicators
- Screen reader support (sr-only text)
- WCAG 2.1 AA color contrast (>= 4.5:1)

---

## Testing

All components have comprehensive test suites:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific component test
npm test -- Button
```

---

## File Locations

```
src/shared/components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   └── __tests__/Button.test.tsx
├── Spinner/
│   ├── Spinner.tsx
│   └── __tests__/Spinner.test.tsx
├── Skeleton/
│   ├── Skeleton.tsx
│   └── __tests__/Skeleton.test.tsx
├── EmptyState/
│   ├── EmptyState.tsx
│   └── __tests__/EmptyState.test.tsx
├── Alert/
│   ├── Alert.tsx
│   └── __tests__/Alert.test.tsx
└── index.ts
```

---

## Best Practices

### Button
- Use `primary` for main actions
- Use `secondary` for alternative actions
- Use `outline` for less prominent actions
- Use `ghost` for subtle actions
- Always provide loading feedback for async operations

### Spinner
- Use `sm` for inline loading indicators
- Use `md` for standalone loading states
- Always include aria-label for accessibility

### Skeleton
- Match skeleton variant to content type (card, text, avatar)
- Use custom dimensions for specific layouts
- Group multiple skeletons for complete loading states

### EmptyState
- Always provide clear, actionable messaging
- Include action button when appropriate
- Use descriptive icons (emojis work well)
- Keep descriptions concise and helpful

### Alert
- Use `success` for completed operations
- Use `warning` for cautionary messages
- Use `error` for failures and errors
- Use `info` for general information
- Include title for important messages

---

## Migration Guide

If migrating from existing UI library:

1. Update imports to use `@/shared/components/ui`
2. Review component props (may differ from other libraries)
3. Update test assertions to match new class names
4. Verify accessibility with screen reader testing
5. Check color contrast in your specific use cases

---

## Next Steps

Phase 2 will include:
- Input components (TextField, TextArea, Select, Checkbox, Radio)
- Navigation components (Tabs, Breadcrumb, Pagination)
- Feedback components (Toast, Modal, ConfirmDialog)
- Layout components (Card, Divider, Stack)

Stay tuned for updates!
