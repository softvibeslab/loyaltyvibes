/**
 * Componentes UI de LoyaltyVibes
 * Exportación centralizada de todos los componentes
 */

// Phase 1: Basic Components (Already implemented)
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerSize } from './Spinner';

export { Skeleton } from './Skeleton';
export type { SkeletonProps, SkeletonVariant } from './Skeleton';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Alert } from './Alert';
export type { AlertProps, AlertVariant } from './Alert';

// Phase 2: Forms
export * from './forms';

// Phase 2: Overlays
export * from './overlays';
