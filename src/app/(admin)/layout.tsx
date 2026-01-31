'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AdminLayout({
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
      } else if (user && user.role !== 'admin') {
        // Only admin can access admin routes (S-01)
        const redirectPath = user.role === 'staff' ? '/scanner' : '/wallet';
        router.replace(redirectPath);
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Loyalty<span className="text-blue-600">Vibes</span>
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Admin
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cerrar Sesion
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
