'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseOnlineStatusReturn {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: Date | null;
  checkConnection: () => Promise<boolean>;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);

  // Check actual connectivity (not just browser status)
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify connectivity
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());

      // If we were offline before, set the flag
      if (!navigator.onLine) {
        setWasOffline(true);
        // Clear the flag after 5 seconds
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const interval = setInterval(async () => {
      const connected = await checkConnection();
      if (connected !== isOnline) {
        setIsOnline(connected);
        if (connected) {
          setLastOnlineAt(new Date());
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection, isOnline]);

  return {
    isOnline,
    wasOffline,
    lastOnlineAt,
    checkConnection,
  };
}

// Hook for tracking connection quality
export function useConnectionQuality() {
  const [quality, setQuality] = useState<'good' | 'slow' | 'offline'>('good');

  useEffect(() => {
    const connection = (navigator as any).connection;

    if (!connection) {
      return;
    }

    const updateQuality = () => {
      if (!navigator.onLine) {
        setQuality('offline');
        return;
      }

      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setQuality('slow');
      } else {
        setQuality('good');
      }
    };

    updateQuality();
    connection.addEventListener('change', updateQuality);

    return () => {
      connection.removeEventListener('change', updateQuality);
    };
  }, []);

  return quality;
}
