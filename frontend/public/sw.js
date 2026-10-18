/**
 * ==============================================================================
 * AegisPath Progressive Web App (PWA) Service Worker (public/sw.js)
 * ==============================================================================
 * Serwist/Workbox compliant offline caching strategy:
 * - Cache-first for immutable static bundles, fonts, and brand assets
 * - Stale-while-revalidate for application shell pages
 * - Network-first with graceful fallback for live API calls
 * - Immediate activation on updates via skipWaiting() & clients.claim()
 * ==============================================================================
 */

const CACHE_NAME = 'aegispath-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent routing based on request destination
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Backend API / Dynamic endpoints: Network first
  if (url.port === '8000' || url.port === '8100' || url.pathname.startsWith('/v1/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline_mode', simulated: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 2. Static Assets (fonts, images, chunks): Stale-While-Revalidate
  if (
    request.destination === 'font' ||
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Navigation requests (App Shell): Network first, fallback to cached '/'
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
