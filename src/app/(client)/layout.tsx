'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CustomerGuard } from '@/features/auth/components/AuthGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { TierBadge } from '@/shared/components/ui/TierBadge';
import { OfflineIndicator, OfflineStatusBadge } from '@/shared/components/ui/OfflineIndicator';

const NAV_ITEMS = [
  { href: '/wallet', label: 'Cartera', icon: '💰' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
];

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Loyalty<span className="text-emerald-600">Vibes</span>
          </h1>
          <div className="flex items-center gap-3">
            <OfflineStatusBadge />
            {user && <TierBadge tier={user.tier} size="sm" />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => logout()}
              className="flex flex-col items-center py-2 px-4 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="text-xs mt-1 font-medium">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerGuard>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </CustomerGuard>
  );
}
