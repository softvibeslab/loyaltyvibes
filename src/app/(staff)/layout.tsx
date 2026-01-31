'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && user.role === 'customer') {
        // Customers cannot access staff routes (S-02)
        router.replace('/wallet');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role === 'customer')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">
              Loyalty<span className="text-green-500">Vibes</span>
            </h1>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              Staff
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cerrar Sesion
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
