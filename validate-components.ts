// Simple validation script to check if all components can be imported
import { Button } from './src/shared/components/ui/Button';
import { Spinner } from './src/shared/components/ui/Spinner';
import { Skeleton } from './src/shared/components/ui/Skeleton';
import { EmptyState } from './src/shared/components/ui/EmptyState';
import { Alert } from './src/shared/components/ui/Alert';

console.log('✓ All components imported successfully');
console.log('Button:', typeof Button);
console.log('Spinner:', typeof Spinner);
console.log('Skeleton:', typeof Skeleton);
console.log('EmptyState:', typeof EmptyState);
console.log('Alert:', typeof Alert);
