// LoyaltyVibes Service Worker
// Version: 1.0.0

const CACHE_NAME = 'loyaltyvibes-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip API requests (handle separately)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Skip Supabase requests
  if (url.hostname.includes('supabase')) {
    return;
  }

  // Network first strategy for pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(async () => {
        // Try cache
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }

        // Return error for other requests
        return new Response('Offline', { status: 503 });
      })
  );
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // For health check, return offline status
    if (request.url.includes('/api/health')) {
      return new Response(JSON.stringify({ status: 'offline' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  // This would communicate with the main thread to sync
  // For now, just notify clients to sync
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'SYNC_TRANSACTIONS',
    });
  });
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title || 'LoyaltyVibes', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: data.url,
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

console.log('[SW] Service Worker registered');
