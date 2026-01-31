'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { syncService } from '@/features/transactions/services/syncService';

interface OfflineIndicatorProps {
  showPendingCount?: boolean;
}

export function OfflineIndicator({ showPendingCount = true }: OfflineIndicatorProps) {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const checkPending = async () => {
      const status = await syncService.getSyncStatus();
      setPendingCount(status.pending + status.failed);
    };

    checkPending();
    const interval = setInterval(checkPending, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timeout = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isOnline, wasOffline]);

  // Show reconnected message
  if (showReconnected && isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
        <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="text-lg">✓</span>
          <div>
            <p className="font-medium">Conexión restaurada</p>
            {pendingCount > 0 && (
              <p className="text-sm text-emerald-100">
                Sincronizando {pendingCount} transacción{pendingCount !== 1 ? 'es' : ''}...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
        <div className="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-lg">📡</span>
          <div>
            <p className="font-medium">Sin conexión</p>
            <p className="text-sm text-amber-100">
              Las transacciones se guardarán localmente
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show pending sync indicator
  if (showPendingCount && pendingCount > 0 && isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          <span>Sincronizando {pendingCount}</span>
        </div>
      </div>
    );
  }

  return null;
}

// Compact version for headers
export function OfflineStatusBadge() {
  const { isOnline } = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      Offline
    </span>
  );
}
