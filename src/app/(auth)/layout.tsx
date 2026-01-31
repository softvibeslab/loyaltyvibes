'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROLE_REDIRECTS } from '@/features/auth/types';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectPath = ROLE_REDIRECTS[user.role] || '/wallet';
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  // Only render auth pages for unauthenticated users
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
