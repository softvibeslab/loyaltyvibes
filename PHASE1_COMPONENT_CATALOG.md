# Phase 1 UI Component Catalog

## Visual Reference and Examples

This catalog provides visual examples of all Phase 1 components in their various configurations.

---

## 1. Button Component

### Variants

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   PRIMARY   │  SECONDARY  │   OUTLINE   │    GHOST    │
│ (Emerald)   │  (Purple)   │  (Gray)     │  (Subtle)   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [ Click Me ]│ [ Click Me ]│ [ Click Me ]│ [ Click Me ]│
│             │             │             │             │
│ Solid green │ Solid purple│ Border only │ No border   │
│ with white  │ with white  │ gray bg on  │ gray bg on  │
│ text        │ text        │ hover       │ hover       │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Sizes

```
SMALL (text-sm, py-1 px-3):
[ Small ]

MEDIUM (text-base, py-2 px-4):
[ Medium ]

LARGE (text-lg, py-3 px-6):
[ Large ]
```

### States

```
NORMAL:    [ Click Me ]
DISABLED:  [ Click Me ]  (50% opacity, not-allowed cursor)
LOADING:   [ ⟳ Loading ]  (spinner + text, button disabled)
FULL WIDTH:
┌──────────────────────────────────────┐
│          Full Width Button           │
└──────────────────────────────────────┘
```

### Code Examples

```tsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// Secondary button
<Button variant="secondary" onClick={handleClick}>
  Cancel
</Button>

// Loading state
<Button loading>
  Processing...
</Button>

// Full width
<Button fullWidth variant="primary">
  Continue
</Button>
```

---

## 2. Spinner Component

### Sizes

```
SMALL (w-4 h-4, border-2):
⟳  (16x16px spinner)

MEDIUM (w-6 h-6, border-3):
⟳  (24x24px spinner)
```

### Visual Style

```
Animated clockwise rotation
- Border: emerald-500
- Border-top: transparent
- Background: transparent
- Rounded: full (circle)
```

### Code Examples

```tsx
// Small spinner
<Spinner size="sm" />

// Medium spinner
<Spinner size="md" />

// In a loading state
<div className="flex items-center justify-center">
  <Spinner size="md" />
  <span className="ml-2">Loading...</span>
</div>
```

---

## 3. Skeleton Component

### Variants

```
CARD (rounded-lg, w-full, h-32):
┌────────────────────────────┐
│                            │
│   (pulsing gray block)     │
│                            │
│                            │
└────────────────────────────┘

TEXT (rounded, h-4, w-full):
█████████████████████████████

AVATAR (rounded-full, w-12, h-12):
⚪ (pulsing gray circle)
```

### Custom Dimensions

```
CUSTOM (width: 200px, height: 100px):
┌──────────────┐
│              │
│              │
└──────────────┘
```

### Loading Patterns

```
CARD LOADING:
┌────────────────────────────┐
│                            │
│   (card skeleton)          │
│                            │
└────────────────────────────┘
█████████████████████████████
█████████████████████████████
█████████████

USER LIST LOADING:
⚪  ████████████████████████████
    ████████████████

⚪  ████████████████████████████
    ████████████████

⚪  ████████████████████████████
    ████████████████
```

### Code Examples

```tsx
// Card skeleton
<Skeleton variant="card" />

// Text skeleton
<Skeleton variant="text" />
<Skeleton variant="text" width="2/3" />

// Avatar skeleton
<Skeleton variant="avatar" />

// Custom dimensions
<Skeleton variant="custom" width="100px" height="50px" />
```

---

## 4. EmptyState Component

### Layout

```
         [ICON]
        (emoji)

        TITLE
    (text-xl font-semibold)

   DESCRIPTION
  (text-gray-600, max-w-sm)

    [ACTION BUTTON]
    (optional)
```

### Examples

```
NO MESSAGES:
        📭
     No messages
 You have no messages yet.
  [Send Message]

NO RESULTS:
        🔍
   No results found
Try adjusting your search
   or filter to find
  what you're looking for.

NO DATA:
        📊
  No data available
There is no data to
   display at the moment.
     [Refresh]
```

### Code Examples

```tsx
// Without action
<EmptyState
  icon="📭"
  title="No messages"
  description="You have no messages yet."
/>

// With action
<EmptyState
  icon="📝"
  title="No items yet"
  description="Create your first item to get started."
  action={{
    label: 'Create Item',
    onClick: handleCreate
  }}
/>
```

---

## 5. Alert Component

### Layout

```
┌──────────────────────────────────────┐
│ [ICON]  TITLE (optional)             │
│ (10x10)                              │
│          DESCRIPTION                 │
└──────────────────────────────────────┘

Horizontal layout with icon on left,
content on right, ml-3 spacing
```

### Variants

```
SUCCESS:
┌──────────────────────────────────┐
│ ✓  Success!                      │
│    Your changes have been        │
│    saved successfully.           │
└──────────────────────────────────┘
- bg-emerald-50
- border-emerald-200
- text-emerald-800
- Icon: ✓ (green)

WARNING:
┌──────────────────────────────────┐
│ ⚠  Warning                       │
│    Your account is about to      │
│    expire. Renew now.            │
└──────────────────────────────────┘
- bg-amber-50
- border-amber-200
- text-amber-800
- Icon: ⚠ (yellow)

ERROR:
┌──────────────────────────────────┐
│ ✕  Error                         │
│    Failed to save changes.       │
│    Please try again.             │
└──────────────────────────────────┘
- bg-red-50
- border-red-200
- text-red-800
- Icon: ✕ (red)

INFO:
┌──────────────────────────────────┐
│ ℹ  Information                  │
│    New features are available!   │
│    Check out the updates.        │
└──────────────────────────────────┘
- bg-blue-50
- border-blue-200
- text-blue-800
- Icon: ℹ (blue)
```

### Code Examples

```tsx
// Success with title
<Alert
  variant="success"
  title="Success!"
  description="Your changes have been saved."
/>

// Warning without title
<Alert
  variant="warning"
  description="Your session will expire in 5 minutes."
/>

// Error with title
<Alert
  variant="error"
  title="Upload Failed"
  description="Failed to upload file. Please try again."
/>

// Info
<Alert
  variant="info"
  title="New Features"
  description="Check out our latest updates."
/>
```

---

## Color Palette Reference

### Primary Colors (Button)

```
PRIMARY (Emerald):
- bg: emerald-600 → emerald-700 (hover)
- text: white
- border: transparent
- focus: ring-emerald-500

SECONDARY (Purple):
- bg: purple-600 → purple-700 (hover)
- text: white
- border: transparent
- focus: ring-purple-500

OUTLINE:
- bg: transparent
- text: gray-700
- border: gray-300
- hover: bg-gray-50
- focus: ring-gray-500

GHOST:
- bg: transparent
- text: gray-600
- border: transparent
- hover: bg-gray-100
- focus: ring-gray-400
```

### Semantic Colors (Alert)

```
SUCCESS (Emerald):
- bg: emerald-50
- border: emerald-200
- text: emerald-800
- icon bg: emerald-100
- icon text: emerald-600

WARNING (Amber):
- bg: amber-50
- border: amber-200
- text: amber-800
- icon bg: amber-100
- icon text: amber-600

ERROR (Red):
- bg: red-50
- border: red-200
- text: red-800
- icon bg: red-100
- icon text: red-600

INFO (Blue):
- bg: blue-50
- border: blue-200
- text: blue-800
- icon bg: blue-100
- icon text: blue-600
```

### Neutral Colors (Skeleton, EmptyState)

```
GRAY-200: Skeleton background
GRAY-50: Alert backgrounds (with semantic colors)
GRAY-100: EmptyState hover states
GRAY-300: Outline borders
GRAY-400: Ghost text
GRAY-600: Muted text
GRAY-700: Outline text
GRAY-900: EmptyState titles
```

---

## Spacing & Sizing Reference

### Button Sizes

```
SMALL:
- py: 1 (0.25rem = 4px)
- px: 3 (0.75rem = 12px)
- text: sm (0.875rem = 14px)

MEDIUM:
- py: 2 (0.5rem = 8px)
- px: 4 (1rem = 16px)
- text: base (1rem = 16px)

LARGE:
- py: 3 (0.75rem = 12px)
- px: 6 (1.5rem = 24px)
- text: lg (1.125rem = 18px)
```

### Spinner Sizes

```
SMALL:
- w: 4 (1rem = 16px)
- h: 4 (1rem = 16px)
- border: 2 (2px)

MEDIUM:
- w: 6 (1.5rem = 24px)
- h: 6 (1.5rem = 24px)
- border: 3 (3px)
```

### Skeleton Dimensions

```
CARD:
- h: 32 (8rem = 128px)
- w: full (100%)

TEXT:
- h: 4 (1rem = 16px)
- w: full (100%)

AVATAR:
- w: 12 (3rem = 48px)
- h: 12 (3rem = 48px)

CUSTOM:
- User defined
```

---

## Accessibility Features

### Keyboard Navigation

All interactive components support:
- Tab: Navigate to element
- Enter/Space: Activate button
- Focus visible: Clear focus indicator

### Screen Reader Support

- Buttons: aria-busy (loading state)
- Spinners: role="status", aria-label="Loading"
- Skeletons: role="status", aria-label="Loading"
- EmptyStates: role="status"
- Alerts: role="alert", aria-live="polite"

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

---

## Common Usage Patterns

### Form Submit Button

```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  loading={isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Submitting...' : 'Submit Form'}
</Button>
```

### Loading Card

```tsx
<Card>
  <Skeleton variant="card" />
  <div className="mt-4 space-y-2">
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="2/3" />
  </div>
</Card>
```

### Empty List with Action

```tsx
{items.length === 0 && (
  <EmptyState
    icon="📝"
    title="No items found"
    description="Create your first item to get started."
    action={{
      label: 'Create Item',
      onClick: () => setShowCreateDialog(true)
    }}
  />
)}
```

### Success Message After Action

```tsx
{showSuccess && (
  <Alert
    variant="success"
    title="Success!"
    description="Your changes have been saved successfully."
  />
)}
```

---

## Next Phase Preview

Phase 2 will include:
- TextField, TextArea, Select (Input components)
- Tabs, Breadcrumb, Pagination (Navigation)
- Toast, Modal, ConfirmDialog (Feedback)
- Card, Divider, Stack (Layout)

All will follow the same design principles and accessibility standards established in Phase 1.
