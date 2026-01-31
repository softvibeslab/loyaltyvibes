'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { UserRole, ROLE_REDIRECTS } from '../types';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallbackUrl?: string;
  loadingComponent?: ReactNode;
}

export function AuthGuard({
  children,
  allowedRoles,
  fallbackUrl,
  loadingComponent,
}: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();

      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // If no role restriction, allow access
      if (!allowedRoles || allowedRoles.length === 0) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const userRole = (profile?.role as UserRole) || 'customer';

      if (allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        // Redirect to appropriate page
        const redirectUrl = fallbackUrl || ROLE_REDIRECTS[userRole] || '/';
        router.push(redirectUrl);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, fallbackUrl]);

  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
        </div>
      )
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// HOC version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function GuardedComponent(props: P) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Role-specific guards
export function AdminGuard({ children }: { children: ReactNode }) {
  return <AuthGuard allowedRoles={['admin']}>{children}</AuthGuard>;
}

export function StaffGuard({ children }: { children: ReactNode }) {
  return <AuthGuard allowedRoles={['admin', 'staff']}>{children}</AuthGuard>;
}

export function CustomerGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin', 'staff', 'customer']}>{children}</AuthGuard>
  );
}
